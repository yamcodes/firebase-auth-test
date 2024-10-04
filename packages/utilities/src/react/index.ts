import { createContext, useContext } from "react";

export function assertContextExists(
	contextVal: unknown,
	msgOrCtx: string | React.Context<unknown>,
): asserts contextVal {
	if (!contextVal) {
		throw new Error(
			typeof msgOrCtx === "string"
				? msgOrCtx
				: `${msgOrCtx.displayName ?? "Context"} not found`,
		);
	}
}

interface Options {
	assertCtxFn?: (v: unknown, msg: string) => void;
}
type ContextOf<T> = React.Context<T | undefined>;
type UseCtxFn<T> = () => T;

/**
 * Create and return a Context and two hooks that return the context value.
 * The Context type is derived from the type passed in by the user.
 * The first hook returned guarantees that the context exists so the returned value is always CtxValue
 * The second hook makes no guarantees, so the returned value can be CtxValue | undefined
 * @param displayName - The display name of the context.
 * @param options - The options for the context.
 * @returns The context, the use context function, and the use context function without guarantee.
 */
export const createContextAndHook = <CtxVal>(
	displayName: string,
	options?: Options,
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
		return ctx!;
	};

	const useCtxWithoutGuarantee = () => {
		const ctx = useContext(Ctx);
		return ctx ?? ({} as Partial<CtxVal>);
	};

	return [Ctx, useCtx, useCtxWithoutGuarantee];
};
