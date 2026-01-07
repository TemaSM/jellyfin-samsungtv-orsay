var GuiNotifications = {
		timeout : null
}

GuiNotifications.setNotification = function (Message, Title, alterHeight) {
	// Clear any existing message
	clearInterval(this.timeout);
	document.getElementById("Notifications").style.visibility = "hidden";
	document.getElementById("NotificationText").innerHTML = "";
	document.getElementById("NotificationText").className = "notification";

	// Build notification content
	document.getElementById("NotificationText").innerHTML =
		'<div class="notificationTitle">' + Title + '</div>' +
		'<div class="notificationMessage">' + Message + '</div>';
	document.getElementById("Notifications").style.visibility = "";

	// Auto-hide after 5 seconds (except Test Mode)
	if (Title != "Test Mode") {
		this.timeout = setTimeout(function() {
			document.getElementById("Notifications").style.visibility = "hidden";
			document.getElementById("NotificationText").innerHTML = "";
		}, 5000);
	}
}