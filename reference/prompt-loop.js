// prompt-input.js

const readline = require("readline");
const fs = require("fs");

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
	let done = false;
	while (!done) {
		let cmd = await promptInput("Enter a command: ");
		if (cmd === "quit") {
			done = true;
			rl.close();
			console.log("Good bye!");
		} else {
			try {
				if (cmd === "") {
					cmd = "test.js";
				}
				console.log("Processing cmd: ", cmd);
				const args = cmd.split(" ");
				const fname = args[0];
				const data = await fs.promises.readFile(fname, "utf8");

				// console.log(data);
				const func = new Function("require", "args", data);
				func(require, args.slice(1));
			} catch (err) {
				console.log("ERROR: failed to exe function: ", err);
			}
		}
	}
})();