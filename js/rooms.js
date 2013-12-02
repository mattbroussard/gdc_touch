
var roomsScroller = null;

function roomsContentLoaded(data, textStatus, jqXHR) {

	if (data.error || data.length==0) return;
	$("#rooms_content > div .data_error").remove();
	
	for (var r in data) {
	
		var room = data[r];
		var div = $("<div>").addClass("room_item").appendTo("#rooms_content > div");
		
		$("<div>").addClass("room_num").text(room.room).appendTo(div);
		
		for (var e in room.events) {
			var event = room.events[e];
			var ev = $("<div>").addClass("room_event").appendTo(div);
			$("<div>").addClass("room_event_time").appendTo(ev).text(event.time);
			$("<div>").addClass("room_event_title").appendTo(ev).text(event.title);
		}
	
	}
	
	setTimeout(function() { roomsScroller.refresh(); }, 0);

}

$(function() {

	enableMenuButton("rooms");
	
	roomsScroller = new iScroll("rooms_content", { hScrollbar : false, vScrollbar : false, wheelAction : "none", onScrollEnd:function(e){track("rooms_scroll",e);} });
	$.getJSON(config_dataSources["rooms"], roomsContentLoaded);

});