import { Rect } from './types';

const getStyleFromRect = (rect: Rect) => ({
  left: rect.x,
  top: rect.y,
  width: rect.width,
  height: rect.height,
});

export default getStyleFromRect;
