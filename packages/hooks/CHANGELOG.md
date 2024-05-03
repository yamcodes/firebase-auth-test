# hooks

## 0.3.3

### Patch Changes

- Improve `useQueryParams` typesafety _[`#45`](https://github.com/Storemavens/mvns-core/pull/45) [`6d8a39f`](https://github.com/Storemavens/mvns-core/commit/6d8a39fec54f1a01f4859056b7555d3902ba95d4) [@Yam-Borodetsky_1701](https://github.com/Yam-Borodetsky_1701)_

  Type the return value based on the incoming keys

## 0.3.2

### Patch Changes

- ed8fbb4: Fix `useQueryParam` infinite render

  Fix an infinite render when using `removeOnUse`, caused by improper usage of `useMemo`
  The tests have been updated to reflect this change and they now pass.

## 0.3.1

### Patch Changes

- 020c020: Fix `useQueryParams` to only handle specified keys

## 0.3.0

### Minor Changes

- 3521ec3: `useQueryParams` hook

## 0.2.1

### Patch Changes

- d956d07: Fix packages build issues

## 0.2.0

### Minor Changes

- f397f20: First release of hooks

## 0.1.0

### Minor Changes

- af5bec1: First release of hooks
