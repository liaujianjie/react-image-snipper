import getStyleFromRect from './getStyleFromRect';

describe('getStyleFromRect', () => {
  test('should return a correct shaped object when given a rect', () => {
    const rect = { x: 100, y: 150, width: 200, height: 300 };
    const result = { left: 100, top: 150, width: 200, height: 300 };

    expect(getStyleFromRect(rect)).toEqual(result);
  });
});
