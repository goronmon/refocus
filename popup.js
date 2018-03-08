function blacklistCurrentSite() {
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        var url = new URL(tabs[0].url);
        var newBlacklistURL = url.hostname;

        chrome.storage.sync.get({
            blacklist: []
        }, function (items) {
            if (!items.blacklist.includes(url.hostname)) {
                items.blacklist.push(newBlacklistURL);

                chrome.storage.sync.set({
                    blacklist: items.blacklist
                }, function() {
                    updateStatus('Blacklist updated');
                });
            }
            else {
                updateStatus('Already in list');
            }
        });
    });
}

function updateStatus (text) {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = text;
    setTimeout(function () {
        status.textContent = '';
    }, 750);
}

document.getElementById('btnBlacklistSite').addEventListener('click',
    blacklistCurrentSite)