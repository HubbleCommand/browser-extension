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

async function handlePicked() {
    document.getElementById("input").disabled = true;   //First, disable the button to select a file
    
    console.log(this.files)
    var data = await this.files[0].text();
    data = JSON.parse(data);

    //Create the new folder
    var createNewFolderRoot = await browser.bookmarks.create({
        parentId:"toolbar_____",
        title:"(just imported) " + this.files[0].name,
        type:"folder"
    })

    var numberOfItemsToImport = data.length;
    var counter = 0;
    console.log("numberOfItemsToImport")
    console.log(numberOfItemsToImport)

    //Iterate over the bookmarks to import, and create them!
    for(item of data){
        await browser.bookmarks.create({
            parentId:createNewFolderRoot.id,
            title:item.title,
            url:item.href
        })
        
        document.getElementById("loadingImportBookmarksProgress").innerHTML = "Import progress : " + counter + " / " + numberOfItemsToImport;
        counter += 1;
    }
    console.log("Done importing!!!");
    document.getElementById("input").disabled = false;  //re-enable the button
}

const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handlePicked, false);

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);