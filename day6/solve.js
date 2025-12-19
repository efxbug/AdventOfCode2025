import ColorHelper from "../utils/colors.js";
import { readTextLines } from "../utils/fileparser.js";
import { Logger, LOGLEVEL } from "../utils/logger.js";

const getOpFunction = (op) => {
  switch (op) {
    case "+":
      return (a, b) => a + b;
    case "*":
      return (a, b) => a * b;
    case "-":
      return (a, b) => a - b;
    case "/":
      return (a, b) => a / b;
  }
  throw new Exception("Invalid operand " + op);
};

const findResults = (operands = [], columns = []) => {
  const result = columns.reduce((sum, col, idx) => {
    let op = operands[idx];
    Logger.v("Index " + idx + " Operand " + op + " Column ", col);
    let opFn = getOpFunction(op);
    let res = col.reduce((acc, v, idx) => {
      if (idx === 0) {
        return v;
      } else {
        return opFn(acc, v);
      }
    });
    Logger.v("Result " + res);
    return sum + res;
  }, 0);
  Logger.v(`Found ${result}`);
  return result;
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

const readInput = (fileName, cephalopod) => {
  Logger.info(`Reading ${fileName}...`);
  const input = readTextLines(fileName).filter((a) => a);
  Logger.v("Input parsed", input);
  //last line is the operands, parse them
  const operands = input
    .slice(-1)[0]
    .split(/\s+/g)
    .filter((a) => a);
  //get other lines and convert them into numbers and into a matrix
  const columns = input.slice(0, input.length - 1).reduce((arr, row) => {
    if (cephalopod) {
      //cannot use split, as we have to persist the spacing in the original file
    } else {
      row
        .split(/\s+/g)
        .filter((a) => a)
        .map((n, index) => {
          if (arr[index] === undefined) {
            arr[index] = [];
          }
          arr[index].push(Number(n));
        });
    }
    return arr;
  }, []);
  Logger.debug("Done", operands, columns);
  return { operands, columns };
};

const solve = (fileName) => {
  const { operands, columns } = readInput(fileName);
  //iterate
  const result = findResults(operands, columns);
  Logger.info(ColorHelper.greenForeground(`Found ${result}`));
};

const solve2 = (fileName) => {
  //cephalopod columns
  const { operands, columns } = readInput(fileName, true);
  const result = findResults(operands, columns);
  Logger.info(ColorHelper.greenForeground(`Found ${result}`));
};

(() => {
  Logger.setLogLevel(LOGLEVEL.INFO);
  Logger.info("Day 6: Trash compactor\n");
  Logger.info("Running sample 1");
  solve(import.meta.dirname + "/sample.txt");
  Logger.info("Running complete 1");
  solve(import.meta.dirname + "/input.txt");
  Logger.info("Running sample 2");
  solve2(import.meta.dirname + "/sample.txt");
  Logger.info("Running complete 2");
  // solve2(import.meta.dirname + "/input.txt");
})();
