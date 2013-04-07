<?php

	function err($errno, $errstr, $errfile, $errline) {
		if ($errno == E_WARNING) return true;
		die(json_encode(array(
			"error" => $errstr,
			"location" => $errfile.":".$errline,
			"level" => $errno
		)));
	}
	set_error_handler(err, E_ALL);

	header("Content-type: application/json");
	
	$url = "http://www.cs.utexas.edu/news-events/news/rss.xml";
	$nStories = 15;

	function clean_description($desc) {
	
		$tbr = trim(strip_tags(str_replace(">read more</", "></", $desc)));
		
		return strlen($tbr)>0 ? $tbr : "<i>No description available.</i>";
	
	}
	
	$doc = simplexml_load_file($url);
	
	if ($doc == FALSE || count($doc->channel->item)<=0) err(-1, "RSS feed failed to load.", "", -1);

	$tbr = array();
	
	for ($i = 0; $i < min(count($doc->channel->item),$nStories); $i++) {
	
		$story = $doc->channel->item[$i];
		$title = $story->title;
		$link = $story->link;
		$description = $story->description;
		
		array_push($tbr, array(
			'title' => strip_tags((string)$title),
			'link' => (string)$link,
			'description' => clean_description((string)$description)
		));
	
	}

	echo(json_encode($tbr));

?>