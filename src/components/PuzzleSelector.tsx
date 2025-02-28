import { Puzzle } from '../types/puzzle';

interface PuzzleSelectorProps {
  puzzles: Puzzle[];
  currentPuzzle: Puzzle;
  onPuzzleSelect: (puzzle: Puzzle) => void;
}

export const PuzzleSelector = ({ puzzles, currentPuzzle, onPuzzleSelect }: PuzzleSelectorProps) => {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <label htmlFor="puzzle-select" style={{ fontWeight: 'bold' }}>
        Select Puzzle:
      </label>
      <select
        id="puzzle-select"
        value={currentPuzzle.puzzleId}
        onChange={(e) => {
          const selected = puzzles.find(p => p.puzzleId === e.target.value);
          if (selected) {
            onPuzzleSelect(selected);
          }
        }}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px',
          cursor: 'pointer',
          backgroundColor: 'white'
        }}
      >
        {puzzles.map(puzzle => (
          <option key={puzzle.puzzleId} value={puzzle.puzzleId}>
            {puzzle.title} ({puzzle.difficulty})
          </option>
        ))}
      </select>
    </div>
  );
}; 