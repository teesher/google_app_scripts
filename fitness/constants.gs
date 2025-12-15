// ------------------------------------------------------------------------------------------------
var GENERAL_TYPE_LIFT = "Lift";
var GENERAL_TYPE_CARDIO = "Cardio";

// ------------------------------------------------------------------------------------------------
var CURRENT_WORKOUTS_COL_TO_IDX = {
  "Exercise": 0,
  "Weight (lbs)": 1,
  "Reps": 2,
  "Sets": 3,
  "Max": 4,
  "MPH": 5,
  "General Type": 6,
  "Type": 7
}

// ------------------------------------------------------------------------------------------------
var HISTORY_COL_TO_IDX = {
  "Timestamp": 0,
  "Type": 1,
  "General Type": 2,
  "Exercise": 3,
  "Weight (lbs)": 4,
  "Reps": 5,
  "Sets": 6,
  "Volume": 7,
  "Max": 8,
  "MPH": 9
}

// ------------------------------------------------------------------------------------------------
var CHART_CONFIGS = {
  "Cardio": {
    headers: ["Date", "MPH"],
    dataColumns: [HISTORY_COL_TO_IDX["Timestamp"], HISTORY_COL_TO_IDX["MPH"]],  // date, mph
    axes: {
      0: {title: "MPH"}
    },
    series: {
      0: {color: '#3366CC', lineWidth: 3, pointSize: 5}
    }
  },
  "Lift": {
    headers: ["Date", "Weight (lbs)", "Volume"],
    dataColumns: [HISTORY_COL_TO_IDX["Timestamp"], HISTORY_COL_TO_IDX["Weight (lbs)"], HISTORY_COL_TO_IDX["Volume"]],  // date, weight, volume
    axes: {
      0: {title: "Weight (lbs)"},
      1: {title: "Volume"}
    },
    series: {
      0: {targetAxisIndex: 0, color: '#3366CC', lineWidth: 3, pointSize: 5},
      1: {targetAxisIndex: 1, color: '#DC3912', lineWidth: 3, pointSize: 5}
    }
  },
};