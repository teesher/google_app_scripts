// ------------------------------------------------------------------------------------------------
// Logs workout data to History sheet with timestamp
// ------------------------------------------------------------------------------------------------
function log_to_history(type, exercise, weight, reps, sets, max_reps) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var historySheet = ss.getSheetByName("history");

    // Create History sheet if it doesn't exist
    if (!historySheet) {
        historySheet = ss.insertSheet("history");
        // Add headers
        historySheet.getRange("A1:H1").setValues([
        ["Timestamp", "Type", "Exercise", "Weight (lbs)", "Reps", "Sets", "Volume", "Max"]
        ]);
        // Format header
        historySheet.getRange("A1:H1").setFontWeight("bold");
    }

    // Calculate volume (weight × reps × sets)
    var volume = weight * reps * sets;

    // Add new row with date
    var timestamp = new Date();
    historySheet.appendRow([timestamp.toLocaleDateString(), type, exercise, weight, reps, sets, volume, max_reps]);

    // Log to console for debugging
    Logger.log("logged: [" + type + "] " + exercise + " - " + weight + "lbs × " + reps + " × " + sets + " = " + volume + " total volume");
}