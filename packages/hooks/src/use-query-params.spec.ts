// Import necessary utilities from Vitest and testing-library/react-hooks
import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useQueryParams } from './use-query-params';

// Mock window.location with jsdom
const originalLocation = window.location;

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: {
      ...originalLocation,
      search: '',
    },
    writable: true,
  });
});
describe('useQueryParams', () => {
  it('returns an empty object when there are no query parameters', () => {
    const { result } = renderHook(() => useQueryParams({ keys: [] }));
    expect(result.current).toEqual({});
  });
  it('returns the correct query parameters', () => {
    window.location.search = '?name=John&age=30';
    const { result } = renderHook(() =>
      useQueryParams({ keys: ['name', 'age'] })
    );
    expect(result.current).toEqual({ name: 'John', age: '30' });
  });
  it('removes query parameters from the URL when removeOnUse is true', () => {
    window.location.search = '?remove=true';
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    expect(window.location.search).toBe('?remove=true');
    renderHook(() =>
      useQueryParams({ keys: ['remove'], options: { removeOnUse: true } })
    );
    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.pathname}${window.location.hash}`
    );
  });
  it('does not remove unrelated query parameters from the URL when removeOnUse is true', () => {
    window.location.search = '?name=John&age=30&remove=true';
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    expect(window.location.search).toBe('?name=John&age=30&remove=true');
    renderHook(() =>
      useQueryParams({ keys: ['name', 'age'], options: { removeOnUse: true } })
    );
    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.pathname}?remove=true${window.location.hash}`
    );
  });
  it('only returns specified query parameters and ignores others', () => {
    window.location.search = '?name=John&age=30&city=NewYork';
    const { result } = renderHook(() =>
      useQueryParams({ keys: ['name', 'age'], options: { removeOnUse: true } })
    );
    expect(result.current).toEqual({ name: 'John', age: '30' });
  });
  it('handles keys that do not exist in the URL', () => {
    window.location.search = '?name=John&age=30';
    const { result } = renderHook(() =>
      useQueryParams({ keys: ['name', 'age', 'city'] })
    );
    expect(result.current).toEqual({
      name: 'John',
      age: '30',
      city: undefined,
    });
  });
});
// Restore original window.location after all tests
afterAll(() => {
  window.location = originalLocation;
});
