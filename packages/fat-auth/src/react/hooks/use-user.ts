import type { User } from "~/core";
import { useFatAuth } from "../contexts";

type UseUserReturn =
	| { isLoggedIn: true; user: User; isLoading: false }
	| { isLoggedIn: false; user: undefined; isLoading: true }
	| { isLoggedIn: false; user: null; isLoading: false };

export const useUser = (): UseUserReturn => {
	const { user, isLoading } = useFatAuth();

	if (user) return { isLoggedIn: true, user, isLoading: false };
	if (isLoading) return { isLoggedIn: false, user: undefined, isLoading: true };
	return { isLoggedIn: false, user: null, isLoading: false };
};
