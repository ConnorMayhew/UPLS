let sa = SheetsApi();
sa.handleClientLoad();
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        getStudentInfo();
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

function getStudentInfo(){
  var id = window.localStorage.getItem("studentID");
  var condition = {header : "STUDENT_ID",value : id,};
  var headers = [];
  var arrayaa = [];
  var studentInfo = [];
  var conditions = new Array();
  conditions[0] = condition;
  sa.getSheet("UPLS").then(response => {
    headers = sa.parseTableHeaders(response);
    studentInfo = sa.selectFromTableWhereConditions(response,"*",conditions,1);
    var commentsDiv = document.createElement('div');
    var body = document.getElementsByTagName("body")[0];
    var table = document.createElement("table");
    var tbody = document.createElement("body");
    var commentsRow = document.createElement("tr");
    var commentsHeader = document.createElement("td");
    var commentsContent = document.createElement("td");
    for (var a =0; a < headers.length; a++){
      if (headers[a] != "GENERAL_COMMENT"){
        var row = document.createElement("tr");
	var header = document.createElement("td");
	header.setAttribute("style","text-align: left");
        var headerContent = document.createElement("td");
	headerContent.setAttribute("style","text-align: right");
	var headerText = document.createTextNode(headers[a]);
	var contentText = document.createTextNode(studentInfo[1][a]);
	header.appendChild(headerText);
	headerContent.appendChild(contentText);
	row.appendChild(header);
	row.appendChild(headerContent);
        tbody.appendChild(row);
      }
      if (headers[a] == "GENERAL_COMMENT"){
        var generalCommentHeader = document.createTextNode(headers[a]);
	var scrollableDiv = document.createElement('div');
	scrollableDiv.setAttribute("style","float: right;height:40px;width:120px;border:1px solid #ccc;overflow:auto;");
	var commentsString = document.createTextNode(studentInfo[1][a]);
	scrollableDiv.appendChild(commentsString);
	commentsHeader.appendChild(generalCommentHeader);
        commentsContent.appendChild(scrollableDiv);
	commentsRow.appendChild(commentsHeader);
	commentsRow.appendChild(commentsContent);
      }
    }
    tbody.appendChild(commentsRow);
    table.appendChild(tbody);
    body.appendChild(table);
    document.getElementsByTagName('body')[0].appendChild(commentsDiv);
    var editBtn = document.createElement("BUTTON");
    var t = document.createTextNode("Go to edit student");
    editBtn.onclick = function(){
      window.location.href="edit_student.html";
    };
    editBtn.appendChild(t);
    editBtn.setAttribute("class","small_button");
    var backBtn = document.createElement("BUTTON");
    var t = document.createTextNode("Main Menu");
    backBtn.onclick = function(){
      window.location.href="index.html";
    };
    backBtn.appendChild(t);
    backBtn.setAttribute("class","small_button");
    document.getElementsByTagName('body')[0].appendChild(backBtn);
    document.getElementsByTagName('body')[0].appendChild(editBtn);
  });
}
