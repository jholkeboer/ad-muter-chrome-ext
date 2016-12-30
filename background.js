// adapted from http://www.codepool.biz/chrome-extension-to-save-web-page-screenshots-to-local-disk.html
var screenshot = {
	data : '',

	init : function() {
        this.recording = false;
		this.initEvents();
	},

    muteCurrentTab: function(decision) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.update(tabs[0].id, {muted: !decision});
        })    
    },

    sendImage : function(data) {
        var time = Date.now();
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:5000/receive_image", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                reply = JSON.parse(xhr.responseText);
                console.log(reply);
                screenshot.muteCurrentTab(reply.decision);
            }
        }
        xhr.send(JSON.stringify({
            time: time,
            image: data
        }));
        if (screenshot.recording) {
            setTimeout(screenshot.getScreencap, 2500);
        }
    },

    getScreencap : function()  {
        if (screenshot.recording) {
            chrome.tabs.captureVisibleTab(null, {
                format : "png",
                quality : 100
            }, function(data) {
                screenshot.data = data;
                screenshot.sendImage(screenshot.data); 
            });
        }
    },
	
	initEvents : function() {
		chrome.browserAction.onClicked.addListener(function(tab) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {ready: "ready", recording: screenshot.recording}, function(response) {
                    screenshot.recording = response.recording;
                    screenshot.getScreencap();
                })
            })

		});
	}
};

screenshot.init();
