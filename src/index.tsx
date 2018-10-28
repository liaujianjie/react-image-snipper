import React from 'react';
import PropTypes from 'prop-types';

// Components
import AnchorPoint from './components/AnchorPoint';
import AnchorLine from './components/AnchorLine';

// Utils
import Action from './utils/Action';
import getNewRect from './utils/getNewRect';
import getStyleFromRect from './utils/getStyleFromRect';
import getScaledRect from './utils/getScaledRect';
// import safelyInvoke from './utils/safelyInvoke';

// Style
import styles from './styles.css';
import { Rect, Point } from './utils/types';

type DataUrlGetter = () => string;
type RectValuesGetter = () => {
  cropper: Rect;
  image: Rect;
};
type CropHandler = (
  {
    getDataUrl,
    getRectValues,
  }: { getDataUrl: DataUrlGetter; getRectValues: RectValuesGetter }
) => void;

interface CropperProps {
  src: string;
  rect?: Rect;
  allowNewSelection?: boolean;
  onCropBegin?: CropHandler;
  onCropChange?: CropHandler;
  onCropEnd?: CropHandler;
}

interface CropperState {
  previousSrc?: string;
  image: {
    width?: number;
    height?: number;
    isLoaded: boolean;
    src?: string;
  };
  originalPointerPos?: Point;
  originalRect?: Rect;
  currentRect?: Rect;
  isDragging: boolean;
  action: Action | null;
}

class Cropper extends React.Component<CropperProps, CropperState> {
  static propTypes = {
    src: PropTypes.string.isRequired,
    rect: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    allowNewSelection: PropTypes.bool,
    onCropBegin: PropTypes.func,
    onCropChange: PropTypes.func,
    onCropEnd: PropTypes.func,
  };

  static defaultProps = {
    allowNewSelection: true,
  };

  constructor(props: CropperProps) {
    super(props);

    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragBegin = this.handleDragBegin.bind(this);
    this.invokeCropHandler = this.invokeCropHandler.bind(this);
    this.getDataUrl = this.getDataUrl.bind(this);
    this.getCroppedImageRect = this.getCroppedImageRect.bind(this);

    this.state = {
      image: {
        // width: '100%',
        // height: 'auto',
        isLoaded: false,
      },
      isDragging: false,
      action: null,
    };
  }

  static getDerivedStateFromProps(props: CropperProps, state: CropperState) {
    const { src, rect } = props;

    const newRectState = {
      originalRect: rect || state.originalRect,
      currentRect: rect || state.currentRect,
    };

    // update image src if changed
    if (src !== state.previousSrc) {
      return {
        ...newRectState,
        image: { ...state.image, src },
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('touchmove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
    document.addEventListener('touchend', this.handleDragEnd);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('touchmove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
    document.removeEventListener('touchend', this.handleDragEnd);
  }

  container = React.createRef<HTMLDivElement>();
  sourceNode = React.createRef<HTMLDivElement>();
  img = React.createRef<HTMLImageElement>();
  frameNode = React.createRef<HTMLDivElement>();
  cloneImg = React.createRef<HTMLImageElement>();

  updateImageState() {
    const img = this.img.current;
    const container = this.container.current;
    if (img && img.naturalWidth && container) {
      this.setState({
        image: {
          height: (img.offsetWidth / img.naturalWidth) * img.naturalHeight,
          width: container.offsetWidth,
          isLoaded: true,
        },
      });
    }
  }

  moveCropper(action: Action, event: MouseOrTouchEvent) {
    const { originalRect, originalPointerPos, image } = this.state;
    if (!originalRect || !originalPointerPos || !image) return;
    if ('pageX' in event) {
      event = event as React.MouseEvent;
    } else {
      event = event as React.TouchEvent;
    }
    const { pageX: x, pageY: y } = isMouseEvent(event)
      ? event
      : event.targetTouches[0];

    const currentRect = getNewRect({
      originalRect,
      originalPointerPos,
      currentPointerPos: { x, y },
      action,
      imageSize: { width: image.width!, height: image.height! },
    });

    this.setState({ currentRect }, () => {
      this.invokeCropHandler(this.props.onCropChange);
    });
  }

  cropFromNewRegion(event: MouseOrTouchEvent) {
    const { pageX: x, pageY: y } = isMouseEvent(event)
      ? event
      : (event as any).targetTouches[0];
    const originalPointerPos = { x, y };
    const container = this.container.current;
    if (!container) return;
    const { offsetLeft, offsetTop } = container;
    const rect = {
      x: x - offsetLeft,
      y: y - offsetTop,
      width: 0,
      height: 0,
    };

    this.setState({
      originalPointerPos,
      currentRect: rect,
      originalRect: rect,
      action: Action.SOUTH_EAST,
      isDragging: true,
    });
  }

  /**
   * Invokes the crop event handlers passed as prop with lazily-evaluatable
   * data.
   */
  invokeCropHandler(handler?: CropHandler) {
    if (!handler) {
      return;
    }

    handler({
      getDataUrl: () => this.getDataUrl(),
      getRectValues: () => ({
        cropper: this.state.currentRect!,
        image: this.getCroppedImageRect(),
      }),
    });
    // safelyInvoke(handler)({
    //   getDataUrl: () => this.getDataUrl(),
    //   getRectValues: () => ({
    //     cropper: this.state.currentRect,
    //     image: this.getCroppedImageRect(),
    //   }),
    // });
  }

  /* POINTER EVENT HANDLERS */

  /**
   * Event handler for when the pointer dragging begins.
   */
  handleDragBegin(event: MouseOrTouchEvent) {
    const { allowNewSelection } = this.props;
    const { pageX: x, pageY: y } = isMouseEvent(event)
      ? event
      : (event as any).targetTouches[0];
    const action = this.state.action;
    // event.target.getAttribute('data-action') ||
    // event.target.parentNode.getAttribute('data-action');
    const originalPointerPos = { x, y };

    // resize or move the selection if:
    // 1. user is dragging the anchors, or
    // 2. user is dragging the selection
    if (action) {
      event.preventDefault();
      this.setState(
        state => ({
          originalPointerPos,
          originalRect: state.currentRect,
          isDragging: true,
          action,
        }),
        () => this.invokeCropHandler(this.props.onCropBegin)
      );
      return;
    }
    // otherwise, if no action and new selection is allowed, create a new frame
    if (allowNewSelection) {
      event.preventDefault();
      this.cropFromNewRegion(event);
    }
  }

  /**
   * Event handler for when the pointer drags.
   */
  handleDrag(event: MouseOrTouchEvent) {
    if (this.state.isDragging) {
      event.preventDefault();
      const { action } = this.state;

      if (!action) return this.cropFromNewRegion(event);
      this.moveCropper(action, event);
    }
  }

  /**
   * Event handler for when the pointer dragging ends.
   */
  handleDragEnd(event: MouseOrTouchEvent) {
    if (this.state.isDragging) {
      event.preventDefault();
      this.setState(
        state => ({
          originalRect: state.currentRect,
          isDragging: false,
          action: null,
        }),
        () => this.invokeCropHandler(this.props.onCropEnd)
      );
    }
  }

  /* UTILITY FUNCTIONS */

  /**
   * Gets the data URL of the cropped portion of the image. This is a
   * computationally expensive operation.
   */
  getDataUrl() {
    const img = this.img.current;
    const { x, y, width, height } = this.getCroppedImageRect();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas
      .getContext('2d')!
      .drawImage(img!, x, y, width, height, 0, 0, width, height);
    return canvas.toDataURL();
  }

  /**
   * Gets the `Rect` cropped portion of the raw image.
   */
  getCroppedImageRect() {
    return getScaledRect({
      rect: this.state.currentRect!,
      scale:
        this.img.current!.naturalWidth / this.container.current!.offsetWidth,
    });
  }

  /* RENDER FUNCTIONS */

  getCursorStyle = () => {
    // show crosshair as cursor if there is no cropped region
    if (!this.state.currentRect && this.props.allowNewSelection)
      return styles.uncropped;
    // show grabbing hand as cursor if currently dragging
    if (this.state.isDragging) return styles.cropping;
    // otherwise, use whatever default cursor style there is
    return '';
  };

  render() {
    const { image, currentRect } = this.state;

    return (
      <div
        ref={this.container}
        onMouseDown={this.handleDragBegin}
        onTouchStart={this.handleDragBegin}
        className={[styles.Cropper, this.getCursorStyle()].join(' ')}
        style={{ height: image.height }}
      >
        <div className={styles.source} ref={this.sourceNode}>
          <img
            ref={this.img}
            src={image.src}
            width={image.width}
            height={image.height}
            className={[
              styles.img,
              // TODO: check on this
              // styles.source_img
            ].join(' ')}
            onLoad={() => this.updateImageState()}
          />
        </div>
        {image.isLoaded && currentRect ? (
          <div>
            <div className={styles.modal} />
            {/* frame container */}
            <div
              ref={this.frameNode}
              className={styles.frame}
              style={{
                // ...(isDragging ? styles.dragging_frame : {}),
                ...getStyleFromRect(this.state.currentRect!),
                display: 'block',
              }}
            >
              {/* clone img */}
              <div className={styles.clone}>
                <img
                  ref={this.cloneImg}
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  className={styles.img}
                  style={{
                    marginLeft:
                      -1 *
                      (this.state.currentRect ? this.state.currentRect.x : 0),
                    marginTop:
                      -1 *
                      (this.state.currentRect ? this.state.currentRect.y : 0),
                  }}
                />
              </div>

              {/* move element */}
              <span data-action="move" className={styles.move} />

              {/* anchor lines and anchor points */}
              {Object.values(AnchorPoint.Point).map(point => (
                <AnchorPoint key={point} point={point} />
              ))}
              {Object.values(AnchorLine.Side).map(side => (
                <AnchorLine key={side} side={side} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Cropper;

type MouseOrTouchEvent = React.MouseEvent | React.TouchEvent | Event;

function isMouseEvent(e: MouseOrTouchEvent): e is React.MouseEvent {
  return (e as React.MouseEvent).pageX !== undefined;
}
