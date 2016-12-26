chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.ready === "ready") {
        if (msg.recording === false) {
            var user_decision = confirm('Do you want to turn recording on?');
            sendResponse({download: "download", recording: user_decision});
        } else if (msg.recording === true) {
            var user_decision = confirm('Do you want to turn recording off?');
            sendResponse({download: "download", recording: !user_decision});
        } else {
            sendResponse({download : "download", recording: null});
        }
	}
		
}); 