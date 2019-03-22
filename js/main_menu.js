/*
 * This file will have a method to create the main menu for multiple pages.\
 * Last edit 2019/20/03 by Connor Mayhew
 */
 
  //create buttons
  var homeBtn = document.createElement("BUTTON");
  var emailBtn = document.createElement("BUTTON");
  var addStudentBtn = document.createElement("BUTTON");
  var viewStudentBtn = document.createElement("BUTTON");
  var editStudentBtn = document.createElement("BUTTON");
  var addIntBtn = document.createElement("BUTTON");
  var viewIntBtn = document.createElement("BUTTON");
  var editIntBtn = document.createElement("BUTTON");
  
  //admin buttons
  var adminBtn = document.createElement("BUTTON");
  var ingestBtn = document.createElement("BUTTON");
  var studentCategoryBtn = document.createElement("BUTTON");
  var editIntTypesBtn = document.createElement("BUTTON");
  var editComChannelBtn = document.createElement("BUTTON");

function mainMenu() 
{ 
  //add css classes
  homeBtn.classList.add("small_button", "menu_bar");
  emailBtn.classList.add("small_button", "menu_bar");
  addStudentBtn.classList.add("small_button", "menu_bar");
  viewStudentBtn.classList.add("small_button", "menu_bar");
  editStudentBtn.classList.add("small_button", "menu_bar");
  addIntBtn.classList.add("small_button", "menu_bar");
  viewIntBtn.classList.add("small_button", "menu_bar");
  editIntBtn.classList.add("small_button", "menu_bar");
		//start of admin buttons
  adminBtn.classList.add("small_button", "menu_bar", "admin");
		//hidden btns
  ingestBtn.classList.add("small_button", "menu_bar", "admin", "hide");
  studentCategoryBtn.classList.add("small_button", "menu_bar", "admin", "hide");
  editIntTypesBtn.classList.add("small_button", "menu_bar", "admin", "hide");
  editComChannelBtn.classList.add("small_button", "menu_bar", "admin", "hide");
  
  //add text to buttons
  homeBtn.appendChild(document.createTextNode("Home"));
  emailBtn.appendChild(document.createTextNode("Group Email"));
  addStudentBtn.appendChild(document.createTextNode("Add Student"));
  viewStudentBtn.appendChild(document.createTextNode("View Student"));
  editStudentBtn.appendChild(document.createTextNode("Edit Student"));
  addIntBtn.appendChild(document.createTextNode("Add Interaction"));
  viewIntBtn.appendChild(document.createTextNode("View Interaction"));
  editIntBtn.appendChild(document.createTextNode("Edit Interaction"));
  //start of admin btns
  adminBtn.appendChild(document.createTextNode("Admin Functions"));
  //hidden btns
  ingestBtn.appendChild(document.createTextNode("Batch Ingest"));
  studentCategoryBtn.appendChild(document.createTextNode("Student Categories"));
  editIntTypesBtn.appendChild(document.createTextNode("Interaction Types"));
  editComChannelBtn.appendChild(document.createTextNode("Communication Channels"));
  
  //append buttons to main_menu div
  var menuBar = document.getElementById("main_menu");
  
  menuBar.classList.add("menu_bar");
  
  //create div for regular btns
  var regularDiv = document.createElement("div");
  regularDiv.classList.add("fl-lt");
  menuBar.appendChild(regularDiv);
  
  regularDiv.appendChild(homeBtn);
  regularDiv.appendChild(emailBtn);
  regularDiv.appendChild(addStudentBtn);
  regularDiv.appendChild(viewStudentBtn);
  regularDiv.appendChild(editStudentBtn);
  regularDiv.appendChild(addIntBtn);
  regularDiv.appendChild(viewIntBtn);
  regularDiv.appendChild(editIntBtn);
  //admin - create admin div
  var adminDiv = document.createElement("div");
  adminDiv.classList.add("fl-lt");
  menuBar.appendChild(adminDiv);
  adminDiv.appendChild(adminBtn);
  adminDiv.appendChild(ingestBtn);
  adminDiv.appendChild(studentCategoryBtn);
  adminDiv.appendChild(editIntTypesBtn);
  adminDiv.appendChild(editComChannelBtn);
  
  //add event listeners
  homeBtn.addEventListener("click", function(){
	toPage("main_page.html");
  });
  
  emailBtn.addEventListener("click", function(){
	toPage("group_email.html");
  });
  
  addStudentBtn.addEventListener("click", function(){		
	toPage("add_student.html");
  });
  
  //for single-search requiring pages: 
  //invalid code = 00, view student = 10, edit student = 11, view interaction = 20, edit interaction = 21, add interaction = 22
  viewStudentBtn.addEventListener("click", function(){
	  toSingleSearch(10);
  });
  
  editStudentBtn.addEventListener("click", function(){
	  toSingleSearch(11);
  });
  
  viewIntBtn.addEventListener("click", function(){
	  toSingleSearch(20);
  });
  
  editIntBtn.addEventListener("click", function(){
	  toSingleSearch(21);
  });
  
  addIntBtn.addEventListener("click", function(){
	  toSingleSearch(22);
  });
  
	//start of admin buttons
  adminBtn.addEventListener("click", function(){
	  showAdminButtons();
  });
  
  ingestBtn.addEventListener("click", function(){
	  toPage("batch_ingest.html");
  });
  
  studentCategoryBtn.addEventListener("click", function(){
	  toPage("edit_student_categories.html");
  });
  
  editIntTypesBtn.addEventListener("click", function(){
	  toPage("edit_interaction_categories.html");
  });
  
  editComChannelBtn.addEventListener("click", function(){
	  toPage("edit_communication_channels.html");
  });
}

  //send function code to single search page
function toSingleSearch(code)
{
	//invalid code = 00, view student = 10, edit student = 11, view interaction = 20, edit interaction = 21, add interaction = 22
	localStorage.setItem("functionCode", code);
	window.location.href = "single_search.html";
}

function toPage(address)
{
	window.location.href = address;
}

function showAdminButtons()
{
	ingestBtn.classList.toggle("hide");
	editIntTypesBtn.classList.toggle("hide");
	editComChannelBtn.classList.toggle("hide");
	studentCategoryBtn.classList.toggle("hide");
	//ADD functionality: if the user is not an admin, these buttons should be semi-transparent and un-clickable.
	/*
		if(adminCheck()){
		}
		else {
			ingestBtn.classList.toggle("unavailable");
			editIntTypesBtn.classList.toggle("unavailable");
			editComChannelBtn.classList.toggle("unavailable");
			studentCategoryBtn.classList.toggle("unavailable");
			ingestBtn.disabled = true;
			editIntTypesBtn.disabled = true;
			editComChannelBtn.disabled = true;
			studentCategoryBtn.disabled = true;
		}
	*/
}

function adminCheck()
{
	//return boolean
}



