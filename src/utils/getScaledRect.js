const getScaledRect = ({ rect, scale }) => ({
  x: rect.x * scale,
  y: rect.y * scale,
  width: rect.width * scale,
  height: rect.height * scale,
});

export default getScaledRect;
