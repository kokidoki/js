
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

(async function() {
	//LILY            
	// await driver.get("https://discord.com/channels/@me/734503544757157899");
	//GROUP CHAT
	// await driver.get("https://discord.com/channels/@me/729411342003339344");
	await driver.get("https://discord.com/channels/706559114448338944/706559116491096166");
	let oldText = await getLastMessage();
	let time = 0;
	while(time <= 120) {
		recentText = await getLastMessage();
		time++;
		if(oldText != recentText) {
			let textField = await driver.wait(until.elementLocated(By.css('.slateTextArea-1Mkdgw')));
			oldText = await getLastMessage();
			await textField.click();
			await textField.sendKeys(recentText);
			await textField.sendKeys(Key.RETURN);
		}
		await sleep(250);
	}
	console.log('Finished!');
})();