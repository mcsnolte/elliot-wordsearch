import { Word } from '../types/puzzle';

interface WordListProps {
  words: Word[];
  foundWords: string[];
}

export const WordList = ({ words, foundWords }: WordListProps) => {
  return (
    <div className="word-list" style={{
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '300px',
      margin: '0 auto'
    }}>
      <h3 style={{ 
        marginTop: 0,
        fontSize: '18px',
        textAlign: 'center'
      }}>
        Words to Find ({foundWords.length}/{words.length})
      </h3>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px',
        justifyContent: 'center'
      }}>
        {words.map((word) => (
          <div
            key={word.word}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              opacity: foundWords.includes(word.word) ? 0.5 : 1,
              textDecoration: foundWords.includes(word.word) ? 'line-through' : 'none',
              padding: '5px',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{word.word}</span>
            <span style={{ fontSize: '0.85em', color: '#666' }}>{word.hint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 