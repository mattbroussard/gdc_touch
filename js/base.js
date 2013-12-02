
var baseClockInterval = null;
var baseResetInterval = null;
var lastMouseEvent = -1;
var pageLoadTimestamp = -1;

var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var pageClasses = ["page_about", "page_directory", "page_rooms", "page_news_full", "page_map", "page_bwi", "page_research"];

var currentUID = 0;
var trackedEvents = [];

function track(/* obj, event, uid */) {

	var obj = arguments[0];
	if (obj==null) return;
	if (typeof(obj)=="string") obj = {"event":obj};

	//We attempt to discern unique users.
	if (arguments.length>=3) {
		currentUID = arguments[2];
	}
	obj["uid"] = currentUID;

	//If a mouse event object is passed, include its x and y coordinates.
	if (arguments.length>=2 && arguments[1] != null) {
		var e = arguments[1];
		if (e.pageX) {
			obj["x"] = e.pageX;
			obj["y"] = e.pageY;
		} else if (e.x) {
			obj["x"] = e.x;
			obj["y"] = e.y;
		}
	}

	//Add a timestamp and location.
	obj["time"] = new Date().getTime();
	obj["loc"] = baseGetLocation();

	//For debugging, also print the event object to the console.
	if (console) console.log(obj);

	//Add the event to the list, prune it a bit if necessary, persist to localStorage if available, and flush the list if it's been awhile.
	trackedEvents.push(obj);
	if (trackedEvents.length > 1000) trackedEvents.splice(0, 100);
	if (window.localStorage) window.localStorage["trackedEvents"] = JSON.stringify(trackedEvents);
	if (trackedEvents.length > 15) flushTracker();

}

function flushTracker() {

	//currently this is unused. Eventually will push events list out to a server and clear it locally.

}

function baseGetLocation() {

	var loc = window.location.href.split("?location=");
	return loc.length >= 2 ? loc[1] : "0"; //NOTE: do not modify this line! Specify the location using a GET parameter such as ?location=3N

}

function baseGetFloorNumber() {

	return baseGetLocation().replace(/[^0-9\-]/g, "") / 1; //added a hyphen in the regex because Ryan wanted to see it say -1

}

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
	currentUID = 0;

}

function baseBackButton() {

	if ($("body").hasClass("page1")) {

		track("manual_reset");
		reset();

	} else if ($("body").hasClass("page3")) {
	
		$("body").addClass("page2").removeClass("page3");
		
	} else {
	
		if ($("body").hasClass("page_directory")) resetDirectory();
		
		$("body").addClass("page1").removeClass("page2");
		for (var i in pageClasses) {
			$("body").removeClass(pageClasses[i]);
		}

		track("menu_return");
	
	}

}

function baseMouseReset() {

	var mouseThreshold = 2 * 60 * 1000; //2 minutes
	var reloadThreshold = 12 * 60 * 60 * 1000; //12 hours

	//If we haven't reloaded the page in >12 hours, and a user has not recently interacted, reload.
	if (pageLoadTimestamp>0 && (new Date().getTime() - pageLoadTimestamp > reloadThreshold) && lastMouseEvent<=0) {
		
		pageLoadTimestamp = -1;
		flushTracker();
		setTimeout(function() { window.location.reload() }, 2000);
		return;

	}

	//If a user has recently interacted, but not in the last 2 minutes, reset to the cover screen.
	if (lastMouseEvent>0 && (new Date().getTime() - lastMouseEvent > mouseThreshold)) {
	
		lastMouseEvent = -1;
		track("timeout_reset");
		reset();
	
	}

}

function baseMouseEvent() {

	lastMouseEvent = new Date().getTime();

}

function baseRefreshScrollers() {

	setTimeout(function() {
	
		var scrollers = [
			"menuNewsScroller",
			"menuEventsScroller",
			"directoryScroller",
			"roomsScroller",
			"aboutScroller",
			"mapScroller",
			"researchMenuScroller"
		];
		
		for (var i in scrollers) {
			if (window[scrollers[i]] && window[scrollers[i]].refresh) {
				window[scrollers[i]].refresh();
			}
		}
		
		var cw = $("#news_full iframe")[0].contentWindow;
		if (cw.fixScroll) cw.fixScroll();
	
	}, 0);

}

function toggleHandicap() {

	$("body").toggleClass("handicap");
	if ($("body").hasClass("handicap")) {
		resetDirectory();
		track("handicap");
	} else {
		track("unhandicap");
	}
	baseRefreshScrollers();

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

	pageLoadTimestamp = new Date().getTime();

	if (window.localStorage)
		if (window.localStorage["trackedEvents"])
			trackedEvents = JSON.parse(window.localStorage["trackedEvents"]);

});
