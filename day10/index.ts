import { getInput } from '../utils.js';

const transformer = (str: string) => str.split('\n');
const rawInput = getInput({ transformer, example: false });

enum InstructionType {
  noop = 'noop',
  addx = 'addx',
}

type Instruction = {
  type: InstructionType;
  args?: number[];
};

class CPU {
  x: number;
  instructions: Instruction[];
  display: string[];
  input: string[];
  cycle: number;
  signalStrengths: {
    [index: string]: {
      value: number;
      strength: number;
    };
  };

  constructor(input: string[]) {
    this.x = 1;
    this.cycle = 0;
    this.signalStrengths = {};
    this.instructions = [];
    this.display = [];
    this.input = input;
    this.parseInput();
  }

  parseInput() {
    for (let i = 0; i < this.input.length; i += 1) {
      const instruction = this.input[i];
      if (instruction === 'noop') {
        this.instructions.push({ type: InstructionType.noop });
      } else if (instruction.startsWith('addx')) {
        const [, value] = instruction.split(' ');
        this.instructions.push(
          { type: InstructionType.noop },
          {
            type: InstructionType.addx,
            args: [parseInt(value)],
          }
        );
      }
    }
  }

  run() {
    while (this.instructions.length) {
      const currentInstruction = this.instructions.shift();
      // Update cycle
      this.cycle += 1;

      // Capture current value
      if ((this.cycle - 20) % 40 === 0) {
        this.signalStrengths[this.cycle] = {
          value: this.x,
          strength: this.cycle * this.x,
        };
      }

      // Draw pixel
      this.draw();

      // Process instruction
      this[currentInstruction.type](currentInstruction.args);

      // console.log({ cycle: this.cycle, x: this.x });
    }
  }

  addx(args: number[]) {
    args.forEach(arg => {
      this.x += arg;
    });
  }

  noop() {
    // DO NOTHING
  }

  draw() {
    const displayRow = Math.floor((this.cycle - 1) / 40);

    const offset = displayRow * 40;
    const pixelPosition = this.cycle - 1 - offset;
    let pixel = ' ';
    if (pixelPosition >= this.x - 1 && pixelPosition <= this.x + 1) {
      pixel = '•';
    }
    this.display[displayRow] = (this.display[displayRow] || '') + pixel;
  }

  print() {
    console.log(this.display.join('\n'));
  }

  get signalStrengthSum() {
    return Object.values(this.signalStrengths).reduce(
      (acc, { strength }) => (acc += strength),
      0
    );
  }
}

const cpu = new CPU(rawInput);
cpu.run();
console.log(cpu.signalStrengthSum);
cpu.print();
