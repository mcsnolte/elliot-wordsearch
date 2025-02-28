interface Position {
  row: number;
  col: number;
}

export function getWordFromSelection(
  grid: string[][],
  selectedCells: Position[]
): string {
  return selectedCells.map(pos => grid[pos.row][pos.col]).join('');
}

export function isValidSelection(selectedCells: Position[]): boolean {
  if (selectedCells.length < 2) return false;

  // Check if cells form a straight line
  const [first, second] = selectedCells;
  const deltaRow = Math.sign(second.row - first.row);
  const deltaCol = Math.sign(second.col - first.col);

  // Check if all cells follow the same direction
  return selectedCells.every((pos, index) => {
    if (index === 0) return true;
    const prev = selectedCells[index - 1];
    return (
      pos.row - prev.row === deltaRow &&
      pos.col - prev.col === deltaCol
    );
  });
} 