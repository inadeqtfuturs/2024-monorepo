import type { ActionDispatch } from 'react';

type NullIdentity<T> = T extends null ? any : T;

type Compose<S, P> = P extends object
  ? {
      [T in keyof P]: T extends keyof S
        ? keyof Partial<P[T]> extends keyof Partial<S[T]>
          ? Compose<S[T], P[T]>
          : S[T] extends object
            ? Partial<S[T]>
            : S[T] extends null
              ? any
              : S[T]
        : NullIdentity<P[T]>;
    }
  : NullIdentity<P>;

export type Action<S, H, T = keyof H> = T extends keyof H
  ? H[T] extends (...args: any) => any
    ? Parameters<H[T]> extends [S, infer X]
      ? X extends object
        ? { type: T; payload: Compose<S, X> }
        : { type: T; payload: X }
      : { type: T }
    : never
  : never;

export type Handler<S, P> = (state: S, payload?: P) => S;

export type Handlers<S> = {
  [K: string]: Handler<S, unknown>;
};

export function createContextReducer<S = unknown, H = Handlers<S>>(
  handlers: H,
  initialState: S,
) {
  const reducer = (state: S, action: Action<S, H>): S => {
    const handler = handlers[action.type] as Handler<S, unknown> | undefined;
    if (handler) {
      if ('payload' in action) {
        return handler(state, action.payload);
      }
      return handler(state);
    }
    return state;
  };

  const context = {
    state: initialState,
    dispatch: (() => undefined) as ActionDispatch<[Action<S, H>]>,
  };

  return [reducer, context] as const;
}
