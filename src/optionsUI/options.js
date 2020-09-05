function saveOptions(e) {
    browser.storage.sync.set({
        colour: document.querySelector("#colour").value,
        SABUurlToSaveBookmarksTo: document.querySelector("#urlToSaveBookmarksTo").value
    });
    e.preventDefault();
}

function restoreOptions() {
    var storageItem = browser.storage.managed.get('colour');
    storageItem.then((res) => {
        document.querySelector("#managed-colour").innerText = res.colour;
    });

    var gettingItem = browser.storage.sync.get('colour');
    gettingItem.then((res) => {
        document.querySelector("#colour").value = res.colour || 'Firefox red';
    });

    var storageItem = browser.storage.managed.get('SABUurlToSaveBookmarksTo');
    storageItem.then((res) => {
        document.querySelector("#managed-urlToSaveBookmarksTo").innerText = res.SABUurlToSaveBookmarksTo;
    });

    var gettingItem = browser.storage.sync.get('SABUurlToSaveBookmarksTo');
    gettingItem.then((res) => {
        document.querySelector("#urlToSaveBookmarksTo").value = res.SABUurlToSaveBookmarksTo || 'Firefox red';
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);