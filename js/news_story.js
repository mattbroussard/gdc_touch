
var scroller = null;

function fixScroll() {

	setTimeout(function() { scroller.refresh(); }, 0);

}

function loadingDone() {

	$("body").addClass("done_loading");
	$("div.gallery-caption, div.terms, iframe, embed, object, audio, video").remove();
	$("img").each(function() {
		if ($(this).attr("src").indexOf("/")==0) {
			$(this).attr("src", "http://www.cs.utexas.edu"+$(this).attr("src"));
		}
	});
	fixScroll();

}

function load(url) {

	$("body").removeClass("done_loading");
	$("body > div > div *").remove();
	fixScroll();
	$("body > div > div").load("news_story.php?proxy=1&url="+url+" h1.title, #content-area div.node:first", loadingDone);

}

$(function() {

	scroller = new iScroll("scroller", { hScrollbar : false, vScrollbar : false, wheelAction : "none" });
	$("body").on({"click":function(e) { e.preventDefault(); return false; }}, "a, button");
	$(window).resize(fixScroll);
	
	if (window.parent.baseMouseEvent) {
	
		$("body").mousedown(window.parent.baseMouseEvent)
				 .mouseup(window.parent.baseMouseEvent)
				 .mousemove(window.parent.baseMouseEvent);
	
	}

});