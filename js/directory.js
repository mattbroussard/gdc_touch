
var directoryScroller = null;
var directoryFilterType = "all";
var directoryLastQuery = "";
var directoryDatabase = null;
var directoryTrackerTimeout = null;

function directoryDataForRoom(room) {

	if (directoryDatabase==null) return null;
	
	for (var i in directoryDatabase) {
		var row = directoryDatabase[i];
		if (row.location && row.location.indexOf(room)>=0) {
			return row;
		}
	}
	
	return null;

}

function formatPhone(p) {

	return "("+p.substring(0,3)+") "+p.substring(3,6)+"-"+p.substring(6);

}

function keyboardPress() {

	var letter = null;
	var button = $(this);
	var search = $("#directory_search input");
	
	var start = search[0].selectionStart;
	var end = search[0].selectionEnd;
	var t = search.val();
	
	if (button.hasClass("backspace")) {
		letter = "";
		if (start==end) start -= 1;
		if (start<0) return;
	} else if (button.hasClass("space")) {
		letter = " ";
	} else letter = $(this).text();
	
	var prev = start > 0 ? t.charAt(start-1) : " ";
	var character = prev==" " ? letter : letter.toLowerCase();
	
	var newQuery = t.substring(0,start)+character+t.substring(end);
	
	if (directoryUpdateFilter(newQuery)) {
	
		search.val(newQuery);
		search[0].focus();
		
		search[0].selectionStart = start + character.length;
		search[0].selectionEnd = start + character.length;

		//because we don't want to track events for everything the user types, let's only do it if they wait 2 seconds before typing something else.
		if (directoryTrackerTimeout != null) {
			clearTimeout(directoryTrackerTimeout);
			directoryTrackerTimeout = null;
		}
		directoryTrackerTimeout = setTimeout(function() {
			directoryTrackerTimeout = null;
			if (newQuery!="") track({"event":"directory_search","query":newQuery});
		}, 2000);
	
	} else {

		search[0].focus();
		search[0].selectionStart = start;
		search[0].selectionEnd = end;
	
	}

}

function buildKeyboard() {

	var rows = [
		"QWERTYUIOP",
		"ASDFGHJKL",
		"ZXCVBNM<",
		" "
	];
	
	for (var i = 0; i < rows.length; i++) {
	
		var row = $("<div>")
						.addClass("keyboard_row")
						.attr("id", "row"+i)
						.appendTo("#directory_keyboard");
		
		for (var j = 0; j < rows[i].length; j++) {
		
			var key = $("<button>")
							.addClass("keyboard_key")
							.text(rows[i].charAt(j))
							.appendTo(row);
			
			switch (rows[i].charAt(j)) {
				case ' ':
					key.text("SPACE").addClass("space");
					break;
				case '<':
					key.html("<i class='icon-circle-arrow-left'></i>").addClass("backspace");
					break;
			}
		
		}
	
	}
	
	$(".keyboard_key").mousedown(function() {
		$(this).addClass("on");
	}).mouseup(function() {
		$(this).removeClass("on");
	}).mouseout(function() {
		$(this).removeClass("on");
	}).click(keyboardPress);

}

function directoryJumplistButton() {

	var letter = $(this).text();
	var el = $(".directory_division_"+letter.toUpperCase()+":visible")[0];
	track({"event":"directory_jump_letter","letter":letter});
	directoryScroller.scrollToElement(el, 200);

}

function directoryTopJump() {

	directoryScroller.scrollToPage(0,0,200);
	track("directory_jump_top");

}

function directoryContentLoaded(data, textStatus, jqXHR) {

	if (data.error) return;
	$("#directory_content > div .data_error").remove();
	directoryDatabase = data;
	
	var jumplist = $("<div>").attr("id", "directory_jumplist").appendTo("#directory_content > div");
	for (var i = 0; i < 26; i++) {
		$("<button>").text(String.fromCharCode(65+i)).click(directoryJumplistButton).appendTo(jumplist);
		if (i==12) $("<br>").appendTo(jumplist);
	}
	
	for (var i = 0; i < data.length; i++) {
	
		var d = data[i];
		var div = $("<div>").addClass("directory_item").addClass("all");
		
		if (d.type) {
			div.addClass(d.type);
			$("<div>").addClass("type").text(d.type.charAt(0)).appendTo(div);
		}

		if (d.lName) {
			$("<div>").addClass("fName").text(d.fName).appendTo(div);
			$("<div>").addClass("lName").text(d.lName).appendTo(div);
		} else if (d.name || d.title) {
			$("<div>").addClass("lName").text(d.title ? d.title : d.name).appendTo(div);
		}
		
		div.attr("data-search-name", (d.title ? d.title : d.name).toLowerCase());
		
		var loc = $("<div>").addClass("location").text(d.location ? d.location : "").appendTo(div);
		if (d.location && d.location.indexOf("GDC")>=0) loc.addClass("maps_link");
		$("<div>").addClass("phone").text(d.phone ? formatPhone(d.phone) : "").appendTo(div);
		
		$("#directory_content > div").append(div);
	
	}
	
	var types = ["all", "faculty", "staff", "grad"];
	for (var i in types) {
	
		var type = types[i];
		var curLetter = "-";
		
		$(".directory_item."+type).each(function() {
			var letter = $(this).find(".lName").text().charAt(0).toUpperCase();
			if (letter != curLetter || letter == " ") {
				curLetter = letter;
				var division = $("<div>")
									.addClass("directory_division")
									.addClass("directory_division_"+letter)
									.addClass(type)
									.text(letter)
									.insertBefore(this);
				$("<i class='icon-circle-arrow-up'>").appendTo(division).click(directoryTopJump);
			}
		});
	
	}
	
	$(".directory_division:not(.all)").hide();
	$(".directory_item:even").addClass("highlight");
	
	setTimeout(function() { directoryScroller.refresh(); }, 0);

}

function flashDirectorySearch() {

	$("#directory_search").removeClass("flash");
	setTimeout(function() { $("#directory_search").addClass("flash"); }, 0);

}

function resetDirectory() {

	$("#directory_search input").val("").blur();
	directoryLastQuery = "";
	directoryFilterType = "all";
	$(".directory_tab").removeClass("on");
	$("#directory_all").addClass("on");
	directoryUpdateFilter("");
	directoryScroller.scrollToPage(0,0,0);
	$("#directory_no_results").hide();
	$("#directory_search").removeClass("flash");

	directoryScroller.scrollToPage(0,0,0);

}

function directoryLoadContent() {

	$.getJSON(config_dataSources["directory"], directoryContentLoaded);

}

function directoryUpdateFilter(q) {

	if ($("#directory_content > div .data_error").length>0) return false;
	
	var query = q.trim().toLowerCase();
	var direction = query.length - directoryLastQuery.length;
	
	var toHide = $(".directory_item");
	var toShow = toHide
					.filter("."+directoryFilterType)
					.filter(function() {
						if (query=="") return true;
						var parts = query.split(/\s/g);
						var name = $(this).attr("data-search-name");
						for (var i in parts)
							if (name.indexOf(parts[i])<0) return false;
						return true;
					});
	
	if (toShow.length < 1 && direction > 0) {
		flashDirectorySearch();
		return false;
	}
	
	toHide.hide();
	toShow.show();
	$("#directory_no_results").hide();
	
	$(".directory_division").hide();
	toShow.each(function() {
		$(this).prevAll(".directory_division."+directoryFilterType+":first").show();
	});
	
	$(".directory_item:visible").removeClass("highlight").filter(":even").addClass("highlight");
	
	if (toShow.length==0) $("#directory_no_results").show();
	
	var jumplist = $("#directory_jumplist");
	if (directoryFilterType != "office") jumplist.removeClass("off");
	else jumplist.addClass("off");
	
	directoryLastQuery = query;
	setTimeout(function() { directoryScroller.refresh(); }, 0);
	
	return true;

}

function directoryTabClick() {

	directoryFilterType = $(this).attr("id").replace("directory_","");
	
	track({"event":"directory_filter","type":directoryFilterType});

	$(".directory_tab.on").removeClass("on");
	$(this).addClass("on");
	
	directoryUpdateFilter(directoryLastQuery);

}

$(function() {

	enableMenuButton("directory");
	buildKeyboard();
	directoryLoadContent();
	directoryScroller = new iScroll("directory_content", { hScrollbar : false, vScrollbar : false, wheelAction : "none", onScrollEnd:function(e){track("directory_scroll",e);} });
	
	$(".directory_tab").click(directoryTabClick);

});