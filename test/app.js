(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$.Del = require('./del.js');
},{"./del.js":2}],2:[function(require,module,exports){
var defaults = {
	$elName: '$el',
	elSep: '__',
	modSep: '--',
	namespace: null
};

if (typeof $ == 'undefined') {
	if (typeof jQuery == 'undefined') {
		throw new Error('ya-del: jQuery is not defined');
	} else $ = jQuery;
}

module.exports = {
	initDel: function(options) {
		this.DelOptions = $.extend(true, {}, defaults, options);
		this.dName = this.dName || this._name;
		this.selector = this.selector || '.' + this.dName;
		this.namespace = this.DelOptions.namespace || this.dName;
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

	/**
	 * Filter function that defines first argument for methods.
	 * @param  {Function} callback callback
	 * @param  {arguments}   args  Arguments of first method
	 * @return {n/a}
	 */
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
		this._smartArgs(function($el, args, context) {
			$.fn.on.apply($el, args);
		}, args);
	},

	/**
	 * Opposite to #on
	 */
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
},{}]},{},[1]);
