var w;
var l = h.g.l;
describe('Init', function() {
	function Constructor() {
		this.selectorName = 'widget';
		this.$el = $('.widget');
		this.initDW(this.$el, this.selectorName);
		this.init();
	}
	function Prototype() {
		this.init = function() {

		};
	}
	var Plugin = h.g.makeClass(Constructor, Prototype);
	$.DW(Plugin);
	var w = new Plugin();


	function Constructor1() {
		this.selectorName = 'widget1';
		this.$el = $('.widget1');
		this.initDW(this.$el, this.selectorName);
		this.init();
	}
	function Prototype1() {
		this.init = function() {

		};
	}
	var Plugin1 = h.g.makeClass(Constructor1, Prototype1);
	$.DW(Plugin1);
	var w1 = new Plugin1();

	describe('Sub el', function() {
		describe('Options', function() {
			describe('inheritName', function() {
				describe('case value = "true" (default)', function() {
					it('name starts with DW name (widget)', function() {
						w.addEl('el', w._.find('el'));
						assert(w.els.el.selectorName == 'widget__el');
					});
					it('name of sub el 2 level starts with "widget"', function() {
						assert(w.els.el._.makeName('sub2') == 'widget__el__sub2');
					});
				});
				describe('case value = "false"', function() {
					it('Name of el "el" in widget id el', function() {
						w.addEl('el', w._.find('el'), null, false);
						assert(w.els.el.selectorName == 'el');
					});

					it('Name of the subel "sub2" of el is "el__sub2"', function() {
						assert(w.els.el._.makeName('sub2') == 'el__sub2');
					});

					it('sub el "item" exists', function() {
						w.addEl('item', w._.find('item'), null, false);
						assert(w.$.item.length);
					});
					it('sub el "item111" does not exist', function() {
						w.addEl('item111', w._.find('item111'), null, false);
						assert(!w.$.item111.length);
					});
					it('Sub el "subitem" of "item" el does not exists', function() {
						assert(!w.els.item._.find('subitem').length);
					});
				});
			});
		});
		describe('Add el with custom init (when el is not known for the time of adding el)', function() {
			w.addEl('custom', null, function() {
				this.$ = $('<div />', {
					class: 'customEl'
				});
				this.initDW();
			});
			it('Class name of subel "custom" = "customEl"', function() {
				assert(w.$.custom.hasClass('customEl'));
			});
		});
	});
	describe('widget DEL', function() {
		describe('DEL mod', function() {
			it('widget has no mod "nomod"', function() {
				assert(!w._.hasMod('nomod'));
			});
			it('add mod "mod1"', function() {
				w._.addMod('mod1');
				assert(w._.hasMod('mod1'));
			});
		});
	});
});