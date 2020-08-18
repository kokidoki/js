const {By, until} = require('selenium-webdriver');
//GET THINGS WORKING BEFORE GOING FOR EFFICIENCY
(async function main() {
	await driver.get('https://www.megaspin.net/');
	const products = await driver.wait(until.elementLocated(By.css('.menu > li > a')));
	console.log(products);
})();