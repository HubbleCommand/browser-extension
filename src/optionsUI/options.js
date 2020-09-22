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

//Missnamed, should be completePath or makePath or something
async function resolvePath(subTree, path, root){
    
    var folderLocVar = null;
    async function recusivelyMakePath(currentTree, path, index){
        //Check if the current children have the correct child
        var correctFolder = currentTree.children.filter(item => item.title == path[index]);
        
        //If child is missing, create it
        if(correctFolder.length == 0 && path[index]){   //Adding && path[index] removes the empty folders that were being generated
            //Create the missing folder
            await browser.bookmarks.create({
                title: path[index],
                parentId : currentTree.id
            });

            await setTimeout(function(){}, 1000); //Not necessarily necessary, but if FF takes time to reindex the bookmarks, then we need to wait a bit

            currentTree = await browser.bookmarks.getSubTree(currentTree.id);
            currentTree = currentTree[0]
        }

        //Retrieve the correct folder. We need to do this again as if we have added a folder, then the old filter is out of date
        correctFolder = currentTree.children.filter(item => item.title == path[index]);
        if(Array.isArray(correctFolder)){
            correctFolder = correctFolder[0]
        }
        
        if(index < path.length && correctFolder){   //If it isn't the last folder, then keep going
            await recusivelyMakePath(correctFolder, path, index+1);
        } else {    //If we are done then set the folder to add to
            folderLocVar = currentTree;
        }
    }
    
    await recusivelyMakePath(subTree, path, 0);
    
    if(folderLocVar){   //If we have found the correct folder to add to
        console.log("Creating bookmark in : ")
        console.log(folderLocVar);
        return folderLocVar;
    } else {    //If some sort of error has occured
        console.log("WAAAAH")
    }
}

//Handle a file that has been chosen for reimport
async function handlePicked() {
    try{
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
    
        console.log(createNewFolderRoot)
        var subtree = null;
        //console.log(await browser.bookmarks.getSubTree(createNewFolderRoot.id))
        console.log(await browser.bookmarks.getSubTree("toolbar_____"))
    
        //Iterate over the bookmarks to import, and create them!
        for(item of data){
            var newBookmarkParentId;
    
            console.log("Creating bookmark for: ")
            console.log(item)
    
            //Before we create the new bookmark, we need to make sure that it's path exists
            subtree = await browser.bookmarks.getSubTree(createNewFolderRoot.id);
            if(typeof item.path == "string"){
                var path = item.path.split("///---rsvp-delim---///")
                path.shift()
                
                newBookmarkParentId = await resolvePath(subtree[0], path, subtree[0])
                if(newBookmarkParentId.id){
                    newBookmarkParentId = newBookmarkParentId.id;
                }
                if(typeof newBookmarkParentId != "string"){
                    newBookmarkParentId = createNewFolderRoot.id;
                }
            } else {
                newBookmarkParentId = createNewFolderRoot.id;
            }
    
            //Create the new bookmark
            await browser.bookmarks.create({
                parentId:   newBookmarkParentId,
                title:      item.title,
                url:        item.href
            })
            
            document.getElementById("loadingImportBookmarksProgress").innerHTML = "Import progress : " + counter + " / " + numberOfItemsToImport;
            counter += 1;
        }
        console.log("Done importing!!!");
        document.getElementById("loadingImportBookmarksProgress").innerHTML = "Import progress : not importing any bookmarks...";
        document.getElementById("input").disabled = false;  //re-enable the button
    } catch (err) {
        document.getElementById("loadingImportBookmarksErrors").innerHTML = "AN ERROR HAS OCCURED. CHECK THE LOGS";
        document.getElementById("loadingImportBookmarksProgress").innerHTML = "Import progress : not importing any bookmarks...";
        document.getElementById("input").disabled = false;  //re-enable the button
    }
    
}

const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handlePicked, false);

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);