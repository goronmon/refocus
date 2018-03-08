// Saves options to chrome.storage
function save_options() {
    var timeLimit = parseInt(document.getElementById('timeLimit').value);
    var closeTab = document.getElementById('closeTab').checked;
    chrome.storage.sync.set({
        refocusTimeLimit: timeLimit,
        refocusCloseTab: closeTab,
        blacklist: []
    }, function () {
        updateStatus('Options saved')
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value timeLimit of 10 and closeTab of true
    chrome.storage.sync.get({
        refocusTimeLimit: 10,
        refocusCloseTab: true,
        blacklist: []
    }, function (items) {
        document.getElementById('timeLimit').value = items.refocusTimeLimit;
        document.getElementById('closeTab').checked = items.refocusCloseTab;

        var blacklistHTML = "";
        for(var x = 0; x < items.blacklist.length; x++) {
            blacklistHTML += "<li>" + items.blacklist[x] + "<button onclick='deleteItem(" + items.blacklist[x] + ")'/></li>";
        }
        document.getElementById('blacklist').innerHTML = blacklistHTML;
    });
}

function deleteItem(itemValue) {
    chrome.storage.sync.get({
        blacklist: []
    }, function (items) {
        var index = items.blacklist.indexOf(itemValue);
        if (index > -1) {
            items.blacklist.splice(index, 1);
        }

        chrome.storage.sync.set({
            blacklist: items.blacklist
        }, restore_options);
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

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);