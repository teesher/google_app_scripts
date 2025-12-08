function setup_spreadsheet() {
    create_current_workouts_sheet();
    create_history_sheet();
    create_blank_sheet("upper body charts");
    create_blank_sheet("lower body charts");
    create_blank_sheet("full body charts");
    create_blank_sheet("cardio charts");
}

// ------------------------------------------------------------------------------------------------
// INITIAL SETUP: Create current workouts sheet
// ------------------------------------------------------------------------------------------------
function create_current_workouts_sheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (ss.getSheetByName("current workouts")) {
        Logger.log("current workouts already exists. . . Skipping.");
        return;
    }

    current_workouts_sheet = ss.insertSheet("current workouts");

    // Add headers
    current_workouts_sheet.getRange("A1:G1").setValues([
    ["Type", "Exercise", "Weight (lbs)", "Reps", "Sets", "Max", "MPH"]
    ]);

    // Format
    current_workouts_sheet.getRange("A1:G1").setFontWeight("bold"); // set headers to bold
    current_workouts_sheet.getRange("A1:G1").setBackground("light green 1"); // set headers to light green
    current_workouts_sheet.getRange("B:B").setFontWeight("bold"); // make exercise names bold

    var lower_body_coloring_rule = SpreadsheetApp.newConditionalFormatRule()
          .whenTextContains("Lower Body")
          .setBackground("light blue 3") 
          .setRanges([current_workouts_sheet.getRange("A:A")]) 
          .build();

    var upper_body_coloring_rule = SpreadsheetApp.newConditionalFormatRule()
          .whenTextContains("Upper Body")
          .setBackground("light magenta 3") 
          .setRanges([current_workouts_sheet.getRange("A:A")]) 
          .build();

    var full_body_coloring_rule = SpreadsheetApp.newConditionalFormatRule()
          .whenTextContains("Full Body")
          .setBackground("light orange 3") 
          .setRanges([current_workouts_sheet.getRange("A:A")]) 
          .build();

    var cardio_coloring_rule = SpreadsheetApp.newConditionalFormatRule()
          .whenTextContains("Cardio")
          .setBackground("light green 3") 
          .setRanges([current_workouts_sheet.getRange("A:A")]) 
          .build();

    // Get existing rules and add the new ones
    var rules = current_workouts_sheet.getConditionalFormatRules();
    rules.push(
        lower_body_coloring_rule, 
        upper_body_coloring_rule, 
        full_body_coloring_rule,
        cardio_coloring_rule
    );

    current_workouts_sheet.setConditionalFormatRules(rules);
}

// ------------------------------------------------------------------------------------------------
// INITIAL SETUP: Create history sheet
// ------------------------------------------------------------------------------------------------
function create_history_sheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (ss.getSheetByName("history")) {
        Logger.log("history already exists. . . Skipping.");
        return;
    }

    history_sheet = ss.insertSheet("history");

    history_sheet.getRange("A1:I1").setValues([
        ["Timestamp", "Type", "Exercise", "Weight (lbs)", "Reps", "Sets", "Volume", "Max", "MPH"]
    ]);
    
    history_sheet.getRange("A1:I1").setFontWeight("bold");
    history_sheet.getRange("A1:I1").setBackground("light green 1"); // set headers to light green
}

// ------------------------------------------------------------------------------------------------
// INITIAL SETUP: Create blank sheet
// ------------------------------------------------------------------------------------------------
function create_blank_sheet(sheet_name) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getSheetByName(sheet_name)) {
        Logger.log(sheet_name + " already exists. . . Skipping.");
        return;
    }
    blank_sheet = ss.insertSheet(sheet_name);
}

