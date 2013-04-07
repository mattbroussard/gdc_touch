<?php
	$modules = array("base", "cover", "menu", "about", "directory", "rooms");
?><!DOCTYPE html>
<html>
<head>
	<title>GDC Touch Kiosk</title>
	<!-- a bit ironic... -->
	<meta name="robots" content="noindex,nofollow" />
	<!-- global CSS/JS includes -->
	<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/iscroll.js"></script>
<?php $t = time(); foreach ($modules as $i) { ?>
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
<!-- authored by Matt Broussard in March 2013 -->