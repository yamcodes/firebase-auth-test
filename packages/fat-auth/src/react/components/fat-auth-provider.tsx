import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useEffectOnce } from "react-use";
import { getQueryParams, removeParamsFromUrl } from "utilities";
import { FatAuth, type User } from "~/core";
import { FatAuthContext } from "../contexts/fat-auth-context";

export type FatAuthProviderProps = PropsWithChildren<{
	autoLogin?: boolean;
}>;

export const FatAuthProvider = ({
	children,
	autoLogin,
}: FatAuthProviderProps) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User | null | undefined>(undefined);

	const auth = useMemo(() => new FatAuth(), []);

	/**
	 * Subscribe / unsubscribe to auth state changes
	 */
	useEffectOnce(() => {
		return auth.subscribe((incomingUser) => {
			setIsLoading(false);
			setIsLoggedIn(Boolean(incomingUser));
			setUser(incomingUser);
		});
	});

	/**
	 * Login if there is an access token in the query params
	 */
	useEffect(() => {
		const { access_token: accessToken } = getQueryParams();
		if (!accessToken) {
			if (!autoLogin) return;
			if (isLoading || user) return;
			auth.login();
			return;
		}
		removeParamsFromUrl(["access_token"]);
		void auth.loginWithAccessToken(accessToken);
	}, [auth, autoLogin, isLoading, user]);

	const login = () => {
		setIsLoading(true);
		auth.login();
		setIsLoading(false);
	};

	const logout = async () => {
		setIsLoading(true);
		await auth.logout();
		setIsLoading(false);
	};

	return (
		<FatAuthContext.Provider
			value={{ isLoggedIn, isLoading, user, login, logout }}
		>
			{children}
		</FatAuthContext.Provider>
	);
};
