import { useSyncExternalStore } from 'react';

function getServerSnapshot(): boolean {
  return false;
}

function getClientSnapshot(): boolean {
  return true;
}

export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    getClientSnapshot,
    getServerSnapshot
  );
}

export function useClientOnly(): boolean {
  return useMounted();
}

export function useMountedState() {
  const mounted = useMounted();
  return { isMounted: mounted };
}