import { useState, useCallback, MouseEvent, useEffect } from 'react';
import { Puzzle } from '../types/puzzle';
import { getWordFromSelection, isValidSelection } from '../utils/wordFinder';

interface Position {
  row: number;
  col: number;
}

interface FoundWord {
  word: string;
  cells: Position[];
}

interface GameBoardProps {
  puzzle: Puzzle;
  onWordFound: (word: string) => void;
}

type InteractionMode = 'click' | 'drag' | 'none';

export const GameBoard = ({ puzzle, onWordFound }: GameBoardProps) => {
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('none');
  const [lastFoundWord, setLastFoundWord] = useState<Position[]>([]);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [cellSize, setCellSize] = useState(40);

  useEffect(() => {
    const updateCellSize = () => {
      // Get the smaller of window width or height
      const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
      // Calculate cell size based on grid size and screen size
      // Leave some margin for the UI elements
      const maxGridDimension = Math.max(puzzle.gridSize.rows, puzzle.gridSize.cols);
      const newCellSize = Math.floor((smallerDimension - 40) / maxGridDimension);
      // Ensure cell size is between 24 and 40 pixels
      setCellSize(Math.min(Math.max(newCellSize, 24), 40));
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [puzzle.gridSize.rows, puzzle.gridSize.cols]);

  const grid = puzzle.grid || Array(puzzle.gridSize.rows).fill(null).map(() =>
    Array(puzzle.gridSize.cols).fill('.')
  );

  const clearSelection = () => {
    setSelectedCells([]);
    setInteractionMode('none');
  };

  const checkWord = useCallback((cells: Position[]) => {
    if (!isValidSelection(cells)) return false;

    const word = getWordFromSelection(grid, cells);
    const reversedWord = word.split('').reverse().join('');

    const foundWord = puzzle.words.find(w => 
      w.word === word || w.word === reversedWord
    );

    if (foundWord) {
      onWordFound(foundWord.word);
      setLastFoundWord(cells);
      // Add to permanent found words list
      setFoundWords(prev => [...prev, { word: foundWord.word, cells }]);
      setTimeout(() => setLastFoundWord([]), 1000); // Clear highlight after 1s
      clearSelection();
      return true;
    }
    return false;
  }, [grid, puzzle.words, onWordFound]);

  const handleCellClick = (row: number, col: number) => {
    // If we're in drag mode, ignore clicks
    if (interactionMode === 'drag') return;

    // Set mode to click if we're just starting
    if (interactionMode === 'none') {
      setInteractionMode('click');
    }

    const newCell = { row, col };
    
    // If this cell is already the last selected cell, do nothing
    if (selectedCells.length > 0 && 
        selectedCells[selectedCells.length - 1].row === row && 
        selectedCells[selectedCells.length - 1].col === col) {
      return;
    }

    // If this cell is already selected, deselect everything after it
    const existingIndex = selectedCells.findIndex(cell => cell.row === row && cell.col === col);
    if (existingIndex !== -1) {
      setSelectedCells(selectedCells.slice(0, existingIndex + 1));
      return;
    }

    const newSelection = [...selectedCells, newCell];
    
    // If it's the first cell or creates a valid line, add it
    if (selectedCells.length === 0 || isValidSelection(newSelection)) {
      setSelectedCells(newSelection);
      
      // Only check for word if we have at least 2 letters
      if (newSelection.length >= 2) {
        checkWord(newSelection);
      }
    }
  };

  const handleCellMouseDown = (e: MouseEvent, row: number, col: number) => {
    // Only start drag selection with primary mouse button
    if (e.button === 0 && interactionMode !== 'click') {
      setInteractionMode('drag');
      setSelectedCells([{ row, col }]);
    }
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (interactionMode === 'drag') {
      const newCell = { row, col };
      const newSelection = [...selectedCells, newCell];
      if (isValidSelection(newSelection)) {
        setSelectedCells(newSelection);
      }
    }
  };

  const handleCellMouseUp = () => {
    if (interactionMode === 'drag') {
      if (selectedCells.length >= 2) {
        const found = checkWord(selectedCells);
        if (!found) {
          clearSelection();
        }
      } else {
        clearSelection();
      }
    }
  };

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const isSelected = selectedCells.some(
      cell => cell.row === rowIndex && cell.col === colIndex
    );
    const isLastFound = lastFoundWord.some(
      cell => cell.row === rowIndex && cell.col === colIndex
    );
    const isLastSelected = selectedCells.length > 0 && 
      selectedCells[selectedCells.length - 1].row === rowIndex && 
      selectedCells[selectedCells.length - 1].col === colIndex;
    const isPermanentlyFound = foundWords.some(
      word => word.cells.some(cell => cell.row === rowIndex && cell.col === colIndex)
    );

    return {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      backgroundColor: isLastFound ? '#4CAF50' : 
                     isPermanentlyFound ? '#81c784' :
                     isLastSelected ? '#7cc3ff' :
                     isSelected ? '#a5d8ff' : 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: `${Math.max(cellSize * 0.4, 14)}px`,
      cursor: 'pointer',
      userSelect: 'none' as const,
      transition: 'background-color 0.2s',
      border: '1px solid #ddd',
      borderRadius: '4px',
      color: (isLastFound || isPermanentlyFound) ? 'white' : 'black'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
      <div 
        className="game-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${puzzle.gridSize.cols}, ${cellSize}px)`,
          gap: '1px',
          backgroundColor: '#eee',
          padding: '10px',
          borderRadius: '8px',
          touchAction: 'none', // Prevent scrolling on touch devices
          maxWidth: '100%',
          margin: '0 auto'
        }}
        onMouseLeave={() => {
          if (interactionMode === 'drag') {
            clearSelection();
          }
        }}
      >
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={getCellStyle(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onMouseDown={(e) => handleCellMouseDown(e, rowIndex, colIndex)}
              onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
              onMouseUp={handleCellMouseUp}
              onTouchStart={(e) => {
                // Only prevent default if we're in drag mode
                if (interactionMode === 'drag') {
                  e.preventDefault();
                  handleCellMouseDown(e.nativeEvent as unknown as MouseEvent, rowIndex, colIndex);
                }
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                if (interactionMode === 'drag') {
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  const cellElement = element?.closest('[data-cell]');
                  if (cellElement) {
                    const [row, col] = cellElement.getAttribute('data-cell')!.split('-').map(Number);
                    handleCellMouseEnter(row, col);
                  }
                }
              }}
              onTouchEnd={(e) => {
                if (interactionMode === 'drag') {
                  e.preventDefault();
                  handleCellMouseUp();
                }
              }}
              data-cell={`${rowIndex}-${colIndex}`}
            >
              {cell}
            </div>
          ))
        ))}
      </div>
      <button
        onClick={clearSelection}
        disabled={selectedCells.length === 0}
        style={{
          padding: '8px 16px',
          backgroundColor: selectedCells.length > 0 ? '#f44336' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: selectedCells.length > 0 ? 'pointer' : 'default',
          fontSize: '14px',
          transition: 'background-color 0.2s',
          opacity: selectedCells.length > 0 ? 1 : 0.7,
          marginTop: '10px'
        }}
        onMouseEnter={e => {
          if (selectedCells.length > 0) {
            e.currentTarget.style.backgroundColor = '#d32f2f';
          }
        }}
        onMouseLeave={e => {
          if (selectedCells.length > 0) {
            e.currentTarget.style.backgroundColor = '#f44336';
          }
        }}
      >
        Clear Selection
      </button>
    </div>
  );
}; 