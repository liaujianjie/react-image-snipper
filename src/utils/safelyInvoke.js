const safelyInvoke = method =>
  method && method.apply && method.call ? method : () => {};

export default safelyInvoke;
