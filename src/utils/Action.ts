const Action = {
  MOVE: 'move' as 'move',
  NORTH: 'n' as 'n',
  SOUTH: 's' as 's',
  EAST: 'e' as 'e',
  WEST: 'w' as 'w',
  NORTH_EAST: 'ne' as 'ne',
  NORTH_WEST: 'nw' as 'nw',
  SOUTH_EAST: 'se' as 'se',
  SOUTH_WEST: 'sw' as 'sw',
};
Object.freeze(Action);

export type ActionKey = keyof typeof Action;
export type ActionValue = typeof Action[ActionKey];

export const GroupedAction = {
  NORTH: [Action.NORTH_EAST, Action.NORTH_WEST, Action.NORTH],
  SOUTH: [Action.SOUTH_EAST, Action.SOUTH_WEST, Action.SOUTH],
  EAST: [Action.NORTH_EAST, Action.SOUTH_EAST, Action.EAST],
  WEST: [Action.NORTH_WEST, Action.SOUTH_WEST, Action.WEST],
};
Object.freeze(GroupedAction);

export type GroupedActionKey = keyof typeof GroupedAction;
export type GroupedActionValue = typeof GroupedAction[GroupedActionKey];

export default Action;
