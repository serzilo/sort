//= ../js/jquery.js
//= ../js/sort.js

$(function(){
	$('#sort-list').sort({
		'sortItem' : '.js-sort__item',
		'classOnMoveItem' : 'sort__item_move',
		'correction' : 20,
		'startCallback' : function(){console.log('start');},
		'moveCallback'  : function(){console.log('move');},
		'stopCallback'  : function(){console.log('stop');}
	});

	$('#sort-list2').sort({
		'sortItem' : '.js-sort__item',
		'classOnMoveItem' : 'sort__full-item_move',
		'placeholderClass' : 'sort__full-item_placeholder'
	});
});