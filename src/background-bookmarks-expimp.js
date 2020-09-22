/** Downloads a bookmark or folder of bookmarks into a JSON file
 * @param {browser.bookmarks.BookmarkTreeNode} start the BookmarkTreeNode (Bookmark or Folder) to download
 */
async function downloadBookmarksFolderToFile(start){
    var bookmarks = [];
    var bookmark = await browser.bookmarks.get(start.bookmarkId)

    async function recursivelyGetFolderContents(item, path){
        //console.log(path)
        //TODO change from type to if has URL, as type is only available in Firefox
        if (item.type == "bookmark"){
            console.log("Got to a bookmark. Adding!")
            bookmarks.push(new BookmarkData(item.url, item.dateAdded, item.dateGroupModified, item.title, path))
        } else if(item.type == "folder") {
            console.log("Got a folder! getting contents...")
            var folderContents = await browser.bookmarks.getChildren(item.id)
            for (var i = 0; i < folderContents.length; i++){
                await recursivelyGetFolderContents(folderContents[i], path + "///---rsvp-delim---///" + item.title)
            }
        } else {
            throw "Bookmark item does not have a valid type!"
        }
    }
    await recursivelyGetFolderContents(bookmark[0], '')

    var bookmarksBlob = new Blob([JSON.stringify(bookmarks, null, 2)], {
        type:'application/json'
    })

    var bookmarksObjectUrl = URL.createObjectURL(bookmarksBlob);

    browser.downloads.download({
        filename : `bookmarks-${bookmark[0].title}-${getCurrentDateTimeDashedColoned()}.json`,
        saveAs: true,
        url: bookmarksObjectUrl,
        conflictAction : 'uniquify'
    });

    //Memory management, revoke URL for object. HOWEVER this can only be done ONCE the download is completed!
    function handleChanged(delta) {
        if (delta.state && delta.state.current === "complete") {
            console.log(`Download ${delta.id} has completed.`);
            URL.revokeObjectURL(bookmarksObjectUrl) //This actually does work, but is async I think
        }
    }

    browser.downloads.onChanged.addListener(handleChanged);
}