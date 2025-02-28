import { Puzzle } from '../types/puzzle';

type Direction = 'horizontal' | 'vertical' | 'diagonal';

const directions: { [key in Direction]: [number, number] } = {
  horizontal: [0, 1],
  vertical: [1, 0],
  diagonal: [1, 1]
};

function canPlaceWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction
): boolean {
  const [dRow, dCol] = directions[direction];
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;
    
    if (row >= grid.length || col >= grid[0].length) {
      return false;
    }
    
    if (grid[row][col] !== '.' && grid[row][col] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: Direction
): void {
  const [dRow, dCol] = directions[direction];
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * dRow;
    const col = startCol + i * dCol;
    grid[row][col] = word[i];
  }
}

function fillEmptySpaces(grid: string[][]): void {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === '.') {
        const randomIndex = Math.floor(Math.random() * letters.length);
        grid[row][col] = letters[randomIndex];
      }
    }
  }
}

export function generateGrid(puzzle: Puzzle): string[][] {
  const { gridSize, words } = puzzle;
  const grid = Array(gridSize.rows)
    .fill(null)
    .map(() => Array(gridSize.cols).fill('.'));
  
  // Sort words by length (longest first)
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);
  
  for (const { word } of sortedWords) {
    let placed = false;
    const availableDirections = Object.keys(directions) as Direction[];
    
    // Try multiple times to place each word
    for (let attempts = 0; attempts < 100 && !placed; attempts++) {
      const direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      const startRow = Math.floor(Math.random() * gridSize.rows);
      const startCol = Math.floor(Math.random() * gridSize.cols);
      
      if (canPlaceWord(grid, word, startRow, startCol, direction)) {
        placeWord(grid, word, startRow, startCol, direction);
        placed = true;
      }
    }
    
    if (!placed) {
      console.warn(`Could not place word: ${word}`);
    }
  }
  
  fillEmptySpaces(grid);
  return grid;
} 