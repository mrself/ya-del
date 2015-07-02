
(function($) {

	/**
	 * Adds functionality for DW. DW is an instanse of Class that has:
	 * 		 $el - jQuery el,
	 * 		 el - DOM el,
	 * 		 _name - name of the element or selectorName - an alternative for _name
	 * 		 
	 * @constructor
	 * @param {DW} DW Instance
	 * @param {object} params - Options
  		@param {string} params.nameDom - DW property name of DOM el; default - 'el;
  		@param {string} params.nameJQuery - DW property name of jQuery el; default - '$el'
		@param {string} params.elSeparator Separator between elements, used when making selector; default - '__'
		@param {string} params.modSeparator Separator between element and modificator, used when making selector; default - '--'

	 * @example
	 * var el = new DEl(DW);
	 */
	function DEl(DW, params) {

	}

	/**
	 * Prototype constructor for DEl
	 * @scope DW
	 */
	function Prototype() {
		/**
		 * @private
		 * @property {DEl} self DEl instance
		 */
		var self;

		return {

			/**
			 * Set up prototype for earch object. Must be called before using methods
			 * @public
			 * @return {undefined}
			 */
			__init: function(DW, params) {
				var options = {
					nameDom: 'el',
					nameJQuery: '$el',
					elDevider: '__',
					modDevider: '--'
				};
				$.extend(options, params);
				
				this.parent = DW;
				this.el = DW[options.nameDom];
				this.$el = DW[options.nameJQuery];
				this.DEVIDER = {
					DW: options.elDevider,
					MOD: options.modDevider
				};

				this.name = DW.selectorName || DW._name;

				self = this;
			},

			/**
			 * Methods for sub elements
			 * When using term "el" in this context it means sub element
			 */
			
			/**
			 * Make name to use in making selector for DOM el
			 * 
			 * @public
			 * @method makeName
			 * @param  {string} el  Name of sub element
			 * @param  {string} mod Name of modificator
			 * @return {string}     Name
			 */
			makeName: function(el, mod, baseName) {
				var name = baseName || this.name;
				if (el && el.length) {
					if ($.isArray(el)) {
						el = el.join(this.DEVIDER.DW);
					}
					name += this.DEVIDER.DW + el;
				}

				if (mod && mod.length) {
					if ($.isArray(mod)) {
						mod = mod.join(this.DEVIDER.MOD);
					}
					name += this.DEVIDER.MOD + mod;
				}
				return name;
			},

			/**
			 * Make selector for DOM el
			 * 
			 * @public
			 * @method makeSelector
			 * @param  {string}  el      Name of sub el
			 * @param  {string}  mod     Name of modificator
			 * @param  {Boolean} isClass It is class or id selector
			 * @return {string}          DOM el selector
			 */
			makeSelector: function(el, mod, isClass) {
				isClass = isClass || true;
				var start = '.';
				if (!isClass) start = '#';
				return start + this.makeName(el, mod);
			},

			/**
			 * Find sub el in parent $el using makeSelector
			 *
			 * @public
			 * @method find
			 * @return {jQuery}
			 */
			find: function() {
				return this.$el.find(this.makeSelector.apply(this, arguments));
			},

			/**
			 * Find el in $el using parent selector
			 * 
			 * @public
			 * @method findIn
			 * @param  {jQuery} $el El to find in
			 * @return {jQuery}   
			 */
			findIn: function($el) {
				return $el.find(this.makeSelector.apply(this, [].slice.call(arguments, 1)));
			},

			/**
			 * Actions with modifier
			 * 
			 * @submodule mod
			 */
			mod: h.g.makeInstance(function() {
				/**
				 * Link to itself (mod)
				 *
				 * @private
				 * @type {object mod}
				 */
				var mod = this,

				/**
				 * Make class name or selector from mod name. Shortcut for self.makeName or makeSelector
				 * @param  {string} modName  Modifier name
				 * @param  {boolean} selector If true - make selector, else - make class name; default - false
				 * @return {string}
				 */
				make = function(modName, selector) {
					if (!selector) {
						return self.makeName('', modName);
					}
					return self.makeSelector('', modName);
				};

				return {
					/**
					 * If the el has modifier "modName"
					 * @param  {string}  modName Modifier name to check
					 * @return {Boolean}
					 */
					has: function(modName) {
						return self.$el.hasClass(make(modName));
					},

					/**
					 * Remove modifier from el
					 * @param  {string} modName Modifier name to remove
					 * @return {jQuery}
					 */
					remove: function(modName) {
						return self.$el.removeClass(make(modName));
					},

					/**
					 * Add modifier to all
					 * @param {string} modName Modiifier name to add
					 * @return {jQuery}
					 */
					add: function(modName) {
						return self.$el.addClass(make(modName));
					}
				};
			}),

			event: h.g.makeInstance(function() {
				this.makeName = function(name) {
					var result = '';
					name = name.split(' ');
					$.each(name, function(index, val) {
						result += name + '.' + self.name;
					});
					return result;
				};

				this.on = function(name, fn, params) {
					var args = arguments;
					args[0] = this.makeName(args[0]);
					$.fn.on.apply(self.$el, args);
				};

				this.off = function(name) {
					self.$el.off(this.makeName(name));
				};

				this.trigger = function(name) {
					var args = arguments;
					args[0] = this.makeName(args[0]);
					$.fn.trigger.apply(self.$el, args);
				};
			})
		};
	}

	h.g.makeClass(DEl, Prototype);
	$.DEl = DEl;


})(jQuery);

