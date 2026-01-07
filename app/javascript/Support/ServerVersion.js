var ServerVersion = {
		ServerInfo : null
}

// Compare semantic versions: returns -1 (a<b), 0 (a==b), 1 (a>b)
ServerVersion.compareVersions = function(a, b) {
	var partsA = a.split('.').map(Number);
	var partsB = b.split('.').map(Number);
	var len = Math.max(partsA.length, partsB.length);

	for (var i = 0; i < len; i++) {
		var numA = partsA[i] || 0;
		var numB = partsB[i] || 0;
		if (numA > numB) return 1;
		if (numA < numB) return -1;
	}
	return 0;
};

// Check if version 'current' is at least 'required'
ServerVersion.isVersionAtLeast = function(current, required) {
	return this.compareVersions(current, required) >= 0;
};

ServerVersion.start = function() {
	document.getElementById("pageContent").innerHTML = "<div class='padding60' style='text-align:center'> \
		<p style='padding-bottom:5px;'>The Samsung app requires a later version of the Server - Please update it and restart the app</p>";
	
	document.getElementById("ServerVersion").focus();
}

ServerVersion.checkServerVersion = function() {
	var url = Server.getCustomURL("/System/Info/Public?format=json");
	this.ServerInfo = Server.getContent(url);
	if (this.ServerInfo == null) { return; }
	
	var requiredServerVersion = Main.getRequiredServerVersion();
	var currentServerVersion = this.ServerInfo.Version;
	
	return this.isVersionAtLeast(currentServerVersion, requiredServerVersion);
}

ServerVersion.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode) {
		default:
			widgetAPI.sendExitEvent();
			break;
	}
}