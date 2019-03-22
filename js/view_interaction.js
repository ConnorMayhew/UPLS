var sa = new SheetsApi();
sa.handleClientLoad();

function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        disp();
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}
var sheetHeaders = [];

function disp() {
    sa.getTableHeaders("INTERACTION_TRACKING").then(response => {
        sheetHeaders = sa.parseTableHeaders(response);
        console.log(sheetHeaders);
    });
    var receiveName = JSON.parse(window.localStorage.getItem("send")); // Retrieving
    console.log("Received: " + receiveName);
    var receiveInteraction = JSON.parse(window.localStorage.getItem("interactionInfo"));
    console.log("Received: " + receiveInteraction);
    var combine2 = receiveName.concat(receiveInteraction);
    var intReturned = JSON.parse(window.localStorage.getItem("returned")); //rest of headers
    console.log("Second Set of headers: " + intReturned);
    var sInfo = ["First Name:", "Last Name:", "ID:", "Email:"];
    var combine = sInfo.concat(intReturned);
    console.log("Combined: " + combine);

    let tagDiv = document.createElement("div");
    tagDiv.className = "ex4";
    let dataDiv = document.createElement("div");
    dataDiv.className = "ex5";

    for (let c = 0; c < combine.length; c++) {
        combine[c] = combine[c].toLowerCase().charAt(0).toUpperCase() + combine[c].slice(1).toLowerCase();
        combine[c] = combine[c].replace(/_/g, ' ');

    }

    for (var i = 0; i < combine.length - 1; i++) {
        if (combine != null) {
            let tag = document.createTextNode(combine[i]);
            tagDiv.appendChild(tag);
            tagDiv.appendChild(document.createElement("br"));
            tagDiv.appendChild(document.createElement("br"));

            document.getElementById("main").appendChild(tagDiv);
        }
    }

    for (var j = 0; j < combine2.length - 1; j++) {
        if (combine2 != null) {
            let data = document.createTextNode(combine2[j]);
            dataDiv.appendChild(data);
            dataDiv.appendChild(document.createElement("br"));
            dataDiv.appendChild(document.createElement("br"));

            document.getElementById("main").appendChild(dataDiv);
        }
    }

    let noteDiv = document.createElement("div");
    let noteBox = document.createElement("div");
    noteDiv.className = "ex2";
    noteBox.className = "ex3";
    let noteTag = document.createTextNode("Notes: ");
    let notes = document.createTextNode(receiveInteraction[7]);
    tagDiv.appendChild(noteTag);
    noteBox.appendChild(notes);
    noteDiv.appendChild(noteBox);
    document.getElementById("main").appendChild(noteDiv);

}