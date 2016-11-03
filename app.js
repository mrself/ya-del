$.Del = require('./del.js');
mocha.setup('bdd');
window.spies = require('chai-spies');
chai.use(spies);
window.spy = chai.spy;
window.assert = chai.assert,
window.expect = chai.expect;
window.should = chai.should();
window.l = function (x) {
	console.log(x);
}