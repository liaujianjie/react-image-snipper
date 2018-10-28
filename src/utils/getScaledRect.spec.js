import getScaledRect from './getScaledRect';

describe('getScaledRect', () => {
  const rect = { x: 100, y: 150, width: 200, height: 300 };
  test('should return a correctly scaled rect', () => {
    const result = { x: 200, y: 300, width: 400, height: 600 };

    expect(getScaledRect({ rect, scale: 2 })).toEqual(result);
  });
});
