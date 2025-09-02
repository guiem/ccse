export type QAItem = {
  question: string;
  answers: string[];
  correct_answer: number; // 0,1,2
  task: 'tarea_1' | 'tarea_2' | 'tarea_3' | 'tarea_4' | 'tarea_5';
  task_id: string; // e.g., "1001"
};

export type Stats = {
  attempts: number;
  correct: number;
  wrong: number;
  wrongCountById: Record<string, number>; // task_id -> count wrong
  lastUpdated: string;
  lastSeqAll?: number; // zero-based index for "all" sequential
  lastSeqByTask?: Partial<Record<QAItem['task'], number>>; // zero-based per tarea sequential
};

export type Mode =
  | { kind: 'all'; order: 'random' | 'sequential' }
  | { kind: 'task'; task: QAItem['task']; order: 'random' | 'sequential' }
  | { kind: 'failed'; order: 'random' | 'sequential' } // premium: review wrong
  | { kind: 'bookmarked'; order: 'random' | 'sequential' }; // premium: review saved
