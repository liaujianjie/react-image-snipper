const getStyleFromRect = rect => ({
  left: rect.x,
  top: rect.y,
  width: rect.width,
  height: rect.height,
});

export default getStyleFromRect;
