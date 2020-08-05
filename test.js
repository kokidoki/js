try {
	// do somthing
} catch (err) {
	// something wrong
} finally {
	// do something regardless pass or failed
}


// Immediately function invocation call
// namespace - safely
(function () {
	// do something
	let x = 123;
})();


// Promise
let p = new Promise((resolve, reject) => {
	// takes some time...
	resolve(123);
});
// p2
p.then(data => {
	// use data
	p2.then(data2 => {
		foo(data2);
	});
});
// problem...
//foo(data);


(async function () {
	data = await p;
	foo(data);
	data2 = await p2;
	ffo(data2);
})();
//console.log("test");
