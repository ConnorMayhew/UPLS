# SheetsApi.js
## Description
The SheetsApi.js file is a layer between the UPLS system and its backend data storage. This file can be swapped out to accomodate other backends, as long as the replacement file has all the exact same function signatures for all functions called from outside this file. Since we have been requested to use Google Sheets as our database, this file encapsulates the functions initializing the google client, calling the google sheets api, and some helper methods for parsing the response of api calls.

## Setup
In order to use it successfully, the google api.js file should be imported before the SheetsApi.js and your own js file should be imported after that. Here is an example.
```
<script src="https://apis.google.com/js/api.js"></script>
<script src="SheetsApi.js"></script>
<script src="test.js"></script>
```
When using the SheetsApi to login, the login user should have the permission to read the target spreadsheet.

### Constructor for SheetsApi Object
SheetsApi (spreadSheetId, ApiKey, ClientId)
SpreadSheetId is the target spreadsheet id. This can be found in the url of the spreadsheet. The following shows the structure of the URL and where spreadSheetId can be found:

```
https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=sheetId
```

The ApiKey and ClientId should be configured in the developer console of google. Instructions can be found on the following websites. The OAuth 2.0 client ID should be set for Web application when creating.
1. If not already done, enable the Google Sheets API and check the quota for your project at        https://console.developers.google.com/apis/api/sheets
2. Get access keys for your application. See https://developers.google.com/api-client-library/javascript/start/start-js#get-access-keys-for-your-application
3. For additional information on authentication, see https://developers.google.com/sheets/api/quickstart/js#step_2_set_up_the_sample
After successfully created the OAuth 2.0 client ID, please get into the client ID by clicking its name and add the http://localhost:your-port-here (ex: http://localhost:8000) into the authorized JavaScript origins.

## Functions
|Function name                 |Return type|Parameters                                      |Description   | 
|------------------------------|-----------|------------------------------------------------|--------------|
|setKeys(inputSheetId, inputApiKey, inputClientId)|N/A|inputSheetId: the target sheet id<br>inputApiKey: The ApiKey of the application<br>inputClientId: The Client Id of the application|This function initialize the sheets api object created.|
|handleClientLoad()	           |void       |N/A.	                                            |This is the function to load the gapi. Should be called after created the SheetsApi instance.|
|handleSignInClick(event)	     |void	     |event (can be ignored).	                        |This is the function to handle the user’s sign in operation.|
|handleSignOutClick(event)	   |void	     |event (can be ignored).	                        |This is the function to handle the user’s sign out operation.|
|getSpreadsheetInfo()	         |Promise	   |N/A.	                                            |This function will return a promise for getting the information of the spreadsheet.|
|parseSpreadsheetInfo(response)|Object	   |response: the response from getSpreadsheetInfo(). 	            |This function will return an object containing the title of the spreadsheet and the sheets information in the spreadsheet.|
|getSheet(sheetName)	         |Promise	   |sheetName: the target sheet name.|This function returns a promise for getting the target sheet.|
|parseSheetValues(response)	   |String[][] |response: the response from getSheet(sheetName).	            |This function parses the response from getSheet(inputRange) and returns a 2D array of values.|
|selectFromTableWhereConditions(response, returnCold, condtions, returnType)|String[][] or object[]|response: the response from getSheet.<br>returnCols: an array of the names of columns need to return, passing "*" will return all columns.<br>conditions: an arrya of conditions. Each condition is an object with format: {header:"the name of a header", values:"the values to check for"}.<br>returnType: int 0 for an array of objects, 1 for a 2D array.|This function takes the response from the getSheet, parses the conditions and returns the wanted type of values.|
|update(inputRange, inputValues)|Promise|inputRange: the target cells that are to be updated.<br>inputValues: a 2D array of the values.|This function returns a promise for update cells.|
|parseUpdate(response)|int|response: the response from update(inputRange, inputValues).|This function parses the response from update(inputRange, inputValues) and returns the number of rows updated.|
|parseErrorMessage(reason)	  |String	     |reason: the error response from a promise.|This function parses the error response and logs the error message to the console.error and returns the error message.|
|getTableHeaders(sheetName)|Promise|sheetName: the target sheet name.|This function will return a promise for getting the headers of the target sheet.|
|parseTableHeaders(response)|String[]|response: the response from getTablesHeaders(sheetName).|This function takes the response of getTableHeaders and return an array of headers.|
|getNotationFromColName(headers, colName)|String|headers: the array of headers.<br>colName: the target column name.|This function returns the 'A1' notation of corresponding column name.|
|getCharFromNum(num)|String|num: the number or index. Starting from 0.|This function takes the number and return a corresponding capital character.|
|arrayToObjects|Object[]|array: A 2D array with the headers in the first row.|This function takes a 2D array including headers and returns an array of objects.|
|insertIntoTableColValues(headers, sheetName, toInsert)|Promise|headers: an array of the headers of the target sheet.<br>sheetName: the target sheet name.<br>toInsert: this is an array of objects with format [{header1:"value1", header2:"value2"}, {...},...,{...}].|This function does things like the sql sentence 'insert into sheetName values(toInsert)'.|
|parseInsert(resposne)|int|response: the response from insert...|This function takes the reponse of insert... and returns the number of rows updated.|
|batchUpdateTable(sheetValues, sheetName, colVal, conditions)|Promise|sheetValues: the whole set of values of the target sheet, including the headers.<br>sheetName: the target sheet name.<br>colVal: an object of value to be updated with format {header: "value"}.<br>conditions: an array of conditions. Each condition is an object with format: {header:"the name of a header", value:"the value to check for"}.|This function does things like the sql sentence 'update sheetName set colVal where conditions'.|
|parseBatchUpdate(response)|int|response: the response of batchUpdateTable.|This function takes the response of batchUpdateTable and return the updated row number.|
|alterTableAddCol(sheetName, colNames, headersLength)|Promise|sheetName: the target sheet name.<br>colNames： an array of inpu column names.<br>headersLength: the length of current headers.|This functio nwill return a promise to add the columns to the target sheet.|
|parseAlter(response)|int|resposne: the response from alterTableAddCol.|This function will parse the response from talterTableAddCol and return the updated columns.|
|getDraftBySubject(subject)|Promise|subject: the subject line.|This function returns a promise to get the draft(s) by subject line.|
|parseDraftBySubject(response)|String[] or Promise or null|response: the response from getDraftBySubject.|This function parses the response from getDraftBySubject and returns a list of drafts, a promise to get the specific draft, or null if no drafts found.|
|decode(str)|String|str: the base64URL encoded string.|This function decodes a base64URL encoded string and returns the result.|
|sendEmail(message)|Promise|message: the base64URL encoded message of the email.|This function returns a promise to send a email.|
|replaceVar(message, variables, index)|String|message: the email message contains the variables.<br>variables: an object of variables and corresponding values, in the format {variable1: [value1, value2, ...], variable2: ...}.<br>index: the index of value to use.|This function replace the variables in the message with corresponding values and returns the final message.|
|addAddress(message, address)|String|message: the email message.<br>address: the destination email address.|This function adds the destination email address to the message.|

#### One function to implement
This function is called when the gapi is ready. In other words, when the handleClientLoad() is finished, it will automatically call the updateSignInStatus(isSignedIn) function.
```
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        //Codes once the user signed in
    } else {
        //Codes once the user signed out
    }
}
```
#### The Promise can be used as following:
```
let sa = new SheetsApi("example", "example", "example");
sa.handleClientLoad();
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        loadData();
    } else {
        Console.log("Need Log In.");
    }
}
function loadData() {
    sa.getSheet("student_info").then(response => {
        let result = sa.parseSheetValues(response);
        //codes of whatever you want to do with the result of response
    }, reason => {
        let message = sa.parseErrorMessage(reason);
        //codes of whatever you want to do with the error message
    });
}
```
#### The inputRange is in A1 notation. Valid ranges are:<br>
•	Sheet1!A1:B2 refers to the first two cells in the top two rows of Sheet1.<br>
•	Sheet1!A:A refers to all the cells in the first column of Sheet1.<br>
•	Sheet1!1:2 refers to the all the cells in the first two rows of Sheet1.<br>
•	Sheet1!A5:A refers to all the cells of the first column of Sheet 1, from row 5 onward.<br>
•	A1:B2 refers to the first two cells in the top two rows of the first visible sheet.<br>
•	Sheet1 refers to all the cells in Sheet1.<br>
If the sheet name has spaces or starts with a bracket, surround the sheet name with single quotes ('), e.g. 'Sheet One'!A1:B2. For simplicity, it is safe to always surround the sheet name with single quotes.

## Example
```
<!DOCTYPE html>
<html>
<head>
    <title>Personal Librarian</title>
    <style>
        table, th, td {
            border: solid 1px black;
            border-collapse: collapse;
        }
        th, td {
            padding: 4px 8px;
        }
    </style>
</head>
<body>
    <p><a href="https://docs.google.com/spreadsheets/d/1n2w0s1lqSZ4kHX3zeNYTUNRPEr1aextWaG_
    bsJisn8/edit?usp=sharing" target="_blank">Spreadsheet share
    link</a></p>
    <button id="signin-button" onclick="ts.handleSignInClick()">Sign in</button>
    <button id="signout-button" onclick="ts.handleSignOutClick()">Sign out</button>
    <button onclick="loadData()">Load Data</button>
    <table id="data"></table>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://apis.google.com/js/api.js"></script>
    <script src="SheetsApi.js"></script>
    <script>
        let ts = new SheetsApi("1n2w0s1lqSZ4kHX3zeNYT-UNRPEr1aextWaG_bsJisn8","AIzaSyDeampVGzzd8NvBiUtEsNVmNkAQU1TZ17I","21358841826-edt9rotek8r1rbivt91nabpn2sc2g6ts.apps.googleusercontent.com");
        ts.handleClientLoad();
        
        /** 
         * This function is called when the client status updated, such as signing in and signing out.
         * If a client is signed in, isSignedIn is true.
         * Else, isSignedIn is false.
         * @param isSignedIn Status of the client
         */
        function updateSignInStatus(isSignedIn) {
            if (isSignedIn) {
                console.log("Ready to make api call.");
                loadData();
            } else {
                console.log("Need log in.");
            }
        }
        function loadData() {
            ts.getSheet("student_info").then(response => {
                let values = ts.parseSheetValues(response);
                let columns = values[0].length;
                let rows = values.length;
                let temp = "";
                let tempValue = "";
                for (let i = 0; i < rows; i++) {
                    temp += "<tr>";
                    for (let j = 0; j < columns; j++) {
                        tempValue = values[i][j]===undefined?"":values[i][j];
                        temp += (i===0?"<th":"<td") + " id='" + ts.getCharFromNum(j) + (i+1) + "'>" + tempValue + (i===0?"</th>":"</td>");
                    }
                    temp += "</tr>";
                }
                $("#data").html(temp);
            }, reason => {
                console.log(ts.parseErrorMessage(reason));
            });
        }
    </script>
</body>
</html>
```