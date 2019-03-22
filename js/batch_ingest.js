
var sa = new SheetsApi();
sa.handleClientLoad();

function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        //add method
        getID();
        getProgs();
        console.log("You are Signed In!")
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}



//Global Variables
let sheetHeaders;
let objectArray;
var data = [];
var validatedData = [];
var invalidData = [];
var validCount = 1;
var invalidCount = 1;
var idArray = [];
var idInfo = [];
var progArray = [];
var progInfo = [];
var nameReturned = ["PROGRAMS"];

var condition = {
    header: "PROGRAMS",
    value: "BA, Major in Applied Communication, Leadership and Culture",
};
conditions = [];
conditions[0] = condition;

validateProg();
//DATE
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var currentDate = year + "-" + month + "-" + day;
console.log(currentDate);



//function to get data from TSV file
function openFile(event) {
    var input = event.target;
    var reader = new FileReader();
    //reader returns result, split data by newline and by tab
    //results are stored in 2D array of [row][column]
    reader.onload=function(){
        var text = reader.result;
        data = text.split('\n');

        for(var i = 0; i < data.length; i++) {
            let temp = data[i].split('\t');
            data[i] = temp;
        }

        for(let i = 1; i < idInfo.length; i++){
            idArray[i] = idInfo[i][0];
        }
        console.log(idArray);

        for(let i = 1; i < progInfo.length; i++){
            progArray[i] = progInfo[i][0];
            console.log(progArray[i]);
        }

        validatedData[0] = data[0];
        invalidData[0] = data[0];

        //run through data for validation
        for(var j = 1; j < data.length; j++){
            console.log("Loop: " + j);


            if(validateEmail(data, j) && checkDupe(data, j)){ //ADD REST OF VALIDATION FUNCTIONS WHEN DB FULL
                validatedData[validCount] = data[j];
                validCount = validCount + 1;
                console.log("Is valid");
                console.log(validatedData);

            } else {
                console.log("not valid");
                invalidData[invalidCount] = data[j];
                invalidCount++;
            }
        }
        for(let i = 1; i < validatedData.length; i++) {
            validatedData[i][15] = currentDate;
        }
        console.log(data);
        console.log(validatedData);
        console.log(invalidData);
        window.localStorage.setItem("errors",JSON.stringify(invalidData));

    };
    console.log(input);
    reader.readAsText(input.files[0]);
}

//function to send data to sheet
function sendToSheet() {
    let actualRows = validatedData.length - 1;
    var rowNum = confirm("Are you sure you want to send " + data.length + " rows?");
    if (rowNum) {
        objectArray = arrayToObjects(validatedData);
        sa.getTableHeaders("UPLS").then(response => {
            sheetHeaders = sa.parseTableHeaders(response);
            sa.insertIntoTableColValues(sheetHeaders, "UPLS", objectArray).then(response => {
                console.log(sa.parseInsert(response));
            });
        });
    } else {}
    var errors = confirm("Only " + actualRows + " uploaded. To see errors, click OK");
    if(errors) {
        window.open("errors.html", "_blank");
    }
}

//validate email cells
function validateEmail(data,x){
    //validate email address
    if(!data[x][3].includes("@")){
        return false;
    } else{
        return true;
    }
}
//validate ID
function validateID(data,x){
    //validate student ID
    if(!data[x][0].match(/^[0-9]+$/)){
        return false;
    } else{
        return true;
    }
}
//validate any column with text(alpha only)
function validateText(data,x,y) {
    //validate any text
    if(!data[x][y].match(/^[A-Z]/)){
        return false;
    } else{
        return true;
    }
}
//validate Catalog year
function validateCatYear(data,x){
    //validate catalog year
    if(!data[x][11].match(/[0-9]+-/)){
        return false;
    } else{
        return true;
    }
}
//validate ingest date, probably not necessary
function validateDate(data, x){
    //validate the ingest date just to be sure
    if(!data[x][15].match(/^\d{4}-\d{2}-\d{2}$/)){
        return false;
    } else{
        return true;
    }
}
//check for duplicate ID's
function checkDupe(data,x){

    if(idArray.includes(data[x][0])){
        return false;
    } else { return true; }

}

function validateProg(data, x){
    //check programs_and_librarians to see if data[x][13] is it, if not open a new window to add the program desc in programs_and_libs
    if(progArray.includes(data[x][13])){
        return true;
    } else {return false;}


}

//function for 2D array to object array
function arrayToObjects(array) {
    let headers = array[0];
    let result = [];
    let tempStr = "";
    for (let i = 1; i < array.length; i++) {
        tempStr = "{";
        for (let j = 0; j< array[i].length; j++) {
            tempStr += "\"" + headers[j] + "\":\"" + array[i][j] + "\"";
            if (j < array[i].length - 1) {
                tempStr += ",";
            }
        }
        tempStr += "}";
        console.log(tempStr);
        result[i-1] = JSON.parse(tempStr.replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f"));
    }
    return result;
}
function getModal() {
//MODAL CREATION
// Get the modal
    var modal = document.getElementById('myModal');

// Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    var cancel = document.getElementById("cancel");
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }

    cancel.onclick = function () {
        modal.style.display = "none";
    }
// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
//GET STUDENT IDS
function getID() {

    sa.getSheet("UPLS").then(response => {
        idInfo = sa.parseSheetValues(response);
        console.log(idInfo);

    });

}

function getProgs() {
    sa.getSheet("PROGRAMS_AND_LIBRARIANS").then(response => {
        progInfo = sa.parseSheetValues(response);
    });
}
