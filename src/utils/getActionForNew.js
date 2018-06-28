import Action from './Action';

const getActionForNew = ({ originalPointerPos, currentPointerPos }) => {
  const offsetX = currentPointerPos.x - originalPointerPos.x;
  const offsetY = currentPointerPos.y - originalPointerPos.y;
  if (offsetX > 0 && offsetY > 0) return Action.SOUTH_EAST;
  if (offsetX > 0 && offsetY < 0) return Action.NORTH_EAST;
  if (offsetX < 0 && offsetY > 0) return Action.SOUTH_WEST;
  if (offsetX < 0 && offsetY < 0) return Action.NORTH_WEST;
  return Action.MOVE;
};

export default getActionForNew;
