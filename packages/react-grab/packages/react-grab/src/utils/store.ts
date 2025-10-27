enum SubscriptionType {
  Full = "full",
  Selected = "selected",
}

export interface StoreApi<T> {
  getInitialState(): T;
  getState(): T;
  setState(partialState: ((prevState: T) => T) | Partial<T>): T;
  subscribe(listener: Listener<T>): () => void;
  subscribe<U>(
    listener: Listener<U>,
    selector: (state: T) => unknown
  ): () => void;
}

type Initializer<T> = (
  set: StoreApi<T>["setState"],
  get: StoreApi<T>["getState"]
) => T;

type Listener<T> = (
  state: T,
  prevState: T | undefined
) => (() => unknown) | void;

type SubscriberEntry<T> =
  | {
      listener: Listener<T>;
      type: SubscriptionType.Full;
    }
  | {
      listener: Listener<unknown>;
      prevSelectedValue: unknown;
      selector: (state: T) => unknown;
      type: SubscriptionType.Selected;
    };

export const createStore = <T>(initializer: Initializer<T>) => {
  const subscriberMap = new Map<string, SubscriberEntry<T>>();
  let currentListenerIndex = 0;

  let currentState: T;

  const setState: StoreApi<T>["setState"] = (maybeStateOrReducer) => {
    const prevState = currentState;
    const resolvedState =
      typeof maybeStateOrReducer === "function"
        ? maybeStateOrReducer(prevState)
        : maybeStateOrReducer;
    const nextState = {
      ...prevState,
      ...resolvedState,
    };

    currentState = nextState;

    for (const entry of subscriberMap.values()) {
      if (entry.type === SubscriptionType.Selected) {
        const nextSelectedValue = entry.selector(nextState);
        const prevSelectedValue = entry.prevSelectedValue;
        if (!Object.is(prevSelectedValue, nextSelectedValue)) {
          entry.prevSelectedValue = nextSelectedValue;
          entry.listener(nextSelectedValue, prevSelectedValue);
        }
      } else {
        entry.listener(nextState, prevState);
      }
    }

    return currentState;
  };

  const getState: StoreApi<T>["getState"] = () => {
    return currentState;
  };

  const initialState: T = initializer(setState, getState);
  currentState = initialState;

  const subscribeWithSelector = <U>(
    listener: Listener<U>,
    selector: (state: T) => U
  ): (() => void) => {
    const index = String(currentListenerIndex++);

    const wrappedListener: Listener<unknown> = (
      value: unknown,
      prevValue: unknown
    ) => listener(value as U, prevValue as U | undefined);

    const entry: Extract<
      SubscriberEntry<T>,
      { type: SubscriptionType.Selected }
    > = {
      listener: wrappedListener,
      prevSelectedValue: selector(currentState),
      selector,
      type: SubscriptionType.Selected,
    };
    subscriberMap.set(index, entry);

    return () => {
      subscriberMap.delete(index);
    };
  };

  const subscribeToFullState = (listener: Listener<T>): (() => void) => {
    const index = String(currentListenerIndex++);
    const entry: Extract<
      SubscriberEntry<T>,
      { type: SubscriptionType.Full }
    > = {
      listener,
      type: SubscriptionType.Full,
    };
    subscriberMap.set(index, entry);

    return () => {
      subscriberMap.delete(index);
    };
  };

  function subscribe<U>(
    subscriber: Listener<U>,
    selector: (state: T) => U
  ): () => void;
  function subscribe(subscriber: Listener<T>): () => void;
  function subscribe<U>(
    subscriber: Listener<T> | Listener<U>,
    selector?: (state: T) => U
  ): () => void {
    return selector
      ? subscribeWithSelector(subscriber as Listener<U>, selector)
      : subscribeToFullState(subscriber as Listener<T>);
  }

  const store: StoreApi<T> = {
    getInitialState() {
      return initialState;
    },
    getState,
    setState,
    subscribe,
  };

  return store;
};
