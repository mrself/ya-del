/**
 * v 1.0.0
 */
var l = h.g.l;
(function($) {
	function DW() {

	}
	var Prototype = {
		initDW: function() {

		}
	};


	$.DW = function(Plugin) {
		$.extend(Plugin.prototype, Prototype);
		
	};
})(jQuery);
(function ($, document, window, undefined) {
	var pluginName = 'ddnav',
		defaults = {

		},
		makeClass = function(constructor, prototype) {
			constructor.prototype = prototype;
			return constructor;
		},
		classes = {
			dd: {
				single: makeClass(function($el) {
					this.$el = $el;
				}, {
					init: function() {

					},

					show: function() {
						this.$el.show();
					},

					hide: function() {
						this.$el.hide();
					}
				}),
				collection: makeClass(function(plugin) {
					this.$el = plugin.find(this._name);
					this.items = [];
				}, {
					_name: 'dd',
					addSingle: function(dd) {
						this.items.push(dd);
					}
				})
			},
			item: {
				single: makeClass(function(el, collection) {
					this.collection = collection;
					this.$el = $(el);
					this.init();
				}, $.extend({}, {
					dName: 'item',
					init: function() {
						this.initDel();
						this.initEvents();
					},

					addDD: function(dds) {
						this.dd = new classes.dd.single(this.$el.find(dds.$el));
						dds.addSingle(this.dd);
					},

					initEvents: function() {
						var that = this;
						this.$el.hover(function() {
							that.open();
						}, function() {
							that.close();
						});
					},

					open: function() {
						this.dd.show();
					},

					close: function() {
						this.dd.hide();
					}
				}, $.Del)),
				collection: makeClass(function(plugin) {
						this.plugin = plugin;
						this.selector = '.' + this._name;
						this.$el = plugin.find(this._name);
						this.init();

					}, {
						_name: 'item',
						init: function() {
							this.makeSingles();
							
						},
						makeSingles: function() {
							var that = this;
							this.items = {};
							this.$el.each(function(index, el) {
								var item = new classes.item.single(el, that);
								item.addDD(that.plugin.e.dd);
								that.items[index] = item;
							});
						},

						
					}
				),
			}
		};

	function Plugin(el, options) {
		this.el = el;
		this.$el = $(el);
		this.options = $.extend(true, {}, defaults, options);
		this.init();
	}

	Plugin.prototype = $.extend({
		dName: 'nav',
		init: function() {
			this.initDel();
			this.defineEls();
		},

		defineEls: function() {
			this.e = {};
			this.e.dd = new classes.dd.collection(this);
			this.e.item = new classes.item.collection(this);
		}
	}, $.Del);


	$.fn.ddnav1 = function(options) {
		return this.each(function(index, el) {
			if (!$.data(this, 'plugin__ddnav')) {
				$.data(this, 'plugin__ddnav', new Plugin(this, options));
			}
		});
	};
})(jQuery, document, window);
jQuery(document).ready(function($) {
	$('.nav').ddnav1();
});