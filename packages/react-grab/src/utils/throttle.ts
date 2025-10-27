// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <F extends (...args: any[]) => void>(
  fn: F,
  delay: number
) => {
  let timeout: null | number = null;
  const throttled = (...args: Parameters<typeof fn>) => {
    if (timeout) {
      return;
    }
    timeout = window.setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  };
  throttled.cancel = () => {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  };
  return throttled;
};
