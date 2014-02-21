
var debugScroller = null;

function exitDebug() {

	reset();

}

function enterDebug() {

	track("debug");
	$("#debug").show();

}

function debugReload() {

	flushTracker();
	setTimeout(function() { window.location.reload(); }, 1000);

}

function debugLog(x, color) {

	var $time = $("<span>").addClass("debug_log_time").text(new Date().toLocaleString());
	var $clearfix = $("<br>").css("clear","both");

	$("<span>")
		.text(x)
		.addClass("debug_log_item")
		.css("color", color)
		.append($time)
		.append($clearfix)
		.appendTo("#debug_log > div");

	setTimeout(function() { debugScroller.refresh(); }, 0);

	if (x.toLowerCase().indexOf("ros connected") >= 0 || x.toLowerCase().indexOf("ros disconnected") >= 0) {

		var ok = x.toLowerCase().indexOf("ros connected") >= 0;

		$("#debug_ros_indicator")
			.removeClass("icon-ok-sign")
			.removeClass("icon-remove-sign")
			.addClass(ok ? "icon-ok-sign" : "icon-remove-sign")
			.css("color", ok ? "green" : "red");

	}

	if ($(".debug_log_item").length > 10000) {
		debugPurge();
	}

}

function debugPurge() {

	$("span.debug_log_item").remove();
	debugLogPageload();
	setTimeout(function() { debugScroller.refresh(); }, 0);

}

function debugPurgeTracker() {

	trackedEvents = [];
	if (window.localStorage) window.localStorage["trackerEvents"] = "[]";
	trackerFlushInflight = null;

}

function debugTrackerStatus() {

	log(trackedEvents.length + " events in queue, a flush is "+(trackerFlushInflight==null?"not ":"")+"in flight.", "cyan");

}

function debugLogPageload() {

	log("Page loaded at " + new Date(pageLoadTimestamp).toLocaleString(), "green");

}

function debugDemoStatus() {

	if (window.bwiSendMessage)
		bwiSendMessage("demo_status", null);

}

function noop() {}
var debugButtons = [
	{"title":"Exit Debug","callback":exitDebug},
	{"title":"Reload Page","callback":debugReload},
	{"title":"Connect ROS","callback":(rosConnect?rosConnect:noop)},
	{"title":"Disconnect ROS","callback":(rosDisconnect?rosDisconnect:noop)},
	{"title":"BWI Demo Status","callback":debugDemoStatus},
	{"title":"Tracker Status","callback":debugTrackerStatus},
	{"title":"Flush Tracker","callback":flushTracker},
	{"title":"Purge Tracker","callback":debugPurgeTracker},
	{"title":"Purge Debug","callback":debugPurge}
];

$(function() {
	
	for (var i in debugButtons) {
		$("<button>")
			.text(debugButtons[i]["title"])
			.click(debugButtons[i]["callback"])
			.appendTo("#debug_buttons");
	}

	debugScroller = new iScroll("debug_log", { hScrollbar : false, vScrollbar : false, wheelAction : "none" });

	setTimeout(debugLogPageload, 1000);

});