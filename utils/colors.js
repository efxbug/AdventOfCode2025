import readLine from "readline";

export default class ColorHelper {
  // returns a colored string based on colorCode, to be prompted on the cli
  static coloredPrompt = (colorCode, string) =>
    `\x1b[${colorCode}m${string ?? ""}\x1b[0m`;

  // some utilities to get a colored prompt
  static reset = (string) => this.coloredPrompt(0, string);
  static whiteForeground = (string) => this.coloredPrompt(37, string);
  static yellowForeground = (string) => this.coloredPrompt(33, string);
  static yellowBackground = (string) =>
    this.coloredPrompt(43, "\x1b[30m" + (string ?? "")); // black foreground to increase contrast
  static redForeground = (string) => this.coloredPrompt(31, string);
  static redBackground = (string) => this.coloredPrompt(41, string);
  static greenForeground = (string) => this.coloredPrompt(32, string);
  static greenBackground = (string) =>
    this.coloredPrompt(42, "\x1b[30m" + (string ?? "")); // black foreground to increase contrast
  static magentaForeground = (string) => this.coloredPrompt(95, string);

  static simpleAsk = (question) => {
    const myIf = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const myQuestion = `${question?.trimEnd()} `;
    return new Promise((resolve, reject) => {
      myIf.question(myQuestion, (answer) => {
        myIf.close();
        if (typeof answer === "string" && answer) {
          resolve(answer);
        } else {
          ColorHelper.simpleAsk(myQuestion).then(resolve, reject);
        }
      });
    });
  };

  // asks a question on the cli and waits for the reply, if the reply is not valid it will reissue the question
  // until it gets a valid reply. Possible replies are "yes"/"y" or "no"/"n"
  static ask = (question) => {
    const myIf = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const myQuestion = question.replace(/\s$/, "") + " ";
    return new Promise((resolve, reject) => {
      myIf.question(this.yellowForeground(myQuestion), (answer) => {
        myIf.close();
        switch (answer) {
          case "yes":
          case "y":
            resolve("confirmed");
            break;
          case "no":
          case "n":
            reject("refused");
            break;
          default:
            console.log(
              this.redForeground(
                "Error! You can only reply with <yes> / <y> or <no> / <n>"
              )
            );
            ColorHelper.ask(myQuestion).then(
              (ok) => resolve(ok),
              (no) => reject(no)
            );
        }
      });
    });
  };

  /**
   * Asks a question on the cli and waits for the reply, if the reply is not something included in "positiveCases" or "negativeCases",
   * it will reissue the question until it gets a valid reply.
   * Returns a Promise, which will be resolved when the answer is included in positive cases and rejected when it's in negative cases.
   * The result or reject parameter will be the answer itself, so it can be used even for a question with multiple answer
   *
   * @param {string} question The question to be shown on the CLI
   * @param {Array} positiveCases An array of positive cases, required
   * @param {Array} negativeCases An array of negative cases, optional
   */
  static multiAsk = (question, positiveCases, negativeCases) => {
    const myIf = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const myQuestion = question.replace(/\s$/, "") + " ";
    return new Promise((resolve, reject) => {
      myIf.question(myQuestion, (answer) => {
        myIf.close();
        if (typeof answer === "string") {
          if (positiveCases.includes(answer)) {
            resolve(answer);
            return;
          } else if (negativeCases && negativeCases.includes(answer)) {
            reject(answer);
            return;
          }
        }
        console.log(
          this.redForeground(
            `Error! You can only reply with ${JSON.stringify(positiveCases)}${
              negativeCases ? " or " + JSON.stringify(negativeCases) : ""
            }`
          )
        );
        ColorHelper.multiAsk(myQuestion, positiveCases, negativeCases).then(
          resolve,
          reject
        );
      });
    });
  };
}
