(function($) {

	function DW (el, name, selectorName) {
		this.el = null;
		this.$el = null;
		this.els = {};
		this.$ = {};
		this._name = name;
		this.selectorName = selectorName || name;
		this.uid = 0;
		this.__constuct(el);
	}


	function Prototype() {
		var self,

		_defineEl = function(el) {
			if ( el instanceof $) {
				this.$el = el;
				this.el = el.get();
			} else {
				this.$el = $(el);
				this.el = el;
			}
		};


		return {
			__constuct: function(el) {
				self = this;
				_defineEl.call(self, el);
				self._ = new $.DEl();
				self._.__init(self);
				self.subEl.Class = h.g.makeClass(this.subEl.Constructor, this.subEl.Prototype);
			},

			subEl: {
				/**
				 * Constructor for subEl
				 * @param {string} name - name of subEl
				 * @param {jQuery|null} $el - jQuery el of subEl; default - find in DW $el by name
				 * @param {function} constructor - subEl constructor; has context is subEl; see property constructor
				 */
				Constructor: function(name, $el, constructor, inheritName) {
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

					if (inheritName) {
						this.selectorName = self._.makeName(this.subName);
					} else {
						this.selectorName = this.subName;
					}
					
					

					/**
					 * @property {jQuery} $ - jQuery el of subEl
					 * @public
					 */
					this.$ = $el || self._.find(this.selectorName);

					/**
					 * @property {DOM} $ - DOM el of subEl
					 * @public
					 */
					this.el = this.$.get();

					/**
					 * @property {function} constructor - arguments constructor; has context of its; containt all logic about subEl
					 * @public
					 */
					this.constructor = constructor || function() {};

					/**
					 * @property {DEl} _ - DEl instance of subEl
					 */
					this._ = null;

					this.__constuct();
				},
				Prototype: function() {
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
					this.__constuct = function() {
						subEl = this;
						this._ = new $.DEl();
						this._.__init(this, {nameJQuery: '$', nameDom: 'el'});
						this.constructor();
					};

					this.baseName = function() {

					};
				}
			},

			addEl: function(name, $el, constructor, inheritName) {
				var el = new self.subEl.Class(name, $el, constructor, inheritName);
				self.$[name] = el.$;
				self.els[name] = el;
			},


			makeUid: function(name) {
				return this._name + '-' + uid + '-' + name;
			}
		};
	}

	h.g.makeClass(DW, Prototype);
	$.DW = DW;
})(jQuery);