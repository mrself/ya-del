(function($) {

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
			return this._smartArgs(function($el, args, context) {
				return $el.find(context.makeSelector.apply(context, args));
			}, arguments);
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
			return this._smartArgs(function($el, args, context) {
				return $el.hasClass(context.modName(args[0]));
			}, arguments);
		},
		_smartArgs: function(callback, args) {
			if (args[0] instanceof $)
				return callback(args[0], [].slice.call(args, 1), this);
			else
				return callback(this[this.DelOptions.$elName], args, this);
		},

		addMod: function(name) {
			this._smartArgs(function($el, args, context) {
				$el.addClass(context.modName(args[0]));
			}, arguments);
		},
		filterByMod: function(name) {
			return this._smartArgs(function($el, args, context) {
				return $el.filter('.' + context.modName(args[0]));
			}, arguments);
		},

		removeMod: function(name) {
			this._smartArgs(function($el, args, context) {
				$el.removeClass(context.modName(args[0]));
			}, arguments);
		},

		toggleMod: function(name, state) {
			this._smartArgs(function($el, args, context) {
				args[0] = context.modName(args[0]);
				$.fn.toggleClass.apply($el, args);
			}, arguments);
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
			this._smartArgs(function($el, args, context) {
				$.fn.on.apply($el, args);

			}, args);
		},

		off: function(name) {
			this._smartArgs(function($el, args, context) {
				$el.off(context.eventName(name));
			}, arguments);
		},
		trigger: function(name) {
			this._smartArgs(function($el, args, context) {
				$el.trigger(context.eventName(name));
			}, arguments);
		},

		createEl: function(name, tagName) {
			return $('<' + (tagName || 'div') + ' />', {
				'class': this.makeName(name)
			});
		}
	};
	module.exports = Prototype;

})(jQuery);

