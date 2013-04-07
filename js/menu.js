
var menuSlideshowScroller = null;
var menuSlideshowScrollerInterval = null;
var menuSlideshowLastScroll = -1;
var menuNewsScroller = null;
var menuEventsScroller = null;

function scrollSafeClick(el, handler) {

	var oldTransform = null;
	
	$(el).mousedown(function() {
	
		oldTransform = $("#menu_news_content > div").css("-webkit-transform");
	
	}).mouseup(function() {
	
		var newTransform = $("#menu_news_content > div").css("-webkit-transform");
		if (oldTransform == newTransform) handler.call(el);
	
	});

}

function launchNewsFull() {

	if (menuNewsScroller.animating || menuNewsScroller.moved) return;
	
	$("#news_full iframe")[0].contentWindow.load($(this).attr("data-source"));
	
	$("body")
		.addClass("page2")
		.removeClass("page1")
		.addClass("page_news_full");

}

function menuNewsLoaded(data, textStatus, jqXHR) {

	if (data.error) return;
	$("#menu_news_content > div .data_error").remove();
	
	for (var i = 0; i < data.length; i++) {
		
		var div = $("<div>").addClass("menu_news_item").attr("data-source", data[i].link);
		scrollSafeClick(div, launchNewsFull);
		var h2 = $("<h2>").addClass("menu_news_headline").html(data[i].title).appendTo(div);
		var blurb = $("<p>").addClass("menu_news_story").html(data[i].description).appendTo(div);
		$("#menu_news_content > div").append(div);
	
	}
	
	setTimeout(function() { menuNewsScroller.refresh(); }, 0);

}

function fuzzyTime(time) {

	var d = new Date(time/1);
	var now = new Date();
	var tomorrow = new Date(now.getTime() + 24*60*60*1000);
	
	var hours = d.getHours() % 12;
	if (hours==0) hours = 12;
	var minutes = d.getMinutes();
	if (minutes<10) minutes = "0" + minutes;
	var ampm = d.getHours() >= 12 ? "pm" : "am";
	var time = (hours + ":" + minutes + ampm).replace(":00", "");
	if (time=="12am") time = "All Day";
	
	var offset = d.getTime() - now.getTime();
	var date = "";
	
	if (offset > 6*24*60*60*1000) {
		date = monthNames[d.getMonth()] + " " + d.getDate();
	} else if (d.getDate()==now.getDate()) {
		date = "Today";
	} else if (d.getDate()==tomorrow.getDate()) {
		date = "Tomorrow";
	} else {
		date = dayNames[d.getDay()];
	}
	
	return date + ", " + time;

}

function menuEventsLoaded(data, textStatus, jqXHR) {

	if (data.error) return;
	$("#menu_events_content > div .data_error").remove();
	
	for (var i = 0; i < data.length; i++) {
		
		var div = $("<div>").addClass("menu_events_item").attr("data-source", data[i].link);
		var time = $("<span>").addClass("menu_events_time").html(fuzzyTime(data[i].time)).appendTo(div);
		var title = $("<span>").addClass("menu_events_title").html(data[i].title).appendTo(div);
		var loc = $("<span>").addClass("menu_events_location").html(data[i].location).appendTo(div);
		
		//baby's first regex
		if (data[i].location.match(/GDC [1-7]\.[0-9]{3}[A-Z]{1}?/)!=null) {
			loc.addClass("maps_link");
		}
		
		$("#menu_events_content > div").append(div);
	
	}
	
	setTimeout(function() { menuEventsScroller.refresh(); }, 0);

}

function menuLoadContent() {

	$.getJSON("php/news.php", menuNewsLoaded);
	$.getJSON("php/events.php", menuEventsLoaded);

}

function menuPushSlideshow() {

	if (menuSlideshowLastScroll>0 && (new Date().getTime()-menuSlideshowLastScroll)<3000) return;
	
	menuSlideshowScroller.scrollToPage(menuSlideshowScroller.currPageX+1, 0, 400);

}

$(function() {
	
	$(".menu_button").mousedown(function() {
		$(this).addClass("on");
	}).mouseup(function() {
		$(this).removeClass("on");
	}).mouseout(function() {
		$(this).removeClass("on");
	});
	
	$("#menu_news_slideshow div img:last").clone().prependTo("#menu_news_slideshow div");
	$("#menu_news_slideshow div img:nth-child(2)").clone().appendTo("#menu_news_slideshow div");
	var menuSlideshowScrollerN = $("#menu_news_slideshow div img").length;
	$("#menu_news_slideshow div").css("width", (600*menuSlideshowScrollerN)+"px");
	menuSlideshowScroller = new iScroll("menu_news_slideshow", {
															 hScrollbar: false,
															 vScrollbar: false,
															 snap: true,
															 momentum: false,
															 wheelAction: "none",
															 onScrollEnd: function() {
															 	if (this.currPageX==0) {
															 		this.scrollToPage(menuSlideshowScrollerN-2, 0, 0);
															 	} else if (this.currPageX==menuSlideshowScrollerN-1) {
															 		this.scrollToPage(1, 0, 0);
															 	} else {
															 		$("#menu_news_slideshow span i.icon-circle").remove().insertAfter("#menu_news_slideshow span i:nth-child("+this.currPageX+")");
															 		menuSlideshowLastScroll = new Date().getTime();
															 	}
															 }
														   });
	menuSlideshowScroller.scrollToPage(1, 0, 0);
	menuSlideshowScrollerInterval = setInterval(menuPushSlideshow, 5000);
	
	$("<i>").css("display", "none").appendTo("#menu_news_slideshow span");
	for (var i = 0; i < menuSlideshowScrollerN-2; i++) {
		$("<i>").addClass(i==0?"icon-circle":"icon-circle-blank").appendTo("#menu_news_slideshow span");
	}
	
	menuNewsScroller = new iScroll("menu_news_content", { hScrollbar : false, vScrollbar : false, wheelAction : "none" });
	menuEventsScroller = new iScroll("menu_events_content", { hScrollbar : false, vScrollbar : false, wheelAction : "none" });
	
	menuLoadContent();
	
	$(".menu_button").click(function() {
		var name = $(this).attr("id").split("_")[1];
		$("body")
			.addClass("page2")
			.removeClass("page1")
			.addClass("page_"+name);
	});
	
});