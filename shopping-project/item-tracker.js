const {By, until} = require('selenium-webdriver');
const fs = require('fs');

function sleep(m) {
	let ms = m * 60 * 1000;
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms);
	});
}

const selectors = {
	amazon: {
		price: '#priceblock_ourprice',
		name: '#productTitle'
	},
	target: {
		price: '.style__PriceFontSize-gob4i1-0',
		name: 'h1.Heading__StyledHeading-sc-1m9kw5a-0 > span'
	}
}

async function getData(source) {
	data.today = new Date();
	data.price = await (driver.wait(until.elementLocated(By.css(selectors[source].price)))).getText();
	data.priceData = JSON.parse(await fs.promises.readFile('shopping-project/item-data.json', 'utf8'));
}

function findCatagory(url) {
	if(url.match(/target\.com/)) {
		return 'target';
	}
	return 'amazon';
}

let data = {}, time = 0, urlList = {target: [], amazon: []}, catagory;
data.priceData = JSON.parse(fs.readFileSync('shopping-project/item-data.json', 'utf8'));
for(let item of data.priceData) {
	item = item.url;
	catagory = findCatagory(item);
	urlList[catagory].push(item);
}

let PARAMETERS = [paramVars.checkTime, paramVars.runTime, paramVars.addedUrls, paramVars.removedUrls];
let DESCRIPTIONS = ['How often to check prices(In minutes)', 'How many times the program should run(1 run = check time)', 'Urls of products you want to add', 'The urls you want to remove:'];
(async function manageUrls()  {
	if(paramVars.addedUrls) {
		await (async function addUrls() {
			for(let url of paramVars.addedUrls.split(' ')) {
				catagory = findCatagory(url);
				await driver.get(url);
				const name = await (driver.wait(until.elementLocated(By.css(selectors[catagory].name)))).getText();
				const product = {"url": `${url}`,"product-name": `${name.trim()}`,"price-history": [],"price-change": []};
				data.priceData.push(product);
				urlList[catagory].push(url);
				console.log('Added url to tracking list!');
			}			
		})();
	}
	if(paramVars.removedUrls) {
		for(let url of paramVars.removedUrls.split(' ')) {
			for(let item of data.priceData) {
				if(item.url === url) {
					data.priceData.splice(data.priceData.indexOf(item), 1);
					catagory = findCatagory(url);
					urlList[catagory].splice(urlList[catagory].indexOf(url), 1);
					console.log('Removed url from tracking list!');
				}
			}
		}
	}
	fs.writeFile('shopping-project/item-data.json', JSON.stringify(data.priceData), 'utf8', (err) => {
		if(err) {
			throw err;
		}
	});
})();
(async function() {
	while(time < paramVars.runTime) {
		time++;
		for(let store in urlList) {
			for(let url of urlList[store]) {
				await driver.get(url);
				await getData(store);
				for(let item of data.priceData) {
					if(item.url === url) {
						let priceHistory = item['price-history'];
						if(priceHistory[priceHistory.length - 1].price !== data.price.slice(1) || priceHistory.length === 0) {
							let entry = {};
							entry.datetime = data.today;
							entry.price = data.price.slice(1);
							item['price-history'].push(entry);
							await fs.writeFile('shopping-project/item-data.json', JSON.stringify(data.priceData), 'utf8', (err) => {
								if(err) {
									throw err;
								}
							});	
						}
					}
				}	
			}
		}
		await sleep(paramVars.checkTime);
	}
	console.log('finished!');
})();