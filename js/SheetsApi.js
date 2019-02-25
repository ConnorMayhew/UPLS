/**
 * Consider this function as a class definition in java.
 * Use `let sa = new SheetsApi(inputSheetid, inputApiKey, inputClientId);` to create a instance of SheetsApi.
 * Then use `sa.functionName(argument...)` to use the functions of it.
 * @param inputSheetId   The target sheet id
 * @param inputApiKey    The ApiKey of the application
 * @param inputClientId  The Client Id of the application
 * @returns {object}     An object of the SheetsApi containing necessary functions
 * @constructor
 */
function SheetsApi(inputSheetId, inputApiKey, inputClientId) {
    let sheetId = inputSheetId;
    let API_KEY = inputApiKey;
    let CLIENT_ID = inputClientId;
    /**
     * Below 4 functions are used for client initialization of the google sheet api
     * Need to configure the sheetId, API_KEY, and CLIENT_ID when creating the SheetsApi
     * object.
     */

    /** Private
     * This function calls the google api to initialize the gapi.client.
     */
    function initClient() {
        let SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

        gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(function () {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    /** Public
     * This function should be called after created the SheetsApi instance.
     * It will then call the initClient() function and get the gapi.client ready.
     */
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    /** Public
     * This function is called to let a user sign in.
     * Can be used for button's onclick
     * @param event
     */
    function handleSignInClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /** Public
     * This function is called to let a user sign out
     * Can be used for button's onclick
     * @param event
     */
    function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /** Public
     * This method returns a promise for getting the information of the spreadsheet
     * @returns {Promise}
     */
    function getSpreadsheetInfo() {
        let params = {
            spreadsheetId: sheetId
        };
        return gapi.client.sheets.spreadsheets.get(params);
    }

    /** Public
     * This method returns an object containing the title of the spreadsheet and
     * the sheets information in the spreadsheet
     * @param response The response of getSpreadsheetInfo()
     * @returns {object}
     */
    function parseSpreadsheetInfo(response) {
        return {
            title: response.result.properties.title,
            sheets: response.result.sheets
        };
    }

    /** Public
     * This method returns a promise for getting the target sheet
     * @param sheetName   The name of the target sheet
     * @returns {Promise}
     */
    function getSheet(sheetName) {
        let params = {
            spreadsheetId: sheetId,
            range: sheetName
        };
        return gapi.client.sheets.spreadsheets.values.get(params);
    }

    /** Public
     * This method returns a 2D array of values in the getSheet response
     * @param response  The response of getSheet(sheetName)
     * @returns {array} A 2D array of all values of target sheet
     */
    function parseSheetValues(response) {
        return response.result.values;
    }

    /** Public
     * Following the sql format `Select returnCols from sheetName where conditions`
     * This function can be used instead of parseSheetValues(response)
     * This will return either an array of objects or a 2D array including headers
     * @param response    The response of getSheet(inputRange)
     * @param returnCols  An array of the names of columns need to return. Pass "*" will return all columns.
     * @param conditions  An array of conditions. Each condition is an object with format:
     *                    {header:"the name of a header", value:"the value to check for"}.
     * @param returnType  0 for an array of objects. 1 for a 2D array including headers
     * @returns {*}       Either an array of objects or a 2D array including headers
     */
    function selectFromTableWhereConditions(response, returnCols, conditions, returnType) {
        let values = response.result.values;
        let headers = values[0].slice();
        let colIndex = [];
        for (let i = 0; i < returnCols.length; i++) {
            for (let j = 0; j < headers.length; j++) {
                if (headers[j] === returnCols[i]) {
                    colIndex[colIndex.length] = j;
                    break;
                }
            }
        }
        values = filterByConditions(values, conditions);
        let result = [];
        let row = [];
        for (let j = 0; j < colIndex.length; j++) {
            row[row.length] = headers[colIndex[j]];
        }
        result[result.length] = row.slice();
        for (let i = 0; i < values.length; i++) {
            row = [];
            for (let j = 0; j < colIndex.length; j++) {
                row[row.length] = values[i][colIndex[j]];
            }
            result[result.length] = row.slice();
        }
        if (returnType === 0) {
            return arrayToObjects(result);
        } else {
            return result;
        }
    }

    /** Private
     * This function parses the conditions and return the 2D array after filtering
     * This is a helper method for parseSelectResponse
     * @param values     Input 2D array
     * @param conditions An array of input conditions with format {header:"the name of a header", value:"the value to check for"}
     * @returns {array}  The 2D array after filtering
     */
    function filterByConditions(values, conditions) {
        for (let i = 0; i < conditions.length; i++) {
            let conditionHeader = conditions[i].header;
            let conditionValue = conditions[i].value;
            let headerIndex = -1;
            for (let j = 0; j < values[0].length; j++) {
                if (conditionHeader === values[0][j]) {
                    headerIndex = j;
                    break;
                }
            }
            values = filterByKeyword(values, conditionValue, headerIndex);
        }
        return values;
    }

    /** Private
     * Returns the 2D array after filtering the input array.
     * @param values      The input 2D array
     * @param keyword     The searching keyword
     * @param columnIndex The specific index of column to be filtered
     *                    if less than 0, then any column includes the keyword
     *                    will add the row to the result.
     * @returns {array}   A 2D array
     */
    function filterByKeyword(values, keyword, columnIndex) {
        let shouldStay = false;
        let rows = values.length;
        for (let i = 0; i < rows; i++) {
            shouldStay = false;
            if (columnIndex < 0) {
                for (let j = 0; j < values[i].length; j++) {
                    if (values[i][j] !== undefined && values[i][j].includes(keyword)) {
                        shouldStay = true;
                        break;
                    }
                }
            } else {
                if (values[i][columnIndex].includes(keyword)) {
                    shouldStay = true;
                }
            }
            if (!shouldStay) {
                values.splice(i, 1);
                rows--;
                i--;
            }
        }
        return values;
    }

    /** Public
     * Returns a promise for adding the inputValues to the sheet
     * @param inputRange  A string value of target sheet in the spreadsheet
     * @param inputValues A 2D array of the values to be added
     * @returns {Promise}
     */
    function update(inputRange, inputValues) {
        let params = {
            spreadsheetId: sheetId,
            range: inputRange,
            valueInputOption: "RAW",
            values: inputValues
        };
        return gapi.client.sheets.spreadsheets.values.update(params);
    }

    /** Public
     * This method returns the cells updated of batchAdd
     * @param response The response of update(inputRange, inputValues)
     * @returns {int}  Number of rows updated
     */
    function parseUpdate(response) {
        return response.result.updatedRows;
    }

    /** Public
     * This function parses the error response and logs the error message
     * to the console.error and returns the error message.
     * @param reason     The error response of a promise
     * @returns {String} The error message
     */
    function parseErrorMessage(reason) {
        console.error('error: ' + reason.result.error.message);
        return reason.result.error.message;
    }

    /** Public
     * This function will return a promise for getting the headers of the target sheet
     * @param sheetName The target sheet name
     * @returns {Promise}
     */
    function getTableHeaders(sheetName) {
        let params = {
            spreadsheetId: sheetId,
            range: sheetName + "!1:1"
        };
        return gapi.client.sheets.spreadsheets.values.get(params);
    }

    /** Public
     * This function takes the response of getTableHeaders and return an array of headers
     * @param response  Response from getTableHeaders
     * @returns {array} An array of headers
     */
    function parseTableHeaders(response) {
        return response.result.values[0];
    }

    /** Public
     * This function returns the `A1` notation of corresponding column name
     * @param headers    The array of headers
     * @param colName    The target column name
     * @returns {String} Return the `A1` notation of the colName. If headers not found, null will be returned
     */
    function getNotationFromColName(headers, colName) {
        for (let i = 0; i < headers.length; i++) {
            if (colName === headers[i]) {
                return getCharFromNum(i);
            }
        }
        return null;
    }

    /** Public
     * This function takes the number and return a corresponding capital char
     * This is a helper method for getNotationFromColName
     * @param num The number
     * @returns {string}
     */
    function getCharFromNum(num) {
        return String.fromCharCode('A'.charCodeAt(0) + num);
    }

    /** Public
     * This function takes a 2D array including headers and returns an array of objects.
     * This is a helper method for parseSelectResponse
     * @param array     A 2D array
     * @returns {array} An array of objects
     */
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
            result[i-1] = JSON.parse(tempStr.replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/\f/g, "\\f"));
        }
        return result;
    }

    //Function for insert
    /** Public
     * Following the sql format `insert into sheetName values(toInsert)`
     * This function will return a promise to send the gapi append request
     * @param headers   An array of the headers of the target sheet
     * @param sheetName The target sheet name
     * @param toInsert  This is an array of objects with format [{header1:"value1", header2:"value2"}, {...},...,{...}]
     * @returns {Promise}
     */
    function insertIntoTableColValues(headers, sheetName, toInsert) {
        let values = [];
        for (let i = 0; i < toInsert.length; i++) {
            values[i] = objectToArrayByHeaders(headers, toInsert[i]);
        }
        let params = {
            spreadsheetId: sheetId,
            range: sheetName + "!A:A",
            majorDimension: "ROWS",
            valueInputOption: "RAW",
            values: values
        };
        return gapi.client.sheets.spreadsheets.values.append(params);
    }

    /** Public
     * This function takes the response of insert and returns the updated row number
     * @param response The response of insert
     * @returns {int}
     */
    function parseInsert(response) {
        return response.result.updates.updatedRows;
    }

    /** Private
     * This function takes an array of objects and corresponding headers and transfer it into a 2D array
     * This is a helper method for insertIntoTableColValues
     * @param headers  An array of the headers of the target sheet
     * @param toInsert This is an array of objects with format [{header1:"value1", header2:"value2"}, {...},...,{...}]
     * @returns {Array}
     */
    function objectToArrayByHeaders(headers, toInsert) {
        let values = [];
        for (let i = 0; i < headers.length; i++) {
            let value = toInsert[headers[i]];
            if (value) {
                values[i] = value;
            }
        }
        return values;
    }

    //Function for update
    /** Public
     * Following the sql format `update sheetName set colVal where conditions`
     * This function will return a promise to send the gapi batchUpdate request
     * @param sheetValues This is the whole set of values including the headers in the target sheet
     * @param sheetName   The target sheet name
     * @param colVal      An object of values to be updated with format {header:"value"}
     * @param conditions  An array of input conditions with format {header:"the name of a header", value:"the value to check for"}
     * @returns {Promise}
     */
    function batchUpdateTable(sheetValues, sheetName, colVal, conditions) {
        let values = sheetValues.slice();
        let headers = sheetValues[0];
        let params = {
            spreadsheetId: sheetId
        };
        let data = [];
        for (let i = 0; i < conditions.length; i++) {
            let rowValues = objectToArrayByHeaders(headers, colVal);
            let rowNumbers = getRowNumbersByCondition(headers, values, conditions[i]);
            if (rowNumbers.length < 1) console.log("No row found");
            else console.log(rowNumbers);
            for (let j = 0; j < rowNumbers.length; j++) {
                let rowNumber = rowNumbers[j] + 1;
                data[data.length] = {
                    range: sheetName + "!" + rowNumber + ":" + rowNumber,
                    majorDimension: "ROWS",
                    values: [fillRowValues(rowValues, values[rowNumber-1])]
                };
            }
        }
        console.log(data);
        let requestBody = {
            valueInputOption: 'RAW',
            data: data
        };
        return gapi.client.sheets.spreadsheets.values.batchUpdate(params, requestBody);
    }

    /** Public
     * This function takes the response of batchUpdateTable and return the updated row number
     * @param response The response of batchUpdateTable
     * @returns {int}
     */
    function parseBatchUpdate(response) {
        return response.result.responses.totalUpdatedRows;
    }

    /** Private
     * This will return an array of row numbers of which rows meet the condition
     * This is a helper method for batchUpdateTable
     * @param headers   The headers of the target sheet
     * @param values    The values of the target sheet excluding the headers
     * @param condition An object of condition
     * @returns {Array}
     */
    function getRowNumbersByCondition(headers, values, condition) {
        let header = condition.header;
        let value = condition.value;
        let rowNumbers = [];
        for (let i = 0; i < headers.length; i++) {
            if (header === headers[i]) {
                for (let j = 1; j < values.length; j++) {
                    if (values[j][i] === value) {
                        rowNumbers[rowNumbers.length] = j;
                        console.log(rowNumbers);
                    }
                }
            }
        }
        return rowNumbers;
    }

    /** Private
     * This function fill the rowValues with the original values from the sheet and return it
     * This is a helper method for batchUpdateTable
     * @param rowValues The target array of row values
     * @param values    The array of original values
     * @returns {array}
     */
    function fillRowValues(rowValues, values) {
        for (let i = 0; i < rowValues.length; i++) {
            if (rowValues[i] === undefined) {
                rowValues[i] = values[i];
            }
        }
        return rowValues;
    }

    /** Public
     * This function will return a promise to add the columns to the target sheet.
     * @param sheetName     The target sheet name
     * @param colNames      An array of input column names
     * @param headersLength The length of the current headers
     * @returns {Promise}
     */
    function alterTableAddCol(sheetName, colNames, headersLength) {
        let startNotation = getCharFromNum(headersLength);
        let endNotation = getCharFromNum(headersLength + colNames.length - 1);
        console.log(startNotation + ":" + endNotation);
        let params = {
            spreadsheetId: sheetId,
            range: sheetName + "!" + startNotation + "1:" + endNotation + "1",
            valueInputOption: "RAW",
            values: [colNames]
        };
        return gapi.client.sheets.spreadsheets.values.update(params);
    }

    /**
     * This function will parse the response from alterTableAddCol and return the updated columns
     * @param response The response from alterTableAddCol
     * @returns {int}
     */
    function parseAlter(response) {
        return response.result.updatedColumns;
    }

    return Object.freeze({
        handleClientLoad,
        handleSignInClick,
        handleSignOutClick,
        getSpreadsheetInfo,
        parseSpreadsheetInfo,
        getSheet,
        parseSheetValues,
        selectFromTableWhereConditions,
        update,
        parseUpdate,
        parseErrorMessage,
        getTableHeaders,
        parseTableHeaders,
        getNotationFromColName,
        getCharFromNum,
        arrayToObjects,
        insertIntoTableColValues,
        parseInsert,
        batchUpdateTable,
        parseBatchUpdate,
        alterTableAddCol,
        parseAlter
    });
}