// adapted from http://www.codepool.biz/chrome-extension-to-save-web-page-screenshots-to-local-disk.html
var screenshot = {
	content : document.createElement("canvas"),
	data : '',

	init : function() {
        this.recording = false;
		this.initEvents();
	},
	
	initEvents : function() {
		chrome.browserAction.onClicked.addListener(function(tab) {
			chrome.tabs.captureVisibleTab(null, {
				format : "png",
				quality : 100
			}, function(data) {
				screenshot.data = data;
				
				chrome.tabs.query({
					active : true,
					currentWindow : true
				}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {ready : "ready", recording: screenshot.recording}, function(response) {
						if (response.download === "download") {
                            screenshot.recording = response.recording;

                            // send image to server
                            var time = Date.now();
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", "http://localhost:5000/receive_image", true);
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            // xhr.onreadystatechange();
                            xhr.send(JSON.stringify({
                                time: time,
                                image: screenshot.data
                            }));

                            screenshot.data = '';
						}
						else {
							screenshot.data = '';
						}
					});
				}); 

			});
		});
	}
};

screenshot.init();
