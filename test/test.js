var $fixture;

beforeEach(function() {
	$fixture = $('#fixture').empty();
});

describe('#initDel', function() {
	it('call #initEl', function() {
		var module = makeSimpleModule();
		var spiedInitEl = spy.on(module, 'initEl');
		var $el = makeEl('module').appendTo($fixture);
		module.initDel({
			dName: 'module'
		});
		spiedInitEl.should.have.been.called();
	});

	it('set DelOptions', function() {
		var module = makeSimpleModule();
		module.initDel({key: null});
		expect(module.DelOptions).to.have.property('key')
	});
});

describe('#makeName', function() {
	beforeEach(function() {
		this.module = makeModule();
	});
	it ('return bem el', function() {
		var name = this.module.makeName('el');
		assert(name == 'module__el');
	});
	it('return bem el with mod', function() {
		var name = this.module.makeName('el', 'mod');
		assert(name == 'module__el--mod');
	});
});

describe('#makeSelector', function() {
	beforeEach(function() {
		this.module = makeModule();
	});
	it ('return bem el as selector', function() {
		var selector = this.module.makeSelector('el');
		assert(selector == '.module__el');
	});
	it('return bem el as selector with mod', function() {
		var selector = this.module.makeSelector('el', 'mod');
		assert(selector == '.module__el--mod');
	});
});

describe('#setName', function() {
	beforeEach(function() {
		this.module = makeModule();
	});
	it ('set name on module el', function() {
		this.module.$el.removeClass('module');
		this.module.setName();
		assert(this.module.$el.hasClass('module'));
	});
});

describe('#find', function() {
	beforeEach(function() {
		this.module = makeModule();
	});
	it ('#find el', function() {
		var $el = $('<div class="module__el"></div>');
		this.module.$el.append($el);
		assert(this.module.find('el')[0] == $el[0]);
	});
	it('#find el with mode', function() {
		var $el = $('<div class="module__el--mod"></div>');
		this.module.$el.append($el);
		assert(this.module.find('el', 'mod')[0] == $el[0]);
	});
	it('#find not existing el should return empty collection', function() {
		assert(this.module.find('nonexist').length == 0);
	});
});

describe('#findIn', function() {
	beforeEach(function() {
		this.module = makeModule();
	});
	it ('find existing el', function() {
		$('body').append($('<div class="jq"><div class="module__el"></div></div>'));
		var $jq = this.module.findIn('.jq', 'el');
		assert($jq.length);
		$jq.remove();
	});
	it('find non existing el should have no result', function() {
		assert(!this.module.findIn('.nonexist', 'el').length);
	});
});

describe('events', function() {
	var module;
	beforeEach(function() {
		this.module = makeModule();
	});

	it('#eventName', function() {
		assert(this.module.eventName('event') == 'event.module');
	});

	it ('#on', function() {
		this.module.on('event', function() {
			assert(true);
		});
		this.module.trigger('event');

	});

	it('#on - should create event with with bubbling', function() {
		var $child = $('<div />', {"class": this.module.makeName('child')});
		this.module.$el.append($child);
		this.module.on('click', 'child', function() {
			assert(true);
		});
		$child.trigger('click.module');
	});

	it('#off', function() {
		var triggered = false;
		this.module.on('event', function() {
			if (!triggered) {
				assert(true);
				triggered = true;
			} else {
				assert(false);
			}
		});
		this.module.trigger('event');
		this.module.off('event');
		this.module.trigger('event');
	});

	it('#off - should remove event with with bubbling', function() {
		var $child = $('<div />', {"class": this.module.makeName('child')});
		this.module.$el.append($child);
		var flag = true;
		this.module.on('click', 'child', function() {
			flag = false;
		});
		this.module.off('click', 'child');
		$child.trigger('click.module');
		assert(flag);
	});
});

describe('#_smartArgs', function() {
	beforeEach(function() {
		this.module = makeModule();
	});
	it ('first arguments is jQuery instance', function() {
		var $_el = $('<div />');
		var module = this.module;
		this.module._smartArgs(function($el, args, context) {
			assert($el instanceof $);
			assert($_el[0] == $el[0]);
			assert(args[0] == 'string');
			assert(context == module);
		}, [$_el, 'string']);
	});

	it('first argument is not jQuery instance', function() {
		var module = this.module;
		this.module._smartArgs(function($el, args, context) {
			assert(module.$el[0] == $el[0]);
			assert(args[0] == 'str1');
			assert(args[1] == 'str2');
		}, ['str1', 'str2']);
	});
});

describe('modifier', function() {
	var module;
	beforeEach(function() {
		this.module = makeModule();
	});
	it ('#modName', function() {
		assert(this.module.modName('mod') == 'module--mod');
	});

	it('#hasMod', function() {
		assert(!this.module.hasMod('mod'));
		this.module.$el.addClass('module--mod');
		assert(this.module.hasMod('mod'));
	});

	it('#addMod', function() {
		this.module.addMod('mod');
		assert(this.module.hasMod('mod'));
	});

	it('#removeMod', function() {
		this.module.addMod('mod');
		this.module.removeMod('mod');
		assert(!this.module.hasMod('mod'));
	});

	describe('#toggleMod', function() {
		it('(add)', function() {
			this.module.toggleMod('mod');
			l(this.module.$el)
			assert(this.module.hasMod('mod'));
		});

		it('(remove)', function() {
			this.module.addMod('mod');
			this.module.toggleMod('mod');
			assert(!this.module.hasMod('mod'));
		});

		it('with true state', function() {
			this.module.toggleMod('mod', true);
			assert(this.module.hasMod('mod'));
		});
		it ('with false state', function() {
			this.module.addMod('mod');
			this.module.toggleMod('mod', false);
			assert(!this.module.hasMod('mod'));
		});
		it('with custom el', function() {
			var $_el = $('<div />');
			this.module.toggleMod($_el, 'mod');
			assert($_el.hasClass('module--mod'));
		});
	});

	it('#filterByMod', function() {
		var $el = $('<div class="module--mod"></div>');
		this.module.$el.append($el);
		assert(this.module.filterByMod($el, 'mod')[0] == $el[0]);
	});
});

describe('#createEl', function() {
	var module;
	beforeEach(function() {
		this.module = makeModule();
	});

	it ('created el has proper class', function() {
		assert(this.module.createEl('el').hasClass('module__el'));
	});

	it('create el has proper tag name', function() {
		assert(this.module.createEl('el')[0].tagName.toLowerCase() == 'div');
	});
});

describe('#initEl', function() {
	it('exit if $el exists', function() {
		var module = makeSimpleModule();
		var $el = makeEl();
		module.$el = $el;
		module.initDel();
		module.$el[0].should.be.eql($el[0]);
	});


	it('set $el prop from DelOptions', function() {
		var module = makeSimpleModule();
		var $el = $('<div />');
		module.DelOptions = {$el: $el};
		module.initEl();
		expect(module.$el[0]).to.be.eql($el[0]);
	});

	it('make $el by dName if $el is not provided', function() {
		var module = makeSimpleModule();
		var $el = $('<div />', {'class': 'dName'});
		$fixture.append($el);
		module.DelOptions = {};
		module.dName = 'dName';
		module.initEl();
		expect(module.$el[0]).to.be.eql($el[0]);
	});

	it('transform $el to jQuery if it is not', function() {
		var module = makeSimpleModule();
		var $el = $('<div />');
		$fixture.append($el);
		module.DelOptions = {$el: $el[0]};
		module.initEl();
		expect(module.$el[0]).to.be.eql($el[0]);
	});
});

function makeModule(name, $el) {
	name = name || 'module';
	var Module = function(){
		this.$el = makeEl(name);
		this.initDel({dName: name});
	};
	Module.prototype = $.Del;
	var module = new Module();
	return module;
}

function makeSimpleModule () {
	function Module () {}
	Module.prototype = Object.create($.Del);
	return new Module;
}

function makeEl(className) {
  var $el = $('<div />', {
    class: className
  });
  return $el;
}
function l(x) {
	console.log(x);
}
