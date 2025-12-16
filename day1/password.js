import { readTextLines } from "../utils/fileparser.js";

const findPassword = (start = 50, size = 100, fileName) => {
  console.log("Reading instructions...");
  const instructions = readTextLines(fileName);
  console.log("Done: " + instructions.length + " line(s)");
  let current = start;
  let zeroes = 0;
  let zeroesPart2 = 0;
  instructions.forEach((instr) => {
    const dir = instr.startsWith("L") ? -1 : 1;
    const moves = Number(instr.slice(1));
    if (moves > 0) {
      for (let i = 0; i < moves; i++) {
        current = (current + dir) % size;
        if (current === 0) {
          zeroesPart2++;
        }
      }
      if (current === 0) {
        zeroes++;
      }
    }
  });
  console.log(`Part 1: Found ${zeroes} zero(s)`);
  console.log(`Part 2: Found ${zeroesPart2} zero(s)`);
  return { zeroes, zeroesPart2 };
};

(() => {
  console.log("Day1: password\n");
  console.log("Running sample");
  findPassword(50, 100, import.meta.dirname + "/sample.txt");
  console.log("Running complete");
  findPassword(50, 100, import.meta.dirname + "/password.txt");
})();
