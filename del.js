/**
 * Module class must have properties: selector, dName, $el
 */

/*
For commit:
	add namespace option (for event name)
	make 'on' method similar to jquery one
	rename makeEventName to eventName
	add 'setName' method
	add 'trigger' method for event
	add 'filterByMod' method
	add state arg to toggleMod
	add 'toSelector' arg to modName
TODO:
 */
(function($) {
	/*function Constructor() {
		this.$el = $('.el');
		this.dName = 'el';
		this.selector = '.el';
		this._name = 'el';
	}
	function Constructor2() {
		this.$el = $('.module__el');
		this.dName = 'module__el';
		this.selector = '.module__el';
		this._name = 'el';
	}*/

	var defaults = {
		$elName: '$el',
		elSep: '__',
		modSep: '--',
		namespace: null
	};
	var Prototype = {
		initDel: function(options) {
			this.DelOptions = $.extend(true, {}, defaults, options);
			this.dName = this.dName || this._name;
			this.selector = this.selector || '.' + this.dName;
			this.namespace = this.DelOptions.namespace || this.dName;
		},

		makeName: function(elName, modName) {
			var name = this.dName;
			if (elName) name += this.DelOptions.elSep + elName;
			if (modName) name += this.DelOptions.modSep + modName;
			return name;
		},

		/**
		 * Add property $dName to el classes
		 */
		setName: function() {
			this.$el.addClass(this.dName);
		},

		makeSelector: function() {
			return '.' + this.makeName.apply(this, arguments);
		},

		find: function() {
			return this[this.DelOptions.$elName].find(this.makeSelector.apply(this, arguments));
		},

		findIn: function($elSelector) {
			return $($elSelector).find(this.makeSelector.apply(this, [].slice.call(arguments, 1)));
		},

		/**
		 * Make full el name by modifier
		 * @param  {string} name       modifier name
		 * @param  {bool} toSelector   to prepend selector mark on not
		 * @return {string}            full el name/selector
		 */
		modName: function(name, toSelector) {
			var selectorMark = toSelector ? '.' : '';
			return selectorMark + this.makeName('', name);
		},

		hasMod: function(name) {
			return this[this.DelOptions.$elName].hasClass(this.modName(name));
		},
		_smartArgs: function(callback, args) {
			if (args[0] instanceof $)
				callback(args[0], [].slice.call(args, 1), this);
			else
				callback(this[this.DelOptions.$elName], args, this);
		},

		addMod: function(name) {
			this._smartArgs(function($el, args, context) {
				$el.addClass(context.modName(args[0]));
			}, arguments);
		},
		filterByMod: function(name) {
			this[this.DelOptions.$elName].filter('.' + this.modName(name));
		},

		removeMod: function(name) {
			this[this.DelOptions.$elName].removeClass(this.modName(name));
		},

		toggleMod: function(name, state) {
			this[this.DelOptions.$elName].toggleClass(this.modName(name), state);
		},

		eventName: function(name) {
			return name + '.' + this.namespace;
		},

		/*deprecated*/
		makeEventName: function(name) {
			return name + '.' + this.dName;
		},

		on: function(name) {
			var args = arguments;
			args[0] = this.eventName(name);
			$.fn.on.apply(this[this.DelOptions.$elName], args);
		},

		off: function(name) {
			this[this.DelOptions.$elName].off(this.eventName(name));
		},
		trigger: function(name) {
			this[this.DelOptions.$elName].trigger(this.eventName(name));
		}
	};
	$.Del = Prototype;


})(jQuery);

