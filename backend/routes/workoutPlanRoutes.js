const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key_if_not_provided');

// Generate a new workout plan
router.post('/generate', protect, async (req, res) => {
    try {
        const { goal, fitnessLevel, daysPerWeek, age, weight } = req.body;
        const userId = req.user._id;

        let aiResponse = "";

        if (!process.env.GEMINI_API_KEY) {
            // Fallback mock response if no API key is provided
            console.log("No GEMINI_API_KEY found, using mock AI generator.");
            
            const exerciseDB = {
                "Muscle Hypertrophy": [
                    { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", notes: "Squeeze at the top." },
                    { name: "Lat Pulldowns", sets: 4, reps: "10-12", notes: "Control the eccentric." },
                    { name: "Bulgarian Split Squats", sets: 3, reps: "12/leg", notes: "Keep chest up." }
                ],
                "Strength Training": [
                    { name: "Barbell Squats", sets: 5, reps: "3-5", notes: "Brace your core." },
                    { name: "Barbell Bench Press", sets: 5, reps: "3-5", notes: "Pause at the chest." },
                    { name: "Conventional Deadlift", sets: 3, reps: "5", notes: "Drive through the floor." }
                ],
                "Fat Loss": [
                    { name: "Kettlebell Swings", sets: 4, reps: "15-20", notes: "Explosive hips." },
                    { name: "Burpees", sets: 3, reps: "15", notes: "Jump high." },
                    { name: "Jump Rope", sets: 5, reps: "60s", notes: "Light on your toes." }
                ],
                "Endurance": [
                    { name: "Treadmill Run", sets: 1, reps: "30 mins", notes: "Zone 2 heart rate." },
                    { name: "Rowing Machine", sets: 5, reps: "500m", notes: "Consistent pacing." },
                    { name: "Cycling", sets: 1, reps: "45 mins", notes: "Steady state." }
                ]
            };

            const selectedExercises = exerciseDB[goal] || exerciseDB["Muscle Hypertrophy"];
            const isBeginner = fitnessLevel === "Beginner";

            const mockPlan = {
                summary: `This is a highly optimized, dynamic mock plan tailored for your ${fitnessLevel} level goal of ${goal}.`,
                days: Array.from({ length: daysPerWeek }).map((_, i) => ({
                    day: i + 1,
                    focus: i % 2 === 0 ? "Push & Quad Focus" : "Pull & Hamstring Focus",
                    exercises: selectedExercises.map(ex => ({
                        name: ex.name,
                        sets: isBeginner ? ex.sets - 1 : ex.sets,
                        reps: ex.reps,
                        notes: ex.notes
                    }))
                }))
            };
            aiResponse = JSON.stringify(mockPlan);
        } else {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            You are a world-class personal trainer. Create a highly detailed, personalized ${daysPerWeek}-day weekly workout plan for a user with the following profile:
            - Goal: ${goal}
            - Fitness Level: ${fitnessLevel}
            - Age: ${age}
            - Weight: ${weight} kg

            Return the plan in a STRICT JSON format. Do not use markdown code blocks or backticks, just output raw JSON matching exactly this structure:
            {
                "summary": "A brief, encouraging paragraph about this plan.",
                "days": [
                    {
                        "day": 1,
                        "focus": "Legs & Core",
                        "exercises": [
                            { "name": "Squats", "sets": 3, "reps": "10-12", "notes": "Keep chest up" }
                        ]
                    }
                ]
            }
            Make sure there are exactly ${daysPerWeek} days in the array.
            `;

            const result = await model.generateContent(prompt);
            aiResponse = result.response.text();
        }


        
        // Clean up markdown if the model hallucinates code blocks
        if (aiResponse.includes('```json')) {
            aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (aiResponse.includes('```')) {
            aiResponse = aiResponse.replace(/```/g, '').trim();
        }

        let planData;
        try {
            planData = JSON.parse(aiResponse);
        } catch (e) {
            console.error("Failed to parse AI response:", aiResponse);
            return res.status(500).json({ message: 'Failed to generate a valid plan from AI.', raw: aiResponse });
        }

        const newPlan = await WorkoutPlan.create({
            userId,
            goal,
            fitnessLevel,
            daysPerWeek,
            planData
        });

        res.status(201).json(newPlan);
    } catch (error) {
        console.error('Error generating workout plan:', error);
        res.status(500).json({ message: 'Server error while generating plan' });
    }
});

// Get user's past workout plans
router.get('/', protect, async (req, res) => {
    try {
        const plans = await WorkoutPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (error) {
        console.error('Error fetching workout plans:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
