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
    
    // Check if the value actually changed (prevents duplicate logs)
    var oldValue = e.oldValue;
    var newValue = e.value;

    Logger.log("old value: " + oldValue + " new value: " + newValue);
    
    // check for if we actually want to update
    if (oldValue === newValue || newValue == undefined) {
      Logger.log("Not performing update")
      return;
    }
    
    // Get the exercise data from that row
    var type = editedSheet.getRange(row, 1).getValue();      // Column A -- type
    var exercise = editedSheet.getRange(row, 2).getValue();  // Column B -- exercise
    var weight = editedSheet.getRange(row, 3).getValue();    // Column C -- weight
    var reps = editedSheet.getRange(row, 4).getValue();      // Column D -- reps
    var sets = editedSheet.getRange(row, 5).getValue();      // Column E -- sets
    var notes = editedSheet.getRange(row, 6).getValue();     // Column F -- notes
    

    exercise_empty = !exercise || exercise === "";
    weight_empty = !weight || weight === "";
    reps_empty = !reps || reps === "";
    sets_empty = !sets || sets === "";

    if (exercise_empty || weight_empty || reps_empty || sets_empty) {
      return;
    }
    
    // Log this to the History sheet
    log_to_history(type, exercise, weight, reps, sets, notes);
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
    
    // Add new row with timestamp
    var timestamp = new Date();
    historySheet.appendRow([timestamp, type, exercise, weight, reps, sets, volume, notes]);
    
    // Log to console for debugging
    Logger.log("logged: [" + type + "] " + exercise + " - " + weight + "lbs × " + reps + " × " + sets + " = " + volume + " total volume");
  }

  
  