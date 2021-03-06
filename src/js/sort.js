(function($){
	function Sort(el, options){
		this.el = $(el);

		this.defaults = {
			'sortItem' : '.sort__item',
			'placeholderClass' : 'sort__placeholder',
			'classOnMoveItem' : '',
			'correction' : 0,
			'startCallback' : function(){},
			'moveCallback'  : function(){},
			'stopCallback'  : function(){}
		};

		this.cursorOffset = {
			'top'  : 0,
			'left' : 0
		};

		$.extend(this.defaults, options);

		this._init();
	}

	$.extend(Sort.prototype, {
		_init: function(){
			var self = this;

			self.el.on('mousedown.sort', self.defaults.sortItem, function(e){
				var $this = $(this);

				e.preventDefault();
				e.stopPropagation();

				self._mouseDown(e, $this);

				$(window).on('mousemove.sort',function(e){
					e.preventDefault();
					e.stopPropagation();

					self._mouseMove(e, $this);
				}).on('mouseup.sort',function(e){
					e.preventDefault();
					e.stopPropagation();

					$(this).off('.sort');

					self._mouseUp(e, $this);
				});
			});
		},
		_mouseDown: function(e, el){
			var self = this,
				placeholder = $('<div class="' + self.defaults.placeholderClass + '"></div>'),
				styles = {
					'width' : el.outerWidth() + 'px',
					'position' : 'absolute', 
					'z-index' : 1000,
					'top' : el.position().top + 'px',
					'left' : el.position().left + 'px'
				};

			el.after(placeholder).prependTo(document.body).css(styles).addClass(self.defaults.classOnMoveItem);

			self.cursorOffset = {
				'top'  : e.offsetY,
				'left' : e.offsetX
			};

			self.defaults.startCallback();
		},
		_mouseMove: function(e, el){
			var self = this,
				styles = {
					'left' : (e.pageX - self.cursorOffset.left) + 'px',
					'top'  : (e.pageY - self.cursorOffset.top) + 'px'
				};

			el.css(styles);

			self._changePosition(e, el);

			self.defaults.moveCallback();
		},
		_mouseUp: function(e, el){
			var self = this,
				placeholder = self.el.find('.' + self.defaults.placeholderClass),
				placeholderPosition = placeholder.position(),
				styles = {
					'top'  : placeholderPosition.top + 'px',
					'left' : placeholderPosition.left + 'px'
				};

			function restoreEl(){
				el.removeAttr('style').removeClass(self.defaults.classOnMoveItem)

				placeholder.after(el).remove();

				self.cursorOffset = {
					'top'  : 0,
					'left' : 0
				};

				self.defaults.stopCallback();
			}

			if (Sort.transition !== false){
				el.addClass('sort__item_animate');

				setTimeout(function(){
					el.css(styles);
				} ,0);

				el.one(Sort.transition, function(){
					el.removeClass('sort__item_animate');
					restoreEl();
				});
			} else {
				restoreEl();
			}
		},
		_changePosition: function(e, el){
			var self = this,
				position = el.position(),
				items = self.el.find(self.defaults.sortItem + ', .'+self.defaults.placeholderClass),
				itemsLength = items.length,
				positionChanged = false;

			for (var i = 0; i < itemsLength; i++){
				var item = $(items[i]),
					itemHeight = item.height(),
					itemWudth = item.width(),
					itemPosition = item.position();

				if ( ((position.left < itemPosition.left) && (position.left + itemWudth + self.correction > itemPosition.left)) &&
					((position.top > itemPosition.top) && (position.top < itemHeight + self.correction + itemPosition.top)) ){

					if (!item.hasClass(self.defaults.placeholderClass)){
						self._swap(self.el.find('.'+self.defaults.placeholderClass), item);
					}

					positionChanged = true;
					return;
				}
			}

			if (positionChanged === false){
				var nearElementSaved = null,
					nearElementDistanceSaved = 0;

				for (var j = 0; j < itemsLength; j++){
					var nearElement = $(items[j]),
						nearElementPosition = nearElement.position(),
						nearElementDistance = Math.sqrt(Math.pow(nearElementPosition.left - e.pageX, 2) + Math.pow(nearElementPosition.top - e.pageY, 2));

					if ((j == 0) || (nearElementDistanceSaved > nearElementDistance)){
						nearElementSaved = nearElement;
						nearElementDistanceSaved = nearElementDistance
					}
				}

				if (!nearElementSaved.hasClass(self.defaults.placeholderClass)) {
					self._swap(self.el.find('.'+self.defaults.placeholderClass), nearElementSaved);
				};

				positionChanged = true;
			}

		},
		_swap: function(el1, el2){
			var el1_0 = el1[0],
				el2_0 = el2[0],
				el1_c = el1_0.cloneNode(true),
				el2_c = el2_0.cloneNode(true),
				el1_0_position = el1.position(),
				el2_0_position = el2.position(),
				left = el2_0_position.left - el1_0_position.left,
				top  = el2_0_position.top - el1_0_position.top;

			el1_0.parentNode.replaceChild(el2_c, el1_0);
			el2_0.parentNode.replaceChild(el1_c, el2_0);
		}
	});

	$.extend(Sort, {
		transition : function(){
			var transition;

			if('ontransitionend' in window) {
			  // Firefox
			  transition = 'transitionend';
			} else if('onwebkittransitionend' in window) {
			  // Chrome/Saf (+ Mobile Saf)/Android
			  transition = 'webkitTransitionEnd';
			} else if('onotransitionend' in document.body || navigator.appName == 'Opera') {
			  // Opera
			  // As of Opera 10.61, there is no "onotransitionend" property added to DOM elements,
			  // so it will always use the navigator.appName fallback
			  transition = 'oTransitionEnd';
			} else {
			  // IE - not implemented (even in IE9) :(
			  transition = false;
			}

			Sort.transition = transition;
		}
	});

	$.fn.sort = function(options){
		if (typeof Sort.transition == 'function'){
			Sort.transition();
		}

		return this.each(function(){
			new Sort(this, options);
		});
	}
}(jQuery));