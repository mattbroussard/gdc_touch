
var aboutScroller = null;

$(function() {

	enableMenuButton("about");
	aboutScroller = new iScroll("about_content", { hScrollbar : false, vScrollbar : false, wheelAction : "none", onScrollEnd:function(e){track("about_scroll",e);} });

});