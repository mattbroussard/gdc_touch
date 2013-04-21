
var baseClockInterval = null;
var baseResetInterval = null;
var lastMouseEvent = -1;

var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var pageClasses = ["page_about", "page_directory", "page_rooms", "page_news_full", "page_map", "page_bwi"];

function baseClockUpdate() {
	
	var date = new Date();
	var hours = date.getHours()%12;
	if (hours==0) hours = 12;
	var minutes = date.getMinutes();
	if (minutes<10) minutes = "0"+minutes;
	var ampm = date.getHours()>=12 ? "PM" : "AM";
	
	var text = dayNames[date.getDay()]+", "+monthNames[date.getMonth()]+" "+date.getDate()+"<br/>"; //, "+date.getFullYear()+"<br/>";
	var shortText = hours+":"+minutes+" "+ampm;
	text += shortText;
	
	$("#cover_clock").html(text);
	$("#base_clock").html(text.replace("<br/>", " &bull; ")); //previously shortText

}

function reset() {

	for (var i in pageClasses) {
		$("body").removeClass(pageClasses[i]);
	}

	$("body")
		.removeClass("cover_anim")
		.removeClass("page1")
		.removeClass("page2")
		.addClass("page0");
	
	menuNewsScroller.scrollToPage(0,0,0);
	menuEventsScroller.scrollToPage(0,0,0);
	
	if ($("body").hasClass("handicap")) toggleHandicap();
	
	resetDirectory();

}

function baseBackButton() {

	if ($("body").hasClass("page1")) reset();
	else {
	
		if ($("body").hasClass("page_directory")) resetDirectory();
		
		$("body").addClass("page1").removeClass("page2");
		for (var i in pageClasses) {
			$("body").removeClass(pageClasses[i]);
		}
	
	}

}

function baseMouseReset() {

	var threshold = 2 * 60 * 1000; //2 minutes
	
	if (lastMouseEvent>0 && (new Date().getTime() - lastMouseEvent > threshold)) {
	
		lastMouseEvent = -1;
		reset();
	
	}

}

function baseMouseEvent() {

	lastMouseEvent = new Date().getTime();

}

function toggleHandicap() {

	$("body").toggleClass("handicap");
	if ($("body").hasClass("handcap")) resetDirectory();
	setTimeout(function() {
		menuNewsScroller.refresh();
		menuEventsScroller.refresh();
		directoryScroller.refresh();
		roomsScroller.refresh();
		aboutScroller.refresh();
		mapScroller.refresh();
		$("#news_full iframe")[0].contentWindow.fixScroll();
	}, 0);

}

$(function() {

	if (navigator.userAgent.toLowerCase().indexOf("webkit")<0) {
		$("<div>")
		  .attr("id", "unsupported")
		  .appendTo("body")
		  .click(function() {
		  	$(this).remove();
		  });
	}
	
	$("body").addClass("page0");
	
	$("#base_back_button").click(baseBackButton);
	
	$("#base_handicap_button, #base_handicap_disable_button").click(toggleHandicap);
	
	$(".base_toolbar_button").mousedown(function() {
		$(this).addClass("on");
	}).mouseup(function() {
		$(this).removeClass("on");
	}).mouseout(function() {
		$(this).removeClass("on");
	});
	
	$("body").mousedown(baseMouseEvent)
			 .mouseup(baseMouseEvent)
			 .mousemove(baseMouseEvent);
	
	baseResetInterval = setInterval(baseMouseReset, 10000);
	baseClockInterval = setInterval(baseClockUpdate, 1000);
	baseClockUpdate();
	
	//address an issue where pressing tab changes focus and messes up the layout
	$(document).keydown(function(e) {
		if (e.keyCode == 9) e.preventDefault();
	});
	
	//For debug purposes, allow page to be manually refreshed.
	$("#base_blackbar").click(function() {
		if ($("body").is(".handicap.page_about")) window.location.reload();
	});

});
