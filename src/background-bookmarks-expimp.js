/*var fs = require('fs');

fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
}); */

//Components.utils.import("resource://gre/modules/osfile.jsm", this)

class BookmarkData {
  constructor(href, date_added, date_modified, title) {
      this.href = href;
      this.date_added = date_added;
      this.date_modified = date_modified;
      this.title = title;
    }
}

/**
 * 
 */
async function downloadBookmarksFolderToFile(start){
  var bookmarks = [];
  /*Get all the sub-bookmarks*/

  console.log(start.bookmarkId)
  var bookmark = await browser.bookmarks.get(start.bookmarkId)

  console.log("Bookmark")
  console.log(bookmark)
  
  async function recursivelyGetFolderContents(item){
    //console.log("Checking object: ...")
    //console.log(item)
    //console.log(typeof item.type)

    if (item.type == "bookmark"){
      console.log("Got to a bookmark. Adding!")
      //bookmarks.push(new BookmarkData(item.url, item.dateAdded, item.dateGroupModified, item.title))
      bookmarks.push({
        url : item.url, 
        date_added : item.dateAdded,
        date_modified : item.dateGroupModified,
        title : item.title})
    } else if(item.type == "folder") {
      console.log("Got a folder! getting contents...")
      var folderContents = await browser.bookmarks.getChildren(item.id)
      console.log("FOlder has : " + folderContents.length)
      for (var i = 0; i < folderContents.length; i++){
        await recursivelyGetFolderContents(folderContents[i])
      }
    } else {
      //folder.children.forEach(element => recursivelyGetFolderContents(element))
      console.log("Oh fuck off...")
      console.log(item.type)
    }
  }
  await recursivelyGetFolderContents(bookmark[0])

  //console.log("Bookmarks")
  //console.log(bookmarks)

  //Have gotten bookmarks, save them!
  var bookmarksBlob = new Blob([JSON.stringify(bookmarks, null, 2)]/*bookmarks*/, {
    type:'application/json'
  })

  var bookmarksObjectUrl = URL.createObjectURL(bookmarksBlob);
  console.log(bookmarksObjectUrl)

  /*var downloading = browser.downloads.download(
    {
      filename : "bookmarks.txt",
      saveAs: false,
      url: bookmarksObjectUrl,
      conflictAction : "overwrite"
    }
  )*/

  function onStartedDownload(id) {
    console.log(`Started downloading: ${id}`);
  }
  
  function onFailed(error) {
    console.log(`Download failed: ${error}`);
  }
  
  var downloading = browser.downloads.download({
    /*url : downloadUrl,
    filename : 'my-image-again.png',
    conflictAction : 'uniquify'*/
    filename : "bookmarks.json",
    saveAs: false,
    url: bookmarksObjectUrl,
    conflictAction : "overwrite"
  });
  
  downloading.then(onStartedDownload, onFailed);

  //Memory management, revoke URL for object
  //HOWEVER this can only be done ONCE the download is completed
  //await(1000)
  //URL.revokeObjectURL(bookmarksObjectUrl)
}