
var coverSlideState = 1;
var coverSlideInterval = null;

function coverSlideUpdate() {

	var duration = 3000;
	
	coverSlideState++;
	if (coverSlideState > config_coverSlideshow.length) coverSlideState = 1;
	
	if (coverSlideState!=1) {
		$("#cover_slide"+coverSlideState).show().addClass("on");
		$("#cover_slide"+(coverSlideState-1)).fadeOut(duration, function() { $(this).removeClass("on"); });
	} else $("#cover_slide1").fadeIn(duration).addClass("on");

}

function coverTouch() {

	menuSlideshowReset();
	
	$("body")
		.removeClass("handicap")
		.removeClass("page0")
		.addClass("cover_anim")
		.addClass("page1");

}

function coverInitSlideshow() {

	for (var i = 1; i <= config_coverSlideshow.length; i++) {
	
		$("<img>")
			.attr("src", config_coverSlideshow[i-1])
			.addClass("cover_slide")
			.attr("id", "cover_slide"+i)
			.css("z-index", 1011+config_coverSlideshow.length-i)
			.appendTo("#cover_slideshow");
	
	}
	
	coverSlideInterval = setInterval(coverSlideUpdate, 12000);

}

$(function() {

	$("#cover").click(coverTouch);
	$("#cover_floor").text(baseGetFloorNumber());
	coverInitSlideshow();

});