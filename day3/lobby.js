import { readTextLines } from "../utils/fileparser.js";

const findMax = (str, start, end) => {
  let max = -1,
    index;
  //need to iterate each number to find the best number
  for (let i = start; i < end; i++) {
    const num = Number(str[i]);
    if (num > max) {
      max = num;
      index = i;
      if (num === 9) {
        //no need to iterate further
        break;
      }
    }
  }
  return {
    max,
    index,
  };
};

const solve = (fileName, cells = 2) => {
  console.log(`Reading ${fileName}...`);
  const batteries = readTextLines(fileName).filter((a) => a);
  console.log("Done: " + batteries.length + " batteries");
  const joltages = [];
  batteries.forEach((battery) => {
    const savedCells = [];
    let lastIndex = -1;
    //need to iterate each number to find the best cells
    for (let cell = 0; cell < cells; cell++) {
      const { max, index } = findMax(
        battery,
        lastIndex + 1,
        battery.length - (cells - savedCells.length - 1)
      );
      savedCells.push(max);
      lastIndex = index;
    }
    // console.log(
    //   `Checking battery ${battery} for ${cells} cells, result = ${savedCells}, ${savedCells.join(
    //     ""
    //   )}`
    // );
    //compose the number
    joltages.push(Number(savedCells.join("")));
  });
  console.log(`Found ${joltages.length} joltages`);
  console.log(
    "Sum is " +
      joltages.reduce((p, c) => {
        return c + p;
      }, 0)
  );
};

const solve2 = (fileName, cells = 12) => {
  return solve(fileName, cells);
};

(() => {
  console.log("Day 3: Lobby\n");
  console.log("Running sample 1");
  solve(import.meta.dirname + "/sample.txt");
  console.log("Running complete 1");
  solve(import.meta.dirname + "/joltages.txt");
  console.log("Running sample 2");
  solve2(import.meta.dirname + "/sample.txt");
  console.log("Running complete 2");
  solve2(import.meta.dirname + "/joltages.txt");
})();
