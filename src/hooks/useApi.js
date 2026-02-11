import { useState, useCallback } from 'react';
import { get } from '../services/api';

const EMPTY = { data: null, loading: true, error: null };

export function useApi(path) {
  const [state, setState] = useState({ ...EMPTY, _path: path, _tick: 0 });

  if (state._path !== path) {
    setState({ ...EMPTY, _path: path, _tick: state._tick });
  }

  const tick = state._tick;
  const needsFetch = state.loading;

  if (needsFetch) {
    fetchData(path, tick, setState);
  }

  const refetch = useCallback(() => {
    setState((s) => ({ ...EMPTY, _path: s._path, _tick: s._tick + 1 }));
  }, []);

  return { data: state.data, loading: state.loading, error: state.error, refetch };
}

const inflight = new Map();

function fetchData(path, tick, setState) {
  const key = `${path}::${tick}`;
  if (inflight.has(key)) return;
  inflight.set(key, true);

  get(path)
    .then((data) => {
      setState((s) => {
        if (s._path === path && s._tick === tick) {
          return { ...s, data, loading: false, error: null };
        }
        return s;
      });
    })
    .catch((err) => {
      setState((s) => {
        if (s._path === path && s._tick === tick) {
          return { ...s, data: null, loading: false, error: err.message };
        }
        return s;
      });
    })
    .finally(() => {
      inflight.delete(key);
    });
}
