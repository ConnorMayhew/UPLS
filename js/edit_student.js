var sa = new SheetsApi();
sa.setKeys("1SWI9vIs5OLg03q3pGzRNLXkvtpvyAUh5Qp3_NYv8jYM", "AIzaSyD5KpN_FCSGTRJGlDFN9CvXD3gyg-f8ZC4", "656316403501-g3io4mu5ibfebpls8jrnht04rg8g2mr1.apps.googleusercontent.com");
sa.handleClientLoad();

function updateSignInStatus(isSignedIn){
    if(isSignedIn){
        disp();
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}


var studentInfo = [];
var sheetHeaders = [];
var condition = {
    header: "STUDENT_ID",
    value: "98754",
};
conditions = [];
conditions[0] = condition;
var main = document.createElement("div");
    main.className = "ex0";
    var headers = document.createElement("div");
    headers.className="ex1";
    var info = document.createElement("div");
    info.className="ex2";
   /* main.appendChild(headers);
    main.appendChild(info);*/
    document.getElementById("main").appendChild("headers");
    document.getElementById("main").appendChild("info");


function disp() {
    sa.getTableHeaders("UPLS").then(response => {
        sheetHeaders = sa.parseTableHeaders(response);
        console.log(sheetHeaders);

        sa.getSheet("UPLS").then(response => {
            studentInfo = sa.selectFromTableWhereConditions(response, sheetHeaders, conditions, 1);
            console.log(studentInfo);
            for(let i = 0; i < sheetHeaders.length; i++){
                document.writeln(sheetHeaders[i]);

            }
        });
    });





}