var defaults = {
	$elName: '$el',
	elSep: '__',
	modSep: '--',
	namespace: null
};

/**
 * @typedef {String} dName
 *
 * Element document name.
 * This name is used as an identifier for element.
 */

module.exports = {
	/**
	 * Init del module
	 * @param  {Object} options
	 * @param  {String} [options.dName]
	 * @param  {String} [options.namespace] Namespace
	 * @param  {jQuery|DOMElement} [options.$el]
	 */
	initDel: function(options) {
		this.DelOptions = $.extend({}, defaults, this.DelOptions, options);
		this.dName = this.DelOptions.dName || this._name;
		this.selector = this.selector || '.' + this.dName;
		this.namespace = this.DelOptions.namespace || this.dName;
		this.initEl();
	},

	/**
	 * Define $el
	 */
	initEl: function() {
		if (this.$el) return;
		if (this.DelOptions.$el) {
			if (this.DelOptions.$el instanceof $)
				this.$el = this.DelOptions.$el;
			else this.$el = $(this.DelOptions.$el);
		} else this.$el = $('.' + this.dName);
	},

	makeName: function(elName, modName) {
		var name = this.dName;
		if (elName) {
			if (!Array.isArray(elName)) elName = [elName];
			name += this.DelOptions.elSep + elName.join(this.DelOptions.elSep);
		}
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

	/**
	 * Find child element by a dName
	 * @param {String} dName dName
	 * @return {jQuery} Finded element
	 */
	find: function() {
		return this.$el.find(this.makeSelector.apply(this, arguments));
	},

	/**
	 * Find element in other el
	 * @param {jQuery|string|DOMElement} el el to find in
	 * @param {string|array} element name
	 * @return {jQuery}
	 */
	findIn: function(el) {
		return (el instanceof $ ? el : $(el)).find(this.makeSelector.apply(this, [].slice.call(arguments, 1)));
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
		return this.$el.hasClass(this.modName(name));
	},

	addMod: function(name) {
		return this.$el.addClass(this.modName(name));
	},

	filterByMod: function(name) {
		return this.$el.filter('.' + this.modName(name));
	},

	removeMod: function(name) {
		this.$el.removeClass(this.modName(name));
	},

	toggleMod: function(name, state) {
		var args = arguments;
		args[0] = this.modName(args[0]);
		$.fn.toggleClass.apply(this.$el, args);
	},

	eventName: function(name) {
		return name + '.' + this.namespace;
	},

	/**
	 * jquery like 'on'. Attach event to this.$el or with delegation.
	 * 
	 * @example
	 * obj.on('click', 'elName', handler)
	 * obj.on('click', handler)
	 * 
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	on: function(name) {
		var args = arguments;
		args[0] = this.eventName(name);
		$.fn.on.apply(this.$el, args);
	},

	/**
	 * Opposite to #on
	 */
	off: function(name) {
		this.$el.off(this.eventName(name));
	},
	trigger: function(name) {
		this.$el.trigger(this.eventName(name));
	},

	createEl: function(name, tagName) {
		return $('<' + (tagName || 'div') + ' />', {
			'class': this.makeName(name)
		});
	}
};