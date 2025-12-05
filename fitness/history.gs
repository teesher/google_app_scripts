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