import { Rect } from './types';

const getScaledRect = ({
  rect,
  scale,
}: {
  rect: Rect;
  scale: number;
}): Rect => ({
  x: rect.x * scale,
  y: rect.y * scale,
  width: rect.width * scale,
  height: rect.height * scale,
});

export default getScaledRect;
