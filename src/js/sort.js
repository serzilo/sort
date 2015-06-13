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
		}
	});

	$.fn.sort = function(options){
		return this.each(function(){
			new Sort(this, options);
		});
	}
}(jQuery));