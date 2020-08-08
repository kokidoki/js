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

async function checkFile(inputFile, success, err) {
	await fs.promises.stat(inputFile)
		.then(async stat => {
			await success(stat);
		})
		.catch(errMsg => {
			err(errMsg);
		});
}

async function getParams(params, descriptions) {
	let paramVarObj = {}
	for(let p of params) {
		let val = await promptInput(`${p} (${descriptions[params.indexOf(p)]}): `);
		paramVarObj[p.slice(p.indexOf('.') + 1)] = val;
	}
	return paramVarObj
}


(async function main() {
	console.log("Initializing Selenium....");
	const opts = new Options(Options.firefox());
	opts.setProfile("/Users/kenny/Library/Application Support/Firefox/Profiles/n0dyd94w.default-1595287968316");
	let openBrowser = await promptInput("Do you want to open the browser? (y/n): ");
	let desicion = false;
	let driver;
	while(!desicion) {
		if(openBrowser === 'y') {
			console.log('Opening browser...')
			driver = await new Builder().forBrowser("firefox").setFirefoxOptions(opts).build();
			desicion = true;
		} else if(openBrowser === 'n') {
			driver = null;
			desicion = true;
		} else {
			console.log('Not valid input! Type y or n!');
			openBrowser = await promptInput('Open the browser?: ');
		}
		
	}
	let defaultFile, data, func, keyword, params, regex, paramVars, descriptions, stop;
	let commands = {
		'r' : async (inputFile) => {
			await checkFile(inputFile, async (stat) => {
				if(stat.isFile()) {
					stop = false;
					data = await fs.promises.readFile(inputFile, "utf8");
					if(regex = (/DESCRIPTIONS = \[.+\];/).exec(data)) {
						params = regex[0].slice(14, regex[0].indexOf(']')).split(', ');
						descriptions = params;
					}
					if(regex = (/PARAMETERS = \[.+\];/).exec(data)) {
						params = regex[0].slice(14, regex[0].indexOf(']')).split(', ');
						console.log('This file takes parameters. Enter them here: ')
						paramVars = await getParams(params, descriptions);
					}
					func = new Function("require", "driver", "paramVars", "stop", data);
					func(require, driver, paramVars, stop);
					console.log(`File ${inputFile} launched!`);
				}
			}, (errMsg) => {
				// console.log(`${inputFile} is not a file!`);
				console.log(errMsg);
			});
		},
		'quit' : async () => {
			done = true;
			rl.close();
			if(driver) await driver.quit();
			console.log("Goodbye!");
		},
		'stop' : () => {
			stop = true;
		},
		'help' : () => {
			console.log('Commands : \ndefault ${file}: Set file to run when no command is given.\nquit: Shut down browser & prompt loop\nr ${file}: Run a file!')
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
				await commands[cmd](input);
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