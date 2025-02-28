import { useState, useEffect } from 'react'
import { GameBoard } from './components/GameBoard'
import { WordList } from './components/WordList'
import { PuzzleSelector } from './components/PuzzleSelector'
import winterPuzzle from './data/puzzles/winter.json'
import animalsPuzzle from './data/puzzles/animals.json'
import unicornsPuzzle from './data/puzzles/unicorns.json'
import { Puzzle } from './types/puzzle'
import { generateGrid } from './utils/gridGenerator'

const puzzles = [
  winterPuzzle,
  animalsPuzzle,
  unicornsPuzzle
] as Puzzle[];

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles[0])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Reset found words and generate new grid when puzzle changes
    setFoundWords([]);
    const grid = generateGrid(currentPuzzle);
    setCurrentPuzzle(prev => ({ ...prev, grid }));
  }, [currentPuzzle.puzzleId])

  const handleWordFound = (word: string) => {
    if (!foundWords.includes(word)) {
      setFoundWords([...foundWords, word])
    }
  }

  const handlePuzzleSelect = (puzzle: Puzzle) => {
    setCurrentPuzzle(puzzle);
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '10px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333', 
        marginBottom: '10px',
        fontSize: isMobile ? '24px' : '32px'
      }}>
        Word Search Game
      </h1>
      <PuzzleSelector
        puzzles={puzzles}
        currentPuzzle={currentPuzzle}
        onPuzzleSelect={handlePuzzleSelect}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
        gap: isMobile ? '20px' : '40px',
        alignItems: 'start',
        marginTop: '20px'
      }}>
        <GameBoard
          key={currentPuzzle.puzzleId}
          puzzle={currentPuzzle}
          onWordFound={handleWordFound}
        />
        <WordList
          words={currentPuzzle.words}
          foundWords={foundWords}
        />
      </div>
      {foundWords.length === currentPuzzle.words.length && (
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: isMobile ? '15px' : '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: isMobile ? '16px' : '18px'
        }}>
          Congratulations! You've found all the words!
        </div>
      )}
    </div>
  )
}

export default App
