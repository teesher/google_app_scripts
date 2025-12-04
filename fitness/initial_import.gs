  // ------------------------------------------------------------------------------------------------
  // Helper Function: Snapshot all current workouts to history
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
  }