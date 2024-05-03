# `useQueryParams`

React hook for retrieving and optionally removing specified query parameters from the URL.

## Usage

This hook is designed to fetch specific query parameters from the current URL. It can also remove these parameters from the URL after fetching them, which is useful for handling one-time parameters like tokens in authentication redirects.

> [!NOTE]
> If `removeOnUse` is set to `true`, the specified query parameters will be removed from the URL when the hook is first executed. This is useful for parameters that should only be processed once, such as authentication tokens.

```tsx
// Demo.tsx
import { useQueryParams } from 'hooks';

export const Demo = () => {
  const queryParams = useQueryParams({
    keys: ['token', 'redirect'],
    options: { removeOnUse: true },
  });
  return (
    <div>
      <p>Token: {queryParams.token}</p>
      <p>Redirect URL: {queryParams.redirect}</p>
    </div>
  );
};

// App.tsx
import { Demo } from './Demo';

export const App = () => {
  return <Demo />;
};
```

## Reference

```ts
type UseQueryParamsOptions = {
  /**
   * A boolean indicating if the specified query parameters should be removed from the URL after retrieval.
   */
  removeOnUse?: boolean;
};

type UseQueryParamsInput = {
  /**
   * The keys of the query parameters to retrieve.
   */
  keys: string[];
  /**
   * The options for the hook.
   * @see {@link UseQueryParamsOptions}
   */
  options?: UseQueryParamsOptions;
};

export const useQueryParams = ({
  keys: unoptimizedKeys,
  options: { removeOnUse = false } = {},
}: UseQueryParamsInput)
```
