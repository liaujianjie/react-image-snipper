import safelyInvoke from './safelyInvoke';

describe('safelyInvoke', () => {
  test('should return the original function', () => {
    const myFunction = jest.fn();
    const safeFunction = safelyInvoke(myFunction);
    safeFunction();

    expect(myFunction).toHaveBeenCalled();
  });

  test('should return an empty function if called with non-function parameter', () => {
    const nonFunction = undefined;
    expect(typeof safelyInvoke(nonFunction)).toBe('function');
  });

  test('should not throw errors when the provided empty function is called', () => {
    expect(safelyInvoke(undefined)).not.toThrow();
  });
});
