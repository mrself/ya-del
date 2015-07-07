var w;

describe('Init', function() {
	var w = new $.DW($('.widget'), 'widget');

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
	});
});