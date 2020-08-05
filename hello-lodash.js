const _ = require("lodash");

console.log(_.repeat('*', 20));

var cowsay = require("cowsay");

console.log(cowsay.say({
	text : "I'm a moooodule",
	e : "oO",
	T : ";;; "
}));