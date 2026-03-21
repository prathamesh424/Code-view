export interface ProgressItem {
  id: string;
  title: string;
  href: string;
  timestamp: number;
}

const RECENT_KEY = 'cv_recent_visualizations_v1';
const FAVORITES_KEY = 'cv_favorite_examples_v1';
const SOLVED_KEY = 'cv_solved_challenges_v1';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota/privacy mode errors
  }
}

export function getRecentVisualizations(): ProgressItem[] {
  return readJson<ProgressItem[]>(RECENT_KEY, []);
}

export function addRecentVisualization(item: Omit<ProgressItem, 'timestamp'>): void {
  const current = getRecentVisualizations();
  const deduped = current.filter((it) => it.id !== item.id);
  const next = [{ ...item, timestamp: Date.now() }, ...deduped].slice(0, 10);
  writeJson(RECENT_KEY, next);
}

export function getFavoriteExamples(): string[] {
  return readJson<string[]>(FAVORITES_KEY, []);
}

export function toggleFavoriteExample(id: string): string[] {
  const favorites = getFavoriteExamples();
  const next = favorites.includes(id)
    ? favorites.filter((fav) => fav !== id)
    : [...favorites, id];
  writeJson(FAVORITES_KEY, next);
  return next;
}

export function getSolvedChallenges(): string[] {
  return readJson<string[]>(SOLVED_KEY, []);
}

export function markChallengeSolved(id: string): void {
  const solved = getSolvedChallenges();
  if (solved.includes(id)) return;
  writeJson(SOLVED_KEY, [...solved, id]);
}
