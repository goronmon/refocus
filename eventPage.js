chrome.windows.onFocusChanged.addListener(function() {
    chrome.tabs.query({'active': true}, function (tabs) {
        var url = new URL(tabs[0].url);

        chrome.storage.sync.get({
            blacklist: []
        }, function (items) {
            if (items.blacklist.includes(url.hostname)) {
                // Get alarm
                chrome.alarms.get('RefocusAlarm', function (alarm){
                    // If alarm doesn't exist create it
                    if (alarm){
                        // Do nothing
                    }
                    else {
                        if (localStorage.getItem("refocusAlarmScheduledTime") !== null) {
                            var previousScheduledTime = parseInt(localStorage.refocusAlarmScheduledTime, 10);
                            if (isNaN(previousScheduledTime)) {
                                startAlarm();
                            }
                            else {
                                var previousPauseTime = parseInt(localStorage.refocusAlarmPauseTime, 10);
                                if (isNaN(previousPauseTime)) {
                                    startAlarm();
                                }
                                else {
                                    var currentTime = Date.now();
                                    var newScheduledTime = (currentTime - previousPauseTime) + previousScheduledTime;
                                    
                                    clearAlarm();
                                    chrome.alarms.create('RefocusAlarm', {when: newScheduledTime});
                                }
                            }
                        }
                        else {
                            startAlarm();
                        }
                    }
                });
    
            }
            else {
                // Pauser timer
                chrome.alarms.get('RefocusAlarm', function (alarm){
                    // If alarm doesn't exist create it
                    if (alarm){
                        localStorage.removeItem('refocusAlarmScheduledTime');
                        localStorage.removeItem('refocusAlarmPauseTime');
    
                        localStorage.refocusAlarmScheduledTime = alarm.scheduledTime;
                        localStorage.refocusAlarmPauseTime = Date.now();
                        chrome.alarms.clear("RefocusAlarm");
                    }
                    else {
                        // Do nothing
                    }
                });
            }
        });
    });
});

function startAlarm() {
    clearAlarm();
    
    chrome.storage.sync.get("refocusTimeLimit", function (value) {
        chrome.alarms.create('RefocusAlarm', {delayInMinutes: value.refocusTimeLimit});
    });
}

function clearAlarm() {
    localStorage.removeItem('refocusAlarmScheduledTime');
    localStorage.removeItem('refocusAlarmPauseTime');

    chrome.alarms.clear("RefocusAlarm");
}

chrome.alarms.onAlarm.addListener(function(alarm) {
    clearAlarm();

    chrome.storage.sync.get({
        blacklist: []
    }, function (items) {
        var tabsToClose = [];
        chrome.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (window) {
                window.tabs.forEach(function (tab) {
                    var url = new URL(tab.url);
                    if (items.blacklist.includes(url.hostname)) {
                        tabsToClose.push(tab.id);
                    }
                });
            });
        });

        chrome.storage.sync.get("refocusCloseTab", function (closeTabs) {
            if (closeTabs) {
                chrome.tabs.remove(tabsToClose);
            }
            else {
                alert("Time's UP!");
            }
        });
    })
});