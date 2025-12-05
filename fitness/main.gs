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
		process_workout_data(e);
	}

	if (col == CARDIO_COL) {
		process_cardio_data(e);
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
function process_workout_data(e) {
	Logger.log("Processing update to lift exercise.")
	var row = e.range.getRow();
	var edited_sheet = e.source.getActiveSheet();

	var lift_exercise_object = new LiftExercise(
		edited_sheet.getRange(row, 1).getValue(),
		edited_sheet.getRange(row, 2).getValue(),
		edited_sheet.getRange(row, 3).getValue(),
		edited_sheet.getRange(row, 4).getValue(),
		edited_sheet.getRange(row, 5).getValue(),
		edited_sheet.getRange(row, 6).getValue()
	);

	if (!lift_exercise_object.is_valid()) {
		Logger.log("Not performing update: Required value(s) empty")
		return;
	}

	log_to_history(lift_exercise_object.generate_historical_record());
	trigger_chart_generation();

}

// ------------------------------------------------------------------------------------------------
// process cardio data
// ------------------------------------------------------------------------------------------------
function process_cardio_data(e) {
	Logger.log("Processing update to cardio exercise.")
	var row = e.range.getRow();
	var edited_sheet = e.source.getActiveSheet();

	var cardio_exercise_object = new CardioExercise(
		edited_sheet.getRange(row, 1).getValue(),
		edited_sheet.getRange(row, 2).getValue(),
		edited_sheet.getRange(row, 7).getValue()
	);

	if (!cardio_exercise_object.is_valid()) {
		Logger.log("Not performing update: Required value(s) empty")
		return;
	}

	log_to_history(cardio_exercise_object.generate_historical_record());

	// TBD regen specific chart. . .
	// trigger_chart_generation();
}
  

  
  