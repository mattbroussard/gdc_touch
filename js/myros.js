//adjusted version of ROS.js with slightly improved security

(function() {

	var ros = window.ros || {};
	window.ros = ros;
	
	var ros_debug = function(x) { console.log(JSON.stringify(x)); };

	var Connection = function(url) {
	  this.handlers = new Array();

	  if (typeof WebSocket == 'undefined') {
	    WebSocket = MozWebSocket;
	  }
	  this.socket = new WebSocket(url);
	  this.onmessage = null;
	  var ths = this;
	  this.socket.onmessage = function(e) {
	    if(ths.onmessage) {
	      try {
		ths.onmessage(e);
	      } catch(err) {
		ros_debug(err);
	      }
	    }

	    var call = JSON.parse(e.data); 

	    for (var i in ths.handlers[call.receiver]) {
	      var handler = ths.handlers[call.receiver][i]
	      handler(call.msg);
	    }
	  }

	  this.magicServices = new Array('/rosbridge/topics','/rosbridge/services','/rosbridge/typeStringFromTopic','/rosbridge/typeStringFromService','/rosbridge/msgClassFromTypeString','/rosbridge/reqClassFromTypeString','/rosbridge/rspClassFromTypeString','/rosbridge/classFromTopic','/rosbridge/classesFromService');

	}

	Connection.prototype.callService = function(service, obj, callback) {
	  this.handlers[service] = new Array(callback);
	  var call = { "receiver" : service, "msg" : obj };
	  this.socket.send(JSON.stringify(call));
	}

	Connection.prototype.publish = function(topic, typeStr, obj) {
	  typeStr.replace(/^\//,'');
	  var call = { "receiver" : topic, "msg" : obj, "type" : typeStr };
	  this.socket.send(JSON.stringify(call));
	}

	Connection.prototype.addHandler = function(topic, func) {
	  if (!(topic in this.handlers)) {
	    this.handlers[topic] = new Array();
	  }
	  this.handlers[topic].push(func);
	}

	Connection.prototype.setOnError = function(func) {
	  this.socket.onerror = func;
	}

	Connection.prototype.setOnClose = function(func) {
	  this.socket.onclose = func;
	}

	Connection.prototype.setOnOpen = function(func) {
	  this.socket.onopen = func;
	}

	Connection.prototype.setOnMessage = function(func) {
	  this.onmessage = func;
	}

	ros.Connection = Connection;

})();
