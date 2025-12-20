import ColorHelper from "../utils/colors.js";
import { readTextLines } from "../utils/fileparser.js";
import { Logger, LOGLEVEL } from "../utils/logger.js";

const OP_FUNCTIONS = {
  "+": (a, b) => a + b,
  "*": (a, b) => a * b,
  "-": (a, b) => a - b,
  "/": (a, b) => a / b,
};
Object.freeze(OP_FUNCTIONS);

const OPERATORS = Object.keys(OP_FUNCTIONS);
Object.freeze(OPERATORS);

const findResults = (operands = [], columns = []) => {
  const result = columns.reduce((sum, col, idx) => {
    const op = operands[idx];
    Logger.v("Index " + idx + " Operand " + op + " Column ", col);
    let res = col.reduce((acc, v, idx) => {
      if (idx === 0) {
        return v;
      } else {
        return OP_FUNCTIONS[op](acc, v);
      }
    });
    Logger.v("Result " + res);
    return sum + res;
  }, 0);
  Logger.v(`Found ${result}`);
  return result;
};

const readInput = (fileName, cephalopod) => {
  Logger.info(`Reading ${fileName}...`);
  const input = readTextLines(fileName).filter((a) => a);
  Logger.v("Input parsed", input);
  //last line is the operands, parse them
  const operandsLine = input[input.length - 1];
  //parse and get operands
  const operands = [];
  const columnsDetails = [];
  for (let i = 0, o = 0; i < operandsLine.length; i++) {
    const op = operandsLine[i];
    if (OPERATORS.includes(op)) {
      //found an operator, add to operands
      operands.push(op);
      if (columnsDetails.length > 0) {
        //adjust last column size
        const last = columnsDetails[columnsDetails.length - 1];
        //column size based on previous index and toggle 1 for space
        last.size = i - last.idx - 1;
      }
      columnsDetails.push({ idx: i, size: operandsLine.length - i });
    }
  }
  //get other lines and convert them into numbers and into a matrix
  const numbers = input.slice(0, input.length - 1);
  //if needed convert into cephalopods
  Logger.debug(
    `Found ${columnsDetails.length} column(s) with width ${JSON.stringify(
      columnsDetails.reduce((res, cd) => {
        if (res[cd.size] === undefined) {
          res[cd.size] = 1;
        } else {
          res[cd.size]++;
        }
        return res;
      }, {})
    )}`
  );
  const columns = cephalopod
    ? numbers
        .reduce((res, row, idx, arr) => {
          if (res.length === 0) {
            //setup res
            for (let i = 0; i < arr.length; i++) {
              res[i] = [];
            }
            Logger.debug("Initialized res", res);
          }
          //browse columns
          for (let c = 0; c < columnsDetails.length; c++) {
            //columns
            const width = columnsDetails[c].size;
            const start = columnsDetails[c].idx;
            // Logger.v(
            //   "Brosing column " +
            //     c +
            //     " from " +
            //     start +
            //     ", width = " +
            //     width +
            //     ": " +
            //     row.slice(start, start + width)
            // );
            for (let i = 0; i < width; i++) {
              let p = start + i;
              let n = Number(row[p]);
              // Logger.v(
              //   `Row ${idx}, i ${i}, column ${c}, pos ${p} = ${n}(${row[p]}), res[i]=${res[i]}, res[i][c]=${res[i][c]}`
              // );
              if (n === 0 && row[p] !== "0") {
                //empty cell, do nothing
              } else if (res[i][c] === undefined) {
                res[i][c] = row[p];
              } else {
                res[i][c] += row[p];
              }
              // Logger.v(
              //   `Updated ${idx}, i ${i}, column ${c}, pos ${p} = ${n}(${row[p]}), res[i]=${res[i]}, res[i][c]=${res[i][c]}`
              // );
            }
          }
          return res;
        }, [])
        .reduce((res, row, rowIdx, arr) => {
          if (res.length === 0) {
            for (let i = 0; i < columnsDetails.length; i++) {
              res[i] = [];
            }
            Logger.debug("Initialized res ", res, arr);
          }
          row.forEach((val, idx) => {
            res[idx][rowIdx] = Number(val);
          });
          return res;
        }, [])
    : numbers.reduce((arr, row) => {
        row
          .split(/\s+/g)
          .filter((a) => a)
          .map((n, index) => {
            if (arr[index] === undefined) {
              arr[index] = [];
            }
            arr[index].push(Number(n));
          });
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
  solve2(import.meta.dirname + "/input.txt");
})();
