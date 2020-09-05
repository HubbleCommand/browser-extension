function onCreated() {
    if (browser.runtime.lastError) {
      console.log(`Error: ${browser.runtime.lastError}`);
    } else {
      console.log("Item created successfully");
    }
}

var count = 0;
var counters = [];

async function countBookmarksInFolder(folder, parent){
    for(var i = 0; i < folder.length; i++) {
        if(folder[i].type == "bookmark"){
            const index = counters.findIndex(counter => counter.id === parent)
            if (index === -1) {
                console.log("This is weird...")
            } else {
                counters[index] = {id:parent, count:(counters[index].count + 1)};
            }
            //count += 1;
        } else if(folder[i].type == "folder"){
            var NewNode = await browser.bookmarks.getChildren((await browser.bookmarks.get(folder[i].id))[0].id)
            await countBookmarksInFolder(NewNode, parent)
        } else {
            console.log("Else...")
        }
    }
}

async function findSameTitledTabs(_title){
    return await browser.tabs.query({
        title:_title
    })
}

let urls = [];

async function getUrls(_bookmarks){
    for(let index = 0; index < _bookmarks.length; index ++){
        if(_bookmarks[index].type == "folder"){
            getUrls(_bookmarks[index].children)
        } else if (_bookmarks[index].type == "bookmark"){
            urls.push(_bookmarks[index].url)
        } else {
            
        }
    }
}

async function getUrlsRec(_bookmarksToAnalyse, _bookMarks){
    
}

function createBrowserNotification(_params){
    browser.notifications.create({
        type:"basic",
        message:_params.message,
        title:_params.title,
    })
}

function sendURLToServer(url){
    var gettingItem = browser.storage.sync.get('SABUurlToSaveBookmarksTo');
    gettingItem.then((res) => {
        //document.querySelector("#urlToSaveBookmarksTo").value = res.SABUurlToSaveBookmarksTo || 'Firefox red';
        console.log("Sending to..."); console.log(res.SABUurlToSaveBookmarksTo);
        //url = http://77.150.252.80:4011/bookmarks/add
        var request = fetch(res.SABUurlToSaveBookmarksTo, 
            {
                method:'post', 
                body:{
                    url:url
                } 
            }
        ).then(function(response) {
            console.log(response)
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    createBrowserNotification({message:"HTTP server error: " + response.status, title:"Send Tab to Server (error)"})
                    return;
                } else {
                    // Examine the text in the response
                    response.json().then(function(data) {
                        console.log(data);
                        createBrowserNotification({message:"Tab sent to server!", title:"Send Tab to Server"})
                    }).catch(function(error){
                        createBrowserNotification({message:"Couldn't parse server response, something bad probably happed!", title:"Send Tab to Server (error)"})
                    })
                }
        }).catch(function(err) {
            console.log('Fetch Error :-S', err);
            createBrowserNotification({message:"Could not retrieve the server URL to send the tab to...", title:"Send Tab to Server (error)"})
        });
    });
}

browser.contextMenus.onClicked.addListener(async function(info, tab, bookmark) {
    console.log("Info: ")
    console.log(info)
    console.log("Tab: ")
    console.log(tab)
    switch (info.menuItemId) {
        case "save-window":
            await saveSavedWindows(await browser.windows.get(tab.windowId, {populate:true}))
            break;

        case "load-window":
            browser.windows.create()
            break;

        case "count-bookmarks":
            if(counters.findIndex(count => count.id === info.bookmarkId) === -1){
                counters.push({id:info.bookmarkId, count:0});
                var value = await browser.bookmarks.get(info.bookmarkId)
                await countBookmarksInFolder(value, info.bookmarkId)
                var index = counters.findIndex(count => count.id === info.bookmarkId)
                var creating = browser.notifications.create({
                    type:"basic",
                    message:"There are "+counters[index].count+ " bookmarks in folder:   " + value[0].title,
                    title:"Count Bookmarks",
                })
                counters = counters.filter((value,index,arr)=>{
                    return value.id !== info.bookmarkId
                })
            } else {
                createBrowserNotification({message:"Counter is already active on this folder!", title:"Count Bookmarks"})
                /*
                var creating = browser.notifications.create({
                    type:"basic",
                    message:"Counter is already active on this folder!",
                    title:"Count Bookmarks",
                })*/
            }
            break;

        case "find-audible-tabs":
            let mutedTabs = await browser.tabs.query({
                audible:true
            })
            console.log(mutedTabs)
            createBrowserNotification({message:"Audible tabs: " + mutedTabs, title:"Count Bookmarks"})
            break;

        case "discard_tab":
            console.log("Discarding...")
            await browser.tabs.discard(tab.id)
            console.log("Discarded...")
            break;

        case "discard_tabs_window":
            console.log("Discarding window...")
            await browser.tabs.discard((await browser.tabs.query({windowId:tab.windowId})).map(a=>a.id))
            console.log("Discarded window!")
            break;

        case "discard_windows":
            console.log("Discarding windows...")
            await browser.tabs.discard((await browser.tabs.query({windowType:"normal"})).map(a=>a.id))
            console.log("Discarded windows!")
            break;

        case "existing_tab":
            console.log("Finding existing...")
            let similar_tabs = await findSameTitledTabs(tab.title);
            console.log(similar_tabs)
            let _message = "";
            if(similar_tabs.length == 1) {
                console.log("Done... tab isn't duplicate!")
                _message = "Tab isn't duplicate"
            } else {
                console.log("Done... tab exists!")
                _message = "Tab is duplicate!"
            }
            browser.notifications.create({
                type:"basic",
                message:_message,
                title:"Count Bookmarks",
            })
            break;

        case "create-window-with-bookmarks":
            let bookmarkroot = await browser.bookmarks.get(info.bookmarkId);
            let windowcreateparams = {};
            console.log("Bookmarks root: ")
            console.log(bookmarkroot)

            if(bookmarkroot[0].type == "folder") {
                let bmsubtree = await browser.bookmarks.getSubTree(info.bookmarkId)
                console.log(bmsubtree)
                await getUrls(bmsubtree)
                windowcreateparams.url = urls
                urls = [];
            } else if (bookmarkroot[0].type == "bookmark") {
                windowcreateparams.url = bookmarkroot[0].url;
            } else {
                console.log("Error with bookmarktype")
            }
            console.log("Window Create Params")
            console.log(windowcreateparams)
            browser.windows.create(windowcreateparams);
            break;

        case "create-window-with-bookmarks-discarded":
            let bookmarkrootdisc = await browser.bookmarks.get(info.bookmarkId);
            var window = await browser.windows.create();
            
            if(bookmarkrootdisc[0].type == "folder") {
                let bmsubtree = await browser.bookmarks.getSubTree(info.bookmarkId)
                await getUrls(bmsubtree)
                for(var i = 0; i < urls.length; i++){
                    browser.tabs.create({
                        discarded:true,
                        windowId: window.id,
                        url : urls[i]
                    })
                }
                urls = [];
            } else if (bookmarkrootdisc[0].type == "bookmark") {
                browser.tabs.create({
                    discarded:true,
                    windowId: window.id,
                    url : bookmarkrootdisc[0].url
                })
            } else {
                console.log("Error with bookmarktype")
            }
            break;

        case "create-windows-with-sub-folders":
            break;


        //TODO next two parts
        case "sabu-send-bookmark-server":
            //Get bookmark, send to server
            var bookmark = await browser.bookmarks.get(info.bookmarkId)
            sendURLToServer(bookmark.url);
            break;
        case "sabu-send-tab-server":
            //Get tab, bookmark it, send to server
            sendURLToServer(tab.url);
            /*var gettingItem = browser.storage.sync.get('SABUurlToSaveBookmarksTo');
            gettingItem.then((res) => {
                //document.querySelector("#urlToSaveBookmarksTo").value = res.SABUurlToSaveBookmarksTo || 'Firefox red';
                console.log("Sending to..."); console.log(res.SABUurlToSaveBookmarksTo);
                //url = http://77.150.252.80:4011/bookmarks/add
                var request = fetch(res.SABUurlToSaveBookmarksTo, 
                    {
                        method:'post', 
                        body:{
                            url:tab.url
                        } 
                    }
                ).then(function(response) {
                    console.log(response)
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' + response.status);
                            createBrowserNotification({message:"HTTP server error: " + response.status, title:"Send Tab to Server (error)"})
                            return;
                        } else {
                            // Examine the text in the response
                            response.json().then(function(data) {
                                console.log(data);
                                createBrowserNotification({message:"Tab sent to server!", title:"Send Tab to Server"})
                            }).catch(function(error){
                                createBrowserNotification({message:"Couldn't parse server response, something bad probably happed!", title:"Send Tab to Server (error)"})
                            })
                        }
                }).catch(function(err) {
                    console.log('Fetch Error :-S', err);
                    createBrowserNotification({message:"Could not retrieve the server URL to send the tab to...", title:"Send Tab to Server (error)"})
                });
            });*/
            break;
        case "export-bookmarks":
            
            break;
        
        default:
            console.log("Default...")

            if(info.menuItemId.includes("tab-mover-window+")){
                let window_id_target = info.menuItemId.substring("tab-mover-window+".length, info.menuItemId.length)
                let move_properties = {
                    windowId: parseInt(window_id_target),
                    index: -1
                }
                console.log(window_id_target)
                browser.tabs.move(tab.id, move_properties)
            } else {

            }
            break;
    }
})

console.log("Background loaded!")
