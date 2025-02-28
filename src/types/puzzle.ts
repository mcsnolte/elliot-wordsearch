export interface GridSize {
  rows: number;
  cols: number;
}

export interface Word {
  word: string;
  hint: string;
  found?: boolean;
}

export interface Puzzle {
  puzzleId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridSize: GridSize;
  words: Word[];
  grid?: string[][];
}

export interface GameState {
  currentPuzzle: Puzzle | null;
  foundWords: string[];
  isComplete: boolean;
  startTime?: Date;
  endTime?: Date;
} 