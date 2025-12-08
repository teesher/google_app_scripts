// main.gs
var GENERAL_TYPE_LIFT = "Lift";
var GENERAL_TYPE_CARDIO = "Cardio";

// chart.gs
var CHART_CONFIGS = {
  "Cardio": {
    headers: ["Date", "MPH"],
    dataColumns: [0, 8],  // date, mph
    axes: {
      0: {title: "MPH"}
    },
    series: {
      0: {color: '#3366CC', lineWidth: 3, pointSize: 5}
    }
  },
  "Lift": {
    headers: ["Date", "Weight (lbs)", "Volume"],
    dataColumns: [0, 3, 6],  // date, weight, volume
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