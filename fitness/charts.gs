function trigger_chart_generation(chart_type) {
    var chart_type = "Upper Body";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var history_sheet = ss.getSheetByName("history");
    var charts_sheet = ss.getSheetByName(chart_type);

    // generate exercise type
    var exercise_type = "Lift";
    if (chart_type == "Cardio") {
      exercise_type = chart_type;
    }

    // get historical data
    var data = history_sheet.getDataRange().getValues();
    type_specific_data = generate_type_specific_subset_of_data(data, chart_type)

    // // Clear existing charts
    clear_chart_sheet(charts_sheet);

    // // create charts
    create_progress_charts(charts_sheet, type_specific_data, exercise_type);
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
function create_progress_charts(charts_sheet, data, exercise_type) {
  
  // Group data by exercise
  var exercises = {};
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var exercise = row[2]; // Exercise name is in column 2
    
    if (!exercises[exercise]) {
      exercises[exercise] = [];
    }
    
    exercises[exercise].push({
      date: row[0],      // Timestamp
      weight: row[3],    // Weight (lbs)
      volume: row[6]     // Volume
    });
  }
  
  // Create charts for each exercise
  var charts_created = 0;
  var chart_row = 1;
  var chart_col = 1;
  var data_col = 50;  // Put data far to the right, hidden from normal view
  var charts_per_row = 2;  // Number of charts per row
  var current_data_row = 1;
  
  for (var exercise in exercises) {
    var exercise_rows = exercises[exercise];
    
    // Skip if no data points
    if (exercise_rows.length < 1) {
      continue;
    }
    
    // Sort by date (in case they're not in order)
    exercise_rows.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Write minimal data headers
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
  
  // Refresh display
  SpreadsheetApp.flush();
}

