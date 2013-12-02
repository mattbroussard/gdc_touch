
var researchMenuScroller = null;

function researchMenuClick() {

	$("#research_iframe").attr("src", $(this).attr("data-page"));
	
	track({"event":"research_click","page":$(this).attr("data-page")});

	$("body")
		.addClass("page3")
		.removeClass("page2");

}

function researchInitMenu() {

	for (var i in config_research) {
	
		var obj = config_research[i];
		var el = $("<img>")
			.attr("src", obj.image)
			.attr("data-page", obj.page)
			.appendTo("#research_menu > div");
		
		scrollSafeClick(el[0], researchMenuClick);
	
	}

}

$(function() {

	enableMenuButton("research");
	
	researchInitMenu();
	researchMenuScroller = new iScroll("research_menu", { hScrollbar : false, vScrollbar : false, wheelAction : "none", onScrollEnd:function(e){track("research_scroll",e);} });

});