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
	date_default_timezone_set("America/Chicago");
	
	$url = "http://apps.cs.utexas.edu/touchscreen/directory.scgi?pop=events";
	
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url);
	
	$els = $doc->getElementsByTagName("tr");
	
	$tbr = array();
	
	for ($i = 1; $i < $els->length; $i++) {
	
		$tds = $els->item($i)->getElementsByTagName("td");
		
		$date = $tds->item(0)->textContent;
		$time = $tds->item(1)->textContent;
		$title = $tds->item(2)->textContent;
		$location = $tds->item(3)->textContent;
		
		if ($time=="All day") $time = "12:00 AM";
		
		if (strlen($location)>1 && stripos($title, " " . $location) != FALSE) {
			$title = str_ireplace(" " . $location, "", $title);
		}
		
		array_push($tbr, array(
			"time" => strtotime($date . " " . $time)*1000,
			"location" => $location,
			"title" => $title,
			"link" => "about:blank"
		));
	
	}
	
	echo(json_encode($tbr));

?>