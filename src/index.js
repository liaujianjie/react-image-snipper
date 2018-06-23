import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import defaultStyles from './defaultStyles';
import Crosshair from './components/Crosshair';
import AnchorPoint from './components/AnchorPoint';
import AnchorLine from './components/AnchorLine';

/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-find-dom-node */
class Cropper extends React.Component {
  constructor(props) {
    super(props);
    const {
      originX,
      originY,
      width,
      height,
      fixedRatio,
      ratio,
      styles,
      src,
    } = props;

    this.state = {
      // image and clone image src
      src,
      // background image width
      imgWidth: '100%',
      // background image height
      imgHeight: 'auto',
      // cropper width, drag trigger changing
      frameWidth4Style: width,
      // cropper height, drag trigger changing
      frameHeight4Style: fixedRatio ? width / ratio : height,
      // cropper height, drag trigger changing
      toImgTop4Style: 0,
      toImgLeft4Style: 0,
      // cropper original position(x axis), accroding to image left
      originX,
      // cropper original position(y axis), accroding to image top
      originY,
      // dragging start, position's pageX and pageY
      startPageX: 0,
      startPageY: 0,
      // frame width, change only dragging stop
      frameWidth: width,
      // frame height, change only dragging stop
      frameHeight: fixedRatio ? width / ratio : height,
      dragging: false,
      maxLeft: 0,
      maxTop: 0,
      action: null,
      imgLoaded: false,
      styles: { ...defaultStyles, ...styles },
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      width: frameWidth,
      height: frameHeight,
      originX,
      originY,
      src,
    } = props;

    // img src changed
    if (src !== state.previousSrc) {
      return { src };
    }

    return { frameWidth, frameHeight, originX, originY };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleDrag.bind(this));
    document.addEventListener('touchmove', this.handleDrag.bind(this));
    document.addEventListener('mouseup', this.handleDragStop.bind(this));
    document.addEventListener('touchend', this.handleDragStop.bind(this));
    this.imgGetSizeBeforeLoad();
  }

  componentWillUnmount() {
    // cleanup
    document.removeEventListener('mousemove', this.handleDrag.bind(this));
    document.removeEventListener('touchmove', this.handleDrag.bind(this));
    document.removeEventListener('mouseup', this.handleDragStop.bind(this));
    document.removeEventListener('touchend', this.handleDragStop.bind(this));
  }

  // initialize style, component did mount or component updated.
  initStyles() {
    const container = findDOMNode(this.container);
    this.setState(
      {
        imgWidth: container.offsetWidth,
      },
      () => {
        // calc frame width height
        let { originX, originY } = this.props;

        const { imgWidth, imgHeight } = this.state;
        const { frameWidth, frameHeight } = this.state;

        const maxLeft = imgWidth - frameWidth;
        const maxTop = imgHeight - frameHeight;

        if (originX + frameWidth >= imgWidth) {
          originX = imgWidth - frameWidth;
          this.setState({
            originX,
          });
        }
        if (originY + frameHeight >= imgHeight) {
          originY = imgHeight - frameHeight;
          this.setState({
            originY,
          });
        }

        this.setState({
          maxLeft,
          maxTop,
        });
        // calc clone position
        this.calcPosition(frameWidth, frameHeight, originX, originY, () => {
          const {
            frameWidth4Style,
            frameHeight4Style,
            toImgTop4Style,
            toImgLeft4Style,
          } = this.state;

          this.setState({
            frameWidth: frameWidth4Style,
            frameHeight: frameHeight4Style,
            originX: toImgLeft4Style,
            originY: toImgTop4Style,
          });
        });
      }
    );
  }

  // image onloaded hook
  imgOnLoad() {
    this.props.onImgLoad();
  }

  // adjust image height when image size scaleing change, also initialize styles
  imgGetSizeBeforeLoad() {
    const img = findDOMNode(this.img);
    // if (img && img.naturalWidth) {
    // image scaling
    const imgHeight = parseInt(
      (img.offsetWidth / img.naturalWidth) * img.naturalHeight
    );
    // resize imgHeight
    this.setState(
      {
        imgHeight,
        imgLoaded: true,
      },
      this.initStyles
    );
  }

  // frame width, frame height, position left, position top
  calcPosition(width, height, left, top, callback) {
    const { imgWidth, imgHeight } = this.state;
    const { ratio, fixedRatio } = this.props;
    // width < 0 or height < 0, frame invalid
    if (width < 0 || height < 0) return false;
    // if ratio is fixed
    if (fixedRatio) {
      // adjust by width
      if (width / imgWidth > height / imgHeight) {
        if (width > imgWidth) {
          width = imgWidth;
          left = 0;
          height = width / ratio;
        }
      } else if (height > imgHeight) {
        // adjust by height

        height = imgHeight;
        top = 0;
        width = height * ratio;
      }
    }
    // frame width plus offset left, larger than img's width
    if (width + left > imgWidth) {
      if (fixedRatio) {
        // if fixed ratio, adjust left with width
        left = imgWidth - width;
      } else {
        // resize width with left
        width = width - (width + left - imgWidth);
      }
    }
    // frame heigth plust offset top, larger than img's height
    if (height + top > imgHeight) {
      if (fixedRatio) {
        // if fixed ratio, adjust top with height
        top = imgHeight - height;
      } else {
        // resize height with top
        height = height - (height + top - imgHeight);
      }
    }
    // left is invalid
    if (left < 0) {
      left = 0;
    }
    // top is invalid
    if (top < 0) {
      top = 0;
    }
    // if frame width larger than img width
    if (width > imgWidth) {
      width = imgWidth;
    }
    // if frame height larger than img height
    if (height > imgHeight) {
      height = imgHeight;
    }
    this.setState(
      {
        toImgLeft4Style: left,
        toImgTop4Style: top,
        frameWidth4Style: width,
        frameHeight4Style: height,
      },
      () => {
        if (callback) callback();
      }
    );
  }

  // create a new frame, and drag, so frame width and height is became larger.
  createNewFrame(e) {
    if (this.state.dragging) {
      // click or touch event
      const { pageX, pageY } = e.pageX ? e : e.targetTouches[0];

      const { ratio, fixedRatio } = this.props;

      const {
        frameWidth,
        frameHeight,
        startPageX,
        startPageY,
        originX,
        originY,
      } = this.state;
      // click or touch point's offset from source image top
      const _x = pageX - startPageX;
      const _y = pageY - startPageY;

      // frame new width, height, left, top
      const _width = frameWidth + Math.abs(_x);
      const _height = fixedRatio
        ? (frameWidth + Math.abs(_x)) / ratio
        : frameHeight + Math.abs(_y);
      let _left = originX;
      let _top = originY;

      if (_y < 0) {
        // drag and resize to top, top changing
        _top = fixedRatio
          ? originY - Math.abs(_x) / ratio
          : originY - Math.abs(_y);
      }

      if (_x < 0) {
        // drag and resize, go to left, left changing
        _left = originX + _x;
      }
      // calc position
      return this.calcPosition(_width, _height, _left, _top);
    }
  }

  // frame move handler
  frameMove(e) {
    const {
      originX,
      originY,
      startPageX,
      startPageY,
      frameWidth,
      frameHeight,
      maxLeft,
      maxTop,
    } = this.state;

    const { pageX, pageY } = e.pageX ? e : e.targetTouches[0];

    let _x = pageX - startPageX + originX;
    let _y = pageY - startPageY + originY;
    if (pageX < 0 || pageY < 0) return false;

    if (_x > maxLeft) _x = maxLeft;
    if (_y > maxTop) _y = maxTop;
    // frame width, frame height not change, top and left changing
    this.calcPosition(frameWidth, frameHeight, _x, _y);
  }

  // drag dot to different direction
  frameDotMove(dir, e) {
    const { pageX, pageY } = e.pageX ? e : e.targetTouches[0];

    const { ratio, fixedRatio } = this.props;

    const {
      startPageX,
      startPageY,
      originX,
      originY,
      frameWidth4Style,
      frameHeight4Style,
      frameWidth,
      frameHeight,
      imgWidth,
      imgHeight,
    } = this.state;

    if (pageY !== 0 && pageX !== 0) {
      // current drag position offset x and y to first drag start position
      const _x = pageX - startPageX;
      const _y = pageY - startPageY;

      let _width = 0;
      let _height = 0;
      let _top = 0;
      let _left = 0;
      // just calc width, height, left, top in each direction
      switch (dir) {
        case 'ne':
          _width = frameWidth + _x;
          _height = fixedRatio ? _width / ratio : frameHeight - _y;
          _left = originX;
          _top = fixedRatio ? originY - _x / ratio : originY + _y;
          break;
        case 'e':
          _width = frameWidth + _x;
          _height = fixedRatio ? _width / ratio : frameHeight;
          _left = originX;
          _top = fixedRatio ? originY - (_x / ratio) * 0.5 : originY;
          break;
        case 'se':
          _width = frameWidth + _x;
          _height = fixedRatio ? _width / ratio : frameHeight + _y;
          _left = originX;
          _top = originY;
          break;
        case 'n':
          _height = frameHeight - _y;
          _width = fixedRatio ? _height * ratio : frameWidth;
          _left = fixedRatio ? originX + _y * ratio * 0.5 : originX;
          _top = originY + _y;
          break;
        case 'nw':
          _width = frameWidth - _x;
          _height = fixedRatio ? _width / ratio : frameHeight - _y;
          _left = originX + _x;
          _top = fixedRatio ? originY + _x / ratio : originY + _y;
          break;
        case 'w':
          _width = frameWidth - _x;
          _height = fixedRatio ? _width / ratio : frameHeight;
          _left = originX + _x;
          _top = fixedRatio ? originY + (_x / ratio) * 0.5 : originY;
          break;
        case 'sw':
          _width = frameWidth - _x;
          _height = fixedRatio ? _width / ratio : frameHeight + _y;
          _left = originX + _x;
          _top = originY;
          break;
        case 's':
          _height = frameHeight + _y;
          _width = fixedRatio ? _height * ratio : frameWidth;
          _left = fixedRatio ? originX - _y * ratio * 0.5 : originX;
          _top = originY;
          break;
        default:
          break;
      }

      if (_width > imgWidth || _height > imgHeight) {
        if (frameWidth4Style >= imgWidth || frameHeight4Style >= imgHeight) {
          return false;
        }
      }

      return this.calcPosition(_width, _height, _left, _top);
    }
  }

  // judge whether to create new frame, frame or frame dot move acroding to action
  handleDrag(e) {
    if (this.state.dragging) {
      e.preventDefault();
      const { action } = this.state;

      if (!action) return this.createNewFrame(e);
      if (action === 'move') return this.frameMove(e);
      this.frameDotMove(action, e);
    }
  }

  // starting dragging
  handleDragStart(e) {
    const { allowNewSelection } = this.props;

    const action = e.target.getAttribute('data-action')
      ? e.target.getAttribute('data-action')
      : e.target.parentNode.getAttribute('data-action');

    const { pageX, pageY } = e.pageX ? e : e.targetTouches[0];

    // if drag or move or allow new selection, change startPageX, startPageY, dragging state
    if (action || allowNewSelection) {
      e.preventDefault();
      // drag start, set startPageX, startPageY for dragging start point
      this.setState({
        startPageX: pageX,
        startPageY: pageY,
        dragging: true,
        action,
      });
    }
    // if no action and allowNewSelection, then create a new frame
    if (!action && allowNewSelection) {
      const container = findDOMNode(this.container);
      const { offsetLeft, offsetTop } = container;

      this.setState(
        {
          // set offset left and top of new frame
          originX: pageX - offsetLeft,
          originY: pageY - offsetTop,
          frameWidth: 2,
          frameHeight: 2,
        },
        () => this.calcPosition(2, 2, pageX - offsetLeft, pageY - offsetTop)
      );
    }
  }

  // crop image
  crop() {
    const img = findDOMNode(this.img);
    const canvas = document.createElement('canvas');
    const { x, y, width, height } = this.values().original;

    canvas.width = width;
    canvas.height = height;
    canvas
      .getContext('2d')
      .drawImage(img, x, y, width, height, 0, 0, width, height);
    return canvas.toDataURL();
  }

  // get current values
  values() {
    const img = findDOMNode(this.img);
    const {
      frameWidth,
      frameHeight,
      originX,
      originY,
      imgWidth,
      imgHeight,
    } = this.state;

    // crop accroding image's natural width
    const _scale = img.naturalWidth / imgWidth;
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
        imgWidth,
        imgHeight,
      },
      original: {
        width: realFrameWidth,
        height: realFrameHeight,
        x: realOriginX,
        y: realOriginY,
        imgWidth: img.naturalWidth,
        imgHeight: img.naturalHeight,
      },
    };
  }

  // stop dragging
  handleDragStop(e) {
    if (this.state.dragging) {
      e.preventDefault();

      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = findDOMNode(
        this.frameNode
      );

      const { imgWidth, imgHeight } = this.state;

      this.setState(
        {
          originX: offsetLeft,
          originY: offsetTop,
          dragging: false,
          frameWidth: offsetWidth,
          frameHeight: offsetHeight,
          maxLeft: imgWidth - offsetWidth,
          maxTop: imgHeight - offsetHeight,
          action: null,
        },
        () => {
          const { onChange } = this.props;
          if (onChange) onChange(this.values());
        }
      );
    }
  }

  render() {
    const {
      dragging,
      imgHeight,
      imgWidth,
      imgLoaded,
      styles,
      src,
    } = this.state;

    const imageNode = (
      <div
        style={styles.source}
        ref={ref => {
          this.sourceNode = ref;
        }}
      >
        <img
          src={src}
          width={imgWidth}
          height={imgHeight}
          ref={ref => {
            this.img = ref;
          }}
          style={{ ...styles.img, ...styles.source_img }}
          onLoad={this.imgOnLoad.bind(this)}
        />
      </div>
    );

    return (
      <div
        onMouseDown={this.handleDragStart.bind(this)}
        onTouchStart={this.handleDragStart.bind(this)}
        style={{
          ...styles.container,
          position: 'relative',
          height: imgHeight,
        }}
        ref={ref => {
          this.container = ref;
        }}
      >
        {imageNode}
        {imgLoaded ? (
          <div>
            <div style={styles.modal} />
            {/* frame container */}
            <div
              style={{
                ...styles.frame,
                ...(dragging ? styles.dragging_frame : {}),
                display: 'block',
                left: this.state.toImgLeft4Style,
                top: this.state.toImgTop4Style,
                width: this.state.frameWidth4Style,
                height: this.state.frameHeight4Style,
              }}
              ref={ref => {
                this.frameNode = ref;
              }}
            >
              {/* clone img */}
              <div style={styles.clone}>
                <img
                  src={src}
                  width={imgWidth}
                  height={imgHeight}
                  style={{
                    ...styles.img,
                    marginLeft: -1 * this.state.toImgLeft4Style,
                    marginTop: -1 * this.state.toImgTop4Style,
                  }}
                  ref={ref => {
                    this.cloneImg = ref;
                  }}
                />
              </div>

              {/* move element */}
              <span data-action="move" style={styles.move} />
              {/* move center element */}
              <Crosshair />

              {/* anchor lines and points */}
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
  originX: PropTypes.number,
  originY: PropTypes.number,
  ratio: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fixedRatio: PropTypes.bool,
  allowNewSelection: PropTypes.bool,
  styles: PropTypes.object,
  onImgLoad: PropTypes.func,
  onChange: PropTypes.func,
};

Cropper.defaultProps = {
  width: 200,
  height: 200,
  fixedRatio: true,
  allowNewSelection: true,
  ratio: 1,
  originX: 0,
  originY: 0,
  styles: {},
  onImgLoad: function() {},
};

export default Cropper;
