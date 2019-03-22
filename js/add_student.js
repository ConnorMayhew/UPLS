var columns = [];
var array = [];
let sa = new SheetsApi();
sa.handleClientLoad();

function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        //add method

        console.log("You are Signed In!")
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

let sheetHeaders;
let objectArray;

function getParams(){
    var idx = document.URL.indexOf('?');
    var params = [];
    if (idx != -1) {
        var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
        for (var i=0; i<pairs.length; i++){
            nameVal = pairs[i].split('=');
            params[nameVal[0]] = nameVal[1];
        }
    }
    return params;
}
params = getParams();
//studentIDString = unescape(params["studentID"]);
//studentIDInt = parseInt(studentIDString);
columns[0] = unescape(params["studentID"])
columns[1] = unescape(params["firstName"]);
columns[2] = unescape(params["lastName"]);
columns[3] = unescape(params["email"]);
columns[4] = unescape(params["progStatus"]);
columns[5] = unescape(params["progCode"]);
columns[6] = unescape(params["progDesc"]);
columns[7] = unescape(params["deptName"]);
columns[8] = unescape(params["deptCode"]);
columns[9] = unescape(params["divCode"]);
columns[10] = unescape(params["divName"]);
columns[11] = unescape(params["honCode"]);
columns[12] = unescape(params["classLvl"]);
columns[13] = unescape(params["cataYear"]);
columns[14] = unescape(params["majors"]);
columns[15] = unescape(params["main_major"]);
columns[16] = unescape(params["minors"]);
columns[17] = unescape(params["frozen"]);
console.log(columns);
array[0] = ["STUDENT_ID", "FIRST_NAME", "LAST_NAME", "EMAIL", "PROG_STATUS", "PROG_CODE", "PROG_DESC", "DEPT_NAME", "DEPT_CODE", "DIV_CODE", "DIV_NAME", "HON_CODE", "CLASS_LVL", "CATA_YEAR", "MAJORS", "MAIN_MAJOR", "MINORS", "FROZEN"];
array[1] = columns;
sheetHeaders = array[0];
objectArray = arrayToObjects(array);


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


}//Function to display student information for review
function dispStudent(){
    for (let i = 0; i < array[0].length; i++) {
        document.writeln("<pre>");
        document.write(sheetHeaders[i] + ": ");
        document.write(columns[i]);
    }
}

//Function to add a student using API.js functions
function addStudent(){
    sa.getTableHeaders("UPLS").then(response => {
        sheetHeaders = sa.parseTableHeaders(response);
        sa.insertIntoTableColValues(sheetHeaders, "UPLS", objectArray).then(response => {
            console.log(sa.parseInsert(response));
            window.alert("You've added a student");
        });
    });

}
