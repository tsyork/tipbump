var worksheets_to_listen_on = {'Co Score Details WS' : true, 'Top Investor Details WS' : true};

window.onload = function () {
    console.log('#{ticket}');

    var options = {
        width: 1920,
        height: 768,
        hideToolbar: false,
        hideTabs: true,
        onFirstInteractive: function () {
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
            queryDashboard(workbook);
            // viz2 = new tableauSoftware.Viz(vizDivFilters, vizURLFilters, optionsFilters);
        }
    };
    var optionsFilters = {
        width: 1920,
        height: 1200,
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: function () {
            workbookFilters = viz2.getWorkbook();
            activeSheetFilters = workbookFilters.getActiveSheet();
            queryDashboard(workbookFilters);
            queryFilters(workbookFilters);
        }
    };

    viz = new tableauSoftware.Viz(vizDiv, vizURL, options);

    viz.addEventListener('tabswitch', function (event) {
        var oldSheetName = event.getOldSheetName();
        var newSheetName = event.getNewSheetName();

        var isNewSheetLandingPage = landingPages.indexOf(newSheetName);
        var isOldSheetLandingPage = landingPages.indexOf(oldSheetName);
        //console.log(newSheetName);
        //console.log(landingPages.indexOf(newSheetName));
        var urlPrefix = "#/";
        var urlSheet = event.getNewSheetName();
        var urlString = urlPrefix.concat(urlSheet.replace(" ", "%20"));
        pos += 1;
        //console.log("about to run history.pushState; stateValue=" + pos);
        history.pushState({pos: pos, sheetName: newSheetName}, 'New Title', urlString);
        $(document).ready(function () {
            $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
        });
    });

    viz.addEventListener('marksSelection', getMarks);
};

window.onpopstate = function (event) {
    console.log("running onpopstate function");
    console.log("location: " + document.location + ", state: " + event.state.pos + ", SheetName: " + event.state.sheetName);
    if (pos !== null) {
        workbook.activateSheetAsync(event.state.sheetName);
    } else {
        sheetName = "Landing_page";
        workbook.activateSheetAsync(event.state.sheetName);
    }
    if (event.originalEvent.state != null) {
        alert("location: " + document.location);
    }
};

var switchView = function (sheetName,parmValue) {
    try {
        console.log("running switchView function");
        workbook = viz.getWorkbook();
        workbook.changeParameterValueAsync('Metric to display',parmValue);
        //alert(workbook);
        workbook.activateSheetAsync(sheetName)
            .then(function (sheet) {
                worksheet = sheet;
                console.log("running then function");
            });
    }
    catch (err) {
        alert(sheetName);
        alert(err.message);
    }
};

function getSheetsAlertText(sheets) {
    var alertText = [];
    for (var i = 0, len = sheets.length; i < len; i++) {
        var sheet = sheets[i];
        alertText.push(" Sheet " + i);
        alertText.push(" (" + sheet.getSheetType() + ")");
        alertText.push(" - " + sheet.getName());
        alertText.push("\n");
    }
    return alertText.join("");
}

function querySheets(workbook) {
    var sheets = workbook.getPublishedSheetsInfo();
    var text = getSheetsAlertText(sheets);
    text = "Sheets in the workbook:\n" + text;
    // alert(text);
}

function queryDashboard(workbook) {
    var worksheets = workbook.getActiveSheet().getWorksheets();
    var text = getSheetsAlertText(worksheets);
    text = "Worksheets in the dashboard:\n" + text;
    // alert(text);
}

function queryFilters(workbook) {
    var worksheets = workbook.getActiveSheet().getWorksheets().get("Filters WS").getFiltersAsync();
    var text = getSheetsAlertText(worksheets);
    text = "Filters in the sheet:\n" + text;
    // alert(text);
}

function filterSingleValue(activeSheet) {
    activeSheet.applyFilterAsync(
        "Company Region",
        "Americas",
        tableau.FilterUpdateType.REPLACE);
}

function getMarks(e){
    console.log('Result of getMarks:');
    console.log(e);
    var ws = e.getWorksheet();
    console.log('Worksheet obj:');
    console.log(ws);
    var ws_name = ws.getName();

// Here you can route for specific worksheets based on the object defined at the beginning
    if ( worksheets_to_listen_on[ws_name]) {
        console.log('Marks selection being routed from ' + ws_name);
        if (ws_name == 'Co Score Details WS') {
            console.log(ws_name);
            e.getMarksAsync().then(handleMarksSelectionCompany);
        }
        if (ws_name == 'Top Investor Details WS') {
            console.log(ws_name);
            e.getMarksAsync().then(handleMarksSelectionInvestor);
        }
    }
}

function handleMarksSelectionCompany(m) {

    console.log("[Event] Marks selection, " + m.length + " marks");
    console.log(m);

// Cleared selection detection
    if (m.length == 0) {
//$("#running_action_history").fadeOut();
// Reset to 'All' if no selection

        viz.getWorkbook().changeParameterValueAsync('Logo URL Parameter', 'All').then(
            function () {
                console.log('Parameter set back to All');
            }
        );
        return;
    }

// MarksSelection object is a collection of Marks class with numeric index
// Marks contain Pairs, accessed by getPairs(), which is also collection
// Easiest way to get the Values for a given field is to add the following method to the MarksSelection object
// Pass the text value of the Field Name as fName and will return array of all of those values from the selected mark
    m.getValuesForGivenField = function (fName) {
        var valuesArray = new Array();

// Run through each Mark in the Marks Collection
        for(i=0;i<this.length;i++)
        {
            pairs = this[i].getPairs();
            for (j = 0; j < pairs.length;
            j++
        )
            {
                if (pairs[j].fieldName == fName) {
                    valuesArray.push(pairs[j].formattedValue);
// Alternatively you could get the value not formattedValue
// valuesArray.push( pairs[j].value );
                }
            }
        }
        return valuesArray;
    }

    values = m.getValuesForGivenField('Company Logo URL'); // Replace with the name of the field you want
    console.log('Company Logo URL value:');
    console.log(values);

// Then do your thing with that array of Values
    if (values.length === 1) {

        viz.getWorkbook().changeParameterValueAsync('Logo URL Parameter', values[0]).then(
            function () {
                console.log('Parameter set');
            }
        );
    }
}

function handleMarksSelectionInvestor(m) {

    console.log("[Event] Marks selection, " + m.length + " marks");
    console.log(m);

// Cleared selection detection
    if (m.length == 0) {
//$("#running_action_history").fadeOut();
// Reset to 'All' if no selection

        viz.getWorkbook().changeParameterValueAsync('Investor Logo URL Parameter', 'All').then(
            function () {
                console.log('Parameter set back to All');
            }
        );
        return;
    }

// MarksSelection object is a collection of Marks class with numeric index
// Marks contain Pairs, accessed by getPairs(), which is also collection
// Easiest way to get the Values for a given field is to add the following method to the MarksSelection object
// Pass the text value of the Field Name as fName and will return array of all of those values from the selected mark
    m.getValuesForGivenField = function (fName) {
        var valuesArray = new Array();

// Run through each Mark in the Marks Collection
        for(i=0;i<this.length;i++)
        {
            pairs = this[i].getPairs();
            for (j = 0; j < pairs.length;
                 j++
            )
            {
                if (pairs[j].fieldName == fName) {
                    valuesArray.push(pairs[j].formattedValue);
// Alternatively you could get the value not formattedValue
// valuesArray.push( pairs[j].value );
                }
            }
        }
        return valuesArray;
    }

    values = m.getValuesForGivenField('Investor Logo URL'); // Replace with the name of the field you want
    console.log('Investor Logo URL value:');
    console.log(values);

// Then do your thing with that array of Values
    if (values.length === 1) {

        viz.getWorkbook().changeParameterValueAsync('Investor Logo URL Parameter', values[0]).then(
            function () {
                console.log('Parameter set');
            }
        );
    }
}
