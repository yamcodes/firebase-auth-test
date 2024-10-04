import { useFatAuth } from "../contexts";

type UseAuthReturn =
	| {
			isLoggedIn: true;
			isLoading: false;
			login: () => void;
			logout: () => Promise<void>;
	  }
	| {
			isLoggedIn: false;
			isLoading: true;
			login: () => void;
			logout: () => Promise<void>;
	  }
	| {
			isLoggedIn: false;
			isLoading: false;
			login: () => void;
			logout: () => Promise<void>;
	  };

export const useAuth = (): UseAuthReturn => {
	const { user, isLoading, login, logout } = useFatAuth();

	if (user) return { isLoggedIn: true, isLoading: false, login, logout };
	if (isLoading) return { isLoggedIn: false, isLoading: true, login, logout };
	return { isLoggedIn: false, isLoading: false, login, logout };
};
