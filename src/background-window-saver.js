browser.storage.onChanged.addListener((changes, area)=>{
    console.log("Storage changed...")
    console.log(changes)
    loadSavedWindows()
})

async function addSavedWindowMenuItem(saved_window){
    console.log("Adding window:: " +saved_window)
    await browser.menus.create({
        id:"load-window-"+saved_window,
        title:"Load Saved Window tabs",
        parentId:"load-window",
        contexts: ["tab"]
    }, onCreated)
}

async function saveSavedWindows(window){
    console.log("Saving Window: ")
    console.log(window)
    let currentExtensionData = await browser.storage.local.get("SABU")
    console.log(currentExtensionData)
    let currentWindows = currentExtensionData.savedWindows
    if(currentWindows === undefined){
        currentWindows = []
    }
    currentWindows.push(window)
    currentExtensionData.SABU["savedWindows"] = currentWindows
    console.log(currentExtensionData)
    await browser.storage.local.set(currentExtensionData)
}

async function setupExtensionDataStorage(){
    await browser.storage.local.set({"SABU":{}})
}
setupExtensionDataStorage()

async function loadSavedWindows(){
    console.log("Loading saved windows")
    let saved_windows = await browser.storage.local.get("SABU")
    console.log("Saved windows")
    console.log(saved_windows)
    saved_windows = saved_windows.SABU.savedWindows
    console.log("Saved windows")
    console.log(saved_windows)
    if(saved_windows !== undefined){
        for(var i = 0; i <= saved_windows.length - 1; i++){
            console.log("Adding another window: " + i)
            await addSavedWindowMenuItem(saved_windows[i]);
        }
    } else {
        console.log("Huh...")
    }
}
//loadSavedWindows();

browser.menus.create({
    id:"window-saver",
    title:"Window saver",
    parentId:"Sasha's Assorted Utilities",
    contexts: ["tab"]
}, onCreated)

browser.menus.create({
    id:"load-window",
    title:"Load Saved Window tabs",
    parentId:"window-saver",
    contexts: ["tab"]
}, onCreated)

browser.menus.create({
    id:"save-window",
    title:"Save Window tabs",
    parentId:"window-saver",
    contexts: ["tab"]
}, onCreated)
