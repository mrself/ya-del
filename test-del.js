var plugin;
/**
 * Core functionality for DOM elements.
 * Used when developing plugin, or simply adding methods to element.
 * @param  {[type]} ) {	}         [description]
 * @return {[type]}   [description]
 */
describe("DEl", function() {
	var inst;
	describe('Init', function() {
		var tempEL = {
			$el: $('.plugin'),
			_name: 'plugin'
		};
		inst = $.DEl();
		inst.initDEL(tempEL);
		it('make name by EL property "_name" if no selectorName', function() {
			assert(inst.name == 'plugin');
		});
	});
	
	describe('Methods', function() {
		describe('Make name', function() {
			var ELName = 'plugin';
			it('Make name if elName & modName are strings', function() {
				assert(inst.makeName('elName', 'modName') == (ELName + '__elName--modName'));
			});
			it('Make name if only elName is defined', function() {
				assert(inst.makeName('elName', '') == (ELName + '__elName'));
			});
			it('Make name if only modName is defined', function() {
				assert(inst.makeName('', 'modName') == (ELName + '--modName'));
			});
			it('Make name if both elName & modName are arrays with length 1', function() {
				assert(inst.makeName(['elName'], ['modName']) == (ELName + '__elName--modName'));
			});
			it('Make name if both elName & modName are arrays with length more than 1', function() {
				assert(inst.makeName(['elName', 'elName1'], ['modName', 'modName1']) == (ELName + '__elName__elName1--modName--modName1'));
			});
		});

		describe('Selector name', function() {
			// It uses the functionality of 'makeName' method, so do not check it again
			it('Class selector from elName & modName is ".name__elName--modName"', function() {
				assert(inst.makeSelector('elName', 'modName') == '.plugin__elName--modName');
			});
			it('Id selector from elName & modName is "#name__elName--modName"', function() {
				assert(inst.makeSelector('elName', 'modName', false) == '.plugin__elName--modName');
			});
		});

		describe('Find el', function() {
			it('".plugin__item" exists', function() {
				assert(inst.find('item')[0] === $('.plugin__item')[0]);
			});
			it('".plugin__item1" does not exists', function() {
				assert(inst.find('item1').length == 0);
				
			});
		});

		describe('Find in', function() {
			it('Find sub el in separate jQuey el', function() {
				assert(inst.findIn($('.jquery'), 'item').length > 0);
			});
		});

		describe('mod', function() {
			it('El has no mod "MOD"', function() {
				assert(!inst.hasMod('MOD'));
			});
			it('El has mod "modName"', function() {
				assert(inst.hasMod('modName'));
			});

			it('remove existing mod name "modNameRemove"', function() {
				inst.removeMod('modNameRemove');
				assert(!inst.hasMod('modNameRemove'));
			});

			it('remove non existing mod name "mmmm"', function() {
				inst.removeMod('mmmm');
				assert(!inst.hasMod('mmmm'));
			});

			it('remove mod name return jQuery object', function() {
				assert(inst.removeMod('ff') instanceof $);
			});

			it('add non existing mod name "ModName1"', function() {
				inst.addMod('ModName1');
				assert(inst.hasMod('ModName1'));
			});
			it('add existing mod name "ModName1"', function() {
				inst.addMod('ModName1');
				assert(inst.hasMod('ModName1'));
			});
			describe('toggle mod', function() {
				it('add non-existing mod "toggleMod"', function() {
					inst.toggleMod('toggleMod');
					assert(inst.hasMod('toggleMod'));
				});
				it('remove existing mod "toggleMod"', function() {
					inst.toggleMod('toggleMod');
					assert(!inst.hasMod('toggleMod'));
				});
			});
		});

		describe('event', function() {
			var clicked;
			it('event name from click is click.plugin', function() {
				assert(inst.eventMakeName('click') == 'click.plugin');
			});
			it('add event click', function() {
				clicked = false;
				inst.on('click', function() {
					clicked = true;
				});
				inst.triggerEvent('click');
				assert(clicked);
			});
			it('add event click with sub el', function() {
				clicked = false;
				inst.on('clickSub', inst.makeSelector('el'), function() {
					clicked = true;
				});
				inst.find('el').trigger('clickSub');
				assert(clicked);
			});
			it('remove event', function() {
				inst.off('clickSub');
				clicked = false;
				inst.find('el').trigger('clickSub');
				assert(!clicked);
			});
		});
	});
});
