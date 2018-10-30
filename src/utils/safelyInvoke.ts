const safelyInvoke = <TFunction extends Function>(
  methodMaybe: TFunction | unknown
) => {
  if (typeof methodMaybe === 'function') {
    return methodMaybe as TFunction;
  }
  return () => {};
};

export default safelyInvoke;
