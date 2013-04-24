
var coverSlideState = 1;
var coverSlideInterval = null;

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
	
	$("#cover_floor").text(baseGetFloorNumber());
	
	coverSlideInterval = setInterval(coverSlideUpdate, 12000);

});