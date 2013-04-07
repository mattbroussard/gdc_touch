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
	
	function sortComparator($a, $b) {
		
		$an = "";
		if (isset($a["title"])) $an = $a["title"];
		else if (isset($a["lName"]) && isset($a["fName"])) $an = $a["lName"]." ".$a["fName"];
		else return 0;
		
		$bn = "";
		if (isset($b["title"])) $bn = $b["title"];
		else if (isset($b["lName"]) && isset($b["fName"])) $bn = $b["lName"]." ".$b["fName"];
		else return 0;
		
		return strcmp(strtolower($an), strtolower($bn));
		
	}
	
	$tbr = array();
	
	header("Content-type: application/json");
	date_default_timezone_set("America/Chicago");
	
	$dict = array(
		"office" => array("title", "location", "phone"),
		"faculty" => array("image", "name", "location", "phone"),
		"staff" => array("lName", "fName", "location", "phone"),
		"grad" => array("lName", "fName", "location")
	);
	
	$url = "http://apps.cs.utexas.edu/touchscreen/directory.scgi?pop=";
	
	foreach ($dict as $type => $columns) {
	
		$doc = new DOMDocument();
		$doc->loadHTMLFile($url . $type);
		
		$els = $doc->getElementsByTagName("tr");
		
		for ($i = 1; $i < $els->length; $i++) {
		
			$tds = $els->item($i)->getElementsByTagName("td");
			$obj = array();
			
			for ($j = 0; $j < count($columns); $j++) {
			
				$key = $columns[$j];
				$val = trim($tds->item($j)->textContent);
				if ($val=="GDC 3.704 / GDC 2.308") $val = "GDC 2.308"; //exception for Bruce Porter, who has two offices, which breaks the layout.
				if ($val!="n/a") $obj[$key] = $val;
				else continue;
				
				if ($key == "image") {
					$obj[$key] = $tds->item($j)->getElementsByTagName("img")->item(0)->getAttribute("src");
				}
				
				if ($key == "phone") {
					$obj[$key] = preg_replace('/[^0-9]/', '', $obj[$key]);
					if (strlen($obj[$key])==7) $obj[$key] = "512" . $obj[$key];
				}
			
			}
			
			if (isset($obj["fName"]) && isset($obj["lName"])) {
				$obj["name"] = $obj["fName"] . " " . $obj["lName"];
			} else if (isset($obj["name"])) {
				$obj["name"] = str_replace("  ", " ", $obj["name"]);
				$nameParts = explode(" ", $obj["name"]);
				$obj["fName"] = $nameParts[0];
				$obj["lName"] = $nameParts[count($nameParts)-1];
			}
			
			$obj["type"] = $type;
			array_push($tbr, $obj);
		
		}
	
	}
	
	usort($tbr, "sortComparator");
	echo(json_encode($tbr));

?>