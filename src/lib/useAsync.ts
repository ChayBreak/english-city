import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type State<T> = { key: string | null; data: T | undefined; error: unknown };

/** Loads data on mount and whenever `deps` (ids and flags) change; `reload`
 * re-runs it and resolves once the fresh data is in. */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]) {
  const depsKey = JSON.stringify(deps);
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState<State<T>>({ key: null, data: undefined, error: null });
  const loader = useRef(load);
  const waiting = useRef<(() => void)[]>([]);
  const runKey = `${depsKey}#${nonce}`;

  useLayoutEffect(() => {
    loader.current = load;
  });

  useEffect(() => {
    let alive = true;
    const settle = (next: (previous: State<T>) => State<T>) => {
      if (!alive) return;
      setState(next);
      waiting.current.splice(0).forEach((resolve) => resolve());
    };
    loader.current().then(
      (data) => settle(() => ({ key: runKey, data, error: null })),
      (error: unknown) => settle((previous) => ({ key: runKey, data: previous.data, error })),
    );
    return () => {
      alive = false;
    };
  }, [runKey]);

  const reload = useCallback(
    () =>
      new Promise<void>((resolve) => {
        waiting.current.push(resolve);
        setNonce((n) => n + 1);
      }),
    [],
  );

  return { data: state.data, error: state.error, loading: state.key !== runKey, reload };
}
