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
		let context = {stopScript: false};

		if (cmd === "quit") {
			done = true;
			rl.close();
			console.log("Good bye!");
		} else {
			if (cmd === "stopScript") {
				console.log("Set stopScript to true");
				context.stopScript = true;
			} else {
				try {
					if (cmd === "") {
						cmd = "test.js";
					}
					const args = cmd.split(" ");
					const fname = args[0];
					console.log("Executing script: ", fname, args);
					const data = await fs.promises.readFile(fname, "utf8");

					// console.log(data);
					const func = new Function("require", "args", "context", data);
					func(require, args.slice(1), context);
				} catch (err) {
					console.log("ERROR: failed to exe function: ", err);
				}
			}
		}
	}
})();