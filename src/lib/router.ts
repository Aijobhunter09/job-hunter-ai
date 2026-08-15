import { useEffect, useState, useCallback } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
}

function getCurrentPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

export function navigate(path: string): void {
  if (window.location.hash.replace(/^#/, '') === path) return;
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function useRouter() {
  const [path, setPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const onChange = () => setPath(getCurrentPath());
    window.addEventListener('hashchange', onChange);
    if (!window.location.hash) {
      window.location.hash = '/';
    }
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const go = useCallback((p: string) => navigate(p), []);

  return { path, go };
}

export function matchRoute(
  path: string,
  routes: { pattern: string; component: string }[]
): { component: string; params: Record<string, string> } | null {
  for (const route of routes) {
    const params = matchPattern(path, route.pattern);
    if (params !== null) {
      return { component: route.component, params };
    }
  }
  return null;
}

function matchPattern(path: string, pattern: string): Record<string, string> | null {
  const pathParts = path.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);

  if (pathParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    const ap = pathParts[i];
    if (pp.startsWith(':')) {
      params[pp.slice(1)] = decodeURIComponent(ap);
    } else if (pp !== ap) {
      return null;
    }
  }
  return params;
}
