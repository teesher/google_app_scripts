  function onOpen(e) {
    // get active sheet
    opened_sheet = e.source.getActiveSheet();
    if (opened_sheet.getName() != "charts") {
      // only trigger on charts
      return;
    }

    // var setup
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var history_sheet = ss.getSheetByName("history");
    var charts_sheet = ss.getSheetByName("charts");

    // history sheet check
    if (!history_sheet) {
      Logger.log("ERROR: 'history' sheet not found. No data to chart.");
      return;
    }

    // Get or create the Charts sheet
    if (!charts_sheet) {
      charts_sheet = ss.insertSheet("charts");
    }

    // get historical data
    var data = history_sheet.getDataRange().getValues();
    if (data.length <= 1) {
      Logger.log("No history data to chart. Add workouts to see charts!");
      return;
    }
    Logger.log("Historical data: " + (data.length - 1) + " workout entries");

    // Clear existing charts
    clear_charts();

    // add data to sheet to be used to generate charts
    // add_data_to_sheet(data); // TBD

    // 

    // create charts
    // create_progress_charts(charts_sheet, data);
  }

  // ------------------------------------------------------------------------------------------------
  // onEdit - runs automatically when you edit any cell
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
    var max_reps = editedSheet.getRange(row, 6).getValue();     // Column F -- max_reps

    if (is_invalid_value(exercise) || is_invalid_value(weight) || is_invalid_value(reps) || is_invalid_value(sets)) {
      Logger.log("Not performing update: Required value(s) empty")
      return;
    }

    // Log this to the History sheet
    log_to_history(type, exercise, weight, reps, sets, max_reps);
  }

  // ------------------------------------------------------------------------------------------------
  // helper function for value validity
  // ------------------------------------------------------------------------------------------------
  function is_invalid_value(val){
    return !val || val == "" || val == undefined;
  }
  

  
  