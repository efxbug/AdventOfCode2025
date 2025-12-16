import ColorHelper from "./utils/colors.js";
import ChildProcess from "node:child_process";
import { listDir } from "./utils/fileparser.js";

const mainMenu = async () => {
  while (true) {
    console.log(
      ColorHelper.whiteForeground("\n"),
      "*******************************\n",
      "*     Advent of code 2025     *\n",
      "*******************************\n",
      ColorHelper.reset()
    );
    const sel = await ColorHelper.simpleAsk(
      'Choose a day to run, "list" or "exit"'
    );
    switch (sel) {
      case "list":
        console.log("Available dirs:");
        console.log(
          ...listDir("./", false, true)
            .filter((name) => name != "utils")
            .map((v) => `${v}`)
        );
        break;
      case "exit":
        return;
      default:
        console.log(`Opening ${sel}...`);
    }
  }
};

(async () => {
  if (process.argv.length > 2 && process.argv[2]) {
    //try to directly run command
    ChildProcess.spawnSync("node", process.argv.slice(2), {
      stdio: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });
  } else {
    await mainMenu();
  }
})();
