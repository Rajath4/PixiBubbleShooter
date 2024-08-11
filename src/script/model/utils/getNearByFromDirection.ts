function isRowShifted(y: number, startShifted: boolean): boolean {
  return y % 2 != 0
}

function getNearByPosFromDirection(pos: { row: number; column: number }, dir: number): { row: number; column: number } {
  if (dir > 6) {
    return { column: -1, row: -1 };
  }

  const isShifted = Math.abs(pos.row) % 2 === 1;

  switch (dir) {
    case 1:
      return { column: isShifted ? pos.column : pos.column - 1, row: pos.row - 1 };
    case 2:
      return { column: isShifted ? pos.column + 1 : pos.column, row: pos.row - 1 };
    case 3:
      return { column: pos.column + 1, row: pos.row };
    case 4:
      return { column: isShifted ? pos.column + 1 : pos.column, row: pos.row + 1 };
    case 5:
      return { column: isShifted ? pos.column : pos.column - 1, row: pos.row + 1 };
    case 6:
      return { column: pos.column - 1, row: pos.row };
    default:
      return { column: -1, row: -1 };
  }
}

export { getNearByPosFromDirection };
