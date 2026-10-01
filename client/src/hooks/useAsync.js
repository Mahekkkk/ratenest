import { useEffect, useState } from "react";

/**
 * Runs `fetcher` whenever `deps` change or `reload()` is called.
 * Keeps the previous data while refetching so lists do not blank out.
 * `loading` is true until the latest request settles.
 */
export function useAsync(fetcher, deps = []) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({ key: null, data: null, error: "" });
  const key = JSON.stringify([deps, tick]);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ key, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setState({ key, data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
    // fetcher is intentionally excluded: callers pass inline closures, `deps` drives refetching.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    data: state.data,
    error: state.error,
    loading: state.key !== key,
    reload: () => setTick((value) => value + 1),
  };
}
