import type { QAItem } from './types'

export const PREMIUM_ENABLED = true; // flip to false to hide Stats UI

export const TASK_LABELS: Record<QAItem['task'], string> = {
  tarea_1: 'Tarea 1 · Gobierno y participación',
  tarea_2: 'Tarea 2 · Derechos y deberes',
  tarea_3: 'Tarea 3 · Organización territorial y geografía',
  tarea_4: 'Tarea 4 · Cultura e historia',
  tarea_5: 'Tarea 5 · Sociedad española',
};

// NOTE: Replace these with the exact hex codes from the PDF if you want a perfect match.
// They are easy to change here in one place.
export const TASK_COLORS: Record<QAItem['task'], string> = {
  tarea_1: '#0ea5e9', // Sky 500 (placeholder)
  tarea_2: '#22c55e', // Green 500 (placeholder)
  tarea_3: '#a855f7', // Purple 500 (placeholder)
  tarea_4: '#f59e0b', // Amber 500 (placeholder)
  tarea_5: '#ef4444', // Red 500 (placeholder)
};

export function groupByTask(items: QAItem[]) {
  const map: Record<QAItem['task'], QAItem[]> = {
    tarea_1: [], tarea_2: [], tarea_3: [], tarea_4: [], tarea_5: []
  };
  items.forEach(it => { map[it.task].push(it); });
  return map;
}

export function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function loadStats(): import('./types').Stats {
  try {
    const raw = localStorage.getItem('ccse_stats_v1');
    if (!raw) {
      return { attempts: 0, correct: 0, wrong: 0, wrongCountById: {}, lastUpdated: new Date().toISOString() };
    }
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, correct: 0, wrong: 0, wrongCountById: {}, lastUpdated: new Date().toISOString() };
  }
}

export function saveStats(stats: import('./types').Stats) {
  stats.lastUpdated = new Date().toISOString();
  localStorage.setItem('ccse_stats_v1', JSON.stringify(stats));
}

export function recordAnswer(stats: import('./types').Stats, item: QAItem, correct: boolean) {
  stats.attempts += 1;
  if (correct) stats.correct += 1; else {
    stats.wrong += 1;
    stats.wrongCountById[item.task_id] = (stats.wrongCountById[item.task_id] ?? 0) + 1;
  }
}

export function getTopFailed(stats: import('./types').Stats, items: QAItem[], topN = 10) {
  const byId = stats.wrongCountById;
  const withWrong = items.map(it => ({
    item: it,
    wrong: byId[it.task_id] ?? 0
  }));
  withWrong.sort((a,b) => b.wrong - a.wrong);
  return withWrong.filter(x => x.wrong > 0).slice(0, topN);
}

export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// Bookmarks: simple string[] of task_id persisted in localStorage
const BOOKMARKS_KEY = 'ccse_bookmarks_v1'

export function loadBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveBookmarks(ids: string[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids))
}
