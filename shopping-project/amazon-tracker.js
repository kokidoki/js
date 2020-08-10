const {By, until} = require('selenium-webdriver');
const fs = require('fs');

function sleep(m) {
	let ms = m * 60 * 1000;
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms);
	});
}

async function getData() {
	data.today = new Date();
	data.price = await (driver.wait(until.elementLocated(By.css('#priceblock_ourprice')))).getText();
	data.priceData = JSON.parse(await fs.promises.readFile('item-data.JSON', 'utf8'));
}

let data = {}, time = 0, urlList = [];
data.priceData = JSON.parse(fs.readFileSync('item-data.JSON', 'utf8'));
async () => await getData()
for(let item of data.priceData) {
	urlList.push(item.url);
}
let PARAMETERS = [paramVars.checkTime, paramVars.runTime, paramVars.addedUrls, paramVars.removedUrls];
let DESCRIPTIONS = ['How often to check prices(In minutes)', 'How many times the program should run(1 run = check time)', 'Urls of products you want to add', 'The urls you want to remove:'];
(async function manageUrls() {
	if(paramVars.addedUrls) {
		await (async function addUrls() {
			for(let url of paramVars.addedUrls.split(' ')) {
				await driver.get(url);
				const name = await (driver.wait(until.elementLocated(By.css('#productTitle')))).getText();
				const product = {"url": `${url}`,"product-name": `${name.trim()}`,"price-history": []};
				data.priceData.push(product);
				urlList.push(product.url);
			}
		})();
	}
	if(paramVars.removedUrls) {
		for(let url of paramVars.removedUrls.split(' ')) {
			for(let item of data.priceData) {
				if(item.url === url) {
					data.priceData.splice(data.priceData.indexOf(item), 1);
					urlList.splice(urlList.indexOf('url'), 1);
				}
			}
		}
	}
	fs.writeFile('item-data.JSON', JSON.stringify(data.priceData), 'utf8', (err) => {
		if(err) {
			throw err;
		}
	});
})();
(async function() {
	while(time < paramVars.runTime) {
		time++;
		for(let url of urlList) {
			await driver.get(url);
			await getData();
			for(let item of data.priceData) {
				if(item.url === url) {
					let priceHistory = item['price-history'];
					if(priceHistory[priceHistory.length - 1] !== data.price || priceHistory.length === 0) {
						let entry = {};
						entry.datetime = data.today;
						entry.price = data.price.slice(1);
						item['price-history'].push(entry);
						await fs.writeFile('item-data.JSON', JSON.stringify(data.priceData), 'utf8', (err) => {
							if(err) {
								throw err;
							}
						});	
					}

				}
			}
		}
		await sleep(paramVars.checkTime);
	}
	console.log('finished!');
})();