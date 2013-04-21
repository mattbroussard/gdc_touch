<?php

	header("Content-type: text/html");
	if (strpos($_GET["url"], "http://www.cs.utexas.edu/news-events/") !== 0 && strpos($_GET["url"], "https://www.cs.utexas.edu/news-events/") !== 0) die("<h1 class='title'>Not allowed.</h1>");
	$result = file_get_contents($_GET["url"]);
	if ($result !== FALSE) die($result);
	else die("<h1 class='title'>Data unavailable.</h1>");

?>