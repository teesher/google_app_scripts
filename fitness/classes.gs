// ------------------------------------------------------------------------------------------------
// main exercise class
// ------------------------------------------------------------------------------------------------
class Exercise {
    constructor(type, exercise_name, general_type) {
        this.type = type;
        this.exercise_name = exercise_name;
        this.general_type = general_type
    }

    is_valid() {
        return (this.type != undefined && this.exercise_name != undefined)
    }
}

// ------------------------------------------------------------------------------------------------
// cardio exercise class
// ------------------------------------------------------------------------------------------------
class CardioExercise extends Exercise {
    constructor(type, exercise_name, mph) {
        super(type, exercise_name);
        this.mph = mph;
    }

    is_valid() {
        return (super.is_valid() && this.mph != undefined)
    } 

    generate_historical_record() {
        return new HistoricalExercise(this.type, this.exercise_name, "", "", "", "", this.mph)
    }
}

// ------------------------------------------------------------------------------------------------
// lifting exercise class
// ------------------------------------------------------------------------------------------------
class LiftExercise extends Exercise {
    constructor(type, exercise_name, weight, reps, sets, max) {
        super(type, exercise_name);
        this.weight = weight;
        this.reps = reps;
        this.sets = sets;
        this.max = max;
    }

    is_valid() {
        // max reps not required
        return (super.is_valid() && this.weight != undefined && this.reps != undefined && this.sets != undefined)
    }

    generate_historical_record() {
        return new HistoricalExercise(this.type, this.exercise_name, this.weight, this.reps, this.sets, this.max, "")
    }
}

// ------------------------------------------------------------------------------------------------
// historical record class
// ------------------------------------------------------------------------------------------------
class HistoricalExercise extends Exercise {
    constructor(type, exercise_name, weight, reps, sets, max, mph) {
        super(type, exercise_name);
        this.weight = weight;
        this.reps = reps;
        this.sets = sets;
        this.max = max;
        this.mph = mph;
        this.date = new Date().toLocaleDateString()
        if (weight != undefined && reps != undefined && sets != undefined) {
            this.volume = weight * reps * sets
        } else {
            this.volume = ""
        }
    }

    log_object(){
        Logger.log(`
            Adding record to history:
            Type: ${this.type}
            Exercise Name: ${this.exercise_name}
            Weight: ${this.weight}
            Reps: ${this.reps}
            Sets: ${this.sets}
            Max: ${this.max}
            MPH: ${this.mph}
            Volume: ${this.volume}
            Date: ${this.date}
            `
        );
    }
}
// cardio
// date 

class ExerciseChartGenerator {
    // sheet
    // minimal data / headers
    constructor(type, exercises) {
        this.type = type;
        this.exercises = exercises;
    }

    generate_type_specific_data() {
        var type_specific_exercises = {};
        for (var i = 1; i < this.exercises.length; i++) {
            var row = data[i];
            var date = row[0];      
            var type = row[1];     
            var exercise = row[2];  
            var weight = row[3];    
            var reps = row[4];      
            var sets = row[5];      
            var volume = row[6];    
            var max = row[7];
            var mph = row[8];
        }
    }


}
