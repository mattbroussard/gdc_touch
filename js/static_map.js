
var mapCurLoc = "3N";

/* scrollSafeClick() implemented in menu.js */

//code from when the map had a popup window with extra info; maybe to be re-enabled in the future?
/* function mapPopup(room, $elem) {

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

} */

function resetMap() {

	mapCurLoc = baseGetLocation();
	if (mapCurLoc == "0") mapCurLoc = "3N";
	suppressTracking("map", 1000);
	$("#map_floor_chooser_button_"+mapCurLoc.charAt(0)).addClass("on").click();

}

//feature shelved for future consideration
/* function mapsLinkClick() {

	var room = $(this).text().replace("GDC","").trim();
	var floor = room.split(".")[0] / 1;
	if (isNaN(floor) || floor < 1 || floor > 7) return;

	//unfortunately, this whole process of getting from some arbitrary screen to the map is really hacky
	//essentially:
	// - disable animations
	// - trigger the back button
	// - trigger the menu button for the map
	// - tell the map to go to the right floor
	// - re-enable animations

	baseDisableAnimations();

	suppressTracking("menu_button_map", 2000);
	suppressTracking("menu_return", 2000);
	suppressTracking("map_choose_floor", 2000);

	if (!$("body").hasClass("page1")) {
		baseBackButton();
	}

	$("#menu_map_button").click();
	$("#map_floor_chooser_button_"+floor).addClass("on").click();

	setTimeout(function() {
		baseEnableAnimations();
	}, 2000);

} */

$(function() {

	enableMenuButton("map");
	
	//init the floor images
	for (var i in config_maps) {
		$("<img>")
			.attr("src", config_maps[i]["image"])
			.attr("id", "map_image_"+config_maps[i]["floor"])
			.appendTo("#map_container > div")
			.hide();
	}

	//when clicking the floor chooser, update the control
	$("#map_floor_chooser button").click(function() {
		$("#map_floor_chooser button").removeClass("on");
		$(this).addClass("on");

		mapCurLoc = $(this).attr("id").replace("map_floor_chooser_button_","");
		if (mapCurLoc == baseGetLocation().charAt(0)) mapCurLoc += baseGetLocation().charAt(1);
		track({"event":"map_choose_floor","floor":mapCurLoc});
		
		$("#map_container > div > img").hide();
		$("#map_image_"+mapCurLoc).show();
	});

	//put us on the right floor to begin with
	resetMap();

	//allow clicks on map links elsewhere in the app to come to the map
	//$("body").on("click", ".maps_link", mapsLinkClick);

	//any clicks not on the map popup close the map popup
	/* $("body").mousedown(function(e) {
		if ($(e.target).is("#map_popup")) return;
		if ($(e.target).parents("#map_popup").length!=0) return;
		$("#map_popup").hide();
	}); */

});