export const scheduleRunWhenIdle = (callback: () => void) => {
  if ("scheduler" in globalThis) {
    return (
      globalThis as typeof globalThis & {
        scheduler: {
          postTask: (
            callback: () => void,
            options: { priority: "background" }
          ) => void;
        };
      }
    ).scheduler.postTask(callback, {
      priority: "background",
    });
  }
  if ("requestIdleCallback" in window) {
    return requestIdleCallback(callback);
  }
  return setTimeout(callback, 0);
};
