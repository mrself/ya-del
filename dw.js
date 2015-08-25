/**
 * v 1.0.0
 */

/*
TODO: 
	add 'addSubEl' method to el
 */
(function($) {

	function subElConstructor() {

	}
	function Prototype() {
		var defaults = {
			inheritName: true
		},

		/**
		 * Constructor for subEl
		 * @param {string} name - name of subEl
		 * @param {jQuery|null} $el - jQuery el of subEl; default - find in DW $el by name
		 * @param {function} constructor - subEl constructor; has context is subEl; see property constructor
		 * @param {bool} inheritName If true name of the subel inherits from base DW name, if false - from parent subel
		 * @param {DW} self link to DW
		 */
		subElClass = function(name, $el, constructor, inheritName, self) {
			/**
			 * 
			 * @property {DM} DW - Link to DW instance
			 * @public
			 */
			this.dw = self;

			/**
			 * @property {string} name - name of the subEl
			 */
			this._name = name;

			/**
			 * @property {string} selectorName - name of selector; mix of DW name and subEl name
			 * @public
			 */
			this.subName = this.selectorName || this._name;

			inheritName = h.g.isUnf(inheritName) ? self.DWoptions.inheritName : inheritName;
			if (inheritName) {
				this.selectorName = self._.makeName(this.subName);
			} else {
				this.selectorName = this.subName;
			}
			
			

			/**
			 * @property {jQuery} $ - jQuery el of subEl
			 * @public
			 */
			this.$ = null;

			/**
			 * @property {DOM} $ - DOM el of subEl
			 * @public
			 */
			this.el = null;

			var isCustomEl = false;
			if ($el === null) {
				this.$ = null;
				isCustomEl = true;
			} else {
				this.$ = $el || self._.find(this.selectorName);
				this.el = this.$.get();
			}
			

			/**
			 * @property {function} constructor - arguments constructor; has context of its; containt all logic about subEl
			 * @public
			 */
			this.constructor = constructor || function() {};

			/**
			 * @property {DEl} _ - DEl instance of subEl
			 */
			this._ = null;

			this.__constuct(isCustomEl);
			
		};

		/**
		 * TODO:
		 * add reinit method (find el and new del inst)
		 */
		subElClass.prototype = h.g.makeInstance(function() {
			/**
			 * @property {subEl} subEl - link to itself subEl
			 * @private
			 */
			var subEl = this;

			/**
			 * Build in constructor for subEl; init DEl property
			 * 
			 * @method
			 * @public
			 */
			this.__constuct = function(isCustomEl) {
				subEl = this;
				var that = this;
				if (isCustomEl) {
					this.constructor.prototype.initDW = this.initDW;
				} else {
					this.initDW();
				}
				
				this.constructor();
				if (this.methods) {
					$.each(this.methods, function(index, val) {
						that[index] = new val();
					});
				}
			};

			this.initDW = function() {
				this._ = $.DEl();
				this._.initDEL(this, {nameJQuery: '$'});
			};

		});

		return {
			initDW: function($el, selectorName, options) {
				options = h.g.isUnf(options) ? {} : options;
				this.DWoptions = $.extend(true, {}, defaults, options);

				this.$el = $el;
				this.el = $el.get();
				this.els = {};
				this.$ = {};
				this.selectorName = selectorName || this._name;
				this.uid = 0;
				this._ = $.DEl();
				this._.initDEL(this);
			},

			addEl: function(name, $el, constructor, inheritName) {
				var el = new subElClass(name, $el, constructor, inheritName, this);
				this.$[name] = el.$;
				this.els[name] = el;
			},


			makeUid: function(name) {
				return this._name + '-' + uid + '-' + name;
			},

			addComponent: function(name, constructor) {
				constructor.prototype.self = this;
				this[name] = new constructor(self);
			}
		};
	}

	var prototype = new Prototype();
	$.DW = function(Plugin) {
		$.extend(Plugin.prototype, prototype);
		
	};
})(jQuery);