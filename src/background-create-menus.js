browser.menus.create({
    id:"Sasha's Assorted Utilities",
    title:"Sasha's Assorted Utilities",
    icons:{
        "16":"../icons/Sidebar_Utilities_Icon_16.png",
        "32":"../icons/Sidebar_Utilities_Icon_32.png"
    },
    contexts:["all", "bookmark", "tab", "tools_menu"]
}, onCreated)

browser.menus.create({
    id:"find-audible-tabs",
    title:"Find audible tabs",
    parentId:"Sasha's Assorted Utilities",
    contexts:["tab"]
}, onCreated)

browser.menus.create({
    id:"create-window-with-bookmarks",
    title:"Create Window with Bookmarks",
    parentId:"Sasha's Assorted Utilities",
    contexts:["bookmark"]
}, onCreated)

browser.menus.create({
    id:"create-window-with-bookmarks-discarded",
    title:"Create Window with Bookmarks - Discarded Tabs",
    parentId:"Sasha's Assorted Utilities",
    contexts:["bookmark"]
}, onCreated)

browser.menus.create({
    id:"create-windows-with-sub-folders",
    title:"Create Window with Bookmarks - Discarded Tabs - Sub-folders as windows",
    parentId:"Sasha's Assorted Utilities",
    contexts:["bookmark"]
}, onCreated)

browser.menus.create({
    id: "count-bookmarks",
    //title: browser.i18n.getMessage("menuItemCountBookmarks"),
    title:"Count Bookmarks",
    icons:{
        "32":"../icons/addition.png"
    },
    parentId:"Sasha's Assorted Utilities",
    contexts: ["bookmark"]
}, onCreated)

browser.menus.create({
    id: "export-bookmarks",
    //title: browser.i18n.getMessage("menuItemCountBookmarks"),
    title:"Export Folder to JSON",
    parentId:"Sasha's Assorted Utilities",
    contexts: ["bookmark"]
}, onCreated)

browser.menus.create({
    id:"discard_tab",
    title:"Discard Tab",
    parentId:"Sasha's Assorted Utilities",
    contexts:["tab"]
}, onCreated)

browser.menus.create({
    id:"discard_tabs_window",
    title:"Discard Tabs in Window",
    parentId:"Sasha's Assorted Utilities",
    contexts:["tab"]
}, onCreated)

browser.menus.create({
    id:"discard_windows",
    title:"Discard Tabs in all Windows",
    parentId:"Sasha's Assorted Utilities",
    contexts:["tab"]
}, onCreated)

browser.menus.create({
    id:"existing_tab",
    title:"Find if tab exists",
    parentId:"Sasha's Assorted Utilities",
    contexts:["tab"]
}, onCreated)
