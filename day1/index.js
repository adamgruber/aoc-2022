import { streamInput } from '../utils.js';

(async function main() {
  let cals = [];
  let idx = 0;

  const transformer = line => {
    if (!cals[idx]) {
      cals[idx] = 0;
    }

    if (line) {
      cals[idx] += Number(line);
    } else {
      idx += 1;
    }
  };
  await streamInput({ transformer, example: false });
  cals = cals.sort((a, b) => b - a);

  console.log(cals[0]);
  console.log(cals[0] + cals[1] + cals[2]);
})();
