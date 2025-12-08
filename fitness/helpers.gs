// ------------------------------------------------------------------------------------------------
// HELPER: create upper body charts
// ------------------------------------------------------------------------------------------------
function create_upper_body_charts() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var upper_body_sheet = ss.getSheetByName("Upper Body");
    clear_chart_sheet(upper_body_sheet);
    trigger_chart_generation("Upper Body", GENERAL_TYPE_LIFT);
}

// ------------------------------------------------------------------------------------------------
// HELPER: clear charts sheet
// ------------------------------------------------------------------------------------------------
function clear_chart_sheet(charts_sheet){
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
// TBD rework
// ------------------------------------------------------------------------------------------------
function snapshot_current_workouts() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var workout_sheet = ss.getSheetByName("current workouts");

    // Get all data from the sheet
    var data = workout_sheet.getDataRange().getValues();
    var logged_count = 0;

    // Loop through all rows (skip header at index 0)
    for (var i = 1; i < data.length; i++) {
        var type = data[i][0];
        var exercise = data[i][1];
        var weight = data[i][2];
        var reps = data[i][3];
        var sets = data[i][4];
        var max = data[i][5];
        var mph = data[i][6];

        if (type == "Cardio") {
            record = new CardioExercise(type, exercise, mph);
        } else {
            record = new LiftExercise(type, exercise, weight, reps, sets, max);
        }

        // Log this workout to history
        log_to_history(record.generate_historical_record());
        logged_count++;
    }

    Logger.log("Snapshot complete! Logged " + logged_count + " workouts to history");
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