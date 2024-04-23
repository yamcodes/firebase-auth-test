import { createContext, useContext } from 'react';

export function assertContextExists(
  contextVal: unknown,
  msgOrCtx: string | React.Context<unknown>
): asserts contextVal {
  if (!contextVal) {
    throw new Error(
      typeof msgOrCtx === 'string'
        ? msgOrCtx
        : `${msgOrCtx.displayName ?? 'Context'} not found`
    );
  }
}

interface Options {
  assertCtxFn?: (v: unknown, msg: string) => void;
}
type ContextOf<T> = React.Context<T | undefined>;
type UseCtxFn<T> = () => T;

export const createContextAndHook = <CtxVal>(
  displayName: string,
  options?: Options
): [
  ContextOf<CtxVal>,
  UseCtxFn<CtxVal>,
  UseCtxFn<CtxVal | Partial<CtxVal>>,
] => {
  const { assertCtxFn = assertContextExists } = options ?? {};
  const Ctx = createContext<CtxVal | undefined>(undefined);
  Ctx.displayName = displayName;

  const useCtx = () => {
    const ctx = useContext(Ctx);
    assertCtxFn(ctx, `${displayName} not found`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- With guarantee
    return ctx!;
  };

  const useCtxWithoutGuarantee = () => {
    const ctx = useContext(Ctx);
    return ctx ?? ({} as Partial<CtxVal>);
  };

  return [Ctx, useCtx, useCtxWithoutGuarantee];
};
