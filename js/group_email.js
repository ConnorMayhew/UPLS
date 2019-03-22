let sa = new SheetsApi();

sa.handleClientLoad();

let sheetHeaders;
let criteriaIndex = 1;
let stepNumber = 1;

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        sa.getTableHeaders("UPLS").then(res => {
            sheetHeaders = sa.parseTableHeaders(res);
            addCriteria();
            updatePopulation();
            document.getElementById("criteria").classList.remove("invisible");
        });
    } else {
        sa.handleSignInClick();
    }
}

function backStep() {
    if (stepNumber === 1) {
        window.location.href = "main_page.html";
    } else if (stepNumber === 2) {
        document.getElementById("template").classList.add("invisible");
        document.getElementById("criteria").classList.remove("invisible");
        stepNumber = 1;
    } else {
        document.getElementById("preview").classList.add("invisible");
        document.getElementById("template").classList.remove("invisible");
        stepNumber = 2;
    }
}

function nextStep() {
    if (stepNumber === 1) {
        document.getElementById("template").classList.remove("invisible");
        document.getElementById("criteria").classList.add("invisible");
        stepNumber = 2;
    } else if (stepNumber === 2) {
        loadDraft();
    }
}

function addCriteria() {
    let options = "<option>---</option>";
    for (let i = 0; i < sheetHeaders.length; i++) {
        options += "<option>" + sheetHeaders[i] + "</option>";
    }
    let str = "<div id=\"criteria_" + criteriaIndex + "\">" +
        "<table>" +
        "<tr>" +
        "<td><button class=\"close_button\" onclick=\"deleteCriteria(this)\"></button></td>" +
        "<td><label for=\"select_criteria_" + criteriaIndex + "\">Criteria: </label></td>" +
        "<td><select id=\"select_criteria_" + criteriaIndex + "\" onchange=\"getVocabulary(this.value," + criteriaIndex + ")\">" + options + "</select></td>" +
        "</tr>" +
        "<tr>" +
        "<td></td>" +
        "<td><label for=\"select_values_" + criteriaIndex + "\">Values:</label></td>" +
        "<td><select multiple id=\"select_values_" + criteriaIndex + "\" onchange=\"updatePopulation()\"></select></td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    let div = document.createElement("div");
    document.getElementById("criteria").appendChild(div);
    div.outerHTML = str;
    criteriaIndex++;
}

function deleteCriteria(object) {
    object.parentElement.parentElement.parentElement.parentElement.outerHTML = "";
    updatePopulation();
}

function getVocabulary(header, index) {
    if (header === "---") {
        return;
    }
    let vocab = [];
    let notation = sa.getNotationFromColName(sheetHeaders, header);
    sa.getSheet("UPLS!" + notation + ":" + notation).then(res => {
        let values = sa.parseSheetValues(res);
        for (let i = 1; i < values.length; i++) {
            if (!vocab.includes(values[i][0])) {
                vocab[vocab.length] = values[i][0];
            }
        }
        setVocabulary(vocab, index);
    });
}

function setVocabulary(values, index) {
    let options = "";
    for (let i = 0; i < values.length; i++) {
        options += "<option>" + values[i] + "</option>";
    }
    document.getElementById("select_values_" + index).innerHTML = options;
}

function getSelectedValues(id) {
    let values = document.querySelectorAll("#" + id + " option:checked");
    let result = [values.length];
    for (let i = 0; i < values.length; i++) {
        result[i] = values[i].innerHTML;
    }
    return result;
}

let emailAddresses = [], names = [], studentIds = [];
function updatePopulation() {
    console.log("Update population");
    emailAddresses = [];
    names = [];
    studentIds = [];
    let header, values, conditions = [];
    for (let i = 1; i < criteriaIndex; i++) {
        if (document.getElementById("criteria_" + i).innerHTML === "") continue;
        header = document.getElementById("select_criteria_" + i).value;
        values = getSelectedValues("select_values_" + i);
        if (header ==="---" || values.length === 0) continue;
        let tempConditions = [values.length];
        for (let j = 0; j < values.length; j++) {
            tempConditions[j] = {"header": header, "value": values[j]};
        }
        conditions[conditions.length] = tempConditions;
    }
    sa.getSheet("UPLS").then(res => {
        let result = sa.selectFromTableWhereConditions(res, ["STUDENT_ID","FIRST_NAME","LAST_NAME","EMAIL"], conditions, 1);
        for (let i = 1; i < result.length; i++) {
            studentIds[studentIds.length] = result[i][0];
            names[names.length] = result[i][1] + " " + result[i][2];
            emailAddresses[emailAddresses.length] = result[i][3];
        }
        document.getElementById("number_label").innerHTML = "This group currently contains " + (emailAddresses.length) + " people.";
    });
}

let draftId, draftMessage;
function loadDraft() {
    let subject = document.getElementById("input_subject").value;
    sa.getDraftBySubject(subject).then(res => {
        let draft = sa.parseDraftBySubject(res);
        if (draft === null) {
            alert("No draft found! Please check the subject line.");
        } else if (draft.length > 1) {
            alert("More than one draft found! Please use a more precise subject line.");
        } else {
            draft.then(res => {
                draftId = res.result.id;
                let raw = res.result.message.raw;
                draftMessage = sa.decode(raw);
                displayContent(draftMessage);
                document.getElementById("preview").classList.remove("invisible");
                document.getElementById("template").classList.add("invisible");
                stepNumber = 3;
            });
        }
    })
}

let draftSubject;
function displayContent(msg) {
    draftSubject = msg.substr(msg.indexOf("Subject: ") + 9, msg.indexOf("From") - msg.indexOf("Subject: ") - 9).trim();
    document.getElementById("email_subject").innerHTML = draftSubject;
    let startIndex = msg.indexOf("UTF-8") + 10;
    let content = msg.substr(startIndex);
    let endIndex = content.indexOf("--");
    document.getElementById("preview_content").value = content.substr(0,endIndex);
}

function sendEmails() {
    for (let i = 0; i < emailAddresses.length; i++) {
        let finalMessage = sa.replaceVar(draftMessage, {"name":names}, i);
        finalMessage = sa.addAddress(finalMessage, emailAddresses[i]);
        finalMessage = window.btoa(finalMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        sa.sendEmail(finalMessage).then(res => {
            if (i === emailAddresses.length - 1) {
                sa.getTableHeaders("INTERACTION_TRACKING").then(res => {
                    let headers = sa.parseTableHeaders(res);
                    let toInsert = [headers];
                    for (let i = 0; i < studentIds.length; i++) {
                        toInsert[toInsert.length] = [studentIds[i], "Email", "Subject: " + draftSubject.trim(), getCurrentDate(), "TRUE"];
                    }
                    sa.insertIntoTableColValues(headers, "INTERACTION_TRACKING", sa.arrayToObjects(toInsert)).then(res => {
                        if (sa.parseInsert(res) !== studentIds.length) {
                            console.log("Something is wrong!");
                        } else {
                            alert("Emails sent successfully!");
                            window.location.href = "main_page.html";
                        }
                    });
                });
            }
        }, reason => {
            alert(reason.result.error.message);
        });
    }
}

function getCurrentDate() {
    let d = new Date();
    let str = "" + d.getFullYear() + "-";
    if (d.getMonth() > 9) str += (d.getMonth() + 1);
    else str += "0" + (d.getMonth() + 1);
    if (d.getDate() > 9) str += "-" + d.getDate();
    else str += "-0" + d.getDate();
    return str;
}
