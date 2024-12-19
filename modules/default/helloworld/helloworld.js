/* global Module */

Module.register("workout_of_the_day", {
	// Module config defaults.
	defaults: {
		workouts: {
			"Monday": "Heavy bag & run 1.5 miles",
			"Tuesday": " Swim & Leg Day: Squats 4x8, Deadlifts 4x6, Leg Press 4x12",
			"Wednesday": "Heavy bag workout, Back and Biceps: Pull-Ups 4x10, Barbell Rows 4x8, Curls 3x12",
			"Thursday": "Run 2 miles",
			"Friday": "Shoulders and Arms: Overhead Press 4x8, Lateral Raises 3x12, Tricep Dips 3x12",
			"Saturday": "Light Stretching or hike",
			"Sunday": "Rest Day o rhike!"
		},
		updateInterval: 24 * 60 * 60 * 1000, // Update once a day
		remoteFile: null,
		fadeSpeed: 4000,
		specialDayUnique: true
	},

	// Define start sequence.
	start() {
		Log.info(`Starting module: ${this.name}`);

		if (this.config.remoteFile !== null) {
			this.loadWorkoutFile();
		}

		// Schedule update timer.
		setInterval(() => {
			this.updateDom(this.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	// Retrieve a file from the local filesystem
	async loadWorkoutFile() {
		const isRemote = this.config.remoteFile.startsWith("http://") || this.config.remoteFile.startsWith("https://");
		const url = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		const response = await fetch(url);
		this.config.workouts = JSON.parse(await response.text());
		this.updateDom();
	},

	// Retrieve the workout of the current day of the week.
	getTodayWorkout() {
		const today = moment().format("dddd");
		return this.config.workouts[today] || "Rest day or custom workout!";
	},

	// Override dom generator.
	getDom() {
		const wrapper = document.createElement("div");
		wrapper.className = "thin xlarge bright pre-line";
		
		const workoutText = this.getTodayWorkout();
		const workoutElement = document.createElement("span");
		workoutElement.textContent = workoutText;
		wrapper.appendChild(workoutElement);
		
		return wrapper;
	}
});
