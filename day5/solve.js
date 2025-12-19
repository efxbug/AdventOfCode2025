import ColorHelper from "../utils/colors.js";
import { readTextLines } from "../utils/fileparser.js";
import { Logger, LOGLEVEL } from "../utils/logger.js";

const findResults = (ranges = [], ingredients) => {
  const results = [];
  ingredients.forEach((ingr) => {
    if (
      ranges.find(([min, max]) => {
        return ingr >= min && ingr <= max;
      })
    ) {
      results.push(ingr);
    }
  });
  Logger.v(`Found ${results} results`);
  return results;
};

const mergeRanges = (ranges = []) => {
  //iterate
  let changed;
  let mergedRanges = [...ranges];
  do {
    changed = mergedRanges.find((rangeA, index) => {
      for (let i = index + 1; i < mergedRanges.length; i++) {
        let min = null,
          max = null;
        //check if ranges are intertwined
        const rangeB = mergedRanges[i];
        if (rangeA[0] <= rangeB[0]) {
          if (rangeA[1] >= rangeB[0]) {
            //create new mergedArray and stop
            min = rangeA[0];
            max = Math.max(rangeA[1], rangeB[1]);
          }
        } else if (rangeB[0] <= rangeA[0]) {
          if (rangeB[1] >= rangeA[0]) {
            min = rangeB[0];
            max = Math.max(rangeA[1], rangeB[1]);
          }
        }
        if (min !== null) {
          //rearrange results and exit by retuning true;
          mergedRanges = mergedRanges
            .map((r, idx) => {
              if (idx === index) {
                //update range
                return [min, max];
              } else if (idx === i) {
                //mark for deletion
                return null;
              } else return r;
            })
            .filter((a) => a);
          return true;
        }
      }
    });
  } while (changed);
  return mergedRanges;
};

const readInput = (fileName) => {
  Logger.info(`Reading ${fileName}...`);
  const input = readTextLines(fileName);
  const divider = input.findIndex((a) => !a);
  const ranges = input.slice(0, divider).map((range) => {
    return range.split("-").map((n) => Number(n));
  });
  const ingredients = input
    .slice(divider)
    .filter((a) => a)
    .map((n) => Number(n));
  Logger.debug("Done", ranges, ingredients);
  return { ranges, ingredients };
};

const solve = (fileName) => {
  const { ranges, ingredients } = readInput(fileName);
  //iterate
  const results = findResults(ranges, ingredients);
  Logger.info(`Found ${results.length} fresh ingredients`);
};

const solve2 = (fileName) => {
  const { ranges } = readInput(fileName);
  //iterate
  const mergedRanges = mergeRanges(ranges);
  //find sum of possible fresh ingredients
  Logger.debug(`Merged ranges: ${mergedRanges}`);
  const result = mergedRanges.reduce((sum, range) => {
    Logger.v(`Previious sum = ${sum}, range = ${range}`);
    return sum + (range[1] + 1 - range[0]);
  }, 0);
  Logger.info(`Found ${result} fresh ingredients`);
};

(() => {
  Logger.setLogLevel(LOGLEVEL.INFO);
  Logger.info("Day 5: Cafeteria\n");
  Logger.info("Running sample 1");
  solve(import.meta.dirname + "/sample.txt");
  Logger.info("Running complete 1");
  solve(import.meta.dirname + "/input.txt");
  Logger.info("Running sample 2");
  solve2(import.meta.dirname + "/sample.txt");
  Logger.info("Running complete 2");
  solve2(import.meta.dirname + "/input.txt");
})();
