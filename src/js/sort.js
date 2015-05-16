(function($){
	function Sort(el, options){
		this.el = $(el);

		this.defaults = {
			'sortItem' : '.sort__item',
			'startCallback' : function(){},
			'moveCallback'  : function(){},
			'stopCallback'  : function(){}
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
			var self = this;

			//console.log(el);

			self.defaults.startCallback();
		},
		_mouseMove: function(e, el){
			var self = this;

			//console.log(el);

			self.defaults.moveCallback();
		},
		_mouseUp: function(e, el){
			var self = this;

			//console.log(el);

			self.defaults.stopCallback();
		}
	});

	$.fn.sort = function(options){
		return this.each(function(){
			new Sort(this, options);
		});
	}
}(jQuery));