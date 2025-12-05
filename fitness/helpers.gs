// ------------------------------------------------------------------------------------------------
// HELPER: Refresh charts manually
// ------------------------------------------------------------------------------------------------
function refresh_charts() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var history_sheet = ss.getSheetByName("history");
    var charts_sheet = ss.getSheetByName("charts");

    if (!history_sheet) {
        Logger.log("ERROR: 'history' sheet not found.");
        return;
    }

    if (!charts_sheet) {
        charts_sheet = ss.insertSheet("charts");
    }

    var data = history_sheet.getDataRange().getValues();
    if (data.length <= 1) {
        Logger.log("No history data to chart.");
        return;
    }

    Logger.log("Refreshing charts...");
    clear_charts();
    create_progress_charts(charts_sheet, data);
    charts_sheet.activate();
    Logger.log("Charts refreshed!");
}

// ------------------------------------------------------------------------------------------------
// HELPER: Create or update progress charts based on history data
// ------------------------------------------------------------------------------------------------
function clear_charts(){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Get or create the Charts sheet
    var charts_sheet = ss.getSheetByName("charts");

    // Clear existing charts
    var existing_charts = charts_sheet.getCharts();
    for (var i = 0; i < existing_charts.length; i++) {
        charts_sheet.removeChart(existing_charts[i]);
    }

    // Clear existing data
    charts_sheet.clear();
}

// ------------------------------------------------------------------------------------------------
// HELPER: Snapshot all current workouts to history
// ------------------------------------------------------------------------------------------------
function snapshot_current_workouts() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var workout_sheet = ss.getSheetByName("current workouts");

    if (!workout_sheet) {
        Logger.log("ERROR: 'current workouts' sheet not found");
        return;
    }

    // Get all data from the sheet
    var data = workout_sheet.getDataRange().getValues();
    var logged_count = 0;

    // Loop through all rows (skip header at index 0)
    for (var i = 1; i < data.length; i++) {
        var type = data[i][0];      // Column A
        var exercise = data[i][1];  // Column B
        var weight = data[i][2];    // Column C
        var reps = data[i][3];      // Column D
        var sets = data[i][4];      // Column E
        var notes = data[i][5];     // Column F

        // Check if row has valid data
        var exercise_empty = !exercise || exercise === "";
        var weight_empty = !weight || weight === "";
        var reps_empty = !reps || reps === "";
        var sets_empty = !sets || sets === "";

        // Skip empty rows
        if (exercise_empty || weight_empty || reps_empty || sets_empty) {
            continue;
        }

        // Log this workout to history
        log_to_history(type, exercise, weight, reps, sets, notes);
        logged_count++;
    }

    Logger.log("Snapshot complete! Logged " + logged_count + " workouts to history");
    trigger_chart_generation();
}

// ------------------------------------------------------------------------------------------------
// HELPER: Clear all history
// ------------------------------------------------------------------------------------------------
function clear_history() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var history_sheet = ss.getSheetByName("history");

    if (history_sheet) {
        // Keep header row, clear everything else
        var last_row = history_sheet.getLastRow();
        if (last_row > 1) {
        history_sheet.deleteRows(2, last_row - 1);
        }
        Logger.log("History cleared!");
    }
}

// ------------------------------------------------------------------------------------------------
// HELPER: Create history sheet
// ------------------------------------------------------------------------------------------------
function create_history_sheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    historySheet = ss.insertSheet("history");
    // Add headers
    historySheet.getRange("A1:I1").setValues([
    ["Timestamp", "Type", "Exercise", "Weight (lbs)", "Reps", "Sets", "Volume", "Max", "MPH"]
    ]);
    // Format header
    historySheet.getRange("A1:I1").setFontWeight("bold");
}