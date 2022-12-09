import { getInput } from '../utils.js';

const transformer = (str: string) => str.split('\n');
const input = getInput({ transformer, example: false })[0];
const examples = getInput({ transformer, example: true });

function findSequenceStart(str: string, winSize: number) {
  let sequenceStart = 0;
  for (let i = winSize; i < str.length; i += 1) {
    const chunk = new Set(...[str.slice(i - winSize, i).split('')]);
    if (chunk.size === winSize) {
      sequenceStart = i;
      break;
    }
  }
  return sequenceStart;
}

examples.forEach(ex => {
  console.log(ex, findSequenceStart(ex, 4), findSequenceStart(ex, 14));
});

console.log(findSequenceStart(input, 4), findSequenceStart(input, 14));
