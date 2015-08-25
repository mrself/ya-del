/**
 * v 1.0.0
 */
(function($) {

	/**
	 * Adds functionality for DW. DW is an instanse of Class that has:
	 * 		 $el - jQuery el,
	 * 		 el - DOM el,
	 * 		 _name - name of the element or selectorName - an alternative for _name
	 * 		 
	*/
	
	var l = h.g.l;

	/**
	 * Prototype constructor for DEl
	 * @scope DW
	 */
	function Prototype() {
		var _defineEl = function(el) {
			if ( el instanceof $) {
				this.$el = el;
				this.el = el.get();
			} else {
				this.$el = $(el);
				this.el = el;
			}
		};
		
		return {

			/**
			 * Set up prototype for earch object. Must be called before using methods
			 * @public
			 * @return {undefined}
			 */
			initDEL: function(DW, params) {
				var options = {
					nameJQuery: '$el',
					elDevider: '__',
					modDevider: '--'
				};
				$.extend(options, params);
				this.parent = DW;
				this.$el = DW[options.nameJQuery];
				this.el = this.$el.get();
				this.DEVIDER = {
					DW: options.elDevider,
					MOD: options.modDevider
				};

				this.name = DW.selectorName || DW._name;
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
			 * Make class name or selector from mod name. Shortcut for self.makeName or makeSelector
			 * @param  {string} modName  Modifier name
			 * @param  {boolean} selector If true - make selector, else - make class name; default - false
			 * @return {string}
			 */
			makeMod: function(modName, selector) {

				if (!selector) {
					return this.makeName('', modName);
				}
				return this.makeSelector('', modName);
			},

			/**
			 * If the el has modifier "modName"
			 * @param  {string}  modName Modifier name to check
			 * @return {Boolean}
			 */
			hasMod: function(modName) {
				return this.$el.hasClass(this.makeMod(modName));
			},

			/**
			 * Remove modifier from el
			 * @param  {string} modName Modifier name to remove
			 * @return {jQuery}
			 */
			removeMod: function(modName) {
				return this.$el.removeClass(this.makeMod(modName));
			},

			/**
			 * Add modifier to all
			 * @param {string} modName Modiifier name to add
			 * @return {jQuery}
			 */
			addMod: function(modName) {
				return this.$el.addClass(this.makeMod(modName));
			},

			/**
			 * Toggle modifier
			 * @param {string} modName Modiifier name to toggle
			 * @return {jQuery} el
			 */
			toggleMod: function(modName) {
				return this.$el.toggleClass(this.makeMod(modName));
			},


			eventMakeName: function(name) {
				var result = '',
					self = this;
				name = name.split(' ');
				$.each(name, function(index, val) {
					result += name + '.' + self.name;
				});
				return result;
			},

			on: function(name, fn, params) {
				var args = arguments;
				args[0] = this.eventMakeName(args[0]);
				$.fn.on.apply(this.$el, args);
			},

			off: function(name) {
				this.$el.off(this.eventMakeName(name));
			},

			triggerEvent: function(name) {
				var args = arguments;
				args[0] = this.eventMakeName(args[0]);
				$.fn.trigger.apply(this.$el, args);
			}
		};
	}

	var prototype = new Prototype();
	$.DEl = function(DELvar) {
		DELvar = DELvar || function(){};
		$.extend(DELvar.prototype, prototype);
		return new DELvar();
	};


})(jQuery);

