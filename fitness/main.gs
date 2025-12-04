// ------------------------------------------------------------------------------------------------
// Main function - runs automatically when you edit any cell
// ------------------------------------------------------------------------------------------------
function onEdit(e) {
    var editedSheet = e.source.getActiveSheet();
    var sheetName = editedSheet.getName();
    
    // Only trigger if editing "Current Workouts" sheet
    if (sheetName !== "current workouts") {
      return;
    }
    
    // Get details about the edit
    var row = e.range.getRow();
    var col = e.range.getColumn();
    
    // Skip header row
    if (row === 1) {
      return;
    }
    
    // Only log changes to Weight (C), Reps (D), or Sets (E) columns
    if (col < 3 || col > 5) {
      return;
    }
    
    // check for if we actually want to update
    if (e.oldValue === e.value) {
      Logger.log("Not performing update: Incoming value same as previous")
      return;
    }
    
    // Get the exercise data from that row
    var type = editedSheet.getRange(row, 1).getValue();      // Column A -- type
    var exercise = editedSheet.getRange(row, 2).getValue();  // Column B -- exercise
    var weight = editedSheet.getRange(row, 3).getValue();    // Column C -- weight
    var reps = editedSheet.getRange(row, 4).getValue();      // Column D -- reps
    var sets = editedSheet.getRange(row, 5).getValue();      // Column E -- sets
    var notes = editedSheet.getRange(row, 6).getValue();     // Column F -- notes

    if (is_invalid_value(exercise) || is_invalid_value(weight) || is_invalid_value(reps) || is_invalid_value(sets)) {
      Logger.log("Not performing update: Required value(s) empty")
      return;
    }
    
    // Log this to the History sheet
    log_to_history(type, exercise, weight, reps, sets, notes);
  }

  // ------------------------------------------------------------------------------------------------
  // helper function for value validity
  // ------------------------------------------------------------------------------------------------
  function is_invalid_value(val){
    return !val || val == "" || val == undefined;
  }
  
  // ------------------------------------------------------------------------------------------------
  // Logs workout data to History sheet with timestamp
  // ------------------------------------------------------------------------------------------------
  function log_to_history(type, exercise, weight, reps, sets, notes) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var historySheet = ss.getSheetByName("history");
    
    // Create History sheet if it doesn't exist
    if (!historySheet) {
      historySheet = ss.insertSheet("history");
      // Add headers
      historySheet.getRange("A1:H1").setValues([
        ["Timestamp", "Type", "Exercise", "Weight (lbs)", "Reps", "Sets", "Volume", "Notes"]
      ]);
      // Format header
      historySheet.getRange("A1:H1").setFontWeight("bold");
    }
    
    // Calculate volume (weight × reps × sets)
    var volume = weight * reps * sets;
    
    // Add new row with date
    var timestamp = new Date();
    historySheet.appendRow([timestamp.toLocaleDateString(), type, exercise, weight, reps, sets, volume, notes]);
    
    // Log to console for debugging
    Logger.log("logged: [" + type + "] " + exercise + " - " + weight + "lbs × " + reps + " × " + sets + " = " + volume + " total volume");
  }

  
  