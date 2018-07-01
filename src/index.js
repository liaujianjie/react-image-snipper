import React from 'react';
import PropTypes from 'prop-types';

// Style
import styles from './styles.css';

// Components
import AnchorPoint from './components/AnchorPoint';
import AnchorLine from './components/AnchorLine';

// Utils
import Action from './utils/Action';
import getNewRect from './utils/getNewRect';
import getStyleFromRect from './utils/getStyleFromRect';

const ZERO_RECT = { x: 100, y: 100, width: 100, height: 100 };

/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-find-dom-node */
class Cropper extends React.Component {
  state = {
    imageWidth: '100%',
    imageHeight: 'auto',
    originalPointerPos: { x: 0, y: 0 },
    originalRect: ZERO_RECT,
    currentRect: ZERO_RECT,
    isDragging: false,
    action: null,
    imageLoaded: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { rect, src } = props;

    // update image src if changed
    if (src !== state.previousSrc) {
      return { src };
    }

    return { originalRect: rect, currentRect: rect };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleDrag.bind(this));
    document.addEventListener('touchmove', this.handleDrag.bind(this));
    document.addEventListener('mouseup', this.handleDragStop.bind(this));
    document.addEventListener('touchend', this.handleDragStop.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleDrag.bind(this));
    document.removeEventListener('touchmove', this.handleDrag.bind(this));
    document.removeEventListener('mouseup', this.handleDragStop.bind(this));
    document.removeEventListener('touchend', this.handleDragStop.bind(this));
  }

  container = React.createRef();
  sourceNode = React.createRef();
  img = React.createRef();
  frameNode = React.createRef();
  cloneImg = React.createRef();

  // initialize style, component did mount or component updated.
  initStyles() {
    const container = this.container.current;
    this.setState({ imageWidth: container.offsetWidth });
  }

  updateImageState() {
    const img = this.img.current;
    if (img && img.naturalWidth) {
      // image scaling
      const imageHeight = parseInt(
        (img.offsetWidth / img.naturalWidth) * img.naturalHeight
      );
      // resize imageHeight
      this.setState({ imageHeight, imageLoaded: true }, this.initStyles);
    }
  }

  handleMove(action, e) {
    const {
      originalRect,
      originalPointerPos,
      imageHeight,
      imageWidth,
    } = this.state;
    const { pageX: x, pageY: y } = e.pageX ? e : e.targetTouches[0];
    const currentRect = getNewRect({
      originalRect,
      originalPointerPos,
      currentPointerPos: { x, y },
      action,
      imageSize: { height: imageHeight, width: imageWidth },
    });

    this.setState({ currentRect });
  }

  handleDrag(event) {
    if (this.state.isDragging) {
      event.preventDefault();
      const { action } = this.state;

      if (!action) return this.handleNewFrame(event);
      this.handleMove(action, event);
    }
  }

  handleNewFrame(e) {
    const { pageX: x, pageY: y } = e.pageX ? e : e.targetTouches[0];
    const originalPointerPos = { x, y };
    const container = this.container.current;
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

  handleDragStart(event) {
    const { allowNewSelection } = this.props;
    const { pageX: x, pageY: y } = event.pageX ? event : event.targetTouches[0];
    const action =
      event.target.getAttribute('data-action') ||
      event.target.parentNode.getAttribute('data-action');
    const originalPointerPos = { x, y };

    // resize or move the selection if:
    // 1. user is dragging the anchors, or
    // 2. user is dragging the selection
    if (action) {
      event.preventDefault();
      return this.setState(state => ({
        originalPointerPos,
        originalRect: state.currentRect,
        isDragging: true,
        action,
      }));
    }

    // if no action and new selection is allowed, create a new frame
    if (allowNewSelection) {
      event.preventDefault();
      this.handleNewFrame(event);
    }
  }

  handleDragStop(event) {
    if (this.state.isDragging) {
      event.preventDefault();

      this.setState(state => ({
        originalRect: state.currentRect,
        isDragging: false,
        action: null,
      }));
    }
  }

  crop() {
    const img = this.img.current;
    const { x, y, width, height } = this.state.currentRect;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas
      .getContext('2d')
      .drawImage(img, x, y, width, height, 0, 0, width, height);
    return canvas.toDataURL();
  }

  values() {
    const img = this.img.current;
    const {
      frameWidth,
      frameHeight,
      originX,
      originY,
      imageWidth,
      imageHeight,
    } = this.state;

    // crop accroding image's natural width
    const _scale = img.naturalWidth / imageWidth;
    const realFrameWidth = frameWidth * _scale;
    const realFrameHeight = frameHeight * _scale;
    const realOriginX = originX * _scale;
    const realOriginY = originY * _scale;

    return {
      display: {
        width: frameWidth,
        height: frameHeight,
        x: originX,
        y: originY,
        imageWidth,
        imageHeight,
      },
      original: {
        width: realFrameWidth,
        height: realFrameHeight,
        x: realOriginX,
        y: realOriginY,
        imageWidth: img.naturalWidth,
        imageHeight: img.naturalHeight,
      },
    };
  }

  render() {
    const {
      isDragging,
      imageHeight,
      imageWidth,
      imageLoaded,
      src,
    } = this.state;

    const imageNode = (
      <div className={styles.source} ref={this.sourceNode}>
        <img
          src={src}
          width={imageWidth}
          height={imageHeight}
          ref={this.img}
          className={[styles.img, styles.source_img].join(' ')}
          onLoad={() => this.updateImageState()}
        />
      </div>
    );

    return (
      <div
        onMouseDown={this.handleDragStart.bind(this)}
        onTouchStart={this.handleDragStart.bind(this)}
        style={{
          position: 'relative',
          height: imageHeight,
        }}
        ref={this.container}
      >
        {imageNode}
        {imageLoaded ? (
          <div>
            <div className={styles.modal} />
            {/* frame container */}
            <div
              className={styles.frame}
              style={{
                ...(isDragging ? styles.dragging_frame : {}),
                ...getStyleFromRect(this.state.currentRect),
                display: 'block',
              }}
              ref={this.frameNode}
            >
              {/* clone img */}
              <div className={styles.clone}>
                <img
                  src={src}
                  width={imageWidth}
                  height={imageHeight}
                  className={styles.img}
                  style={{
                    marginLeft: -1 * this.state.currentRect.x,
                    marginTop: -1 * this.state.currentRect.y,
                  }}
                  ref={this.cloneImg}
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

Cropper.propTypes = {
  src: PropTypes.string.isRequired,
  rect: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  allowNewSelection: PropTypes.bool,
};

Cropper.defaultProps = {
  allowNewSelection: true,
  rect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
};

export default Cropper;
