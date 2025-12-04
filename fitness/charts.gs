// ------------------------------------------------------------------------------------------------
// Create or update progress charts based on history data
// ------------------------------------------------------------------------------------------------
function create_progress_charts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var history_sheet = ss.getSheetByName("history");
  var charts_sheet = ss.getSheetByName("charts");
  
  if (!history_sheet) {
    Logger.log("ERROR: 'history' sheet not found. No data to chart.");
    return;
  }
  
  // Get or create the Charts sheet
  if (!charts_sheet) {
    charts_sheet = ss.insertSheet("charts");
  }
  
  // Clear existing charts
  clear_charts();
  
  // Get all history data
  var data = history_sheet.getDataRange().getValues();
  Logger.log("History data: " + (data.length - 1) + " workout entries");
  
  if (data.length <= 1) {
    Logger.log("No history data to chart. Add workouts to see charts!");
    return;
  }
  
  // Create summary chart first (at the top)
  // var summary_rows = create_summary_chart(ss, charts_sheet, data);
  
  // Group data by exercise
  var exercises_data = group_by_exercise(data);
  var exercise_names = Object.keys(exercises_data);
  if (exercise_names.length > 0) {
    Logger.log("Exercises: " + exercise_names.join(", "));
  }
  
  // Create charts for each exercise, starting after the summary chart
  // var chart_position = summary_rows + 3;  // Leave space after summary
  var chart_position = 3;
  var exercises = Object.keys(exercises_data).sort();
  var charts_created = 0;
  
  for (var i = 0; i < exercises.length; i++) {
    var exercise = exercises[i];
    var exercise_rows = exercises_data[exercise];
    
    // Skip if no data points
    if (exercise_rows.length < 1) {
      continue;
    }
    
    // Create chart data in the sheet
    var start_row = chart_position;
    charts_sheet.getRange(start_row, 1).setValue(exercise + " - Progress");
    charts_sheet.getRange(start_row, 1).setFontWeight("bold").setFontSize(12);
    
    // Headers
    charts_sheet.getRange(start_row + 1, 1, 1, 4).setValues([
      ["Date", "Weight (lbs)", "Volume", "Max Reps"]
    ]).setFontWeight("bold");
    
    // Add data rows
    for (var j = 0; j < exercise_rows.length; j++) {
      var row = exercise_rows[j];
      charts_sheet.getRange(start_row + 2 + j, 1, 1, 4).setValues([[
        row.date,
        row.weight,
        row.volume,
        row.reps
      ]]);
    }
    
    // Create combo chart (lines for weight and volume)
    var data_range = charts_sheet.getRange(start_row + 1, 1, exercise_rows.length + 1, 4);
    
    var chart = charts_sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(data_range)
      .setPosition(start_row, 6, 0, 0)  // Position to the right of data
      .setOption('title', exercise + ' - Progress Over Time')
      .setOption('width', 600)
      .setOption('height', 350)
      .setOption('legend', {position: 'bottom'})
      .setOption('hAxis', {title: 'Date', slantedText: true, slantedTextAngle: 45})
      .setOption('vAxis', {title: 'Value'})
      .setOption('series', {
        0: {targetAxisIndex: 0, color: '#3366CC'},  // Weight - blue
        1: {targetAxisIndex: 1, color: '#DC3912'},  // Volume - red
        2: {targetAxisIndex: 0, color: '#109618'}   // Max Reps - green
      })
      .setOption('vAxes', {
        0: {title: 'Weight (lbs) / Reps'},
        1: {title: 'Volume'}
      })
      .build();
    
    charts_sheet.insertChart(chart);
    charts_created++;
    
    // Move to next position (leave space for chart + data)
    chart_position += exercise_rows.length + 20;
  }
  
  // Verify charts are actually in the sheet
  var final_chart_count = charts_sheet.getCharts().length;
  // Logger.log("Charts created successfully: " + (summary_rows > 0 ? "1 summary + " : "0 summary + ") + charts_created + " exercise charts");
  Logger.log("Total charts in sheet: " + final_chart_count);
  
  if (final_chart_count === 0) {
    Logger.log("WARNING: No charts could be created!");
    Logger.log("TIP: Add more workout history data by editing values in 'current workouts' sheet.");
    Logger.log("Charts work best with multiple dates and multiple data points per exercise.");
  } else {
    Logger.log("SUCCESS! Charts have been created.");
    if (data.length < 10) {
      Logger.log("TIP: Add more workout data over time to see better trend visualizations!");
    }
  }
  
  // Switch to the charts sheet so user can see it
  charts_sheet.activate();
  SpreadsheetApp.flush();  // Force update
  Logger.log("Switched to 'charts' sheet - check it out!");
}

// ------------------------------------------------------------------------------------------------
// Create or update progress charts based on history data
// ------------------------------------------------------------------------------------------------
function clear_charts(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Get or create the Charts sheet
  var charts_sheet = ss.getSheetByName("charts");
  
  // Clear existing charts
  var existing_charts = charts_sheet.getCharts();
  for (var i = 0; i < existing_charts.length; i++) {
    charts_sheet.removeChart(existing_charts[i]);
  }
  
  // Clear existing data
  charts_sheet.clear();
}

// ------------------------------------------------------------------------------------------------
// Group history data by exercise
// ------------------------------------------------------------------------------------------------
function group_by_exercise(data) {
  var exercises = {};
  
  // Skip header row (index 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var date = row[0];      // Timestamp
    var exercise = row[2];  // Exercise
    var weight = row[3];    // Weight
    var reps = row[4];      // Reps
    var sets = row[5];      // Sets
    var volume = row[6];    // Volume
    
    if (!exercise || exercise === "") {
      continue;
    }
    
    if (!exercises[exercise]) {
      exercises[exercise] = [];
    }
    
    exercises[exercise].push({
      date: date,
      weight: weight,
      reps: reps,
      sets: sets,
      volume: volume
    });
  }
  
  return exercises;
}

// ------------------------------------------------------------------------------------------------
// Create overall summary chart showing total volume over time
// Returns the number of rows used
// ------------------------------------------------------------------------------------------------
function create_summary_chart(ss, charts_sheet, data) {
  // Group volume by date
  var dates_volume = {};
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var date = row[0];
    var volume = row[6];
    
    if (!date) {
      continue;
    }
    
    var date_str = new Date(date).toLocaleDateString();
    
    if (!dates_volume[date_str]) {
      dates_volume[date_str] = 0;
    }
    dates_volume[date_str] += volume;
  }
  
  // Sort dates
  var sorted_dates = Object.keys(dates_volume).sort(function(a, b) {
    return new Date(a) - new Date(b);
  });
  
  if (sorted_dates.length < 1) {
    return 0;  // No summary chart created
  }
  
  // Write summary data at the very top
  charts_sheet.getRange(1, 1).setValue("Total Volume Over Time");
  charts_sheet.getRange(1, 1).setFontWeight("bold").setFontSize(14);
  
  charts_sheet.getRange(2, 1, 1, 2).setValues([["Date", "Total Volume"]]).setFontWeight("bold");
  
  for (var i = 0; i < sorted_dates.length; i++) {
    charts_sheet.getRange(3 + i, 1, 1, 2).setValues([[
      sorted_dates[i],
      dates_volume[sorted_dates[i]]
    ]]);
  }
  
  var data_rows = sorted_dates.length + 2;  // Title + header + data rows
  
  // Create summary chart (will work even with 1 data point)
  var summary_range = charts_sheet.getRange(2, 1, sorted_dates.length + 1, 2);
  
  var chart_type = sorted_dates.length === 1 ? Charts.ChartType.COLUMN : Charts.ChartType.AREA;
  
  var summary_chart = charts_sheet.newChart()
    .setChartType(chart_type)
    .addRange(summary_range)
    .setPosition(2, 4, 0, 0)
    .setOption('title', 'Total Workout Volume Over Time')
    .setOption('width', 800)
    .setOption('height', 400)
    .setOption('legend', {position: 'none'})
    .setOption('hAxis', {title: 'Date', slantedText: true, slantedTextAngle: 45})
    .setOption('vAxis', {title: 'Total Volume (lbs)'})
    .setOption('colors', ['#FF6D00'])
    .build();
  
  charts_sheet.insertChart(summary_chart);
  
  return data_rows;
}

// ------------------------------------------------------------------------------------------------
// Refresh charts - convenience function
// ------------------------------------------------------------------------------------------------
function refresh_charts() {
  create_progress_charts();
  Logger.log("Charts refreshed!");
}

