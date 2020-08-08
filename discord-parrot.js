const {Builder, By, until, Key} = require("selenium-webdriver");

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
let DESCRIPTIONS = ['How often do you want the parrot to check for new messages(In ms)?', 'How long do you want the parrot to run(In increments of check time)?', 'The url of the chat you want to parrot'];

(async function() {
	//LILY            
	// await driver.get("https://discord.com/channels/@me/734503544757157899");
	//GROUP CHAT
	// await driver.get("https://discord.com/channels/@me/729411342003339344");
	await driver.get(paramVars.url);
	let oldText = await getLastMessage();
	let time = 0;
	while(time <= paramVars.runtime) {
		if(stop) {
			return;
		}
		recentText = await getLastMessage();
		time++;
		if(oldText != recentText) {
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