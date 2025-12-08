function trigger_chart_generation() {
    // var setup
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var history_sheet = ss.getSheetByName("history");
    var charts_sheet = ss.getSheetByName("charts");

    // get historical data
    var data = history_sheet.getDataRange().getValues();

    // Clear existing charts
    clear_charts();

    // create charts
    create_progress_charts(charts_sheet, data);
}

// ------------------------------------------------------------------------------------------------
// Create or update progress charts based on history data
// ------------------------------------------------------------------------------------------------
function create_progress_charts(charts_sheet, data) {
  // Group data by exercise and type
  var exercises_data = group_by_exercise_and_type(data);
  
  // Create charts for each exercise
  var exercises = Object.keys(exercises_data).sort();
  var charts_created = 0;
  var chart_row = 1;
  var chart_col = 1;
  var data_col = 50;  // Put data far to the right, hidden from normal view
  var charts_per_row = 2;  // Number of charts per row
  var current_data_row = 1;
  
  for (var i = 0; i < exercises.length; i++) {
    var exercise = exercises[i];
    var exercise_rows = exercises_data[exercise];
    
    // Skip if no data points
    if (exercise_rows.length < 1) {
      continue;
    }
    
    // Write minimal data
    charts_sheet.getRange(current_data_row, data_col, 1, 3).setValues([
      ["Date", "Weight (lbs)", "Volume"]
    ]);
    
    // Data rows
    for (var j = 0; j < exercise_rows.length; j++) {
      var row = exercise_rows[j];
      charts_sheet.getRange(current_data_row + 1 + j, data_col, 1, 3).setValues([[
        row.date,
        row.weight,
        row.volume
      ]]);
    }
    
    // Create chart from data range
    var data_range = charts_sheet.getRange(current_data_row, data_col, exercise_rows.length + 1, 3);
    
    var chart = charts_sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(data_range)
      .setPosition(chart_row, chart_col, 0, 0)
      .setOption('title', exercise)
      .setOption('width', 550)
      .setOption('height', 350)
      .setOption('legend', {position: 'bottom'})
      .setOption('hAxis', {
        title: 'Date',
        slantedText: true,
        slantedTextAngle: 45
      })
      .setOption('series', {
        0: {
          targetAxisIndex: 0,
          color: '#3366CC',
          lineWidth: 3,
          pointSize: 5
        },  // Weight - blue, left axis
        1: {
          targetAxisIndex: 1,
          color: '#DC3912',
          lineWidth: 3,
          pointSize: 5
        }   // Volume - red, right axis
      })
      .setOption('vAxes', {
        0: {title: 'Weight (lbs)'},
        1: {title: 'Volume'}
      })
      .build();
    
    charts_sheet.insertChart(chart);
    charts_created++;
    
    // Update data position for next chart
    current_data_row += exercise_rows.length + 2;
    
    // Position next chart in grid
    chart_col += 8;
    if (charts_created % charts_per_row === 0) {
      chart_row += 20;
      chart_col = 1;
    }
  }
  
  // Log summary
  Logger.log("Created " + charts_created + " exercise charts");
  
  if (charts_created === 0) {
    Logger.log("No charts created - make sure you have workout history data!");
  } else if (data.length < 10) {
    Logger.log("Tip: Add more workout data over time to see better trends!");
  }
  
  // Refresh display
  SpreadsheetApp.flush();
}

// ------------------------------------------------------------------------------------------------
// Group history data by exercise
// ------------------------------------------------------------------------------------------------
function group_by_exercise_and_type(data) {
  var exercises = {};
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var date = row[0];      // date
    var type = row[1];     // Type
    var exercise = row[2];  // Exercise
    var weight = row[3];    // Weight
    var reps = row[4];      // Reps
    var sets = row[5];      // Sets
    var volume = row[6];    // Volume
    
    type_and_exercise = type + " - " + exercise;
    
    if (!exercises[type_and_exercise]) {
      exercises[type_and_exercise] = [];
    }
    
    exercises[type_and_exercise].push({
      date: date,
      weight: weight,
      reps: reps,
      sets: sets,
      volume: volume
    });
  }
  
  return exercises;
}

