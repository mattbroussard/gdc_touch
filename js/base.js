
var baseClockInterval = null;
var baseResetInterval = null;
var lastMouseEvent = -1;
var pageLoadTimestamp = -1;

var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var pageClasses = ["page_about", "page_directory", "page_rooms", "page_news_full", "page_map", "page_bwi", "page_research"];

var currentUID = 0;
var trackedEvents = [];
var trackerSuppress = [];
var trackerSuppressTimeout = null;
var trackerFlushInflight = null;

function log(/* x, color */) {

	var x = arguments[0];
	var c = arguments.length>1?arguments[1]:"white";
	if (window.console) console.log(x);
	if (typeof(x)=="object") x = JSON.stringify(x);
	if (window.debugLog) debugLog(x, c);

}

//avoid UI performance problems related to track() taking awhile
function track(/* obj, event, uid */) {
	var that = this;
	var args = arguments;
	setTimeout(function() { doTrack.apply(that, args); }, 0);
}

function doTrack(/* obj, event, uid */) {

	var obj = arguments[0];
	if (obj==null) return;
	if (typeof(obj)=="string") obj = {"event":obj};

	//There are cases where we want to suppress tracking events momentarily
	for (var i = 0; i < trackerSuppress.length; i++)
		if (obj["event"].indexOf(trackerSuppress[i]["event"]) >= 0)
			return;

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

	//Since this will be stored in a SQL database with inflexible schema on the server, we need to normalize extra properties
	var allowed = ["event", "uid", "time", "loc", "x", "y", "meta"];
	outer: for (var i in obj) {
		for (var j in allowed)
			if (allowed[j]==i) continue outer;
		obj["meta"] = obj[i];
		delete obj[i];
	}

	//For debugging, also print the event object to the console.
	log(obj);

	//Add the event to the list, prune it a bit if necessary, persist to localStorage if available, and flush the list if it's been awhile.
	trackedEvents.push(obj);
	if (trackedEvents.length > config_trackerDropQuota) trackedEvents.splice(0, Math.round(config_trackerDropQuota / 10));
	if (window.localStorage) window.localStorage["trackedEvents"] = JSON.stringify(trackedEvents);
	if (trackedEvents.length >= config_trackerFlushQuota) flushTracker();

}

function flushTracker() {

	//If the BWI module is included, and we are connected, send events there instead.
	if (window.bwiConnected && bwiConnected()) {

		bwiSendMessage("tracker", trackedEvents);
		trackedEvents = [];
		if (window.localStorage) window.localStorage["trackerEvents"] = "[]";
		return;

	}

	if (trackerFlushInflight != null || config_trackerEndpoint == null) return;
	trackerFlushInflight = trackedEvents;
	trackedEvents = [];
	if (window.localStorage) window.localStorage["trackerEvents"] = "[]";

	log("trackerFlush sending " + trackerFlushInflight.length + " events to endpoint " + config_trackerEndpoint, "cyan");

	var ret = function(data) {
		if (data=="Success") {
			trackerFlushInflight = null;
			log("trackerFlush XHR success", "green");
		} else {
			trackedEvents = trackerFlushInflight;
			if (window.localStorage) window.localStorage["trackedEvents"] = JSON.stringify(trackedEvents);
			trackerFlushInflight = null;
			log("trackerFlush XHR failure", "red");
		}
	};

	$.ajax({
		success:ret,
		error:ret,
		data:JSON.stringify(trackerFlushInflight),
		url:config_trackerEndpoint,
		type:"POST"
	});

}

function cleanupTrackerSuppress() {

	var now = new Date().getTime();
	for (var i = trackerSuppress.length-1; i >= 0; i--) {
		if (trackerSuppress[i]["expiry"] < now) {
			trackerSuppress.splice(i,1);
		}
	}

	if (trackerSuppress.length != 0)
		trackerSuppressTimeout = setTimeout(cleanupTrackerSuppress, 1000);

}

function suppressTracking(event, time) {

	trackerSuppress.push({"event":event,"expiry":(new Date().getTime() + time)});

	clearTimeout(trackerSuppressTimeout);
	trackerSuppressTimeout = setTimeout(cleanupTrackerSuppress, 1000);

}

function baseGetLocation() {

	//NOTE: do not modify this function! Specify the location using a GET parameter such as ?location=3N

	var l1 = window.location.href.indexOf("location=");
	var l2 = window.location.href.indexOf("&", l1);
	if (l1 < 0) return "0";
	if (l2 < 0) return window.location.href.substring(l1 + 9);
	return window.location.href.substring(l1 + 9, l2);

}

function baseGetFloorNumber() {

	return baseGetLocation().replace(/[^0-9\-]/g, "") / 1; //added a hyphen in the regex because Ryan wanted to see it say -1

}

/* function fakeDate() { //generate random fake dates for testing the design of the clock

	var d = new Date();
	d.setHours(Math.round(Math.random()*23));
	d.setMinutes(Math.round(Math.random()*59));
	return d;

} */

function baseClockUpdate() {
	
	var date = new Date();
	var hours = date.getHours()%12;
	if (hours==0) hours = 12;
	var minutes = date.getMinutes();
	if (minutes<10) minutes = "0"+minutes;
	var ampm = date.getHours()>=12 ? "PM" : "AM";
	
	var text = dayNames[date.getDay()]+", "+monthNames[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
	var shortText = hours+":"+minutes+" "+ampm;
	//text += "<br/>" + shortText;
	
	$("#base_blackbar_clock").html(shortText);
	$("#base_clock").html(text/*.replace("<br/>", " &bull; ")*/);

}

function reset() {

	lastMouseEvent = -1;
	suppressTracking("scroll", 3000);
	suppressTracking("handicap", 3000);

	for (var i in pageClasses) {
		$("body").removeClass(pageClasses[i]);
	}

	$("body")
		.removeClass("cover_anim")
		.removeClass("page1")
		.removeClass("page2")
		.addClass("page0");

	$("#debug").hide();
	
	menuNewsScroller.scrollToPage(0,0,0);
	menuEventsScroller.scrollToPage(0,0,0);
	aboutScroller.scrollToPage(0,0,0);
	roomsScroller.scrollToPage(0,0,0);

	var cw = $("#news_full iframe")[0].contentWindow;
	if (cw.resetScroll) cw.resetScroll();
	
	if ($("body").hasClass("handicap")) toggleHandicap();
	
	resetDirectory();
	resetMap();

}

function baseBackButton() {

	if ($("body").hasClass("page1")) {

		track("manual_reset");
		reset();

	} else if ($("body").hasClass("page3")) {
	
		$("body").addClass("page2").removeClass("page3");
		
	} else {
	
		if ($("body").hasClass("page_directory")) {
			suppressTracking("scroll", 2000);
			resetDirectory();
		}
		
		$("body").addClass("page1").removeClass("page2");
		for (var i in pageClasses) {
			$("body").removeClass(pageClasses[i]);
		}

		track("menu_return");
	
	}

}

function baseMouseReset() {

	//If we haven't reloaded the page in >12 hours, and a user has not recently interacted, reload.
	if (pageLoadTimestamp>0 && (new Date().getTime() - pageLoadTimestamp > config_reloadThreshold) && lastMouseEvent<=0) {
		
		pageLoadTimestamp = -1;
		flushTracker();
		setTimeout(function() { window.location.reload() }, 2000);
		return;

	}

	//If a user has recently interacted, but not in the last 2 minutes, reset to the cover screen.
	if (lastMouseEvent>0 && (new Date().getTime() - lastMouseEvent > config_mouseThreshold)) {
	
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
			"researchMenuScroller",
			"bwiScroller"
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

	suppressTracking("scroll", 2000);

	$("body").toggleClass("handicap");
	if ($("body").hasClass("handicap")) {
		resetDirectory();
		track("handicap");
	} else {
		track("unhandicap");
	}
	baseRefreshScrollers();

}

function baseDisableAnimations() {
	$("body").addClass("noanim");
	$("body")[0].offsetHeight; //hack: trigger CSS reflow, see http://stackoverflow.com/questions/11131875
}

function baseEnableAnimations() {
	$("body").removeClass("noanim");
	$("body")[0].offsetHeight; //hack: trigger CSS reflow, see http://stackoverflow.com/questions/11131875
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
	
	//Allow access to a hidden debug page, which shows logging information and allows manual page reloads.
	$("#base_blackbar").click(function() {
		if ($("body").is(".handicap.page_about") && !$("#debug").is(":visible")) {
			if (window.enterDebug) enterDebug();
			else { //old behavior before debug page was to just reload the page.
				flushTracker();
				setTimeout(function() { window.location.reload(); }, 1000);
			}
		}
	});
	if (window.location.href.indexOf("debug=true")>=0 && window.enterDebug) {
		enterDebug();
		clearInterval(baseResetInterval);
	}

	pageLoadTimestamp = new Date().getTime();

	if (window.localStorage)
		if (window.localStorage["trackedEvents"])
			trackedEvents = JSON.parse(window.localStorage["trackedEvents"]);

});
