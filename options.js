// Saves options to chrome.storage
function save_options() {
    var timeLimit = parseInt(document.getElementById('timeLimit').value);
    var closeTab = document.getElementById('closeTab').checked;
    chrome.storage.sync.set({
        refocusTimeLimit: timeLimit,
        refocusCloseTab: closeTab,
        blacklist: []
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
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
            blacklistHTML += '<li>' + items.blacklist[x] + '</li>';
        }
        document.getElementById('blacklist').innerHTML = blacklistHTML;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);