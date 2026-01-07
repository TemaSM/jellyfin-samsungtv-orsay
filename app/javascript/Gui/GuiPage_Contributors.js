var GuiPage_Contributors = {
	CoreTeam : ["nvllsvm","joshuaboniface", "JustAMan", "anthonylavado", "Bond-009", "dkanada"]
}

GuiPage_Contributors.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiPage_Contributors.start = function() {
	alert("Page Enter : GuiPage_Contributors");
	
	document.getElementById("Counter").innerHTML = Main.version;
	document.getElementById("guiReturnButton").style.visibility = "";
	document.getElementById("guiReturnButton").innerHTML = "Return";
	
	document.getElementById("pageContent").innerHTML = "<div class='EpisodesSeriesInfo'>About:</div><div id=ContentAbout style='font-size:1em;' class='guiPage_Settings_Settings'></div>";
	
	var htmlToAdd = "Jellyfin for Samsung Smart TVs is a free, open source community project. A broad range of Smarthub devices are supported due to the generously donated time and efforts of, among others, the following people.<br>";
	htmlToAdd += "Feedback on this and other Jellyfin products is gratefully received at https://jellyfin.org/docs/general/getting-help.html.<br><br>"
	htmlToAdd += "<span style='font-size:1.2em;'>Core Team</span><table><tr class='guiSettingsRow'>";
	for (var index = 0; index < this.CoreTeam.length; index++) {
		if (index % 6 == 0) {
			htmlToAdd += "<tr class='guiSettingsRow'>";
		}
		htmlToAdd += "<td class='guiSettingsTD'>" + this.CoreTeam[index] + "</td>";
		if (index+1 % 6 == 0) {
			htmlToAdd += "</tr>";
		}
	}
	htmlToAdd += "</tr></table><br><br>";
	//Set Focus for Key Events
	document.getElementById("GuiPage_Contributors").focus();
}


GuiPage_Contributors.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	//Update Screensaver Timer
	Support.screensaver();
	
	//If screensaver is running 
	if (Main.getIsScreensaverRunning()) {
		//Update Main.js isScreensaverRunning - Sets to True
		Main.setIsScreensaverRunning();
		
		//End Screensaver
		GuiImagePlayer_Screensaver.stopScreensaver();
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode) {
		case tvKey.KEY_LEFT:
			alert("LEFT");
			this.openMenu();
			break;
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_BLUE:
			GuiMusicPlayer.showMusicPlayer("GuiPage_Contributors");
			break;	
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			this.openMenu();
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_Contributors.openMenu = function() {
	Support.updateURLHistory("GuiPage_Contributors",null,null,null,null,null,null,null);
	GuiMainMenu.requested("GuiPage_Contributors",null);
}