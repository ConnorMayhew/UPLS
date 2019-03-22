var studentID = window.localStorage.getItem("studentID");

var sa = new SheetsApi();
sa.handleClientLoad();

function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        getName();
        createDiv();
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}



//columns to be returned
var nameReturned = ["LAST_NAME", "FIRST_NAME", "EMAIL"];
var interactionReturned = ["INTERACTION_TYPE", "INTERACTION_DATE", "LIBRARIAN_INITIATED", "FOLLOW_UP", "MINUTES", "COMMUNICATION_CHANNEL", "URL", "NOTES"];

//conditions to search by
var condition = {
    header: "STUDENT_ID",
    value: studentID,
};
conditions = [];
conditions[0] = condition;

//arrays to store returned info
var nameInfo = [];
var interactionInfo = [];
var send = [];

function getName() {
    sa.getSheet("UPLS").then(response => {
        nameInfo = sa.selectFromTableWhereConditions(response, nameReturned, conditions, 1);
        console.log(nameInfo);
        let nameDiv = document.createElement("div");
        let txt = document.createTextNode("Student Name: " + nameInfo[1][1] + " " + nameInfo[1][0]);
        send[0] = nameInfo[1][1]; //first name
        send[1] = nameInfo[1][0]; //last name
        send[2] = condition.value; //student ID
        send[3] = nameInfo[1][2]; //email
        window.localStorage.setItem("send",JSON.stringify(send));
        window.localStorage.setItem("returned", JSON.stringify(interactionReturned));
        console.log("Sending: " + send);
        // nameDiv.style.textAlign = "center";
        //nameDiv.style.marginLeft = "400px";
        let br = document.createElement("br");
        let txt3 = document.createTextNode(" Student ID: " + condition.value);
        nameDiv.appendChild(txt);
        nameDiv.appendChild(br);
        nameDiv.appendChild(txt3);
        document.getElementById("studentInfo").appendChild(nameDiv);
    });

}

function createDiv(){
    sa.getSheet("INTERACTION_TRACKING").then(response => {
        interactionInfo = sa.selectFromTableWhereConditions(response, interactionReturned, conditions, 1);
        console.log(interactionInfo);

        for(let i = 1; i < interactionInfo.length; i++)
        {
            let intDiv = document.createElement("div");
            intDiv.className = "ex0";
            let btn = document.createElement("BUTTON");
            let text = document.createTextNode("Select");
            btn.setAttribute("id", "btn" + i); //add IDs to buttons
            btn.addEventListener("click", function() {
                window.localStorage.setItem("interactionInfo",JSON.stringify(interactionInfo[i]));
                console.log("Sending: " + interactionInfo[i]);
                //will also need to open view_interaction page
                window.open("view_interaction.html", "_top");
            });
            btn.appendChild(text);
            btn.style.marginTop = "65px";
            intDiv.appendChild(btn);


            //infobox holds interaction info for each interaction
            let infoBox = document.createElement("div");
            infoBox.className = "ex2";
            intDiv.appendChild(infoBox);

            //create labels for interaction info
            let date = document.createTextNode("Date: " + interactionInfo[i][1]);
            let type = document.createTextNode("Type: " + interactionInfo[i][0]);
            let librarian = document.createTextNode("Librarian Initiated: " + interactionInfo[i][2]);
            let minuets = document.createTextNode("Time Spent: " + interactionInfo[i][4]);


            //add interaction data to interaction div
            infoBox.appendChild(date);
            infoBox.appendChild(document.createElement("div"));

            infoBox.appendChild(type);
            infoBox.appendChild(document.createElement("div"));

            infoBox.appendChild(librarian);
            infoBox.appendChild(document.createElement("div"));

            infoBox.appendChild(minuets);
            document.getElementById("main").appendChild(intDiv);
        }
    });



}