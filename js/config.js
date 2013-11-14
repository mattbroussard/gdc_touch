
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

var config_maps = [
	{
		"floor" : "1N",
		"image" : "img/maps/static/gdcfloorplan1N.png"
	},
	{
		"floor" : "1S",
		"image" : "img/maps/static/gdcfloorplan1S.png"
	},
	{
		"floor" : "2N",
		"image" : "img/maps/static/gdcfloorplan2N.png"
	},
	{
		"floor" : "2S",
		"image" : "img/maps/static/gdcfloorplan2S.png"
	},
	{
		"floor" : "3N",
		"image" : "img/maps/static/gdcfloorplan3N.png"
	},
	{
		"floor" : "3S",
		"image" : "img/maps/static/gdcfloorplan3S.png"
	},
	{
		"floor" : "4N",
		"image" : "img/maps/static/gdcfloorplan4N.png"
	},
	{
		"floor" : "4S",
		"image" : "img/maps/static/gdcfloorplan4S.png"
	},
	{
		"floor" : "5N",
		"image" : "img/maps/static/gdcfloorplan5N.png"
	},
	{
		"floor" : "5S",
		"image" : "img/maps/static/gdcfloorplan5S.png"
	},
	{
		"floor" : "6N",
		"image" : "img/maps/static/gdcfloorplan6N.png"
	},
	{
		"floor" : "6S",
		"image" : "img/maps/static/gdcfloorplan6S.png"
	},
	{
		"floor" : "7N",
		"image" : "img/maps/static/gdcfloorplan7N.png"
	},
	{
		"floor" : "7S",
		"image" : "img/maps/static/gdcfloorplan7S.png"
	}
];