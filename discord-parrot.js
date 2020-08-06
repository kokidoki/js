const {Builder, By, until} = require("selenium-webdriver");
const {Options} = require("selenium-webdriver/firefox");

(async function () {
	const opts = new Options(Options.firefox());
	opts.setProfile("/Users/kenny/Library/Application Support/Firefox/Profiles/n0dyd94w.default-1595287968316");
	const driver = await new Builder().forBrowser("firefox").setFirefoxOptions(opts).build();
	await driver.get("https://discord.com/channels/@me/708855190023045150");
	const messagesDiv = await driver.wait(until.elementsLocated(By.css("#messages")), 20000);
	const messages = await messages[messages.length - 1].getText();
	console.log(typeof messages); 
})();