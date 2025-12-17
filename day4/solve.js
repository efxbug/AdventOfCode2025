import ColorHelper from "../utils/colors.js";
import { readTextLines } from "../utils/fileparser.js";
import { Logger, LOGLEVEL } from "../utils/logger.js";

const findResults = (input, adjacents) => {
  const results = [];
  input.forEach((row, i) => {
    row.forEach((val, j) => {
      if (input[i][j] === "@") {
        const minX = Math.max(j - 1, 0);
        const minY = Math.max(i - 1, 0);
        const maxX = Math.min(j + 2, row.length);
        const maxY = Math.min(i + 2, input.length);
        Logger.debug(
          `Processing cell ${i};${j}: ${input[i][j]}, ${minX}<x<${maxX}, ${minY}<y<${maxY}`
        );
        //check surroundings: (i-1;j-1), (i;j-1) etc
        let count = 0;
        for (let x = minX; x < maxX && count < adjacents; x++) {
          for (let y = minY; y < maxY && count < adjacents; y++) {
            if (x != j || y != i) {
              if (input[y][x] === "@") {
                Logger.v(`COUNT ROLL ${y};${x}`);
                count++;
              } else {
                Logger.v(`NOT COUNTING ROLL ${y};${x}`);
              }
            } else {
              Logger.v(`Not checking ${y};${x}`);
            }
          }
        }
        if (count < adjacents) {
          Logger.debug(
            ColorHelper.yellowForeground(
              `Cell ${j};${i}, ${count} adjacent roll(s), SAVE it`
            )
          );
          //found, save it
          results.push({ val, i, j });
        } else {
          Logger.debug(
            ColorHelper.redBackground(
              `Cell ${j};${i}, ${count} adjacent roll(s), discard`
            )
          );
        }
      } else {
        //no roll
        Logger.debug(`*NOT* Processing cell ${i};${j}: ${input[i][j]}`);
      }
    });
  });
  Logger.v(`Found ${results} results`);
  return results;
};

const readInput = (fileName) => {
  Logger.info(`Reading ${fileName}...`);
  const input = readTextLines(fileName)
    .filter((a) => a)
    .reduce((acc, val) => {
      Logger.v(`Processing ${val} ; ${acc}`);
      acc.push(val.split(""));
      return acc;
    }, []);
  Logger.info("Done");
  return input;
};

const solve = (fileName, adjacents = 4) => {
  const input = readInput(fileName);
  //iterate
  const results = findResults(input, adjacents);
  Logger.debug(`Found ${results.length} movable rolls`);
};

const solve2 = (fileName, adjacents = 4) => {
  const input = readInput(fileName);
  const results = [];
  let partials;
  do {
    partials = findResults(input, adjacents);
    //save partials into results AND mark them on input
    results.push(...partials);
    partials.forEach(({ i, j }) => {
      input[i][j] = "x";
    });
  } while (partials.length > 0);
  Logger.info(`Found ${results.length} movable rolls`);
};

(() => {
  Logger.setLogLevel(LOGLEVEL.INFO);
  Logger.info("Day 4: Printing department\n");
  Logger.info("Running sample 1");
  solve(import.meta.dirname + "/sample.txt");
  Logger.info("Running complete 1");
  solve(import.meta.dirname + "/input.txt");
  Logger.info("Running sample 2");
  solve2(import.meta.dirname + "/sample.txt");
  Logger.info("Running complete 2");
  solve2(import.meta.dirname + "/input.txt");
})();
