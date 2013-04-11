
var mapCurFloor = 3;
var mapCurWing = "ne";

var mapAdjustments = { "3ne" : { x:-120, y:0, scale:0.638 } };
var mapData = {
	"3ne":[
		{"name":"3.432","x":141,"y":459,"width":234,"height":170},
		{"name":"3.430","x":141,"y":626,"width":234,"height":170},
		{"name":"3.422","x":141,"y":1128,"width":234,"height":170},
		{"name":"3.420","x":141,"y":1296,"width":234,"height":170},
		{"name":"3.418","x":141,"y":1463,"width":234,"height":170},
		{"name":"3.416","x":141,"y":1631,"width":234,"height":170,"title":"Conference Room"},
		{"name":"3.512","x":751,"y":1296,"width":234,"height":170},
		{"name":"3.510","x":751,"y":1463,"width":234,"height":170},
		{"name":"3.508","x":751,"y":1631,"width":234,"height":170},
		{"name":"3.514","x":751,"y":1128,"width":234,"height":164,"title":"Pod Lounge"},
		{"name":"3.436","x":132,"y":58,"width":626,"height":400,"title":"Robotic Soccer Research Lab"},
		{"name":"3.424","x":141,"y":796,"width":234,"height":330,"title":"Graduate Student Desks"},
		{"name":"3.408","x":141,"y":1804,"width":234,"height":330,"title":"Graduate Student Desks"},
		{"name":"3.518","x":751,"y":459,"width":234,"height":330,"title":"Graduate Student Desks"},
		{"name":"3.504","x":751,"y":1804,"width":234,"height":330,"title":"Graduate Student Desks"},
		{"name":"3.516","x":751,"y":796,"width":312,"height":330,"title":"Seminar"},
		{"name":"3.428","x":439,"y":559,"width":249,"height":178,"hidden":true},
		{"name":"3.426","x":439,"y":739,"width":249,"height":124,"hidden":true},
		{"name":"3.414B","x":439,"y":861,"width":249,"height":323,"title":"Building Wide Intelligence Lab"},
		{"name":"3.414A","x":439,"y":1421,"width":249,"height":314,"title":"Building Wide Intelligence Lab"},
		{"name":"3.414","x":439,"y":1183,"width":186,"height":240,"title":"Building Wide Intelligence Lab"},
		{"name":"3.520","x":625,"y":1183,"width":64,"height":240,"hidden":true},
		{"name":"3.404","x":141,"y":2135,"width":234,"height":170},
		{"name":"3.402","x":141,"y":2303,"width":234,"height":170},
		{"name":"3.502","x":751,"y":2135,"width":234,"height":170},
		{"name":"3.410","x":439,"y":1868,"width":249,"height":244,"title":"Graduate Student Desks"},
		{"name":"3.406","x":439,"y":2156,"width":249,"height":141,"hidden":true},
		{"name":"3.412","x":439,"y":1732,"width":170,"height":131,"hidden":true},
		{"name":"3.506","x":610,"y":1732,"width":80,"height":131,"hidden":true}
	]};

var mapScroller = null;

/* scrollSafeClick() implemented in menu.js */

function mapPopup(room, $elem) {

	var name = $elem.attr("data-subtitle");
	var phone = $elem.attr("data-phone");
	
	var rec = directoryDataForRoom(room);
	if (rec!=null) {
		if (name!="") {}
		else if (rec.lName) name = rec.fName+" "+rec.lName;
		else if (rec.title) name = rec.title;
		else if (rec.name) name = rec.name;
		if (rec.phone && phone=="") phone = formatPhone(rec.phone);
	}
	
	$("#map_popup_title").text("GDC " + room);
	$("#map_popup_subtitle").text(name);
	$("#map_popup_phone").text(phone);
	
	var x = $elem.offset().left + Math.round($elem.width()/2);
	var y = $elem.offset().top + Math.round($elem.height()/2) - 50;
	
	var h = $("#map_popup").height() + 20;
	
	var nx = x - 60;
	var ny = y - h;
	
	$("#map_popup").css({"left":nx+"px","top":ny+"px"}).show();

}

function mapClick() {

	mapPopup($(this).text(), $(this));

}

function mapUpdateView() {

	//..

}

function populateMap(loc) {

	var rooms = mapData[loc];
	var adj = mapAdjustments[loc];
	
	for (var i in rooms) {
	
		var room = rooms[i];
		if (room.hidden) continue;
		
		var el = $("<div>")
			.addClass("map_label")
			.addClass("map_"+loc)
			.text(room.name)
			.attr("data-subtitle", room.title?room.title:"")
			.attr("data-phone", room.phone?room.phone:"")
			.css({
				"left" : Math.round(adj.scale*(room.x+adj.x))+"px",
				"top" : Math.round(adj.scale*(room.y+adj.y))+"px",
				"width" : Math.round(adj.scale*room.width)+"px",
				"height" : Math.round(adj.scale*room.height)+"px",
				"line-height" : Math.round(adj.scale*room.height)+"px"
			})
			.appendTo("#map_container > div")[0];
		
		scrollSafeClick(el, mapClick);
	
	}
	
	mapScroller.refresh();

}

$(function() {

	mapScroller = new iScroll("map_container", { hScrollbar : false, vScrollbar : false, wheelAction : "none" });
	
	populateMap("3ne");
	
	//temp
	$("#map_wing_chooser").click(function(e) {
		var ep = $(this).offset();
		var x = e.pageX - ep.left;
		var y = e.pageY - ep.top;
		var cl = "ne";
		if (x > 25 && y > 25 && x < 120 && y < 256) cl = "ne";
		else if (x > 25 && y > 255 && x < 120 && y < 425) cl = "nw";
		else if (x > 192 && y > 166 && x < 285 && y < 430) cl = "s";
		else return;
		$(this).removeClass("ne").removeClass("nw").removeClass("s").addClass(cl);
	});
	$("#map_floor_chooser button").click(function() {
		$("#map_floor_chooser button").removeClass("on");
		$(this).addClass("on");
	});
	$("body").mousedown(function(e) {
		if ($(e.target).is("#map_popup")) return;
		if ($(e.target).parents("#map_popup").length!=0) return;
		$("#map_popup").hide();
	});

});