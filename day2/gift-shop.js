import { readTextLines } from "../utils/fileparser.js";

const findDuplicatesSum = (fileName) => {
  console.log("Reading ranges...");
  const ranges = readTextLines(fileName)[0].split(",");
  console.log("Done: " + ranges.length + " range(s)");
  const ids = [];
  ranges.forEach((range) => {
    const [start, end] = range.split("-");
    for (let i = Number(start); i <= Number(end); i++) {
      //get the string version
      const str = i.toString();
      if (
        str.length % 2 === 0 &&
        str.slice(0, str.length / 2) === str.slice(str.length / 2)
      ) {
        //found
        ids.push(i);
      }
    }
  });
  console.log(`Found ${ids.length} ids`);
  console.log(
    "Sum is " +
      ids.reduce((p, c) => {
        return c + p;
      }, 0)
  );
};

const findDuplicatesSum2 = (fileName) => {
  console.log("Reading ranges...");
  const ranges = readTextLines(fileName)[0].split(",");
  console.log("Done: " + ranges.length + " range(s)");
  const ids = [];
  ranges.forEach((range) => {
    const [start, end] = range.split("-");
    for (let i = Number(start); i <= Number(end); i++) {
      //get the string version
      const str = i.toString();
      for (let j = 2; j <= str.length; j++) {
        //test any smaller measure if it's a valid divisor
        if (str.length % j === 0) {
          //check repetitions
          const len = str.length / j;
          const rep = str.slice(0, len).repeat(j);
          if (rep === str) {
            //found
            ids.push(i);
            break;
          }
        }
      }
    }
  });
  console.log(`Found ${ids.length} ids`);
  console.log(
    "Sum is " +
      ids.reduce((p, c) => {
        return c + p;
      }, 0)
  );
};

(() => {
  console.log("Day 2: Gift shop\n");
  console.log("Running sample 1");
  findDuplicatesSum(import.meta.dirname + "/sample.txt");
  console.log("Running complete 1");
  findDuplicatesSum(import.meta.dirname + "/ids.txt");
  console.log("Running sample 2");
  findDuplicatesSum2(import.meta.dirname + "/sample.txt");
  console.log("Running complete 2");
  findDuplicatesSum2(import.meta.dirname + "/ids.txt");
})();
