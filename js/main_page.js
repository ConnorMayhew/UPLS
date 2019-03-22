/*
 * 	This file handles the communication between the main page and the single search page, telling the search page which function has been requested.
 *  Last edit 2019/19/03 by Connor Mayhew
 */
  
let sa = new SheetsApi();
sa.handleClientLoad();
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
    } else {
        console.log("Need Log In!");
        sa.handleSignInClick();
    }
}

//add button functionality
function loadButtonListeners()
{
	//these are helpers to call js functions in main_page.html
	//toPage() and toSingleSearch() functions both located in main_menu.js
	document.getElementById("addStudentButton").addEventListener("click", function() {
		toPage("add_student.html");
	});
	
	document.getElementById("emailButton").addEventListener("click", function() {
		toPage("group_email.html");
	});
	
	document.getElementById("viewStudentButton").addEventListener("click", function() {
		toSingleSearch(10);
	});
	
	document.getElementById("editStudentButton").addEventListener("click", function() {
		toSingleSearch(11);
	});
	
	document.getElementById("viewInteractionButton").addEventListener("click", function() {
		toSingleSearch(20);
	});
	
	document.getElementById("editInteractionButton").addEventListener("click", function() {
		toSingleSearch(21);
	});
	
	document.getElementById("addInteractionButton").addEventListener("click", function() {
		toSingleSearch(22);
	});
	
	document.getElementById("ingestButton").addEventListener("click", function() {
		toPage("batch_ingest.html");
	});
	
	document.getElementById("intTypeButton").addEventListener("click", function() {
		toPage("edit_interaction_categories.html");
	});
	
	document.getElementById("comChannelButton").addEventListener("click", function() {
		toPage("edit_communication_channels.html");
	});
	
	document.getElementById("studentCategoryButton").addEventListener("click", function() {
		toPage("edit_student_categories.html");
	});
	
	document.getElementById("adminShowButton").addEventListener("click", function() {
		showMainAdminButtons();
	});	
}

function showMainAdminButtons()
{
	document.getElementById("ingestButton").classList.toggle("hide");
	document.getElementById("intTypeButton").classList.toggle("hide");
	document.getElementById("comChannelButton").classList.toggle("hide");
	document.getElementById("studentCategoryButton").classList.toggle("hide");
	
	//ADD functionality: if the user is not an admin, these buttons should be semi-transparent and un-clickable.
	/*
		//adminCheck function located within main_menu.js
		if(adminCheck()){
		}
		else {
			document.getElementById("ingestButton").classList.toggle("unavailable");
			document.getElementById("intTypeButton").classList.toggle("unavailable");
			document.getElementById("comChannelButton").classList.toggle("unavailable");
			document.getElementById("studentCategoryButton").classList.toggle("unavailable");
			document.getElementById("ingestButton").disabled = true;
			document.getElementById("intTypeButton").disabled = true;
			document.getElementById("comChannelButton").disabled = true;
			document.getElementById("studentCategoryButton").disabled = true;
		}
	*/
}