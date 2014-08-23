
// The code here is super terrible.
// cover2 is a temporary cover screen displaying some extra information for the first week.
// As such, it's been hacked together very quickly, with the expectation it will be trashed in the near future.

var cover2_roomsDivRoom = null;
var cover2_roomsDivTime = null;
var cover2_mapCurLoc = "3N";
var cover2_roomsScroller = null;
var cover2_roomsCurrentUpdateInterval = null;

// called when the rooms module has rendered its content, so we can copy it.
function cover2_roomsAvailable() {

	suppressTracking("cover2_rooms", 1000);

	$("#cover_rooms > div > .data_error").remove();
	cover2_roomsDivRoom = $(roomsDivRoom).clone().appendTo("#cover_rooms > div");
	cover2_roomsDivTime = $(roomsDivTime).clone().appendTo("#cover_rooms > div");

	cover2_setRoomsView("current");
	$("#cover_rooms_switch").show();

}

function cover2_calcNow() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	return hours * 60 + minutes;
}

function cover2_setRoomsView(mode) {

	$("#cover_rooms_switch button").removeClass("on");
	$("#cover_rooms_switch_"+mode).addClass("on");

	var other = {"room":"time","time":"room","current":"room"};
	var divs = {"room":cover2_roomsDivRoom,"time":cover2_roomsDivTime,"current":cover2_roomsDivTime};

	$(divs[other[mode]]).hide();
	$(divs[mode]).show();

	if (mode != "current") {
		$(divs[mode]).find(".room_group").show();
		$("#cover_rooms_empty_warning").hide();
	} else {
		var now = cover2_calcNow();
		$(divs[mode]).find(".room_group").each(function() {
			var time = $(this).attr("data-time")/1;
			if (isNaN(time)) {
				// assume blocks without time data are all-day events
				time = -1;
			}

			var diff = now - time;
			// don't show events more than 60 minutes in the past or 35 minutes in the future
			if (diff > 60 || diff < -35) $(this).hide();
			else $(this).show();
			// special case "all day" events
			if (time < 0) $(this).show();
		});
		$("#cover_rooms_empty_warning").toggle($(divs[mode]).find(".room_group:visible").length == 0);
	}

	setTimeout(function() { cover2_roomsScroller.refresh(); }, 0);
	track({"event":"cover2_rooms_filter","filter":mode});

}

function cover2_exit(event) {

	menuSlideshowReset();
	
	track("cover2_open", event, new Date().getTime());
	track("cover_open", event, new Date().getTime());

	$("body")
		.removeClass("page0")
		.addClass("cover_anim")
		.addClass("page1");

}

function cover2_reset() {

	cover2_setRoomsView("current");
	cover2_resetMap();

}

function cover2_resetMap() {

	cover2_mapCurLoc = baseGetLocation();
	if (cover2_mapCurLoc == "0") cover2_mapCurLoc = "3N";
	$("#cover_map_switch_"+cover2_mapCurLoc.charAt(0)).addClass("on").click();

}

function cover2_mapClick() {

	$("#cover_map_switch button").removeClass("on");
	$(this).addClass("on");

	cover2_mapCurLoc = $(this).attr("id").replace("cover_map_switch_","");
	if (cover2_mapCurLoc == baseGetLocation().charAt(0))
		cover2_mapCurLoc += baseGetLocation().charAt(1);
	
	$("#cover_map img").hide();
	$("#cover2_map_image_"+cover2_mapCurLoc).show();

	track({"event":"cover2_map_choose_floor","floor":cover2_mapCurLoc});

}

$(function() {

	suppressTracking("cover2", 1000);

	$("#cover_exit").click(cover2_exit);
	$("#cover_map_switch button").click(cover2_mapClick);
	$("#cover_floor").text(baseGetFloorNumber());

	cover2_roomsScroller = new iScroll("cover_rooms", { hScrollbar : false, vScrollbar : false, wheelAction : "none" });

	var roomsModes = {"room":null, "time":null, "current":null};
	for (var mode in roomsModes) {
		$("#cover_rooms_switch_"+mode).click(cover2_setRoomsView.bind(null, mode));
	}

	//init map images
	for (var i in config_maps) {
		$("<img>")
			.attr("src", config_maps[i]["image"])
			.attr("id", "cover2_map_image_"+config_maps[i]["floor"])
			.appendTo("#cover_map > div")
			.hide();
	}

	cover2_resetMap();
	//rooms view will be set when data is available

	//make sure the current tab is always...current
	cover2_roomsCurrentUpdateInterval = setInterval(function() {
		if ($("#cover_rooms_switch_current").is(".on")) {
			cover2_setRoomsView("current");
		}
	}, 5 * 60 * 1000);

});