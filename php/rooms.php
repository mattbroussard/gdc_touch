<?php

	//shoot me now.
	
	function err($errno, $errstr, $errfile, $errline) {
		if (strstr($errstr, "Unexpected end tag")) return true;
		if ($errno == E_WARNING) return true;
		die(json_encode(array(
			"error" => $errstr,
			"location" => $errfile.":".$errline,
			"level" => $errno
		)));
	}
	set_error_handler(err, E_ALL);
	
	header("Content-type: application/json");
	
	$url = "http://apps.cs.utexas.edu/touchscreen/directory.scgi?pop=calendar";
	
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url);
	
	$els = $doc->getElementsByTagName("p");
	
	$tbr = array();
	
	for ($i = 0; 2*$i < $els->length; $i++) {
	
		$p1 = $els->item(2*$i);
		$p2 = $els->item(2*$i+1);
		
		$roomNum = $p1->textContent;
		
		$times = array();
		preg_match_all("/[0-9]+:[0-9]+ [ap]m - [0-9]+:[0-9]+ [ap]m/", $p2->textContent, $times);
		
		$that = array();
		for ($j = 0; $j < count($times[0]); $j++) {
					
			$start = strpos($p2->textContent, $times[0][$j]) + strlen($times[0][$j]);
			$end = $j+1==count($times[0]) ? strlen($p2->textContent) : stripos($p2->textContent, $times[0][$j+1]);
			
			$title = str_replace("\r\n\n - ", "", substr($p2->textContent, $start, $end-$start));
			
			array_push($that, array("time" => $times[0][$j], "title" => $title));
		
		}
		
		array_push($tbr, array("room" => $roomNum, "events" => $that));
	
	}
	
	echo(json_encode($tbr));

?>