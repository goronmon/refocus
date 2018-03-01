chrome.windows.onFocusChanged.addListener(function() {
    chrome.tabs.query({'active': true}, function (tabs) {
        var url = tabs[0].url;
        if (url === "https://www.google.com/") {
            // Get alarm
            chrome.alarms.get('RefocusAlarm', function (alarm){
                // If alarm doesn't exist create it
                if (alarm){
                    // Do nothing
                }
                else {
                    if (localStorage.getItem("refocusAlarmScheduledTime") !== null) {
                        var previousScheduledTime = localStorage.refocusAlarmScheduledTime;
                        var currentTime = Date.now();
                        var newScheduledTime = previousScheduledTime + (currentTime - previousScheduledTime);
                        localStorage.removeItem('refocusAlarmScheduledTime');

                        chrome.alarms.create('RefocusAlarm', {when: newScheduledTime});
                    }
                    else {
                        chrome.alarms.create('RefocusAlarm', {delayInMinutes: 1});
                    }
                }
            });

        }
        else {
            // Pauser timer
            chrome.alarms.get('RefocusAlarm', function (alarm){
                // If alarm doesn't exist create it
                if (alarm){
                    localStorage.refocusAlarmScheduledTime = alarm.scheduledTime;
                    chrome.alarms.clear("RefocusAlarm");
                }
                else {
                    // Do nothing
                }
            });
        }
    });
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    alert("Time's up!");
  });