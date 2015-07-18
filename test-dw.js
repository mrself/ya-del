var w;
var l = h.g.l;
describe('Init', function() {
	function Constructor() {
		this.selectorName = 'widget';
		this.$el = $('.widget');
		this.el = this.$el.get();
		this.initDW(this.el, this.selectorName);
		this.init();
	}
	function Prototype() {
		var self;
		this.init = function() {

		};
	}
	var Plugin = h.g.makeClass(Constructor, Prototype);
	// $.extend(Plugin.prototype, new Prototype());
	$.DW(Plugin);
	var w = new Plugin();
	l(w);
	// w._.test();

	// var w = new $.DW($('.widget'), 'widget');

	function Constructor1() {
		this.selectorName = 'widget1';
		this.$el = $('.widget1');
		this.el = this.$el.get();
		this.initDW(this.el, this.selectorName);
		this.init();
	}
	function Prototype1() {
		var self;
		this.init = function() {

		};
	}
	var Plugin1 = h.g.makeClass(Constructor1, Prototype1);
	// $.extend(Plugin.prototype, new Prototype());
	$.DW(Plugin1);
	var w1 = new Plugin1();

	describe('Sub el', function() {
		

		describe('sub el inherited', function() {
			it('name starts with DW name (widget)', function() {
				w.addEl('el', w._.find('el'), null, true);
				assert(w.els.el.selectorName == 'widget__el');
			});
			it('name of sub el 2 level starts with "widget"', function() {
				assert(w.els.el._.makeName('sub2') == 'widget__el__sub2');
			});
			
		});

		describe('sub el non inherited', function() {
			it('name starts with sub el name (el)', function() {
				w.addEl('el', w._.find('el'));
				assert(w.els.el.selectorName == 'el');
			});

			it('name of sub el 2 level starts with "el"', function() {
				assert(w.els.el._.makeName('sub2') == 'el__sub2');
			});

			it('sub el "item" exists', function() {
				w.addEl('item', w._.find('item'), null, true);
				assert(w.$.item.length);
			});
			it('sub el "item111" does not exist', function() {
				w.addEl('item111', w._.find('item111'), null, true);
				assert(!w.$.item111.length);
			});
			it('sub el 2 level if item is "subitem"', function() {
				assert(w.els.item._.find('subitem').length);
			});
		});
		describe('Add el with custom jQuery el', function() {
			w.addEl('custom', null, function() {
				this.$ = $('<div />', {
					class: 'customEl'
				});
				this.initDW();
			});
			// l(w.$.custom);
			l(w.els.custom);
			it('Class name of subel "custom" = "customEl"', function() {
				assert(w.$.custom.hasClass('customEl'));
			});
		});
	});
	describe('widget DEL', function() {
		it('widget context has not changed', function() {
			// l(w._);
		});
		describe('DEL mod', function() {
			it('widget has no mod "nomod"', function() {
				assert(!w._.mod.has('nomod'));
			});
			it('add mod "mod1"', function() {
				w._.mod.add('mod1');
				assert(w._.mod.has('mod1'));
			});
		});
	});
});