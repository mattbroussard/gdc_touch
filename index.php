<?php
	/* note: debug, if included, MUST be last */
	$modules = array("base", "cover", "menu", "about", "directory", "rooms", "static_map", "bwi", /*"research",*/ "debug");
	$t = time();
?><!DOCTYPE html>
<html>
<head>
	<title>GDC Touch Kiosk</title>
	<!-- a bit ironic... -->
	<meta name="robots" content="noindex,nofollow" />
	<!-- global CSS/JS includes -->
	<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
	<link rel="stylesheet" type="text/css" href="css/fonts.css" />
	<script type="text/javascript" src="js/lib/jquery.js"></script>
	<script type="text/javascript" src="js/lib/iscroll.js"></script>
	<script type="text/javascript" src="js/lib/eventemitter2.js"></script>
	<script type="text/javascript" src="js/lib/roslib.min.js"></script>
	<script type="text/javascript" src="js/config.js?cachebuster=<?php echo $t; ?>"></script>
<?php foreach ($modules as $i) { ?>
	<!-- CSS/JS includes for module <?php echo $i; ?> -->
	<link rel="stylesheet" type="text/css" href="css/<?php echo $i; ?>.css?cachebuster=<?php echo $t; ?>" />
	<script type="text/javascript" src="js/<?php echo $i; ?>.js?cachebuster=<?php echo $t; ?>"></script>
<?php } ?>
</head>
<body>
<div id="global">
<?php
	foreach ($modules as $i) {
		?>


	<!-- HTML include for module <?php echo $i; ?> -->
<?php
		require_once("html/".$i.".html");
	}
?>



</div>
</body>
</html>
<!-- authored by Matt Broussard beginning March 2013, continuing as of January 2014 -->
