
var coverSlideState = 1;
var coverSlideInterval = null;
var coverLocation = "0";
var coverFloorNumber = 0;

//clock updating moved to base.js

function coverSlideUpdate() {

	var duration = 3000;
	
	coverSlideState++;
	if (coverSlideState>5) coverSlideState = 1;
	
	if (coverSlideState!=1) {
		$("#cover_slide"+coverSlideState).show().addClass("on");
		$("#cover_slide"+(coverSlideState-1)).fadeOut(duration, function() { $(this).removeClass("on"); });
	} else $("#cover_slide1").fadeIn(duration).addClass("on");

}

function coverTouch() {

	menuSlideshowLastScroll = -1;
	menuSlideshowScroller.scrollToPage(1, 0, 0);
	
	$("body")
		.removeClass("handicap")
		.removeClass("page0")
		.addClass("cover_anim")
		.addClass("page1");

}

$(function() {

	var animOn = true;
	
	$("#cover").click(coverTouch);
	
	var loc = window.location.href.split("?location=");
	if (loc.length>=2) coverLocation = loc[1];
	coverFloorNumber = coverLocation.replace(/[^0-9\-]/g, "") / 1; //added a hyphen in the regex because Ryan wanted to see it say -1
	$("#cover_floor").text(coverFloorNumber);
	
	coverSlideInterval = setInterval(coverSlideUpdate, 12000);

});