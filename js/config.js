
var config_rosAddress = "wss://localhost:9090/"; //the websocket address with port for roslibjs communications (e.g. ws://server:9090/)

var config_trackerEndpoint = "php/tracker.php"; //url to which POST requests can be sent with tracker events
var config_trackerFlushQuota = 15; //number of events after which the tracker will attempt to flush its event queue to the server
var config_trackerDropQuota = 1000; //number of events after which the tracker will dump 1/10 of its events (this should only be hit if flushes to the server are failing)

var config_mouseThreshold = 2 * 60 * 1000; //timeout in milliseconds to return to the cover screen after no activity
var config_reloadThreshold = 6 * 60 * 60 * 1000; //timeout in milliseconds to reload the page

var config_roomsSortDefault = "time"; //can be "room" or "time"

//Note: setting news_slideshow to null removes the news slideshow and expands the size of the news story scroll view.
var config_dataSources = {
	"news" : "json/news.json",
	"news_slideshow" : null,
	"events" : "json/events.json",
	"directory" : "json/directory.json",
	"rooms" : "json/rooms.json"
};

var config_coverSlideshow = [
	"img/gates/image1.png",
	"img/gates/image2.png",
	"img/gates/image3.png",
	"img/gates/image4.png",
	"img/gates/image5.png",
	"img/gates/image6.png",
    "img/gates/image7.png"
];

var config_research = [
	{
		"image" : "img/research/dummy.png",
		"page" : "html/research/dummy.html"
	},
	{
		"image" : "img/research/dummy.png",
		"page" : "html/research/dummy.html"
	}
];

//config_maps could be manually populated, but we're going to do it in code because it's cleaner... sort of.
var config_maps = [];
for (var i = 1; i <= 7; i++)
	for (var j in {"N":0,"S":0,"":0})
		config_maps.push({"floor":i+j,"image":"img/maps/static/gdcfloorplan"+i+j+".png"});
