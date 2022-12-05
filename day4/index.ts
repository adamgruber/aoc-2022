import { getInput } from '../utils.js';

const pairs = getInput({
  transformer: (str: string) => {
    return str.split('\n').map(s =>
      s.split(',').map(r => {
        const [start, end] = r.split('-');
        return { start: parseFloat(start), end: parseFloat(end) };
      })
    );
  },
  example: false,
});

function isRangeContained(a, b) {
  const bInA = a.start <= b.start && a.end >= b.end;
  const aInB = b.start <= a.start && b.end >= a.end;
  return bInA || aInB;
}

function doesRangeOverlap(a, b) {
  return (
    (a.start >= b.start && a.start <= b.end) ||
    (b.start >= a.start && b.start <= a.end)
  );
}

const containments = pairs.reduce((acc, pair) => {
  const [rangeA, rangeB] = pair;
  if (isRangeContained(rangeA, rangeB)) {
    return (acc += 1);
  }
  return acc;
}, 0);

const overlaps = pairs.reduce((acc, pair) => {
  const [rangeA, rangeB] = pair;
  if (doesRangeOverlap(rangeA, rangeB)) {
    return (acc += 1);
  }
  return acc;
}, 0);

console.log('containments: ', containments);
console.log('overlaps: ', overlaps);
