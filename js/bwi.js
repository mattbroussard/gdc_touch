
var rosConn = null;
var rosAvailable = -1;
var bwiMessageTimeout = null;

function rosConnectionOpened() {

	console.log("ROS connection established, attempting to subscribe to /gdc_touch");
	rosConn.callService("/rosbridge/subscribe", ["/gdc_touch",-1], function() {});
	sendROSMessage({"action":"connect"});

}

function rosConnectionClosed() {

	if (rosAvailable < -9) {
		console.log("Giving up on connecting to ROS, reload page to try again.");
		return;
	}
	
	rosAvailable = rosAvailable > 0 ? -1 : rosAvailable-1;
	try { rosConn.socket.close(); } catch (e) {}
	rosConn = null;

	var reconnectTimeout = Math.pow(2, -1*rosAvailable);
	setTimeout(startROSConnection, reconnectTimeout*1000);
	console.log("ROS connection closed or failed. Retrying in " + reconnectTimeout + " seconds.");

}

function rosMessageReceived(msg) {

	var obj = JSON.parse(msg.data);
	if (obj["to"] != baseGetLocation()) return;
	if (obj["from"] != "server") return;
	rosAvailable = new Date().getTime();
	
	if (obj["action"] == "connect") {
	
		console.log("Received connect message.");
		if (!obj["noreply"]) sendROSMessage({ "action":"connect", "noreply":true });
		
	} else if (obj["action"] == "display") {
	
		if (obj["hide"]) {
		
			console.log("Received hide icon display message.");
			$("#bwi_message_screen").hide();
			return;
		
		}
		
		var type = "icon-" + obj["icon"].replace(/[^a-z\-]/g, "");
		console.log("Received icon display message for type " + type);		

		$("#bwi_message_screen i").removeClass().addClass(type);
		$("#bwi_message_screen").show();
		
		if (obj["timeout"]) {
			clearTimeout(bwiMessageTimeout);
			bwiMessageTimeout = setTimeout(function() {
				$("#bwi_message_screen").hide();
			}, obj["timeout"]*1000);
		}
	
	}

}

function sendROSMessage(obj) {

	if (rosConn==null) return;

	obj["to"] = "server";
	obj["from"] = baseGetLocation();
	rosConn.publish("/gdc_touch", "std_msgs/String", { data : JSON.stringify(obj) });

}

function startROSConnection() {

	if (rosConn && rosConn.socket.readyState <= 1) return;
	
	rosConn = new ros.Connection(config_rosAddress);
	rosConn.setOnOpen(rosConnectionOpened);
	rosConn.setOnClose(rosConnectionClosed);
	rosConn.setOnError(rosConnectionClosed);
	rosConn.addHandler("/gdc_touch", rosMessageReceived);

}

function bwiDemoClick() {

	sendROSMessage({"action":"demo","time":new Date().toString()});

}

$(function() {

	enableMenuButton("bwi");
	
	$("#bwi button").mousedown(function() {
		$(this).addClass("on");
	}).mouseout(function() {
		$(this).removeClass("on");
	}).mouseup(function() {
		$(this).removeClass("on");	
	}).click(bwiDemoClick);
	
	$("#bwi_message_screen button").click(function() {
		$("#bwi_message_screen").hide();
	});
	
	startROSConnection();

});
