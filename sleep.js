// sleep.js

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms);
	});
}

(async function main() {
	while (true) {
		console.log("hi");
		await sleep(3300);
	}
})();