function Module() {
	this.init = function() {
		this.dName = 'module';
		this.$el = $('.' + this.dName);
		this.initDel();
	};
}
$.extend(Module.prototype, require('del'));
var module = new Module();
module.initDel();

// now you can use Del api

// For example, #find:
module.$el.append('<div class="module__el"></div>');
var $el = module.find('el'); // appended el
