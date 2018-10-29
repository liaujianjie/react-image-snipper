import getNewRect from './getNewRect';
import Action from './Action';

describe('getNewRect', () => {
  const rect = { x: 100, y: 150, width: 200, height: 300 };

  test('should create identical rect when using zero offset and full size', () => {
    const expectedResult = { x: 100, y: 150, width: 200, height: 300 };
    const imageSize = { width: 1200, height: 1300 };
    const originalPointer = { x: 100, y: 150 };
    const currentPointer = { x: 100, y: 150 };
    expect(
      getNewRect({
        originalRect: rect,
        originalPointerPos: originalPointer,
        currentPointerPos: currentPointer,
        imageSize,
        action: Action.MOVE,
      })
    ).toEqual(expectedResult);
  });

  test('should not allow growing the rect larger than image size', () => {
    const expectedResult = { x: 0, y: 0, width: 400, height: 550 };
    const imageSize = { width: 400, height: 550 };
    const originalPointer = { x: 300, y: 450 };
    const currentPointer = { x: 900, y: 950 };
    expect(
      getNewRect({
        originalRect: rect,
        originalPointerPos: originalPointer,
        currentPointerPos: currentPointer,
        imageSize,
        action: Action.SOUTH_EAST,
      })
    ).toEqual(expectedResult);
  });

  test('should truncate negative pointer to zero', () => {
    const expectedResult = { x: 0, y: 0, width: 150, height: 200 };
    const imageSize = { width: 400, height: 550 };
    const originalPointer = { x: 300, y: 450 };
    const currentPointer = { x: -50, y: -50 };
    expect(
      getNewRect({
        originalRect: rect,
        originalPointerPos: originalPointer,
        currentPointerPos: currentPointer,
        imageSize,
        action: Action.SOUTH_EAST,
      })
    ).toEqual(expectedResult);
  });

  test('should allow growing the rect to the left', () => {
    const expectedResult = { x: 50, y: 150, width: 250, height: 300 };
    const imageSize = { width: 400, height: 550 };
    const originalPointer = { x: 100, y: 150 };
    const currentPointer = { x: 50, y: 150 };
    expect(
      getNewRect({
        originalRect: rect,
        originalPointerPos: originalPointer,
        currentPointerPos: currentPointer,
        imageSize,
        action: Action.WEST,
      })
    ).toEqual(expectedResult);
  });

  test('should allow growing the rect upwards', () => {
    const expectedResult = { x: 100, y: 50, width: 200, height: 400 };
    const imageSize = { width: 400, height: 550 };
    const originalPointer = { x: 100, y: 150 };
    const currentPointer = { x: 100, y: 50 };
    expect(
      getNewRect({
        originalRect: rect,
        originalPointerPos: originalPointer,
        currentPointerPos: currentPointer,
        imageSize,
        action: Action.NORTH,
      })
    ).toEqual(expectedResult);
  });
});
