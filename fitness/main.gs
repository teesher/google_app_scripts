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
	var row_as_array = get_row_as_array(edited_sheet, row);
	var general_type = row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["General Type"]];

	// Skip header row
	if (row === 1) {
		Logger.log("Non applicable cell edited. No action to be taken.");
		return;
	}

	// check for if we actually want to update
	if (e.oldValue === e.value) {
		Logger.log("Not performing update: Incoming value same as previous")
		return;
	}

	if (general_type == GENERAL_TYPE_LIFT) {
		process_workout_data(row_as_array);
	}

	else if (general_type == GENERAL_TYPE_CARDIO) {
		process_cardio_data(row_as_array);
	}
	
	else {
		Logger.log("Non applicable cell edited. No action to be taken.");
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
function process_workout_data(row_as_array) {
	Logger.log("Processing update to lift exercise.")

	var chart_type = row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Type"]];
	var exercise_general_type = row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["General Type"]];

	var lift_exercise_object = new LiftExercise(
		chart_type, 
		row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Exercise"]],
		exercise_general_type, 
		row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Weight (lbs)"]],
		row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Reps"]],
		row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Sets"]],
		row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Max"]]
	);

	if (!lift_exercise_object.is_valid()) {
		Logger.log("Not performing update: Required value(s) empty")
		return;
	}

	log_to_history(lift_exercise_object.generate_historical_record());
	trigger_chart_generation(chart_type, exercise_general_type); 
}

// ------------------------------------------------------------------------------------------------
// process cardio data
// ------------------------------------------------------------------------------------------------
function process_cardio_data(row_as_array) {
	Logger.log("Processing update to cardio exercise.")

	var chart_type = row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Type"]];
	var exercise_general_type = row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["General Type"]];

	var cardio_exercise_object = new CardioExercise(
		chart_type, 
		row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["Exercise"]],
		exercise_general_type, 
		row_as_array[CURRENT_WORKOUTS_COL_TO_IDX["MPH"]]
	);

	if (!cardio_exercise_object.is_valid()) {
		Logger.log("Not performing update: Required value(s) empty")
		return;
	}

	log_to_history(cardio_exercise_object.generate_historical_record());
	trigger_chart_generation(chart_type, exercise_general_type);
}
  

  function get_row_as_array(sheet, row) {
	var last_column = sheet.getLastColumn();
  	var row_range = sheet.getRange(row, 1, 1, last_column);
  	return row_range.getValues()[0];
  }