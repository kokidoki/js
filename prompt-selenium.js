// prompt-input.js

const readline = require("readline");
const fs = require("fs");

const {Builder, By, until} = require("selenium-webdriver");
const {Options} = require("selenium-webdriver/firefox");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});



function promptInput(q) {
	return new Promise(resolve => {
		rl.question(q, (answer) => {
			resolve(answer);
		});
	});
}

(async function main() {

	console.log("Initializing Selenium....");
	const opts = new Options(Options.firefox());
	opts.setProfile("/Users/kenny/Library/Application Support/Firefox/Profiles/n0dyd94w.default-1595287968316");
	const driver = await new Builder().forBrowser("firefox").setFirefoxOptions(opts).build();

	console.log("Entering prompt loop...");
	let done = false;
	while (!done) {
		let cmd = await promptInput("Enter a command: ");
		if (cmd === "quit") {
			done = true;
			rl.close();
			console.log("Good bye!");
		} else {
			if (cmd === "") {
				cmd = "test.js";
			}
			console.log("Processing cmd: ", cmd);
			const fname = cmd;
			const data = await fs.promises.readFile(fname, "utf8");

			// console.log(data);
			const func = new Function("require", "driver", data);
			func(require, driver);
		}
	}
})();