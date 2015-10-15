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

var zen = function(input) {
  return jQuery(zen_coding.expandAbbreviation(input, 'html', 'xhtml'));
};


describe('_smartArgs', function() {
	it('with $', function() {
		var module = makeModule('module'), $el_ = $('<div />');
		module._smartArgs(function($el, args, context) {
			assert($el instanceof $ && $el_[0] == $el[0]);
			assert(context == module);
		}, [$el_, 'string']);
	});
	it('without $', function() {
		var module = makeModule('module');
		module._smartArgs(function($el, args, context) {
			assert($el instanceof $ && module.$el[0] == $el[0]);
			assert(args[0] == 'string1');
		}, ['string1', 'string']);
	});
});
describe('mod', function() {
	var $module = makeDomTree({
		name: 'module module--mod',
		children: {
			name: 'jqel',
			children: {
				name: 'module__el module__el--mod'
			}
		}
	});
	function getModule() {
		return $module.clone();
	}
	it('mod name', function() {
		var module = makeModule('module', getModule());
		assert(module.modName('mod') == 'module--mod');
	});
	it('has mod', function() {
		var module = makeModule('module', getModule());
		assert(module.hasMod('mod'));
	});
	it('has not mod', function() {
		var module = makeModule('module', getModule());
		assert(!module.hasMod('modsmth'));
	});

	it('add mod', function() {
		var module = makeModule('module', getModule());
		module.addMod('newmod');
		assert(module.hasMod('newmod'));
	});
	it('add mod with $ el', function() {
		var module = makeModule('module', getModule());
		module.$el.append($('<div />', {'class': 'someEl'}));
		var $el = module.$el.find('.someEl');
		module.addMod($el, 'newmod');
		assert($el.hasClass('module--newmod'));
	});

	it('remove mod', function() {
		var module = makeModule('module', getModule());
		module.removeMod('mod');
		assert(!module.hasMod('mod'));
	});

	it('toggle mod (has mod)', function() {
		var module = makeModule('module', getModule());
		var hasMod = module.hasMod('mod');
		module.toggleMod('mod');
		assert(hasMod != module.hasMod('mod'));
	});

	it('toggle mod (has not mod)', function() {
		var module = makeModule('module', getModule());
		var hasMod = module.hasMod('newmod');
		module.toggleMod('newmod');
		assert(hasMod != module.hasMod('newmod'));
	});
	it('toggle mod with true state', function() {
		var module = makeModule('module', getModule());
		module.toggleMod('mymod', 1);
		assert(module.hasMod('mymod'));
	});
	it('toggle mod with false state', function() {
		var module = makeModule('module', getModule());
		module.toggleMod('mymod', false);
		assert(!module.hasMod('mymod'));
	});
	it('toggle mod with custom $el', function() {
		var module = makeModule('module', getModule());
		var $cEl = $module.find('.jqel');
		module.toggleMod($cEl, 'mymod', 1);
		assert($cEl.hasClass('module--mymod'));
	});
	it('#filterByMod', function() {
		var $module = $('<div />');
		$module.append($('<div />', {
			'class': 'module module--mod2'
		}));
		$module.append($('<div />', {
			'class': 'module module--mod1'
		}));
		$module = $module.find('.module');
		var module = makeModule('module', $module);
		assert(module.filterByMod('mod1')[0] == module.$el.filter('.module--mod1')[0]);
	});
});

describe('createEl', function() {
	it('el has proper class', function() {
		var module = makeModule('module');
		var $el = module.createEl('el');
		assert($el.hasClass('module__el'));
	});
	it('el has proper tag', function() {
		var module = makeModule('module');
		var $el = module.createEl('el', 'div');
		assert($el[0].tagName.toLowerCase() == 'div');
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


function makeDomTree(tree, $el) {
	if (!$el) {
		$el = makeEl(tree.name);
	} else {
		$el.html(makeEl(tree.name));
	}

	if (tree.children)
		$el.html(makeDomTree(tree.children));
	return $el;
}
