var l = h.g.l;
var zen = function(input) {
  return jQuery(zen_coding.expandAbbreviation(input, 'html', 'xhtml'));
};
function makeModule(name, $el) {
	var Module = function(){
		this.dName = name;
		if (!$el) {
			this.$el = makeEl(name);
			// this.$el = $('.' + this.dName).appendTo('body');
		}
		else
			this.$el = $el;
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


describe('makeName method', function() {
	it('makeName(el) = module__el', function() {
		var module = makeModule('module');
		assert(module.makeName('el') == 'module__el');
	});
	it('makeName(el, mod) = module__el--mod', function() {
		var module = makeModule('module');
		assert(module.makeName('el', 'mod') == 'module__el--mod');
	});
});

describe('makeSelector method', function() {
	it('makeSelector(el) = .module__el', function() {
		var module = makeModule('module');
		assert(module.makeSelector('el') == '.module__el');
	});
	it('makeSelector(el, mod) = .module__el--mod', function() {
		var module = makeModule('module');
		assert(module.makeSelector('el', 'mod') == '.module__el--mod');
	});
});

describe('find method', function() {
	var $module = makeDomTree({
		name: 'module',
		children: {
			name: 'module__el',
			children: {
				name: 'module__el--mod'
			}
		}
	});
	
	it('find(el)', function() {
		var module = makeModule('module', $module);
		assert(module.find('el').get(0) === $module.find('.module__el').get(0));
		$module.remove();
	});
	it('find(el, mod)', function() {
		var module = makeModule('module', $module);
		assert(module.find('el', 'mod').get(0) === $module.find('.module__el--mod').get(0));
		$module.remove();
	});

	it('length of find(nonexist) == 0', function() {
		$('body').append($module);
		var module = makeModule('module');
		assert(!module.find('nonexist').length);
		$module.remove();
	});
});

describe('findIn method', function() {
	var $module = makeDomTree({
		name: 'module',
		children: {
			name: 'jqel',
			children: {
				name: 'module__el--mod'
			}
		}
	});
	it('find real el', function() {
		$('body').append($module);
		var module = makeModule('module');
		assert(module.findIn('.jqel', 'el', 'mod').length);
		$module.remove();
	});

	it('find unreal el', function() {
		$('body').append($module);
		var module = makeModule('module');
		assert(!module.findIn('.blabla', 'el', 'mod').length);
		$module.remove();
	});
});

describe('events', function() {
	var $module = makeDomTree({
		name: 'module',
		children: {
			name: 'jqel',
			children: {
				name: 'module__el--mod'
			}
		}
	});
	it('make event name', function() {
		var module = makeModule('module');
		assert(module.eventName('event') == 'event.module');
	});
	it('on', function() {
		$('body').append($module);
		var module = makeModule('module');
		var flag = false;
		module.on('event', function() {
			flag = true;
		});
		module.$el.trigger(module.eventName('event'));
		assert(flag);
		$module.remove();
	});
	it('off', function() {
		var module = makeModule('module', $module);
		var flag = false;
		module.on('event', function() {
			flag = !flag;
		});
		module.$el.trigger(module.eventName('event'));
		module.off('event');
		module.$el.trigger(module.eventName('event'));
		assert(flag);
		$module.remove();
	});
});
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
				name: 'module__el--mod'
			}
		}
	});
	it('mod name', function() {
		var module = makeModule('module', $module);
		assert(module.modName('mod') == 'module--mod');
	});
	it('has mod', function() {
		var module = makeModule('module', $module);
		assert(module.hasMod('mod'));
	});
	it('has not mod', function() {
		var module = makeModule('module', $module);
		assert(!module.hasMod('modsmth'));
	});

	it('add mod', function() {
		var module = makeModule('module', $module);
		module.addMod('newmod');
		assert(module.hasMod('newmod'));
	});
	it('add mod with $ el', function() {
		var module = makeModule('module', $module);
		module.$el.append($('<div />', {'class': 'someEl'}));
		var $el = module.$el.find('.someEl');
		module.addMod($el, 'newmod');
		assert($el.hasClass('module--newmod'));
	});

	it('remove mod', function() {
		var module = makeModule('module', $module);
		module.removeMod('mod');
		assert(!module.hasMod('mod'));
	});

	it('toggle mod (has mod)', function() {
		var module = makeModule('module', $module);
		var hasMod = module.hasMod('mod');
		module.toggleMod('mod');
		assert(hasMod != module.hasMod('mod'));
	});

	it('toggle mod (has not mod)', function() {
		var module = makeModule('module', $module);
		var hasMod = module.hasMod('newmod');
		module.toggleMod('newmod');
		assert(hasMod != module.hasMod('newmod'));
	});
	it('toggle mod with true state', function() {
		var module = makeModule('module', $module);
		module.toggleMod('mymod', 1);
		assert(module.hasMod('mymod'));
	});
	it('toggle mod with false state', function() {
		var module = makeModule('module', $module);
		module.toggleMod('mymod', 0);
		assert(!module.hasMod('mymod'));
	});
});