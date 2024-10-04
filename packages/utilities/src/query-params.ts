/**
 * Get all query parameters from the URL.
 * @returns An object containing all query parameters.
 */
export const getQueryParams = (): Record<string, string | undefined> => {
	const urlSearchParams = new URLSearchParams(window.location.search);
	return Object.fromEntries<string | undefined>(urlSearchParams.entries());
};

/**
 * Remove the specified query parameters from the URL.
 * @param keys - The keys of the query parameters to remove.
 */
export const removeParamsFromUrl = (keys: string[]) => {
	const newSearchParams = new URLSearchParams(window.location.search);
	for (const key of keys) newSearchParams.delete(key);
	const newSearchParamsString = newSearchParams.toString();
	const newUrl = `${window.location.pathname}${
		newSearchParamsString ? `?${newSearchParamsString}` : ""
	}`;
	window.history.replaceState(null, "", newUrl);
};
