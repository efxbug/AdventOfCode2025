import ColorHelper from "../utils/colors.js";
import { readTextLines } from "../utils/fileparser.js";
import { Logger, LOGLEVEL } from "../utils/logger.js";

const SOURCE = "S";
const SPLITTER = "^";

const findResults = (input) => {
  Logger.v("Searching input", input);
  //find source
  const beams = [];
  const nextBeams = [];
  let split = 0;
  let sources = 0;
  let tachyons = [];
  input.forEach((line = "") => {
    //clear array
    nextBeams.splice(0, nextBeams.length);
    //search for a source or a splitter
    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case SOURCE:
          Logger.v("FOUND SOURCE " + i);
          //add a beam right below
          nextBeams.push(i);
          sources++;
          tachyons[i] = 1;
          break;
        case SPLITTER:
          Logger.v("FOUND SPLITTER " + i);
          //check for split
          if (beams.includes(i)) {
            if (i > 0) {
              tachyons[i - 1] = (tachyons[i - 1] || 0) + tachyons[i];
              nextBeams.push(i - 1);
            }
            if (i < line.length - 1) {
              nextBeams.push(i + 1);
              tachyons[i + 1] = (tachyons[i + 1] || 0) + tachyons[i];
            }
            tachyons[i] = 0;
            split++;
          }
          break;
        default:
          if (beams.includes(i)) {
            nextBeams.push(i);
          }
      }
    }
    Logger.v("Iteration " + line, nextBeams, tachyons);
    beams.splice(0, beams.length);
    beams.push(...nextBeams);
  });
  const result = {
    split,
    tachyons,
    tachyonsSum: tachyons.reduce((res, v) => {
      return res + v;
    }, 0),
    sources,
  };
  Logger.debug("Result: ", result);
  return result;
};

const readInput = (fileName) => {
  Logger.info(`Reading ${fileName}...`);
  const input = readTextLines(fileName).filter((a) => a);
  Logger.v("Input parsed", input);
  return input;
};

const solve = (fileName) => {
  const input = readInput(fileName);
  //iterate
  const result = findResults(input);
  Logger.info(ColorHelper.greenForeground(`Found ${result.split}`));
};

const solve2 = (fileName) => {
  const input = readInput(fileName);
  //iterate
  const result = findResults(input);
  Logger.info(ColorHelper.greenForeground(`Found ${result.tachyonsSum}`));
};

(() => {
  Logger.setLogLevel(LOGLEVEL.VERBOSE);
  Logger.info(ColorHelper.yellowForeground("--- Day 7: Laboratories ---\n"));
  Logger.info("Running sample 1");
  solve(import.meta.dirname + "/sample.txt");
  Logger.setLogLevel(LOGLEVEL.INFO);
  Logger.info("Running complete 1");
  solve(import.meta.dirname + "/input.txt");
  Logger.info("Running sample 2");
  solve2(import.meta.dirname + "/sample.txt");
  Logger.info("Running complete 2");
  solve2(import.meta.dirname + "/input.txt");
})();
