import { getInput } from '../utils.js';

(function main() {
  const turns = getInput({
    transformer: str => {
      return str.split('\n');
    },
    example: false,
  });

  const playRound = (a, b, part) => {
    const scoreMap = {
      X: 1, // Rock
      Y: 2, // Paper
      Z: 3, // Scissors
    };

    const playsMap = {
      // Rock
      X: {
        A: 3,
        B: 0,
        C: 6,
      },
      // Paper
      Y: {
        A: 6,
        B: 3,
        C: 0,
      },
      // Scissors
      Z: {
        A: 0,
        B: 6,
        C: 3,
      },
    };

    const playsMap2 = {
      // Rock
      A: {
        X: 0 + 3, // C
        Y: 3 + 1, // A
        Z: 6 + 2, // B
      },
      // Paper
      B: {
        X: 0 + 1, // A
        Y: 3 + 2, // B
        Z: 6 + 3, // C
      },
      // Scissors
      C: {
        X: 0 + 2, // B
        Y: 3 + 3, // C
        Z: 6 + 1, // A
      },
    };
    const partOneScore = playsMap[b][a] + scoreMap[b];
    const partTwoScore = playsMap2[a][b];
    return part === 2 ? partTwoScore : partOneScore;
  };

  const totalScore1 = turns.reduce((acc, plays) => {
    return acc + playRound(...plays.split(' '));
  }, 0);
  const totalScore2 = turns.reduce((acc, plays) => {
    return acc + playRound(...plays.split(' '), 2);
  }, 0);
  console.log(totalScore1);
  console.log(totalScore2);
})();
