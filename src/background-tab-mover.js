browser.menus.create({
    id:"tab-mover",
    title:"Move Tab",
    parentId:"Sasha's Assorted Utilities",
    contexts: ["tab"]
}, onCreated)

var windowMenuIDs = []; //Holds a reference to all of the menu item ids that are for holding windows

async function getWindows(){
    let windows = [] 
    windows = await browser.windows.getAll();
    for(var i = 0; i < windows.length; i++){
        windows[i] = {
            id: windows[i].id,
            title: windows[i].title
        }
    }
    updateBrowserMenu(windows)
}

async function start(){
    getWindows()
}

browser.windows.onCreated.addListener((window) => {
    getWindows()
})

browser.windows.onRemoved.addListener((window) => {
    getWindows()
})

async function updateBrowserMenu(_windowids){
    //Remove the previous menu items
    windowMenuIDs.forEach(async function(item, index){
        await browser.menus.remove(item)
    })

    //Add new menu items
    for(var i = 0; i < _windowids.length; i++){
        let menuId = "tab-mover-window+" + _windowids[i].id;
        windowMenuIDs.push(menuId);
        browser.menus.create({
            id: menuId,
            title:"Move Tab to window : " + _windowids[i].title,
            parentId:"tab-mover",
            contexts: ["tab"]
        }, onCreated)
    }
}

start()