
var roomsScroller = null;
var roomsDivRoom = null;
var roomsDivTime = null;

function roomsDisplayByRoom(data, dom) {
	
	for (var r in data) {
	
		var room = data[r];
		var div = $("<div>").addClass("room_group").appendTo(dom);
		
		$("<div>").addClass("room_group_header").addClass("maps_link").text(room.room).appendTo(div);
		
		for (var e in room.events) {
			var event = room.events[e];
			var ev = $("<div>").addClass("room_item").appendTo(div);
			$("<div>").addClass("room_item_header").appendTo(ev).text(event.time);
			$("<div>").addClass("room_item_title").appendTo(ev).text(event.title);
		}
	
	}
	
	setTimeout(function() { roomsScroller.refresh(); }, 0);

}

function roomsTimeParse(time) {

	// special case for "All day"
	if (time.toLowerCase().indexOf("all day") >= 0) {
		return -1;
	}

	var hours = time.split(":")[0].trim()/1;
	if (time.toLowerCase().indexOf("pm")>=0 && hours < 12) hours += 12;
	var minutes = time.split(":")[1].substring(0,2)/1;
	return hours * 60 + minutes;

}

function roomsDisplayByTime(data, dom) {

	var times = {};

	for (var r in data) {

		for (var e in data[r].events) {

			var event = data[r].events[e];
			if (!(event.time in times)) times[event.time] = [];
			times[event.time].push({"room" : data[r].room, "title" : event.title});

		}

	}

	var groups = [];
	for (var t in times)
		groups.push({ "time" : t, "events" : times[t] });

	groups.sort(function(a,b) {
		return roomsTimeParse(a.time) - roomsTimeParse(b.time);
	});

	for (var g in groups) {

		var group = groups[g];
		var time = group.time;
		var events = group.events;

		var $group = $("<div>").addClass("room_group").attr("data-time", roomsTimeParse(group.time)).appendTo(dom);
		$("<div>").addClass("room_group_header").text(group.time).appendTo($group);

		for (var e in events) {
			var event = events[e];
			var $event = $("<div>").addClass("room_item").appendTo($group);
			$("<div>").addClass("room_item_header").addClass("maps_link").appendTo($event).text(event.room);
			$("<div>").addClass("room_item_title").appendTo($event).text(event.title);
		}

	}

	setTimeout(function() { roomsScroller.refresh(); }, 0);

}

function roomsSetDisplayMode(mode) {
	if (mode != "room" && mode != "time") mode = "time";
	
	var other = {"room":"time", "time":"room"};
	var divs = {"room":roomsDivRoom, "time":roomsDivTime};

	$(divs[other[mode]]).hide();
	$(divs[mode]).show();
	
	$("#rooms_toggle_"+mode).hide();
	$("#rooms_toggle_"+other[mode]).show();
	$("#rooms_toggle").show();

	setTimeout(function() { roomsScroller.refresh(); }, 0);
	track({"event":"rooms_filter","filter":mode});

}

function roomsToggleDisplayMode() {

	var current = $(roomsDivRoom).is(":visible") ? "room" : "time";
	var other = {"room":"time", "time":"room"};

	roomsSetDisplayMode(other[current]);

}

function roomsContentLoaded(data, textStatus, jqXHR) {

	if (data.error || data.length==0) return;
	$("#rooms_content > div .data_error").remove();
	
	suppressTracking("rooms", 2000);

	roomsDivRoom = $("<div>").appendTo("#rooms_content > div").hide();
	roomsDisplayByRoom(data, roomsDivRoom);
	roomsDivTime = $("<div>").appendTo("#rooms_content > div").hide();
	roomsDisplayByTime(data, roomsDivTime);

	roomsSetDisplayMode(config_roomsSortDefault);

	// if cover2 is in use, notify it that the rooms data has been loaded.
	cover2_roomsAvailable && cover2_roomsAvailable();

}

$(function() {

	enableMenuButton("rooms");
	
	$("#rooms_toggle button").click(roomsToggleDisplayMode);
	roomsScroller = new iScroll("rooms_content", { hScrollbar : false, vScrollbar : false, wheelAction : "none", onScrollEnd:function(e){track("rooms_scroll",e);} });
	$.getJSON(config_dataSources["rooms"], roomsContentLoaded);

});