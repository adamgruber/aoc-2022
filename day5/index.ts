import { getInput } from '../utils.js';

/*
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
 */

const exampleInitial = ['NZ', 'DCM', 'P'];

/*
[N]     [Q]         [N]            
[R]     [F] [Q]     [G] [M]        
[J]     [Z] [T]     [R] [H] [J]    
[T] [H] [G] [R]     [B] [N] [T]    
[Z] [J] [J] [G] [F] [Z] [S] [M]    
[B] [N] [N] [N] [Q] [W] [L] [Q] [S]
[D] [S] [R] [V] [T] [C] [C] [N] [G]
[F] [R] [C] [F] [L] [Q] [F] [D] [P]
 1   2   3   4   5   6   7   8   9 
 */
const initial = [
  'NRJTZBDF',
  'HJNSR',
  'QFZGJNRC',
  'QTRGNVF',
  'FQTL',
  'NGRBZWCQ',
  'MHNSLCF',
  'JTMQND',
  'SGP',
];

const instructionsRegex =
  /move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/gm;

type Move = {
  count: number;
  to: number;
  from: number;
};

const transformer = (str: string) => {
  return str.split('\n').map(line => {
    for (const match of line.matchAll(instructionsRegex)) {
      const { count, to, from } = match.groups;
      return {
        count: parseFloat(count),
        to: parseFloat(to),
        from: parseFloat(from),
      };
    }
  });
};

const exampleMoves = getInput<ReturnType<typeof transformer>>({
  transformer,
  example: true,
});

const inputMoves = getInput<ReturnType<typeof transformer>>({
  transformer,
  example: false,
});

function moveCrates(initial: string[], moves: Move[], multiple: boolean) {
  const subject = [...initial];
  // console.log(initial);
  // console.log(moves);
  moves.forEach(({ count, to, from }) => {
    const r = new RegExp(`(?<take>\\w{${count}})(?<remain>\\w*)`);
    const moveStack = subject[from - 1];
    // console.log('moveStack ', moveStack);
    const match = r.exec(moveStack);
    let { take, remain } = match.groups;
    // console.log({ take, remain });

    if (!multiple) {
      take = take.split('').reverse().join('');
    }
    subject[from - 1] = remain;
    subject[to - 1] = `${take}${subject[to - 1]}`;
    // console.log(subject);
  });
  return subject.map(stack => stack.charAt(0)).join('');
}

// console.log(moveCrates(exampleInitial, exampleMoves, false));
// console.log(moveCrates(exampleInitial, exampleMoves, true));
console.log(moveCrates(initial, inputMoves, false));
console.log(moveCrates(initial, inputMoves, true));
