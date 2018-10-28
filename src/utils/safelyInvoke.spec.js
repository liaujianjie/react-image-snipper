import safelyInvoke from './safelyInvoke';

describe('safelyInvoke', () => {
  test('should return the original function', () => {
    const myFunction = jest.fn();
    expect(safelyInvoke(myFunction)).toBe(myFunction);
  });

  test('should return an empty function if called with non-function parameter', () => {
    const nonFunction = undefined;
    expect(typeof safelyInvoke(nonFunction)).toBe('function');
  });

  test('should not throw errors when the provided empty function is called', () => {
    safelyInvoke(undefined)();
  });
});
