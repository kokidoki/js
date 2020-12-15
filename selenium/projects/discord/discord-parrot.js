const {By, until, Key} = require("selenium-webdriver");

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms);
	});
}

async function getLastMessage() {
	let messagesDiv = await driver.wait(until.elementsLocated(By.css('#messages > div[id^="messages-"]')));
	let text = await messagesDiv[messagesDiv.length - 1].getText();
	if(text.match(/\n/)) {
		text = text.split("\n").pop();
	}
	return text;
}

let PARAMETERS = [paramVars.checkTime, paramVars.runtime, paramVars.url];
let DESCRIPTIONS = ['How often do you want the parrot to check for new messages(In ms)?', 'How long do you want the parrot to run(Either in increments of run time or "infinite")?', 'The url of the chat you want to parrot'];

(async function() {
	await driver.get(paramVars.url);
	let oldText = await getLastMessage();
	let time = 0, infinite = false;
	if(PARAMETERS[1].toLowerCase() === 'infinite') infinite = true
	while(time <= paramVars.runtime || infinite) {
		if(stop.stopScript) {
			return;
		}
		recentText = await getLastMessage();
		time++;
		if(oldText != recentText) {
			console.log('test');
			let textField = await driver.wait(until.elementLocated(By.css('.slateTextArea-1Mkdgw')));
			oldText = await getLastMessage();
			await textField.click();
			await textField.sendKeys(recentText);
			await textField.sendKeys(Key.RETURN);
		}
		await sleep(paramVars.checkTime);
	}
	console.log('Finished!');
})();