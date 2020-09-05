console.log("Script loaded...")

document.getElementById("buttonMergePinTabs").addEventListener("click", async function(event){
    var selectedTabs = await getPinnedTabs();
    console.log("Returned: ", selectedTabs)
    mergeSelectedTabs(selectedTabs)
})

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPinnedTabs(){
    var tabs = []
    await browser.tabs.query({pinned:true}).then(res=>{
        console.log("Tabs")
        console.log(res)
        tabs = res
        //return res
    }).catch(err=>{
        return "oops"
    })
    return tabs
}

async function mergeSelectedTabs(selectedTabs) {
    var createData = {
        url:"../res.html"
    }
    var newWindow = await browser.windows.create(createData)
    
    var selectedTabIds = [];
    for (var t=0; t < selectedTabs.length; t++) {
        selectedTabIds.push(selectedTabs[t].id)
    }
    var moveProperties = {
        windowId:newWindow.id,
        index:0
    }
    //var moving = await browser.tabs.move(selectedTabIds, moveProperties)
    var moving = browser.tabs.move(selectedTabIds, moveProperties)
    moving.then(res =>{
        console.log("Should have moved all the tabs...")
        console.log(res)
    })
    moving.catch(err =>{
        console.log("ERROR: ", err)
    })
}

//Check that the page loaded
document.getElementById("body").addEventListener("onload", 
    function(){
        console.log("Body loaded...")
    }
)

//Add listener to update array of drop-down options
document.getElementById("buttonGetWindows").addEventListener("click", function(){
    var select = document.getElementById("selectSourceWindow")
    updateArray(select)
    var selectTarget = document.getElementById("selectTargetWindow")
    updateArray(selectTarget)
})

//Update the list of windows when a new window is created
browser.windows.onCreated.addListener((window) => {

})

//Empty the array of all values and populate it with the list of browser windows
function updateArray(DOMElement) {
    var select = DOMElement
    console.log("Length: ", select.options.length)
    console.log("OPTIONS: ", select.options)
    
    //THIS CLEARS THE ARRAY OF OPTIONS
    select.options.length = 0
    console.log("OPTIONS: ", select.options)

    //Populate list with IDs of the different windows
    browser.windows.getAll().then(res=>{
        console.log(res)
        
        for (var i=0; i < res.length; i++) {
            try {
                console.log(res[i].id)
                var elem = document.createElement("option");

                var title=res[i].title;                

                //To determine the maximum title length allowed, get the window width:
                var w = window.innerWidth
                            || document.documentElement.clientWidth
                            || document.body.clientWidth;
                
                var limit=0;

                //A sitch will PHYSICALLY NOT FUCKING WORK HERE GODDAMN FUCKING
                //JAVASCRIPT CAN'T DO BASIC GODDAMN FUCKING ARITHMETIC
                //WHY CAN'T I USE C OR JAVA OR AT LEAST FUCKING PYTHON
                //BUT NO LET'S ALL USE THIS GODAWFUL PIECE OF JS SHIT
                //WHERE 400<300 IS SOMEHOW EVALUATED TO TRUE
                //JS AND THE FUCKERS THAT MAKE IT CAN EAT SHIT AND DIE
                if(w<168){
                    limit=5;
                } else if(w<200){
                    limit=10;
                } else if (w<300){
                    limit=20;
                } else if (w<400){
                    limit=25;
                } else {
                    limit=50;
                }
                
                if(title.length > limit){title = (title.substring(0,limit) + "...")}

                elem.textContent = title;
                elem.value = '{"ID": '+ res[i].id +', "Title": "'+ res[i].title +'"}';
                select.add(elem);
            }
            catch (err) {
                console.log("ERROR: ", err)
            }
        }
    })
}

//Add change listeners to both drop-down lists (this isn't needed anymore)
document.getElementById("selectSourceWindow").addEventListener("change", changeSelect)
document.getElementById("selectTargetWindow").addEventListener("change", changeSelect)

function changeSelect(event) {
    var chosen = event.target.value
    //console.log("Value chosen: ", chosen, " ID: ", chosen.id, " Title: ", chosen.title)
    console.log("Value chosen: ", chosen)
    console.log(chosen)
    
    var values = JSON.parse(chosen)
    console.log(values)
    chosenWindow = chosen
}

//Add listener for Merging, and function to merge two windows
document.getElementById("buttonMerge").addEventListener("click", mergeWindows)
async function mergeWindows() {
    console.log("Merging....")

    var source = JSON.parse(document.getElementById("selectSourceWindow").value)
    var target = JSON.parse(document.getElementById("selectTargetWindow").value)

    console.log("Source: ", source)
    console.log("Target: ", target)

    var getInfo = {populate:true}
    var sourceWindow = await browser.windows.get(source.ID, getInfo)
    var targetWindow = await browser.windows.get(target.ID, getInfo)

    console.log("Source: ", sourceWindow)
    console.log("Target: ", targetWindow)

    var tabIds = [];
    for (var x = 0; x < sourceWindow.tabs.length; x++) {
        tabIds.push(sourceWindow.tabs[x].id)
    }

    var moveProperties = {
        windowId: targetWindow.id,
        index:0
    }

    browser.tabs.move(tabIds, moveProperties)

    console.log("Merged!")
}
