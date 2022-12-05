import { getInput, chunk } from '../utils.js';

const rucksacks = getInput({
  transformer: str => {
    return str.split('\n');
  },
  example: false,
});

const prioritySum = rucksacks.reduce((acc, sack) => {
  const compartmentA = sack
    .slice(0, sack.length / 2)
    .split('')
    .join('|');
  const compartmentB = sack.slice(sack.length / 2);
  const reg = new RegExp(compartmentA);
  const commonItem = compartmentB.match(reg)[0];
  const isUpper = commonItem.toUpperCase() === commonItem;
  const priority = commonItem.charCodeAt(0) - (isUpper ? 38 : 96);
  return acc + priority;
}, 0);

const groups = chunk(rucksacks, 3);
const badgeSum = groups.reduce((acc, group) => {
  const reg = new RegExp(group[0].split('').join('|'), 'g');
  const reg2 = new RegExp(
    [...group[1].matchAll(reg)].map(match => match[0]).join('|')
  );
  const badge = group[2].match(reg2)[0];
  const isUpper = badge.toUpperCase() === badge;
  const priority = badge.charCodeAt(0) - (isUpper ? 38 : 96);
  return acc + priority;
}, 0);

console.log(prioritySum);
console.log(badgeSum);
