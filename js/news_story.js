
var scroller = null;

function fixScroll() {

	setTimeout(function() { scroller.refresh(); }, 0);

}

function resetScroll() {

	scroller.scrollToPage(0,0,0);

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

function loadContent(title, content) {

	$("body > div > div *").remove();
	$("body").addClass("done_loading");
	$("body > div > div").html(content);
	$("div.gallery-caption, div.terms, iframe, embed, object, audio, video").remove();
	$("img").each(function() {
		if ($(this).attr("src").indexOf("data:")!=0) $(this).remove();
	})
	$("<h1>").addClass("title").text(title).prependTo("body > div > div");
	fixScroll();

}

function load(url) {

	$("body").removeClass("done_loading");
	$("body > div > div *").remove();
	fixScroll();
	$("body > div > div").load("../php/news_story.php?url="+url+" h1.title, #content-area div.node:first", loadingDone);

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