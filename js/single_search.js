/*
 * 	This file will handle the JS methods required for the function of the single search page. 
 *  Created 2019/03/04 by Connor Mayhew
 *  Last Edited 2019/03/15 by Connor Mayhew
 */
 
let sa = new SheetsApi();
//!!set key!!-- remove this in final product (at least remove keys in pull requests)	
//!!set key!!
sa.handleClientLoad();

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

//variable for id representing student to be submitted to next page
var submitID; 
 
 function loadButtonListeners()
 //loads event listeners and their functionality onto page buttons
 {
	 //these are helpers to call js functions in single_search.html
	document.getElementById("viewStudentButton").addEventListener("click", function()
	{
		submitStudent("view_student.html");
	});
	
	document.getElementById("editStudentButton").addEventListener("click", function() 
	{
		submitStudent("edit_student.html");
	});
	
	document.getElementById("viewInteractionButton").addEventListener("click", function()
	{
		//select interaction page
		submitStudent("select_interaction.html");
	});
	
	document.getElementById("editInteractionButton").addEventListener("click", function() 
	{
		//edit interaction page
		submitStudent("edit_interaction.html");
	});
	
	document.getElementById("addInteractionButton").addEventListener("click", function() 
	{
		//add interaction page
		submitStudent("add_student_interaction.html");
	});
	
	document.getElementById("searchButton").addEventListener("click", function() 
	{
		//disable to ensure double clicking doesn't submit search twice
		document.getElementById("searchButton").disabled = true;
		searchStudents();
		setTimeout(function() {
			document.getElementById("searchButton").disabled = false;
		}, 500);
	});
 }
  
 function showFunctionButton(code)
 /*shows the button for the function requested from main menu
  *invalid code = 00, view student = 10, edit student = 11, view interaction = 20, edit interaction = 21
  */
 {
	 switch(code)
	 {
		 case "10":
		 document.getElementById("viewStudentButton").classList.remove("invisible");
		 break;
		 
		 case "11":
		 document.getElementById("editStudentButton").classList.remove("invisible");
		 break;
		 
		 case "20":
		 document.getElementById("viewInteractionButton").classList.remove("invisible");
		 break;
		 
		 case "21":
		 document.getElementById("editInteractionButton").classList.remove("invisible");
		 break;
		 
		 case "22":
		 document.getElementById("addInteractionButton").classList.remove("invisible");
		 break;
		 
		 default: 
		 alert("Unrecognized function code " + code + " from previous page. Redirecting you to main page. Please try again.");
		 window.location.href = "main_page.html";
	 }
 } 
 
 function searchStudents()
 /*
  *  Takes user-entered criteria, searches student sheet, and returns data.
  *  Also 
  */
 {
	//gapi search functionality here
	//booleans for checking if fields filled, default no
	var boolID = false;
	var boolFirst = false;
	var boolLast = false;
	var boolEmail = false;
	
	//check for content
	boolID = Boolean(document.getElementById('idNumberField').value);
	boolFirst = Boolean(document.getElementById('firstNameField').value);
	boolLast = Boolean(document.getElementById('lastNameField').value);
	boolEmail = Boolean(document.getElementById('emailField').value);
	
	//get results of content check
	if(boolID || boolFirst || boolLast || boolEmail)
	{
		//count entered criteria
		var numCriteria = [boolEmail, boolFirst, boolID, boolLast].filter(Boolean).length;
		
		//remove any previous err message
		clearFeedback();
		//grab table so that we may display the results
		var studentTable = document.getElementById("studentTable");
		
		//make sure only results from current search will be displayed
		clearTable(studentTable);
		
		//format conditions for search
		let conditions = [numCriteria];
		var critIndex = 0;
		
		if (boolID)
		{
			conditions[critIndex] = {"header":"STUDENT_ID", "value":"" + document.getElementById('idNumberField').value};
			critIndex++;
		}
		
		if (boolFirst)
		{		
			conditions[critIndex] = {"header":"FIRST_NAME", "value":"" + document.getElementById('firstNameField').value};
			critIndex++;		
		}
		
		if (boolLast)
		{		
			conditions[critIndex] = {"header":"LAST_NAME", "value":"" + document.getElementById('lastNameField').value};
			critIndex++;		
		}
		
		if (boolEmail)
		{		
			conditions[critIndex] = {"header":"EMAIL", "value":"" + document.getElementById('emailField').value};
			critIndex++;		
		}
		//start building results table
		var tableData = "<table border=\"1\"><tr><th>Select</th><th>Student ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Year of Study</th></tr>"
		
		//submit a search with criteria
		/*
		 *
		 * This GAPI search part needs some review- testing has revealed that the entries are case sensitive
		 * and some searches give back incorrect results
		 *
		 */
		sa.getSheet("UPLS").then(res =>
		{
			let result = sa.selectFromTableWhereConditions(res, ["STUDENT_ID","FIRST_NAME","LAST_NAME","EMAIL", "CLASS_LEVEL"], conditions, 1).slice(1);
			//if no results, tell user
			if(result.length < 1)
			{
				feedback("There are no matches for this entry.");
				//end execution of function 
				return;
			}
			
			var row;
			var selectButton;
			var selectCell;
			var idCell;
			var firstNameCell;
			var lastNameCell;
			var emailCell;
			var yearCell;
			
			for (let i = 0; i < result.length; i++)
			{
				//format received data into table here
				//table format is:
				// | Select (Btn) | STUDENT_ID | FIRST_NAME | LAST_NAME | EMAIL | YOS |
				//create new row for every student
				var row = studentTable.insertRow(-1);
						
				//create cells
				selectCell = row.insertCell(0);
				idCell = row.insertCell(1);
				firstNameCell = row.insertCell(2);
				lastNameCell = row.insertCell(3);
				emailCell = row.insertCell(4);
				yearCell = row.insertCell(5);
				
				//create button for selection of student, make it select associated student id on click
				selectButton = document.createElement("BUTTON");
				selectButton.addEventListener("click", function()
				{
					selectStudent(result[i][0]);
				});
				
				//add text
				selectButton.appendChild(document.createTextNode("Select"));				
				
				//add values to cells
				selectCell.appendChild(selectButton);
				idCell.innerHTML = result[i][0];
				firstNameCell.innerHTML = result[i][1];
				lastNameCell.innerHTML = result[i][2];
				emailCell.innerHTML = result[i][3];
				yearCell.innerHTML = result[i][4];			
			}
		});
	} else {
		//if nothing entered, tell user
		feedback("At least one field must be given a value.");
	}
 }
 
 function clearFeedback()
 {
	 document.getElementById("feedBackMessage").innerHTML = "";
	 document.getElementById("feedBackMessage").classList.toggle("hide", true);
 }
 
 function feedback(message)
 {
	 document.getElementById("feedBackMessage").innerHTML = message;
	 document.getElementById("feedBackMessage").classList.toggle("hide", false);
 }
 
 function clearTable(table)
 {
	 for (let i = table.rows.length-1; i > 0; i--)
	 {
		 table.deleteRow(i);
	 }
 }
 
 function selectStudent(id)
 {
	 feedback("Selected student with ID: " + id);
	 submitID = id;
 }
 
 function getSelectedStudent()
 {
	 return submitID;
 }
 
 function submitStudent(address)
 {
	 //ensure a student has been selected before submission
	 if (submitID in window)
		{
			feedback("You must select a student in order to continue.");
		}
		else
		{
			 localStorage.setItem("studentID", getSelectedStudent());
			 window.location.href = address;
		}
 }
