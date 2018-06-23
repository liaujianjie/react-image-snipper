const defaultStyles = {
  container: {},
  img: {
    userDrag: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    WebkitTransform: 'translateZ(0)',
    WebkitPerspective: 1000,
    WebkitBackfaceVisibility: 'hidden',
  },

  clone: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
  },

  frame: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: 'none',
  },

  dragging_frame: {
    opacity: 0.8,
  },

  source: {
    overflow: 'hidden',
  },

  source_img: {
    float: 'left',
  },

  modal: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    opacity: 0.4,
    backgroundColor: '#000',
  },
  move: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    cursor: 'move',
    outline: '1px dashed #ff0000',
    backgroundColor: 'transparent',
  },

  dot: {
    zIndex: 10,
  },
  dotN: {
    cursor: 'n-resize',
  },
  dotS: {
    cursor: 's-resize',
  },
  dotE: {
    cursor: 'e-resize',
  },
  dotW: {
    cursor: 'w-resize',
  },
  dotNW: {
    cursor: 'nw-resize',
  },
  dotNE: {
    cursor: 'ne-resize',
  },
  dotSW: {
    cursor: 'sw-resize',
  },
  dotSE: {
    cursor: 'se-resize',
  },
  dotCenter: {
    backgroundColor: 'transparent',
    cursor: 'move',
  },

  dotInner: {
    border: '1px solid #ff0000',
    background: 'transparent',
    display: 'block',
    width: 7,
    height: 7,
    padding: 0,
    margin: 0,
    position: 'absolute',
  },

  dotInnerN: {
    top: -5,
    left: '50%',
    marginLeft: -4,
  },
  dotInnerS: {
    bottom: -5,
    left: '50%',
    marginLeft: -4,
  },
  dotInnerE: {
    right: -5,
    top: '50%',
    marginTop: -4,
  },
  dotInnerW: {
    left: -5,
    top: '50%',
    marginTop: -4,
  },
  dotInnerNE: {
    top: -5,
    right: -5,
  },
  dotInnerSE: {
    bottom: -5,
    right: -5,
  },
  dotInnerNW: {
    top: -5,
    left: -5,
  },
  dotInnerSW: {
    bottom: -5,
    left: -5,
  },
  dotInnerCenterVertical: {
    position: 'absolute',
    border: 'none',
    width: 1,
    height: 9,
    backgroundColor: '#ff0000',
    top: '50%',
    left: '50%',
    marginLeft: -0.5,
    marginTop: -4,
  },
  dotInnerCenterHorizontal: {
    position: 'absolute',
    border: 'none',
    width: 9,
    height: 1,
    backgroundColor: '#ff0000',
    top: '50%',
    left: '50%',
    marginLeft: -4,
    marginTop: -0.5,
  },

  line: {
    position: 'absolute',
    display: 'block',
    zIndex: 100,
  },

  lineS: {
    cursor: 's-resize',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 4,
    background: 'transparent',
  },
  lineN: {
    cursor: 'n-resize',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    background: 'transparent',
  },
  lineE: {
    cursor: 'e-resize',
    right: 0,
    top: 0,
    width: 4,
    height: '100%',
    background: 'transparent',
  },
  lineW: {
    cursor: 'w-resize',
    left: 0,
    top: 0,
    width: 4,
    height: '100%',
    background: 'transparent',
  },
};
Object.freeze(defaultStyles);

export default defaultStyles;
