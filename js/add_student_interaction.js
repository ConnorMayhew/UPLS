sa = new SheetsApi();
sa.handleClientLoad();
var student_id = 0;
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    fillStudentInfo();
  } else {
    console.log("Need Log In!");
    sa.handleSignInClick();
  }
}

/**
 * This functions gets all necessary information from the database to setup the
 * form.
 */
function fillStudentInfo() {
  student_id = window.localStorage.getItem("studentID");
  // Get name and email.
  var col_names = ["FIRST_NAME", "LAST_NAME", "EMAIL"];
  var upls_condition = [{
    "header": "STUDENT_ID", "value": student_id
  }];
  var upls_table = "UPLS";
  sa.getSheet(upls_table).then(response => {
    var student_info = sa.selectFromTableWhereConditions(response, col_names, upls_condition, 0);
    var student_name = student_info[0].FIRST_NAME + " " + student_info[0].LAST_NAME;
    var email = student_info[0].EMAIL;
    document.getElementById("student_name").innerHTML = student_name;
    document.getElementById("student_id").innerHTML = student_id;
    document.getElementById("student_email").innerHTML = email;
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
  // Get list of interaction types.
  var interactions_table = "INTERACTIONS";
  var interactions_condition = [{
    "header": "INTERACTIONS_LIST", "value": ""
  }];
  sa.getSheet(interactions_table).then(response => {
    var interaction_types = sa.selectFromTableWhereConditions(response, ["INTERACTIONS_LIST"], interactions_condition, 0);
    for (let i = 1; i < interaction_types.length; i++) {
      var interaction_type = interaction_types[i].INTERACTIONS_LIST;
      if (interaction_type !== "" && interaction_type !== "undefined") {
        var interaction_type_option = "<option>" + interaction_type + "</option>";
        document.getElementById("interaction_type").innerHTML += interaction_type_option;
      }
    }
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
  // Get list of communication channels.
  var communication_condition = [];
  sa.getSheet(interactions_table).then(response => {
    var communication_channels = sa.selectFromTableWhereConditions(response, ["COMMUNICATION_CHANNEL"], communication_condition, 0);
    for (let i = 1; i < communication_channels.length; i++) {
      var communication_channel = communication_channels[i].COMMUNICATION_CHANNEL;
      if (communication_channel !== "" && communication_channel !== "undefined") {
        var communication_channel_option = "<option>" + communication_channel + "</option>";
        document.getElementById("communication_channel").innerHTML += communication_channel_option;
      }
    }
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
}

/**
 * This function is used to submit an interaction to the database.
 */
function interactionSubmit() {
  var headers = [
    "STUDENT_ID", //headers[0]
    "INTERACTION_TYPE", //headers[1]
    "INTERACTION_NOTE", //headers[2]
    "INTERACTION_DATE", //headers[3]
    "LIBRARIAN_INITIATED", //headers[4]
    "FOLLOW_UP", //headers[5]
    "MINUTES", //headers[6]
    "COMMUNICATION_CHANNEL", //headers[7]
    "URL", //headers[8]
  ];
  // Collect data to submit.
  var lib_init, follow_up;
  if (document.getElementById("librarian_initiated_yes").checked) {
    lib_init = "TRUE";
  } else {
    lib_init = "FALSE";
  }
  if (document.getElementById("follow_up_yes").checked) {
    follow_up = "TRUE";
  } else {
    follow_up = "FALSE";
  }
  var toSubmit = [{
    STUDENT_ID : student_id,
    INTERACTION_TYPE : document.getElementById("interaction_type").value,
    INTERACTION_NOTE : document.getElementById("notes").value,
    INTERACTION_DATE : document.getElementById("interaction_date").value,
    LIBRARIAN_INITIATED : lib_init,
    FOLLOW_UP : follow_up,
    MINUTES : document.getElementById("time_spent").value,
    COMMUNICATION_CHANNEL : document.getElementById("communication_channel").value,
    URL : document.getElementById("url").value,
  }];
  // Add data to database.
  sa.insertIntoTableColValues(headers, "INTERACTION_TRACKING", toSubmit).then(response => {
    alert("Interaction has been successfully saved.");
    window.location.href = "main_page.html";
  }, reason => {
    let msg = sa.parseErrorMessage(reason);
    console.log(msg);
  });
}
