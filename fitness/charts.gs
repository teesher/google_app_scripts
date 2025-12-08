function trigger_chart_generation(chart_type, exercise_general_type) {
    var chart_type = "Upper Body";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var history_sheet = ss.getSheetByName("history");
    var charts_sheet = ss.getSheetByName(chart_type);

    // get historical data
    var data = history_sheet.getDataRange().getValues();
    type_specific_data = generate_type_specific_subset_of_data(data, chart_type)

    // // Clear existing charts
    clear_chart_sheet(charts_sheet);

    // // create charts
    create_progress_charts(charts_sheet, type_specific_data, exercise_general_type);
}

// ------------------------------------------------------------------------------------------------
// HELPER: reduce helper function
// ------------------------------------------------------------------------------------------------
function generate_type_specific_subset_of_data(data, type) {
  var deduplicated = data
      .filter(row => row[1] == type)
      .reduce((accumulator, current_row) => {
        var key = current_row[0] + "|" + current_row[1] + "|" + current_row[2];
        accumulator[key] = current_row;
        return accumulator;
      }, {});

  return Object.values(deduplicated);
}

// ------------------------------------------------------------------------------------------------
// Create or update progress charts based on history data
// ------------------------------------------------------------------------------------------------
function create_progress_charts(charts_sheet, data, general_type) {
  
  // Get the chart configuration for this general_type
  var config = CHART_CONFIGS[general_type];
  if (!config) {
    Logger.log("No chart configuration found for general_type: " + general_type);
    return;
  }
  
  // Group data by exercise
  var exercises = {};
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var exercise = row[2]; // Exercise name is in column 2
    
    if (!exercises[exercise]) {
      exercises[exercise] = [];
    }
    
    // Extract data based on config's dataColumns
    var exerciseData = {};
    for (var j = 0; j < config.dataColumns.length; j++) {
      var colIndex = config.dataColumns[j];
      exerciseData[config.headers[j]] = row[colIndex];
    }
    
    exercises[exercise].push(exerciseData);
  }
  
  // Create charts for each exercise
  var charts_created = 0;
  var chart_row = 1;
  var chart_col = 1;
  var data_col = 50;  // Put data far to the right, hidden from normal view
  var charts_per_row = 2;  // Number of charts per row
  var current_data_row = 1;
  var num_columns = config.headers.length;
  
  for (var exercise in exercises) {
    var exercise_rows = exercises[exercise];
    
    // Skip if no data points
    if (exercise_rows.length < 1) {
      continue;
    }
    
    // Sort by date (in case they're not in order)
    exercise_rows.sort(function(a, b) {
      return new Date(a.Date) - new Date(b.Date);
    });
    
    // Write data headers from config
    charts_sheet.getRange(current_data_row, data_col, 1, num_columns).setValues([
      config.headers
    ]);
    
    // Write data rows
    for (var j = 0; j < exercise_rows.length; j++) {
      var rowData = [];
      for (var k = 0; k < config.headers.length; k++) {
        rowData.push(exercise_rows[j][config.headers[k]]);
      }
      charts_sheet.getRange(current_data_row + 1 + j, data_col, 1, num_columns).setValues([rowData]);
    }
    
    // Create chart from data range
    var data_range = charts_sheet.getRange(current_data_row, data_col, exercise_rows.length + 1, num_columns);
    
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
      .setOption('series', config.series)
      .setOption('vAxes', config.axes)
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
  Logger.log("Created " + charts_created + " exercise charts for " + general_type);
  
  // Refresh display
  SpreadsheetApp.flush();
}

