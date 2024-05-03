import { useMemo, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { getQueryParams, removeParamsFromUrl } from 'utilities';

/**
 * Filter the query parameters based on the specified keys.
 * @param params - The query parameters to filter.
 * @param keys - The keys to filter by.
 * @returns An object containing the filtered query parameters
 */
const filterParams = <T extends string>(
  params: Record<string, string | undefined>,
  keys: T[]
) =>
  Object.fromEntries(
    Object.entries(params).filter(([key]) => keys.includes(key as T))
  ) as Record<T, string | undefined>;

type UseQueryParamsOptions = {
  /**
   * A boolean indicating if the specified query parameters should be removed from the URL after retrieval.
   */
  removeOnUse?: boolean;
};

type UseQueryParamsInput<T extends string> = {
  /**
   * The keys of the query parameters to retrieve.
   */
  keys: T[];
  /**
   * The options for the hook.
   * @see {@link UseQueryParamsOptions}
   */
  options?: UseQueryParamsOptions;
};

/**
 * Custom hook to retrieve and optionally remove specified query parameters from the URL.
 * @param input - The input for the hook. {@link UseQueryParamsInput}
 * @returns An object containing the specified query parameters.
 */
export const useQueryParams = <T extends string>({
  keys: unoptimizedKeys,
  options: { removeOnUse = false } = {},
}: UseQueryParamsInput<T>): Record<T, string | undefined> => {
  /**
   * Store a stable reference to the keys
   */
  const keysRef = useRef(unoptimizedKeys);
  useEffectOnce(() => {
    keysRef.current = unoptimizedKeys;
  });
  const keys = keysRef.current;

  const filteredParams = useMemo(() => {
    const queryParams = getQueryParams();
    return filterParams(queryParams, keys);
  }, [keys]);

  /**
   * Remove the specified params from the URL
   */
  useEffectOnce(() => {
    if (!removeOnUse) return;
    removeParamsFromUrl(keys);
  });

  return filteredParams;
};
