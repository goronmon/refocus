// Saves options to browser.storage
function save_options() {
    var timeLimit = parseInt(document.getElementById('timeLimit').value);
    var closeTab = document.getElementById('closeTab').checked;
    browser.storage.sync.set({
        refocusTimeLimit: timeLimit,
        refocusCloseTab: closeTab,
        blacklist: []
    }, function () {
        updateStatus('Options saved')
    });
}

// Restores select box and checkbox state using the preferences
// stored in browser.storage.

function onGetRestore(items) {
  document.getElementById('timeLimit').value = items.refocusTimeLimit;
  document.getElementById('closeTab').checked = items.refocusCloseTab;

  let blacklist = document.getElementById('blacklist');
  for(var x = 0; x < items.blacklist.length; x++) {
    let li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = items.blacklist[x];
    let button = document.createElement('button');
    button.name = 'btnDelete';
    button.className = 'btn btn-danger btn-sm btn-delete-item';
    button.value = items.blacklist[x];
    button.textContent = 'Delete';
    li.appendChild(button);
    blacklist.appendChild(li);
  }
}

function restore_options() {
    // Use default value timeLimit of 10 and closeTab of true
    let getRestore = browser.storage.sync.get({
        refocusTimeLimit: 10,
        refocusCloseTab: true,
        blacklist: []
    });
    getRestore.then(onGetRestore);
}

function deleteItem(itemValue) {
    browser.storage.sync.get({
        blacklist: []
    }, function (items) {
        var index = items.blacklist.indexOf(itemValue);
        if (index > -1) {
            items.blacklist.splice(index, 1);
        }

        browser.storage.sync.set({
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

document.getElementById('blacklist').addEventListener('click', function(event) {
    handleDelete(event.target);
});
function handleDelete(element) {
    var siteToRemove = element.value;
    deleteItem(siteToRemove);
}