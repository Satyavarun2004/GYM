export const bmiPlans = {
  male: {
    underweight: {
      status: 'Underweight',
      message: 'Time to fuel up and build strength! You have a great foundation to build upon.',
      workoutPlan: [
        { day: 'Monday', focus: 'Heavy Compound Lifts', exercises: ['Squats', 'Bench Press', 'Deadlifts'], reps: '3 sets of 5-8' },
        { day: 'Tuesday', focus: 'Rest & Recovery', exercises: ['Light Stretching'], reps: '15 mins' },
        { day: 'Wednesday', focus: 'Hypertrophy - Upper Body', exercises: ['Bicep Curls', 'Tricep Dips', 'Shoulder Press'], reps: '3 sets of 10-12' },
        { day: 'Thursday', focus: 'Rest & Recovery', exercises: ['Yoga'], reps: '20 mins' },
        { day: 'Friday', focus: 'Hypertrophy - Lower Body', exercises: ['Leg Press', 'Lunges', 'Calf Raises'], reps: '3 sets of 10-12' },
        { day: 'Saturday', focus: 'Active Recovery', exercises: ['Walking'], reps: '30 mins' },
        { day: 'Sunday', focus: 'Total Rest', exercises: ['Rest'], reps: '-' },
      ],
      dietPlan: [
        { meal: 'Breakfast', items: '4 Egg Omelette with Spinach and whole grain toast' },
        { meal: 'Lunch', items: 'Chicken Breast, Quinoa, and Avocado' },
        { meal: 'Snack', items: 'Peanut Butter and Banana on rice cakes' },
        { meal: 'Dinner', items: 'Salmon, Sweet Potato, and Steamed Broccoli' },
        { meal: 'Before Bed', items: 'Casein protein shake or Greek Yogurt' },
      ],
      targetCalories: '+500 Surplus'
    },
    normal: {
      status: 'Healthy',
      message: 'Maintaining perfection! Your body is in a great place. Let\'s keep it that way.',
      workoutPlan: [
        { day: 'Monday', focus: 'Chest & Triceps', exercises: ['Bench Press', 'Incline Press', 'Dips'], reps: '3 sets of 8-12' },
        { day: 'Tuesday', focus: 'Back & Biceps', exercises: ['Pull-ups', 'Rows', 'Hammer Curls'], reps: '3 sets of 8-12' },
        { day: 'Wednesday', focus: 'Active Recovery', exercises: ['Swimming or Cycling'], reps: '45 mins' },
        { day: 'Thursday', focus: 'Shoulders & Abs', exercises: ['Overhead Press', 'Lateral Raises', 'Plank'], reps: '3 sets of 12-15' },
        { day: 'Friday', focus: 'Legs', exercises: ['Squats', 'Leg Curls', 'Calf Raises'], reps: '4 sets of 10-12' },
        { day: 'Saturday', focus: 'HIIT', exercises: ['Sprints', 'Burpees', 'Jump Rope'], reps: '20 mins' },
        { day: 'Sunday', focus: 'Rest', exercises: ['Rest'], reps: '-' },
      ],
      dietPlan: [
        { meal: 'Breakfast', items: 'Oatmeal with berries and a scoop of whey' },
        { meal: 'Lunch', items: 'Lean Beef, Brown Rice, and Mixed Greens' },
        { meal: 'Snack', items: 'Apple and a handful of almonds' },
        { meal: 'Dinner', items: 'Grilled Turkey, Asparagus, and a small side of pasta' },
        { meal: 'Post-Workout', items: 'Protein shake and a banana' },
      ],
      targetCalories: 'Maintenance'
    },
    obese: {
      status: 'Overweight/Obese',
      message: 'Let\'s turn that intensity up! You have incredible power waiting to be unlocked.',
      workoutPlan: [
        { day: 'Monday', focus: 'Total Body Circuit', exercises: ['Bodyweight Squats', 'Pushups', 'Step-ups'], reps: '3 sets of 15-20' },
        { day: 'Tuesday', focus: 'Steady State Cardio', exercises: ['Incline Walk'], reps: '45 mins' },
        { day: 'Wednesday', focus: 'Strength - Upper Body', exercises: ['DB Press', 'Rows', 'Lat Pulldowns'], reps: '3 sets of 12-15' },
        { day: 'Thursday', focus: 'Steady State Cardio', exercises: ['Elliptical'], reps: '45 mins' },
        { day: 'Friday', focus: 'Strength - Lower Body', exercises: ['Leg Press', 'Hamstring Curls', 'Plank'], reps: '3 sets of 12-15' },
        { day: 'Saturday', focus: 'Active Recovery', exercises: ['Light Walk or Swimming'], reps: '60 mins' },
        { day: 'Sunday', focus: 'Rest', exercises: ['Rest'], reps: '-' },
      ],
      dietPlan: [
        { meal: 'Breakfast', items: 'Egg white scramble with plenty of veggies' },
        { meal: 'Lunch', items: 'Huge salad with Tuna or Tofu (light dressing)' },
        { meal: 'Snack', items: 'Cottage cheese or a small protein bar' },
        { meal: 'Dinner', items: 'White fish or Chicken with a large portion of zucchini/green beans' },
        { meal: 'Evening', items: 'Herbal tea (no sugar)' },
      ],
      targetCalories: '-500 Deficit'
    }
  },
  female: {
    underweight: {
        status: 'Underweight',
        message: 'Strength is beautiful! Let\'s nourish your body and build those curves.',
        workoutPlan: [
          { day: 'Monday', focus: 'Full Body Sculpt', exercises: ['Goblet Squats', 'DB Bench', 'Rows'], reps: '3 sets of 10-12' },
          { day: 'Tuesday', focus: 'Rest', exercises: ['Stretching'], reps: '15 mins' },
          { day: 'Wednesday', focus: 'Glutes & Legs', exercises: ['Glute Bridges', 'Lunges', 'Step-ups'], reps: '3 sets of 12-15' },
          { day: 'Thursday', focus: 'Upper Body & Core', exercises: ['Shoulder Press', 'Lat Pulldown', 'Plank'], reps: '3 sets of 12-15' },
          { day: 'Friday', focus: 'Full Body', exercises: ['RDLs', 'Pushups', 'Bicep Curls'], reps: '3 sets of 12' },
          { day: 'Saturday', focus: 'Active Recovery', exercises: ['Yoga'], reps: '30 mins' },
          { day: 'Sunday', focus: 'Rest', exercises: ['Rest'], reps: '-' },
        ],
        dietPlan: [
          { meal: 'Breakfast', items: 'Greek Yogurt with granola, honey, and nuts' },
          { meal: 'Lunch', items: 'Avocado and Egg on Sourdough Toast' },
          { meal: 'Snack', items: 'Protein Smoothie with almond butter' },
          { meal: 'Dinner', items: 'Grilled Chicken, Mashed Potatoes, and Carrots' },
          { meal: 'Snack', items: 'Dark chocolate and a glass of milk' },
        ],
        targetCalories: '+300 Surplus'
    },
    normal: {
        status: 'Healthy',
        message: 'You look radiant! Consistency is key to maintaining your health and vitality.',
        workoutPlan: [
          { day: 'Monday', focus: 'Lower Body', exercises: ['Squats', 'Hip Thrusts', 'Calf Raises'], reps: '3 sets of 10-15' },
          { day: 'Tuesday', focus: 'Upper Body', exercises: ['DB Press', 'Rows', 'Tricep Extensions'], reps: '3 sets of 10-15' },
          { day: 'Wednesday', focus: 'Pilates/Core', exercises: ['Leg Circles', 'Hundred', 'Plank'], reps: '45 mins' },
          { day: 'Thursday', focus: 'Lower Body', exercises: ['Deadlifts', 'Lunges', 'Leg Press'], reps: '3 sets of 10-15' },
          { day: 'Friday', focus: 'Shoulders & Arms', exercises: ['Lateral Raises', 'Front Raises', 'Bicep Curls'], reps: '3 sets of 12-15' },
          { day: 'Saturday', focus: 'Cardio', exercises: ['Dance or Cycling'], reps: '30-45 mins' },
          { day: 'Sunday', focus: 'Rest', exercises: ['Rest'], reps: '-' },
        ],
        dietPlan: [
          { meal: 'Breakfast', items: 'Smoothie Bowl with spinach, banana, and chia seeds' },
          { meal: 'Lunch', items: 'Tenderloin Steak or Tofu with a Kale Salad' },
          { meal: 'Snack', items: 'Hummus and carrots' },
          { meal: 'Dinner', items: 'Shrimp Stir-fry with various vegetables and Rice' },
          { meal: 'Evening', items: 'Small piece of fruit' },
        ],
        targetCalories: 'Maintenance'
    },
    obese: {
        status: 'Overweight/Obese',
        message: 'Every step counts toward a stronger you! You\'re doing amazing.',
        workoutPlan: [
          { day: 'Monday', focus: 'Low Impact Cardio', exercises: ['Walking or Swimming'], reps: '40 mins' },
          { day: 'Tuesday', focus: 'Full Body Resistance', exercises: ['Dumbbell Thrusters', 'Rows', 'Wall Sits'], reps: '3 sets of 15' },
          { day: 'Wednesday', focus: 'Cardio', exercises: ['Brisk Walk'], reps: '45 mins' },
          { day: 'Thursday', focus: 'Core & Mobility', exercises: ['Modified Burpees', 'Bird-Dog', 'Plank'], reps: '3 sets of 12' },
          { day: 'Friday', focus: 'Full Body Resistance', exercises: ['Glute Bridges', 'Incline Pushups', 'Step-ups'], reps: '3 sets of 15' },
          { day: 'Saturday', focus: 'Long Walk', exercises: ['Hike or Walk'], reps: '60 mins' },
          { day: 'Sunday', focus: 'Rest', exercises: ['Rest'], reps: '-' },
        ],
        dietPlan: [
          { meal: 'Breakfast', items: 'Chia Pudding with almond milk' },
          { meal: 'Lunch', items: 'Grilled Chicken strips with steamed broccoli and cauliflower' },
          { meal: 'Snack', items: 'A few waluts or an orange' },
          { meal: 'Dinner', items: 'Zucchini noodles with lean turkey bolognese' },
          { meal: 'Evening', items: 'Infused water' },
        ],
        targetCalories: '-400 Deficit'
    }
  }
};
