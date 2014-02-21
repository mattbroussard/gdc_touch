
var rosConn = null;
var rosAvailable = -1;
var rosConnectTimeout = null;
var rosSubTopic = null;
var rosPubTopic = null;

var bwiCallbacks = [];
var bwiNextID = 0;
var bwiSent = {};
var bwiReceived = [];
var bwiResendTimeout = null;
var bwiMessagingConfig = {
    "max_attempts" : 5,
    "retry_delay" : 5,
    "received_queue_length" : 500
};

var bwiScroller = null;
var bwiDemoStatusCheckInterval = null;
var bwiIconMessageTimeout = null;

//ros* things deal directly with the ROSLIBjs api
//bwi* things deal with safe message/call abstraction

function rosInit() {
	
	rosSubTopic = new ROSLIB.Topic({
		"ros" : rosConn,
		"name" : "/gdc_touch_server",
		"messageType" : "std_msgs/String"
	});
	rosSubTopic.subscribe(rosMessageReceived);

	rosPubTopic = new ROSLIB.Topic({
		"ros" : rosConn,
		"name" : "/gdc_touch_client",
		"messageType" : "std_msgs/String"
	});
	
	rosAvailable = 0;

}

function rosConnect(resetCount) {

	if (resetCount) rosAvailable = -1;
	if (config_rosAddress == null) return;
	rosConn.connect(config_rosAddress);

}

function rosDisconnect() {

	rosAvailable = -100;
	rosConn.close();
	clearTimeout(rosConnectTimeout);

}

function rosDisconnected() {

	rosAvailable--;
	var message = "ROS disconnected; ";

	if (rosAvailable < -12) {
		message += "giving up.";
	} else {
		message += "retrying after ";
		var time = Math.pow(2, -1*rosAvailable);
		message += time;
		message += " seconds.";
		rosConnectTimeout = setTimeout(function() { rosConnect(false); }, 1000*time);
	}

	log(message, "red");
	bwiCallCallback("", {"connected":false});

}

function rosConnected() {

	rosInit();
	log("ROS connected.", "green");
	bwiCallCallback("", {"connected":true});

}

function rosMessageReceived(msg) {

	var obj = JSON.parse(msg.data.toString());
	bwiMessageReceived(obj);

}

function rosSendMessage(msg) {

	var str = JSON.stringify(msg);
	var msg = new ROSLIB.Message({"data":str});
	rosPubTopic.publish(msg);

}

//Begin functions for BWI messaging abstraction

function bwiConnected() {

	return rosAvailable >= 0;

}

function bwiSendReceipt(meta) {

	var obj = {
		"receipt" : true,
		"meta" : meta
	};
	rosSendMessage(obj);

}

function bwiMessageReceived(msg) {

	if (!("meta" in msg)) return;
	
	if ("receipt" in msg) {
		var id = msg["meta"]["id"];
		if (id in bwiSent)
			delete bwiSent[id];
		return;
	}

	if (msg["meta"]["dest"] != baseGetLocation()) {
		log("misrouted message: \""+msg["meta"]["dest"]+"\"!=\""+baseGetLocation()+"\"", "red");
		return;
	}

	outer: for (var i in bwiReceived) {
		var keys = ["dest", "src", "id"];
		for (var k in keys) {
			if (bwiReceived[i][keys[k]] != msg["meta"][keys[k]]) continue outer;
		}
		return;
	}

	bwiSendReceipt(msg["meta"]);
	
	bwiReceived.push(msg["meta"]);
	if (bwiReceived.length > bwiMessagingConfig["received_queue_length"]) bwiReceived.splice(0,100);

	var payload = null;
	if ("payload" in msg) payload = msg["payload"];
	var call = msg["call"];

	log("BWI message received, call="+call+", payload="+JSON.stringify(payload), "yellow");
	bwiCallCallback(call, payload);

}

function bwiCallCallback(call, payload) {

	for (var i in bwiCallbacks)
		if (bwiCallbacks[i]["call"] == call)
			(bwiCallbacks[i]["callback"])(payload);

}

function bwiRegisterCallback(call, callback) {

	bwiCallbacks.push({
		"call" : call,
		"callback" : callback
	});

}

function bwiSendMessage(call, payload) {

	bwiNextID++;
	var obj = {
		"meta" : {
			"dest" : "server",
			"src" : baseGetLocation(),
			"id" : bwiNextID
		},
		"call" : call,
		"payload" : payload
	};

	var sent = {
		"timestamp" : new Date().getTime(),
		"attempts" : 1,
		"msg" : obj
	};

	bwiSent[bwiNextID] = sent;

	log("BWI message sent, call="+call+", payload="+JSON.stringify(payload), "yellow");
	rosSendMessage(obj);

}

function bwiResend() {

	clearTimeout(bwiResendTimeout);

	var now = new Date().getTime();
	for (var i in bwiSent) {

		if (bwiSent[i]["attempts"] > bwiMessagingConfig["max_attempts"]) {
			log("Giving up on message "+JSON.stringify(bwiSent[i]["msg"]), "red");
			delete bwiSent[i];
			continue;
		}

		if ((now - that.timestamp)/1000 > bwiMessagingConfig["retry_delay"]) {
			bwiSent[i]["timestamp"] = now;
			bwiSent[i]["attempts"]++;
			rosSendMessage(bwiSent[i]["msg"]);
			log("Retrying message "+JSON.stringify(bwiSent[i]["msg"])+" after "+bwiSent[i]["attempts"]+" attempts.", "yellow");
		}

	}

	bwiResendTimeout = setTimeout(bwiResend, bwiMessagingConfig["retry_delay"]*1000);

}

//Above this line: messaging implementation
//Below this line: stuff for BWI functionality

function bwiSegbotDemo() {

	if (!$("#bwi_segbot_dispatch_demo").hasClass("ready")) return;

	bwiUpdateDemoStatus("#bwi_segbot_dispatch_demo", "loading");
	bwiSendMessage("segbot_demo", null);

}

function bwiUpdateDemoStatus(sel, status) {

	$(sel)
		.removeClass("loading")
		.removeClass("disabled")
		.removeClass("ready")
		.addClass(status);

}

function bwiDemoStatusUpdateReceived(payload) {
	for (var i in payload) {
		if (i=="") {
			if (payload[i]=="ready") enableMenuButton("bwi");
			else disableMenuButton("bwi");
		} else bwiUpdateDemoStatus("#"+i, payload[i]);
	}
}

function bwiIconMessageReceived(payload) {

	if ("hide" in payload) {
		$("#bwi_message_screen").hide();
		return;
	}

	var type = "icon-" + payload["icon"].replace(/[^a-z\-]/g, "");
	$("#bwi_message_screen i").removeClass().addClass(type);
	$("#bwi_message_screen").show();

	if ("timeout" in payload) {
		clearTimeout(bwiIconMessageTimeout);
		bwiIconMessageTimeout = setTimeout(function() {
			$("#bwi_message_screen").hide();
		}, payload["timeout"]);
	}

}

$(function() {

	//keep this screen disabled by default, we'll have the server turn it on
	//enableMenuButton("bwi");
	
	$("#bwi_message_screen button").click(function() {
		$("#bwi_message_screen").hide();
	});

	$(".bwi_demo_button button").mousedown(function() {
		$(this).addClass("on");
	}).mouseout(function() {
		$(this).removeClass("on");
	}).mouseup(function() {
		$(this).removeClass("on");	
	});

	$("#bwi_segbot_dispatch_demo .bwi_demo_button button").click(bwiSegbotDemo);
	
	bwiScroller = new iScroll("bwi_content", { hScrollbar : false, vScrollbar : false, wheelAction : "none", onScrollEnd:function(e){track("bwi_scroll",e);} });

	bwiDemoStatusCheckInterval = setInterval(function() {
		if (bwiConnected()) {
			disableMenuButton("bwi");
			bwiUpdateDemoStatus(".bwi_demo", "disabled");
			bwiSendMessage("demo_status", null);
		}
	}, 5 * 60 * 1000);

	bwiRegisterCallback("", function(payload) {
		if (payload.connected) bwiSendMessage("hello", null);
		else disableMenuButton("bwi");
	});

	bwiRegisterCallback("demo_status", bwiDemoStatusUpdateReceived);
	bwiRegisterCallback("icon", bwiIconMessageReceived);

	//setup for ROS connection
	rosConn = new ROSLIB.Ros();
	rosConn.on("connection", rosConnected);
	rosConn.on("close", rosDisconnected);
	rosConn.on("error", function(){}); //pass noop here because EventEmitter2 fusses if we don't catch this "error" that happens when the connection fails, even though the close handler gets called as desired.
	setTimeout(function() { rosConnect(false); }, 2000);

});
