describe('#initDel', function() {
	it ('have all properties', function() {
		var module = makeModule();
		assert(module.dName == 'module');
		assert(module.namespace == 'module');
	});
});

describe('#makeName', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});
	it ('return bem el', function() {
		var name = module.makeName('el');
		assert(name == 'module__el');
	});
	it('return bem el with mod', function() {
		var name = module.makeName('el', 'mod');
		assert(name == 'module__el--mod');
	});
});

describe('#makeSelector', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});
	it ('return bem el as selector', function() {
		var selector = module.makeSelector('el');
		assert(selector == '.module__el');
	});
	it('return bem el as selector with mod', function() {
		var selector = module.makeSelector('el', 'mod');
		assert(selector == '.module__el--mod');
	});
});

describe('#setName', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});
	it ('set name on module el', function() {
		module.$el.removeClass('module');
		module.setName();
		assert(module.$el.hasClass('module'));
	});
});

describe('#find', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});
	it ('#find el', function() {
		var $el = $('<div class="module__el"></div>');
		module.$el.append($el);
		assert(module.find('el')[0] == $el[0]);
	});
	it('#find el with mode', function() {
		var $el = $('<div class="module__el--mod"></div>');
		module.$el.append($el);
		assert(module.find('el', 'mod')[0] == $el[0]);
	});
	it('#find not existing el should return empty collection', function() {
		assert(module.find('nonexist').length == 0);
	});
});

describe('#findIn', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});
	it ('find existing el', function() {
		$('body').append($('<div class="jq"><div class="module__el"></div></div>'));
		var $jq = module.findIn('.jq', 'el');
		assert($jq.length);
		$jq.remove();
	});
	it('find non existing el should have no result', function() {
		assert(!module.findIn('.nonexist', 'el').length);
	});
});

describe('events', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});

	it('#eventName', function() {
		assert(module.eventName('event') == 'event.module');
	});

	it ('#on', function() {
		module.on('event', function() {
			assert(true);
		});
		module.trigger('event');

	});

	it('#on - should create event with with bubbling', function() {
		var $child = $('<div />', {"class": module.makeName('child')});
		module.$el.append($child);
		module.on('click', 'child', function() {
			assert(true);
		});
		$child.trigger('click.module');
	});

	it('#off', function() {
		var triggered = false;
		module.on('event', function() {
			if (!triggered) {
				assert(true);
				triggered = true;
			} else {
				assert(false);
			}
		});
		module.trigger('event');
		module.off('event');
		module.trigger('event');
	});

	it('#off - should remove event with with bubbling', function() {
		var $child = $('<div />', {"class": module.makeName('child')});
		module.$el.append($child);
		var flag = true;
		module.on('click', 'child', function() {
			flag = false;
		});
		module.off('click', 'child');
		$child.trigger('click.module');
		assert(flag);
	});
});

describe('#_smartArgs', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});
	it ('first arguments is jQuery instance', function() {
		var $_el = $('<div />');
		module._smartArgs(function($el, args, context) {
			assert($el instanceof $);
			assert($_el[0] == $el[0]);
			assert(args[0] == 'string');
			assert(context == module);
		}, [$_el, 'string']);
	});

	it('first argument is not jQuery instance', function() {
		module._smartArgs(function($el, args, context) {
			assert(module.$el[0] == $el[0]);
			assert(args[0] == 'str1');
			assert(args[1] == 'str2');
		}, ['str1', 'str2']);
	});
});

describe('modifier', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});
	it ('#modName', function() {
		assert(module.modName('mod') == 'module--mod');
	});

	it('#hasMod', function() {
		assert(!module.hasMod('mod'));
		module.$el.addClass('module--mod');
		assert(module.hasMod('mod'));
	});

	it('#addMod', function() {
		module.addMod('mod');
		assert(module.hasMod('mod'));
	});

	it('#removeMod', function() {
		module.addMod('mod');
		module.removeMod('mod');
		assert(!module.hasMod('mod'));
	});

	describe('#toggleMod', function() {
		it('(add)', function() {
			module.toggleMod('mod');
			assert(module.hasMod('mod'));
		});

		it('(remove)', function() {
			module.addMod('mod');
			module.toggleMod('mod');
			assert(!module.hasMod('mod'));
		});

		it('with true state', function() {
			module.toggleMod('mod', true);
			assert(module.hasMod('mod'));
		});
		it ('with false state', function() {
			module.addMod('mod');
			module.toggleMod('mod', false);
			assert(!module.hasMod('mod'));
		});
		it('with custom el', function() {
			var $_el = $('<div />');
			module.toggleMod($_el, 'mod');
			assert($_el.hasClass('module--mod'));
		});
	});

	it('#filterByMod', function() {
		var $el = $('<div class="module--mod"></div>');
		module.$el.append($el);
		assert(module.filterByMod($el, 'mod')[0] == $el[0]);
	});
});

describe('#createEl', function() {
	var module;
	beforeEach(function() {
		module = makeModule();
	});

	it ('created el has proper class', function() {
		assert(module.createEl('el').hasClass('module__el'));
	});

	it('create el has proper tag name', function() {
		assert(module.createEl('el')[0].tagName.toLowerCase() == 'div');
	});
});
function makeModule(name, $el) {
	name = name || 'module';
	var Module = function(){
		this.dName = name;
		this.$el = $el ? $el : $('<div class="'+ name +'"></div>');
		this.initDel();
	};
	Module.prototype = $.Del;
	var module = new Module();
	return module;
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
