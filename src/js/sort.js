(function($){
	function Sort(el, options){
		this.el = $(el);

		this.defaults = {
			'sortItem' : '.sort__item',
			'placeholderClass' : 'sort__placeholder',
			'startCallback' : function(){},
			'moveCallback'  : function(){},
			'stopCallback'  : function(){}
		};

		this.cursorOffset = {
			'top'  : 0,
			'left' : 0
		};

		$.extend(this.defaults, options);

		console.dir(this);

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
					'position' : 'absolute', 
					'z-index' : 1000,
					'top' : el.position().top + 'px',
					'left' : el.position().left + 'px'
				};

			el.after(placeholder).prependTo(document.body).css(styles);

			// console.log(e);

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

			el.animate(styles, 200, 'linear', function(){
				el.removeAttr('style');

				placeholder.after(el).remove();

				self.cursorOffset = {
					'top'  : 0,
					'left' : 0
				};

				self.defaults.stopCallback();
			});

		},
		_changePosition: function(e, el){
			var self = this,
				position = el.position(),
				items = this.el.find(self.defaults.sortItem),
				itemsLength = items.length;

			for (var i = 0; i < itemsLength; i++){
				var item = $(items[i]),
					itemHeight = item.height(),
					itemWudth = item.width(),
					itemPosition = item.position();

				if ( ((position.left < itemPosition.left) && (position.left + itemWudth > itemPosition.left)) &&
					((position.top > itemPosition.top) && (position.top < itemHeight + itemPosition.top)) ){
					self._swap(self.el.find('.'+self.defaults.placeholderClass), item);
					return;
				}
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

			// console.log(el1_0_position);
			// console.log(el2_0_position);

			el1_0.parentNode.replaceChild(el2_c, el1_0);
			el2_0.parentNode.replaceChild(el1_c, el2_0);

			/*
			$(el2_c).css('transform', 'translate(' + left + 'px, ' + top + 'px)')
					.animate({'transform' : 'translate(0px, 0px)'}, 200, 'linear', function(){

					});
			*/
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
		Sort.transition();

		return this.each(function(){
			new Sort(this, options);
		});
	}
}(jQuery));