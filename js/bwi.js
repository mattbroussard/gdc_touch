
//this is temporary; eventually build out a demo to get port forward permisssion.
//once permission is received, this whole thing will be replaced with a screen for actually interacting with the BWI system.
var blarghhhhhh = 0;
function bwiDemoClick() {

	var colors = ["Red", "Green", "Blue", "Cyan", "Black", "Grey", "Orange", ""];
	blarghhhhhh++;
	bwiUpdateColor(colors[blarghhhhhh%colors.length]);

}

function bwiUpdateColor(c) {

	$("#bwi button")
		.css("background", c.toLowerCase())
		.text("Big " + c + " Demo Button");

}

$(function() {

	enableMenuButton("bwi");
	
	$("#bwi button").mousedown(function() {
		$(this).addClass("on");
	}).mouseout(function() {
		$(this).removeClass("on");
	}).mouseup(function() {
		$(this).removeClass("on");	
	}).click(bwiDemoClick);

});