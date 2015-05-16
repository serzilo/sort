//= ../js/jquery.js
//= ../js/sort.js

$(function(){
	$('#sort-list').sort({
		'sortItem' : '.js-sort__item',
		'startCallback' : function(){console.log('start');},
		'moveCallback'  : function(){console.log('move');},
		'stopCallback'  : function(){console.log('stop');}
	});
});