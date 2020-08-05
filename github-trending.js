// Selenium API https://www.selenium.dev/selenium/docs/api/javascript/index.html
// User Guide: https://www.selenium.dev/documentation/en/


const {Builder, By, until} = require("selenium-webdriver");

(async function () {
	const driver = await new Builder().forBrowser("firefox").build();
	// console.log("got driver", driver);

	await driver.get("https://github.com");
	await driver.wait(until.elementLocated(By.css("li.d-block:nth-child(4) > details:nth-child(1) > summary:nth-child(1)"))).click();
	await driver.wait(until.elementLocated(By.css("ul.mb-3:nth-child(3) > li:nth-child(3) > a:nth-child(1)"))).click();
	
	await driver.wait(until.elementLocated(By.css("#select-menu-date > summary:nth-child(1)"))).click();
	await driver.wait(until.elementLocated(By.css("div.select-menu-list:nth-child(2) > a:nth-child(3) > span:nth-child(2)"))).click();
	
	// Wait for the first row project stars
	const stars = await driver.wait(until.elementLocated(By.css("article.Box-row:nth-child(1) > div:nth-child(4) > span:nth-child(5)"))).getText();
	const projectName = await driver.wait(until.elementLocated(By.css("article.Box-row:nth-child(1) > h1:nth-child(2) > a:nth-child(1)"))).getText();


	// 
	console.log(`Top project ${projectName} has ${stars}`);
})();