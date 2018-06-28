import Action, { GroupedAction } from './Action';

/**
 * Calculates a new `Rect` from interaction with anchor points or the box itself.
 * @param {Rect} originalRect the original to calculate the new rect from
 * @param {Point} originalPointerPos the original pointer position
 * @param {Point} currentPointerPos the current pointer position
 * @param {Action} action the action
 */
const getNewRect = ({
  originalRect,
  originalPointerPos,
  currentPointerPos,
  action,
}) => {
  const rectMap = getRectMap(action);
  const pointerOffset = {
    x: currentPointerPos.x - originalPointerPos.x,
    y: currentPointerPos.y - originalPointerPos.y,
  };
  return getNegativeCorrectRect({
    x: originalRect.x + pointerOffset.x * rectMap.x,
    y: originalRect.y + pointerOffset.y * rectMap.y,
    width: originalRect.width + pointerOffset.x * rectMap.width,
    height: originalRect.height + pointerOffset.y * rectMap.height,
  });
};

const getNegativeCorrectRect = ({ x, y, width, height }) => {
  const flipX = width < 0;
  const flipY = height < 0;
  const newX = flipX ? x + width : x;
  const newY = flipY ? y + height : y;
  return {
    x: newX < 0 ? 0 : newX,
    y: newY < 0 ? 0 : newY,
    // flip sizes if they are negative
    width: flipX ? -width : width,
    height: flipY ? -height : height,
  };
};

const getRectMap = action => ({
  x: getRectMapX(action),
  y: getRectMapY(action),
  width: getRectMapWidth(action),
  height: getRectMapHeight(action),
});

const getRectMapX = action => {
  const positive = [Action.MOVE, ...GroupedAction.WEST];
  if (positive.includes(action)) return 1;
  return 0;
};

const getRectMapY = action => {
  const positive = [Action.MOVE, ...GroupedAction.NORTH];
  if (positive.includes(action)) return 1;
  return 0;
};

const getRectMapWidth = action => {
  const positive = GroupedAction.EAST;
  const negative = GroupedAction.WEST;
  if (positive.includes(action)) return 1;
  if (negative.includes(action)) return -1;
  return 0;
};

const getRectMapHeight = action => {
  const positive = GroupedAction.SOUTH;
  const negative = GroupedAction.NORTH;
  if (positive.includes(action)) return 1;
  if (negative.includes(action)) return -1;
  return 0;
};

export default getNewRect;
