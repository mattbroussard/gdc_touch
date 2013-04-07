<?php

	if (isset($_GET["proxy"])) {
		header("Content-type: text/html");
		if (strpos($_GET["url"], "http://www.cs.utexas.edu/news-events/") !== 0 && strpos($_GET["url"], "https://www.cs.utexas.edu/news-events/") !== 0) die("<h1 class='title'>Not allowed.</h1>");
		$result = file_get_contents($_GET["url"]);
		if ($result !== FALSE) die($result);
		else die("<h1 class='title'>Data unavailable.</h1>");
	}
	
	$t = time();

?><!DOCTYPE html>
<html>
<head>
	<title>GDC Touch News Story Popup</title>
	<link rel="stylesheet" type="text/css" href="../css/news_story.css?cachebuster=<?php echo $t; ?>" />
	<link rel="stylesheet" type="text/css" href="../css/font-awesome.min.css" />
	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/iscroll.js"></script>
	<script type="text/javascript" src="../js/news_story.js?cachebuster=<?php echo $t; ?>"></script>
</head>
<body>
	<div id="scroller">
		<div></div>
	</div>
	<i class="icon-spinner icon-spin"></i>
</body>
</html>