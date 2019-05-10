browser.windows.onFocusChanged.addListener(function () {
    browser.tabs.query({ 'active': true, 'currentWindow': true }, function (tabs) {
        if (tabs[0]) {
            var url = new URL(tabs[0].url);

            browser.storage.sync.get({
                blacklist: []
            }, function (items) {
                if (items.blacklist.includes(url.hostname)) {
                    // Get alarm
                    browser.alarms.get('RefocusAlarm', function (alarm) {
                        // If alarm doesn't exist create it
                        if (alarm) {
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
                                        browser.alarms.create('RefocusAlarm', { when: newScheduledTime });
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
                    browser.alarms.get('RefocusAlarm', function (alarm) {
                        // If alarm doesn't exist create it
                        if (alarm) {
                            localStorage.removeItem('refocusAlarmScheduledTime');
                            localStorage.removeItem('refocusAlarmPauseTime');

                            localStorage.refocusAlarmScheduledTime = alarm.scheduledTime;
                            localStorage.refocusAlarmPauseTime = Date.now();
                            browser.alarms.clear("RefocusAlarm");
                        }
                        else {
                            // Do nothing
                        }
                    });
                }
            });
        }
    });
});

function startAlarm() {
    clearAlarm();
    
    browser.storage.sync.get("refocusTimeLimit", function (value) {
        browser.alarms.create('RefocusAlarm', {delayInMinutes: value.refocusTimeLimit});
    });
}

function clearAlarm() {
    localStorage.removeItem('refocusAlarmScheduledTime');
    localStorage.removeItem('refocusAlarmPauseTime');

    browser.alarms.clear("RefocusAlarm");
}

browser.alarms.onAlarm.addListener(function(alarm) {
    clearAlarm();

    browser.storage.sync.get({
        blacklist: []
    }, function (items) {
        var tabsToClose = [];
        browser.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (window) {
                window.tabs.forEach(function (tab) {
                    var url = new URL(tab.url);
                    if (items.blacklist.includes(url.hostname)) {
                        tabsToClose.push(tab.id);
                    }
                });
            });

            browser.storage.sync.get("refocusCloseTab", function (closeTabs) {
                if (closeTabs) {
                    browser.tabs.remove(tabsToClose);
                }
                else {
                    alert("Time's UP!");
                }
            });
        });
    })
});