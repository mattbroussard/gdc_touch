
var config_rosAddress = null; //the websocket address with port for roslibjs communications (e.g. ws://server:9090/)

//Note: setting news_slideshow to null removes the news slideshow and expands the size of the news story scroll view.
var config_dataSources = {
	"news" : "json/news.json",
	"news_slideshow" : "json/news_slideshow.json",
	"events" : "json/events.json",
	"directory" : "json/directory.json",
	"rooms" : "json/rooms.json"
};

var config_coverSlideshow = [
	"img/slide1.png",
	"img/slide2.png",
	"img/slide3.png",
	"img/slide4.png",
	"img/slide5.png"
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
