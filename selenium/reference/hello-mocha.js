const assert = require("assert");


describe("my js tests", () => {
	it("test 1 + 1", () => {
		assert.equal(1 + 1, 2);
	});

	it("array", () => {
		assert.deepEqual([1, 2, 3].concat([4, 5]), [1, 2, 3, 4, 5]);
	});
});