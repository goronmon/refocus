function blacklistCurrentSite() {
    chrome.tabs.query({'active': true}, function (tabs) {
        var url = tabs[0].url;
        var newBlacklistURL = url.hostname;

        chrome.storage.sync.get({
            blacklist: []
        }, function (items) {
            items.blacklist.push(newBlacklistURL);

            chrome.storage.sync.set({
                blacklist: blacklist
            });
        });
    });
}