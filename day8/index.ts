import { getInput } from '../utils.js';

type Row = number[];
type Grid = Row[];
type SearchDirection = 'forward' | 'reverse';
type LookDirection = 'left' | 'right';
type Score = {
  up: number;
  down: number;
  left: number;
  right: number;
};
type Scores = {
  [index: string]: Score;
};

const transformer = (str: string): [Grid, Grid] => {
  const lines = str.split('\n');
  const rows = lines.map(line => line.split('').map(parseFloat));
  const cols = [];
  rows.forEach(row => {
    row.forEach((value, i) => {
      if (!cols[i]) {
        cols[i] = [];
      }
      cols[i].push(value);
    });
  });
  return [rows, cols];
};

const [inputRows, inputCols] = getInput({ transformer, example: false });

function searchRow(
  row: Row,
  rowIdx: number,
  direction: SearchDirection = 'forward',
  flipPosition: boolean
) {
  const isFwd = direction === 'forward';

  // Forward
  let max = -1;
  let visibleTrees = [];
  for (
    let colIdx = isFwd ? 0 : row.length - 1;
    isFwd ? colIdx < row.length : colIdx >= 0;
    isFwd ? (colIdx += 1) : (colIdx -= 1)
  ) {
    const value = row[colIdx];
    const comparedValue = isFwd ? row[colIdx - 1] : row[colIdx + 1];
    const position = flipPosition
      ? `${colIdx},${rowIdx}`
      : `${rowIdx},${colIdx}`;

    if (comparedValue === undefined || value > max) {
      visibleTrees.push(position);
      max = value;
    }
  }
  return visibleTrees;
}

function getScoresForRow(
  scoresObj: Scores,
  row: Row,
  rowIdx: number,
  flipPosition: boolean
) {
  for (let colIdx = 1; colIdx < row.length - 1; colIdx += 1) {
    const position = flipPosition
      ? `${colIdx},${rowIdx}`
      : `${rowIdx},${colIdx}`;

    if (!scoresObj[position]) {
      scoresObj[position] = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
      };
    }

    const value = row[colIdx];

    // Look left
    let prevIdx = colIdx - 1;
    let leftScore = 0;
    let stop = false;
    while (!stop) {
      const prevValue = row[prevIdx];
      if (prevValue === undefined) {
        stop = true;
      } else if (prevValue >= value) {
        leftScore += 1;
        stop = true;
      } else if (prevValue < value) {
        leftScore += 1;
      } else {
        stop = true;
      }
      prevIdx -= 1;
    }

    // Look right
    let nextIdx = colIdx + 1;
    let rightScore = 0;
    stop = false;
    while (!stop) {
      const nextValue = row[nextIdx];
      if (nextValue === undefined) {
        stop = true;
      } else if (nextValue >= value) {
        rightScore += 1;
        stop = true;
      } else if (nextValue < value) {
        rightScore += 1;
      } else {
        stop = true;
      }
      nextIdx += 1;
    }

    if (flipPosition) {
      scoresObj[position].up = leftScore;
      scoresObj[position].down = rightScore;
    } else {
      scoresObj[position].left = leftScore;
      scoresObj[position].right = rightScore;
    }
  }
}

function addToSet(set: Set<string>, arr: string[]) {
  for (let i = 0; i < arr.length; i += 1) {
    set.add(arr[i]);
  }
}

function findVisibleTrees(rows: Grid, cols: Grid) {
  const visibleTrees = new Set<string>();

  rows.forEach((row, rowIdx) => {
    // Forward
    const fwdTrees = searchRow(row, rowIdx, 'forward', false);

    // Reverse
    const revTrees = searchRow(row, rowIdx, 'reverse', false);

    addToSet(visibleTrees, [...fwdTrees, ...revTrees]);
  });

  cols.forEach((col, colIdx) => {
    // Forward
    const fwdTrees = searchRow(col, colIdx, 'forward', true);

    // Reverse
    const revTrees = searchRow(col, colIdx, 'reverse', true);

    addToSet(visibleTrees, [...fwdTrees, ...revTrees]);
  });

  return visibleTrees;
}

function getMaxScenicScore(rows: Grid, cols: Grid) {
  const scores = {};

  // L/R
  for (let rowIdx = 1; rowIdx < rows.length - 1; rowIdx += 1) {
    getScoresForRow(scores, rows[rowIdx], rowIdx, false);
  }

  // U/D
  for (let colIdx = 1; colIdx < cols.length - 1; colIdx += 1) {
    getScoresForRow(scores, cols[colIdx], colIdx, true);
  }

  let maxScore = 0;
  Object.keys(scores).forEach(pos => {
    const { up, left, down, right } = scores[pos];
    const score = up * left * down * right;
    if (score > maxScore) {
      maxScore = score;
    }
  });

  return maxScore;
}

const numVisibleTrees = findVisibleTrees(inputRows, inputCols);
const maxScore = getMaxScenicScore(inputRows, inputCols);
console.log(numVisibleTrees.size);
console.log(maxScore);
