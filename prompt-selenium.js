// prompt-input.js

const readline = require("readline");
const fs = require("fs");

const {Builder, By, until} = require("selenium-webdriver");
const {Options} = require("selenium-webdriver/firefox");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

async function isFile(file) {
	const stat = fs.lstat(file, (err, stats) => {
		try {
			if(stats.isFile()) {
				return true;
			}
		} catch(e) {
			console.log(`${file} is not a file!`);
			return false;
		}
	});
}

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
	let defaultFile, data, func, keyword;

	let commands = {
		'run' : async (inputFile) => {
			if(isFile(inputFile)) {
				data = await fs.promises.readFile(inputFile, "utf8");
				func = new Function("require", "driver", data);
				func(require, driver);
				console.log(`File ${inputFile} launched!`);
			}
		},
		'' : async () => {
			if(defaultFile != undefined) {
				commands.run(defaultFile);
			} else {
				console.log('No default set! Use "default ${keyword}" to set a default');
			}
		},
		'quit' : async () => {
			done = true;
			rl.close();
			await driver.quit();
			console.log("Goodbye!");
		},
		'default' : async (input) => {
			if(isFile(input)) {
				defaultFile = input;
				console.log(`Successfully set ${input} to default file to run!`);
			}
		},
		'help' : () => {
			console.log('Commands : \ndefault ${file}: Set file to run when no command is given.\nquit: Shut down browser ')
		}
	};

	console.log("Entering prompt loop...");
	let done = false;
	while (!done) {
		let input = await promptInput("Enter a command: ");
		input = input.split(" ");
		keyword = input.shift();
		input = input.join("");
		for(let cmd of Object.keys(commands)) {
			if(keyword === cmd) {
				commands[cmd](input);
			}
		}
		// let cmd = await promptInput("Enter a command: ");
		// if (cmd === "quit") {
		// 	done = true;
		// 	rl.close();
		// 	console.log("Good bye!");
		// } else {
		// 	if (cmd === "") {
		// 		cmd = "discord-parrot.js";
		// 	}
		// 	console.log("Processing cmd: ", cmd);
		// 	const fname = cmd;
		// 	const data = await fs.promises.readFile(fname, "utf8");

		// 	// console.log(data);
		// 	const func = new Function("require", "driver", data);
		// 	func(require, driver);
		// }
	}
})();