import * as fs from 'fs';
import path from 'path';
import events from 'events';
import readline from 'readline';
import callsites from 'callsites';

interface GetInputOptions<T> {
  transformer: (input: string) => T;
  example: boolean;
}

export function getInput<T>(options: GetInputOptions<T>) {
  const callsite = callsites()[1].getFileName().replace('file://', '');
  const data = fs.readFileSync(
    path.resolve(callsite, '..', options.example ? 'example.txt' : 'input.txt'),
    {
      encoding: 'utf8',
    }
  );
  return options.transformer(data);
}

export const streamInput = async ({
  transformer = () => {},
  example = false,
}) => {
  const callsite = callsites()[1].getFileName().replace('file://', '');
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(
        path.resolve(callsite, '..', example ? 'example.txt' : 'input.txt')
      ),
      crlfDelay: Infinity,
    });

    rl.on('line', transformer);

    await events.once(rl, 'close');
  } catch (err) {
    console.error(err);
  }
};

export const sumArray = arr => arr.reduce((acc, i) => (acc += i));

export const chunk = (arr, size = 1) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const permuteArray = arr => {
  const results = [];
  const used = [];

  function permute(inputArray) {
    for (let i = 0; i < inputArray.length; i++) {
      // Grab single element from array
      const element = inputArray.splice(i, 1)[0];

      // Add element to list of used elements
      used.push(element);

      if (inputArray.length === 0) {
        results.push(used.slice());
      }

      permute(inputArray);
      inputArray.splice(i, 0, element);

      used.pop();
    }
    return results;
  }

  return permute(arr);
};

export const valueAtPoint = (matrix, x, y) => {
  return matrix[y][x];
};

export const mapAdjacenies = matrix => {
  const adjacencies = {};

  matrix.forEach((row, y) => {
    row.forEach((_, x) => {
      const key = [x, y].join(',');
      adjacencies[key] = [];

      const add = (x, y) => {
        adjacencies[key].push([x, y]);
      };

      // aboveL
      if (x - 1 >= 0 && y - 1 >= 0) {
        add(x - 1, y - 1);
      }

      // above
      if (y - 1 >= 0) {
        add(x, y - 1);
      }

      // aboveR
      if (x + 1 >= 0 && y - 1 >= 0) {
        add(x + 1, y - 1);
      }

      // L
      if (x - 1 >= 0) {
        add(x - 1, y);
      }

      // R
      if (x + 1 < row.length) {
        add(x + 1, y);
      }

      // belowL
      if (x - 1 >= 0 && y + 1 < matrix.length) {
        add(x - 1, y + 1);
      }

      // below
      if (y + 1 < matrix.length) {
        add(x, y + 1);
      }

      // belowR
      if (x + 1 < row.length && y + 1 < matrix.length) {
        add(x + 1, y + 1);
      }
    });
  });

  return adjacencies;
};

export class PriorityQueue {
  items: any[];
  comparator: (item1: any, item2: any) => any;

  constructor(comparator = (a, b) => a - b) {
    this.items = [];
    this.comparator = (i1, i2) => {
      const value = comparator(this.items[i1], this.items[i2]);
      if (Number.isNaN(value)) {
        throw new Error(
          `Comparator should evaluate to a number. Got ${value} when comparing ${this.items[i1]} with ${this.items[i2]}`
        );
      }
      return value;
    };
  }

  enqueue(item) {
    this.items.push(item);
    this.bubbleUp();
  }

  dequeue(index = 0) {
    if (!this.size) {
      return null;
    }

    this.swap(index, this.size - 1);
    const item = this.items.pop();
    this.bubbleDown(index);
    return item;
  }

  bubbleUp() {
    let index = this.size - 1;
    const getParentIndex = i => Math.ceil(i / 2 - 1);

    let parentIndex = getParentIndex(index);
    while (parentIndex >= 0 && this.comparator(parentIndex, index) > 0) {
      this.swap(parentIndex, index);
      index = parentIndex;
      parentIndex = getParentIndex(index);
    }
  }

  bubbleDown(index) {
    let curr = index;
    const left = i => 2 * i + 1;
    const right = i => 2 * i + 2;
    const getTopChild = i =>
      right(i) < this.size && this.comparator(left(i), right(i)) > 0
        ? right(i)
        : left(i);

    while (
      left(curr) < this.size &&
      this.comparator(curr, getTopChild(curr)) > 0
    ) {
      const next = getTopChild(curr);
      this.swap(curr, next);
      curr = next;
    }
  }

  swap(i1, i2) {
    [this.items[i1], this.items[i2]] = [this.items[i2], this.items[i1]];
  }

  get size(): number {
    return this.items.length;
  }
}
