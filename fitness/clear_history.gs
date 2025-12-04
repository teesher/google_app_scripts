  // ------------------------------------------------------------------------------------------------
  // Helper function: Clear all history
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