var MIN_EXERCISE_COL = 3;
var MAX_EXERCISE_COL = 6;
var CARDIO_COL = 9;

// ------------------------------------------------------------------------------------------------
// onEdit - runs automatically when you edit any cell
// ------------------------------------------------------------------------------------------------
function onEdit(e) {
	var edited_sheet = e.source.getActiveSheet();
	var sheet_name = edited_sheet.getName();

	// Only trigger if editing "Current Workouts" sheet
	if (sheet_name !== "current workouts") {
		return;
	}

	// Get details about the edit
	var row = e.range.getRow();
	var col = e.range.getColumn();

	// Skip header row
	if (row === 1) {
		return;
	}

	// check for if we actually want to update
	if (e.oldValue === e.value) {
		Logger.log("Not performing update: Incoming value same as previous")
		return;
	}

	if (col >= MIN_EXERCISE_COL && col <= MAX_EXERCISE_COL) {
		process_workout_data();
	}

	if (col == CARDIO_COL) {
		process_cardio_data();
	}
}

// ------------------------------------------------------------------------------------------------
// helper function for value validity
// ------------------------------------------------------------------------------------------------
function is_invalid_value(val){
	return !val || val == "" || val == undefined;
}

// ------------------------------------------------------------------------------------------------
// process lifting data
// ------------------------------------------------------------------------------------------------
function process_workout_data() {
	var edited_sheet = e.source.getActiveSheet();
	var type = edited_sheet.getRange(row, 1).getValue();      // Column A -- type
	var exercise = edited_sheet.getRange(row, 2).getValue();  // Column B -- exercise
	var weight = edited_sheet.getRange(row, 3).getValue();    // Column C -- weight
	var reps = edited_sheet.getRange(row, 4).getValue();      // Column D -- reps
	var sets = edited_sheet.getRange(row, 5).getValue();      // Column E -- sets
	var max_reps = edited_sheet.getRange(row, 6).getValue();     // Column F -- max_reps

	if (is_invalid_value(exercise) || is_invalid_value(weight) || is_invalid_value(reps) || is_invalid_value(sets)) {
		Logger.log("Not performing update: Required value(s) empty")
		return;
	}

	// Log this to the History sheet
	log_to_history(type, exercise, weight, reps, sets, max_reps);

	// Now trigger chart regeneration
	trigger_chart_generation();

}

// ------------------------------------------------------------------------------------------------
// process cardio data
// ------------------------------------------------------------------------------------------------
function process_cardio_data() {
	return;
}
  

  
  