// ------------------------------------------------------------------------------------------------
// Logs workout data to History sheet with timestamp
// ------------------------------------------------------------------------------------------------
function log_to_history(record) {
    Logger.log("Attempting to log record to history.")
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var historySheet = ss.getSheetByName("history");

    // Create History sheet if it doesn't exist
    if (!historySheet) {
        create_history_sheet();
    }

    historySheet.appendRow([
        record.date,
        record.type,
        record.exercise_name,
        record.weight,
        record.reps,
        record.sets,
        record.volume,
        record.max,
        record.mph
    ]);

    record.log_object();
}