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
	var general_type = edited_sheet.getRange(row, 8).getValue();

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
		process_workout_data(e);
	}

	else if (general_type == GENERAL_TYPE_CARDIO) {
		process_cardio_data(e);
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
function process_workout_data(e) {
	Logger.log("Processing update to lift exercise.")
	var row = e.range.getRow();
	var edited_sheet = e.source.getActiveSheet();
	var chart_type = edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Type"]).getValue();
	var exercise_general_type = edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["General Type"]).getValue();

	var lift_exercise_object = new LiftExercise(
		chart_type, 
		edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Exercise"]).getValue(), 
		exercise_general_type, 
		edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Weight (lbs)"]).getValue(), 
		edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Reps"]).getValue(), 
		edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Sets"]).getValue(), 
		edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Max"]).getValue() 
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
function process_cardio_data(e) {
	Logger.log("Processing update to cardio exercise.")
	var row = e.range.getRow();
	var edited_sheet = e.source.getActiveSheet();
	var chart_type = edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Type"]).getValue();
	var exercise_general_type = edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["General Type"]).getValue();

	var cardio_exercise_object = new CardioExercise(
		chart_type, 
		edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["Exercise"]).getValue(), 
		exercise_general_type, 
		edited_sheet.getRange(row, CURRENT_WORKOUTS_COL_TO_IDX["MPH"]).getValue() 
	);

	if (!cardio_exercise_object.is_valid()) {
		Logger.log("Not performing update: Required value(s) empty")
		return;
	}

	log_to_history(cardio_exercise_object.generate_historical_record());

	trigger_chart_generation(chart_type, exercise_general_type);
}
  

  
  