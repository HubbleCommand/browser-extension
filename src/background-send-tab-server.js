
/*var gettingItem = browser.storage.sync.get('SABUurlToSaveBookmarksTo');
gettingItem.then((res) => {
    //document.querySelector("#urlToSaveBookmarksTo").value = res.SABUurlToSaveBookmarksTo || 'Firefox red';
    console.log(res.SABUurlToSaveBookmarksTo)


    //var request = fetch('http://example.com').then(
    //test url http://77.150.252.80:7070
    var request = fetch(res.SABUurlToSaveBookmarksTo).then(
        function(response) {
            if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
            }

            // Examine the text in the response
            console.log(response)
        }
    ).catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
});*/

//Menu to send a bookmark to the server
browser.menus.create({
    id: "sabu-send-bookmark-server",
    //title: browser.i18n.getMessage("menuItemCountBookmarks"),
    title:"Send Bookmark To Server",
    parentId:"Sasha's Assorted Utilities",
    contexts: ["bookmark"]
}, onCreated)

//Menu to send a specific tab to the server (and bookmark it)
browser.menus.create({
    id: "sabu-send-tab-server",
    //title: browser.i18n.getMessage("menuItemCountBookmarks"),
    title:"Send Tab To Server",
    parentId:"Sasha's Assorted Utilities",
    contexts: ["tab"]
}, onCreated)



console.log("Background send tab to server loaded!")