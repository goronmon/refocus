chrome.windows.onFocusChanged.addListener(function() {
    chrome.tabs.query({'active': true}, function (tabs) {
        var url = tabs[0].url;
        if (url === 'https://www.google.com/') {
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
                            localStorage.removeItem('refocusAlarmScheduledTime');
                            localStorage.removeItem('refocusAlarmPauseTime');

                            chrome.alarms.clear("RefocusAlarm");
                            chrome.storage.sync.get("refocusTimeLimit", function (value) {
                                chrome.alarms.create('RefocusAlarm', {delayInMinutes: value});
                            });
                        }
                        else {
                            var previousPauseTime = parseInt(localStorage.refocusAlarmPauseTime, 10);
                            if (isNaN(previousPauseTime)) {
                                localStorage.removeItem('refocusAlarmScheduledTime');
                                localStorage.removeItem('refocusAlarmPauseTime');

                                chrome.alarms.clear("RefocusAlarm");
                                chrome.storage.sync.get("refocusTimeLimit", function (value) {
                                    chrome.alarms.create('RefocusAlarm', {delayInMinutes: value});
                                });
                            }
                            else {
                                var currentTime = Date.now();
                                var newScheduledTime = (currentTime - previousPauseTime) + previousScheduledTime;
                                localStorage.removeItem('refocusAlarmScheduledTime');
                                localStorage.removeItem('refocusAlarmPauseTime');

                                chrome.alarms.clear("RefocusAlarm");
                                chrome.alarms.create('RefocusAlarm', {when: newScheduledTime});
                            }
                        }
                    }
                    else {
                        localStorage.removeItem('refocusAlarmScheduledTime');
                        localStorage.removeItem('refocusAlarmPauseTime');

                        chrome.alarms.clear("RefocusAlarm");

                        chrome.storage.sync.get("refocusTimeLimit", function (value) {
                            chrome.alarms.create('RefocusAlarm', {delayInMinutes: value});
                        });
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

chrome.alarms.onAlarm.addListener(function(alarm) {
    localStorage.removeItem('refocusAlarmScheduledTime');
    localStorage.removeItem('refocusAlarmPauseTime');
    chrome.alarms.clear("RefocusAlarm");

    var tabsToClose = [];
    chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){
            if (tab.url === 'https://www.google.com/') {
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
  });