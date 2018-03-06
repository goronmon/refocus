function blacklistCurrentSite() {
    chrome.tabs.query({'active': true}, function (tabs) {
        var url = new URL(tabs[0].url);
        var newBlacklistURL = url.hostname;

        chrome.storage.sync.get({
            blacklist: []
        }, function (items) {
            items.blacklist.push(newBlacklistURL);

            chrome.storage.sync.set({
                blacklist: items.blacklist
            });
        });
    });
}

document.getElementById('btnBlacklistSite').addEventListener('click',
    blacklistCurrentSite)