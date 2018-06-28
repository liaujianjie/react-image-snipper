const Action = {
  MOVE: 'move',
  NORTH: 'n',
  SOUTH: 's',
  EAST: 'e',
  WEST: 'w',
  NORTH_EAST: 'ne',
  NORTH_WEST: 'nw',
  SOUTH_EAST: 'se',
  SOUTH_WEST: 'sw',
};
Object.freeze(Action);

export const GroupedAction = {
  NORTH: [Action.NORTH_EAST, Action.NORTH_WEST, Action.NORTH],
  SOUTH: [Action.SOUTH_EAST, Action.SOUTH_WEST, Action.SOUTH],
  EAST: [Action.NORTH_EAST, Action.SOUTH_EAST, Action.EAST],
  WEST: [Action.NORTH_WEST, Action.SOUTH_WEST, Action.WEST],
};
Object.freeze(GroupedAction);

export default Action;
