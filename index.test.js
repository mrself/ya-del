var chai = require('chai'),
	expect = chai.expect,
	assert = chai.assert,
	$ = require('jquery'),
	// jsdom = require('jsdom');
	del = require('./del');

function Module () {
	this.$el = $('<div />');
	this.dName = 'module';
}
describe('initDel', function() {
	// jsdom.jsdom.createWindow('');
	
	// it ('should have properties', function() {
	// 	var module = new Module();
	// 	module.initDel();
	// 	assert(module.DelOptions.$elName == '$el');

	// });
});
describe('#makeName', function() {
	it('it should work', function() {
		assert(true);
	});
});