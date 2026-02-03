export const exercises = [
    {
        id: 'chest',
        name: 'Chest',
        description: 'Build a strong chest with these exercises.',
        image: '/assets/body-parts/chest.png',
        exercises: [
            {
                id: 'pushups',
                name: 'Push-ups',
                description: 'Start in a plank position. Lower your body until your chest nearly touches the floor. Push back up.',
                image: '/assets/exercises/pushups.png',
                duration: '3 sets of 15',
                calories: '50-100 cal',
                difficulty: 'Beginner',
                equipment: 'None',
                dietPlan: 'Post-workout: Lean protein like chicken breast or plant-based protein shake to repair muscle fibers.'
            },
            {
                id: 'bench-press',
                name: 'Bench Press',
                description: 'Lie on a flat bench. Grip the bar slightly wider than shoulder-width. Lower the bar to your chest, then press up.',
                image: '/assets/exercises/bench-press.png',
                duration: '3 sets of 10',
                calories: '80-120 cal',
                difficulty: 'Intermediate',
                equipment: 'Barbell, Bench',
                dietPlan: 'Pre-workout: Complex carbs (oats, brown rice) for sustained energy during heavy lifts.'
            },
            {
                id: 'incline-db-press',
                name: 'Incline Dumbbell Press',
                description: 'Sit on an incline bench. Press dumbbells up from shoulder level. Focus on the upper pectorals.',
                image: '/assets/exercises/incline-db-press.png',
                duration: '3 sets of 12',
                calories: '70-110 cal',
                difficulty: 'Intermediate',
                equipment: 'Dumbbells, Incline Bench',
                dietPlan: 'Include healthy fats (avocado, nuts) in your daily diet to support hormone production for muscle growth.'
            },
            {
                id: 'chest-flys',
                name: 'Chest Flys',
                description: 'Lie on a flat bench with dumbbells. Lower weights in a wide arc until you feel a stretch in your chest.',
                image: '/assets/exercises/chest-flys.png',
                duration: '3 sets of 15',
                calories: '40-80 cal',
                difficulty: 'Beginner',
                equipment: 'Dumbbells, Bench',
                dietPlan: 'Stay hydrated with electrolytes to prevent cramping during high-repetition sets.'
            }
        ]
    },
    {
        id: 'back',
        name: 'Back',
        description: 'Strengthen your back for better posture.',
        image: '/assets/body-parts/back.png',
        exercises: [
            {
                id: 'pullups',
                name: 'Pull-ups',
                description: 'Hang from a bar with palms facing away. Pull your body up until your chin is over the bar.',
                image: '/assets/exercises/pullups.png',
                duration: '3 sets of 8',
                calories: '60-100 cal',
                difficulty: 'Intermediate',
                equipment: 'Pull-up Bar',
                dietPlan: 'High protein intake is crucial. Aim for 1.6g to 2.2g of protein per kg of body weight.'
            },
            {
                id: 'rows',
                name: 'Bent Over Rows',
                description: 'Hold a barbell. Bend your knees slightly and hinge forward. Pull the bar to your lower chest.',
                image: '/assets/exercises/rows.png',
                duration: '3 sets of 12',
                calories: '70-110 cal',
                difficulty: 'Intermediate',
                equipment: 'Barbell',
                dietPlan: 'Consume Magnesium-rich foods (spinach, almonds) to improve muscle contraction and recovery.'
            },
            {
                id: 'lat-pulldowns',
                name: 'Lat Pulldowns',
                description: 'Sit at a machine. Pull the bar down to your upper chest while squeezing your shoulder blades.',
                image: '/assets/exercises/lat-pulldowns.png',
                duration: '3 sets of 12',
                calories: '50-90 cal',
                difficulty: 'Beginner',
                equipment: 'Lat Machine',
                dietPlan: 'Creatine supplementation can help increase strength and power for back training.'
            },
            {
                id: 'deadlifts',
                name: 'Deadlifts',
                description: 'Lift a loaded barbell off the ground to hip level, then lower it back down with a straight back.',
                image: '/assets/exercises/deadlifts.png',
                duration: '3 sets of 5',
                calories: '150-250 cal',
                difficulty: 'Advanced',
                equipment: 'Barbell',
                dietPlan: 'High calorie day. Increase carb intake to fuel this compound, taxing movement.'
            }
        ]
    },
    {
        id: 'legs',
        name: 'Legs',
        description: 'Power up your lower body.',
        image: '/assets/body-parts/legs.png',
        exercises: [
            {
                id: 'squats',
                name: 'Squats',
                description: 'Stand with feet shoulder-width apart. Lower your hips back and down as if sitting in a chair. Stand back up.',
                image: '/assets/exercises/squats.png',
                duration: '3 sets of 15',
                calories: '60-120 cal',
                difficulty: 'Intermediate',
                equipment: 'Barbell / Dumbbells',
                dietPlan: 'Refuel with fast-digesting carbs and protein within 45 minutes after leg day for optimal recovery.'
            },
            {
                id: 'lunges',
                name: 'Lunges',
                description: 'Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle.',
                image: '/assets/exercises/lunges.png',
                duration: '3 sets of 12 per leg',
                calories: '50-100 cal',
                difficulty: 'Beginner',
                equipment: 'None / Dumbbells',
                dietPlan: 'Include anti-inflammatory foods like turmeric and ginger to help with delayed onset muscle soreness (DOMS).'
            },
            {
                id: 'leg-press',
                name: 'Leg Press',
                description: 'Sit on the machine and push the platform away from you using your legs.',
                image: '/assets/exercises/leg-press.png',
                duration: '3 sets of 12',
                calories: '80-140 cal',
                difficulty: 'Beginner',
                equipment: 'Leg Press Machine',
                dietPlan: 'Keep a steady intake of Vitamin D and Calcium for bone health to support heavy leg loads.'
            },
            {
                id: 'calf-raises',
                name: 'Calf Raises',
                description: 'Stand on the edge of a step. Raise your heels as high as possible, then lower them below the step level.',
                image: '/assets/exercises/calf-raises.png',
                duration: '4 sets of 20',
                calories: '30-60 cal',
                difficulty: 'Beginner',
                equipment: 'None',
                dietPlan: 'Ensure adequate potassium intake (bananas, potatoes) to prevent calf cramps.'
            }
        ]
    },
    {
        id: 'abs',
        name: 'Abs',
        description: 'Carve out your core.',
        image: '/assets/body-parts/abs.png',
        exercises: [
            {
                id: 'plank',
                name: 'Plank',
                description: 'Hold a push-up position, resting on your forearms. Keep your body in a straight line.',
                image: '/assets/exercises/plank.png',
                duration: '3 sets of 60 seconds',
                calories: '30-50 cal',
                difficulty: 'Beginner',
                equipment: 'None',
                dietPlan: 'A slight caloric deficit is often necessary to reveal abdominal definition.'
            },
            {
                id: 'crunches',
                name: 'Crunches',
                description: 'Lie on your back with knees bent. Lift your shoulders off the floor while contracting your abs.',
                image: '/assets/exercises/crunches.png',
                duration: '3 sets of 20',
                calories: '40-60 cal',
                difficulty: 'Beginner',
                equipment: 'None',
                dietPlan: 'Fiber-rich foods (veggies, whole grains) help reduce bloating and keep the midsection looking tight.'
            },
            {
                id: 'leg-raises',
                name: 'Lying Leg Raises',
                description: 'Lie on your back and lift your legs up to 90 degrees without bending your knees. Lower slowly.',
                image: '/assets/exercises/leg-raises.png',
                duration: '3 sets of 15',
                calories: '40-70 cal',
                difficulty: 'Beginner',
                equipment: 'None',
                dietPlan: 'Hydration is key. Drink at least 3 liters of water daily to maintain metabolic rate.'
            },
            {
                id: 'russian-twists',
                name: 'Russian Twists',
                description: 'Sit with knees bent and feet off the floor. Twist your torso from side to side.',
                image: '/assets/exercises/russian-twists.png',
                duration: '3 sets of 30',
                calories: '50-80 cal',
                difficulty: 'Beginner',
                equipment: 'None',
                dietPlan: 'Avoid added sugars and processed foods which can lead to visceral fat storage.'
            }
        ]
    },
    {
        id: 'shoulders',
        name: 'Shoulders',
        description: 'Build broad and strong shoulders.',
        image: '/assets/body-parts/shoulders.png',
        exercises: [
            {
                id: 'overhead-press',
                name: 'Overhead Press',
                description: 'Stand with hold dumbbells at shoulder height. Press them strictly overhead until arms are straight.',
                image: '/assets/exercises/overhead-press.png',
                duration: '3 sets of 10',
                calories: '50-90 cal',
                difficulty: 'Intermediate',
                equipment: 'Barbell / Dumbbells',
                dietPlan: 'Pre-workout caffeine (from green tea or coffee) can help increase focus and intensity.'
            },
            {
                id: 'lateral-raises',
                name: 'Lateral Raises',
                description: 'Stand with dumbbells at your side. Raise your arms to the side until they are parallel to the floor.',
                image: '/assets/exercises/lateral-raises.png',
                duration: '3 sets of 15',
                calories: '40-70 cal',
                difficulty: 'Beginner',
                equipment: 'Dumbbells',
                dietPlan: 'Ensure you are getting enough Vitamin C to support collagen production for shoulder joint health.'
            },
            {
                id: 'arnold-press',
                name: 'Arnold Press',
                description: 'Start with dumbbells in front of shoulders, palms facing you. Rotate palms as you press up.',
                image: '/assets/exercises/arnold-press.png',
                duration: '3 sets of 12',
                calories: '60-100 cal',
                difficulty: 'Intermediate',
                equipment: 'Dumbbells',
                dietPlan: 'Beta-alanine can help buffer lactic acid buildup in high-volume shoulder sets.'
            },
            {
                id: 'face-pulls',
                name: 'Face Pulls',
                description: 'Use a rope attachment on a cable machine. Pull the rope towards your face, pulling the ends apart.',
                image: '/assets/exercises/face-pulls.png',
                duration: '3 sets of 15',
                calories: '30-60 cal',
                difficulty: 'Beginner',
                equipment: 'Cable Machine',
                dietPlan: 'Maintain a balance of electrolytes (Sodium, Potassium) to ensure proper nerve signaling for shoulder stability.'
            }
        ]
    },
    {
        id: 'arms',
        name: 'Arms',
        description: 'Tone and strengthen your arms.',
        image: '/assets/body-parts/arms.png',
        exercises: [
            {
                id: 'bicep-curls',
                name: 'Bicep Curls',
                description: 'Hold dumbbells with palms facing forward. Curl the weights up towards your shoulders.',
                image: '/assets/exercises/bicep-curls.png',
                duration: '3 sets of 12',
                calories: '40-80 cal',
                difficulty: 'Beginner',
                equipment: 'Dumbbells',
                dietPlan: 'BCAAs during your workout can help reduce muscle breakdown during arm sessions.'
            },
            {
                id: 'tricep-dips',
                name: 'Tricep Dips',
                description: 'Use a bench or chair. Place hands on the edge, extend legs. Lower your body by bending elbows, then push up.',
                image: '/assets/exercises/tricep-dips.png',
                duration: '3 sets of 12',
                calories: '50-90 cal',
                difficulty: 'Beginner',
                equipment: 'Bench / Chair',
                dietPlan: 'Consuming Casein protein before bed can provide a slow release of amino acids for arm recovery.'
            },
            {
                id: 'hammer-curls',
                name: 'Hammer Curls',
                description: 'Similar to bicep curls but with palms facing each other (neutral grip).',
                image: '/assets/exercises/hammer-curls.png',
                duration: '3 sets of 12',
                calories: '40-80 cal',
                difficulty: 'Beginner',
                equipment: 'Dumbbells',
                dietPlan: 'Focus on iron-rich foods to ensure oxygen delivery to the muscles during intense curls.'
            },
            {
                id: 'skull-crushers',
                name: 'Skull Crushers',
                description: 'Lie on a bench. Lower a barbell or dumbbells towards your forehead by bending at the elbows.',
                image: '/assets/exercises/skull-crushers.png',
                duration: '3 sets of 10',
                calories: '60-100 cal',
                difficulty: 'Intermediate',
                equipment: 'EZ-Bar / Dumbbells',
                dietPlan: 'Healthy fats like salmon (Omega-3) can help reduce joint inflammation in the elbows.'
            }
        ]
    },
    {
        id: 'cardio',
        name: 'Cardio',
        description: 'Improve your endurance and heart health.',
        image: '/assets/body-parts/cardio.png',
        exercises: [
            {
                id: 'running',
                name: 'Running',
                description: 'A higher intensity cardio exercise that strengthens the heart and lungs.',
                image: '/assets/exercises/running.png',
                duration: '30 mins',
                calories: '300-500 cal',
                difficulty: 'Beginner',
                equipment: 'None / Treadmill',
                dietPlan: 'Maintain steady hydration and consume slow-digesting carbs 2 hours prior.'
            },
            {
                id: 'cycling',
                name: 'Cycling',
                description: 'A low-impact cardio exercise great for building leg strength and stamina.',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
                duration: '45 mins',
                calories: '400-600 cal',
                difficulty: 'Beginner',
                equipment: 'Bicycle / Stationary Bike',
                dietPlan: 'High-energy snacks like bananas provide quick fuel for long rides.'
            },
            {
                id: 'rowing',
                name: 'Rowing',
                description: 'A full-body cardio workout that engages the core, back, and arms.',
                image: 'https://images.unsplash.com/photo-1541534741688-6078c65b5a38?auto=format&fit=crop&q=80&w=800',
                duration: '20 mins',
                calories: '200-350 cal',
                difficulty: 'Intermediate',
                equipment: 'Rowing Machine',
                dietPlan: 'Ensure adequate sodium intake to prevent cramping during high-intensity rowing.'
            },
            {
                id: 'jump-rope',
                name: 'Jump Rope',
                description: 'Excellent for coordination and burning calories quickly in short bursts.',
                image: 'https://images.unsplash.com/photo-1599058917233-57c0e662999e?auto=format&fit=crop&q=80&w=800',
                duration: '15 mins',
                calories: '150-250 cal',
                difficulty: 'Intermediate',
                equipment: 'Jump Rope',
                dietPlan: 'Light pre-workout fueling to avoid discomfort during rhythmic jumping.'
            }
        ]
    },
    {
        id: 'yoga',
        name: 'Yoga & Mobility',
        description: 'Enhance flexibility, balance, and mental clarity.',
        image: '/assets/body-parts/yoga.png',
        exercises: [
            {
                id: 'sun-salutation',
                name: 'Sun Salutation',
                description: 'A sequence of 12 powerful yoga poses that provide a full-body workout.',
                image: '/assets/exercises/sun-salutation.png',
                duration: '10 mins',
                calories: '50-100 cal',
                difficulty: 'Beginner',
                equipment: 'Yoga Mat',
                dietPlan: 'Practice on an empty stomach or 2-3 hours after a meal for comfort.'
            },
            {
                id: 'warrior-poses',
                name: 'Warrior Series',
                description: 'A series of poses designed to build strength and focus in the legs and core.',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
                duration: '15 mins',
                calories: '80-120 cal',
                difficulty: 'Intermediate',
                equipment: 'Yoga Mat',
                dietPlan: 'Anti-inflammatory foods like berries support joint health during deep stretches.'
            },
            {
                id: 'downward-dog',
                name: 'Downward Dog',
                description: 'Stretches the hamstrings and calves while strengthening the shoulders.',
                image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800',
                duration: '5 mins',
                calories: '20-40 cal',
                difficulty: 'Beginner',
                equipment: 'Yoga Mat',
                dietPlan: 'Focus on magnesium-rich foods to help with muscle relaxation and flexibility.'
            },
            {
                id: 'pigeon-pose',
                name: 'Pigeon Pose',
                description: 'A deep hip opener that helps relieve tension and improve mobility.',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
                duration: '10 mins',
                calories: '30-50 cal',
                difficulty: 'Intermediate',
                equipment: 'Yoga Mat',
                dietPlan: 'Stay hydrated to keep connective tissues supple for deep mobility work.'
            }
        ]
    },
    {
        id: 'hiit',
        name: 'HIIT',
        description: 'High-Intensity Interval Training for maximum fat burn.',
        image: '/assets/body-parts/hiit.png',
        exercises: [
            {
                id: 'burpees',
                name: 'Burpees',
                description: 'A full-body exercise used in strength training and as an aerobic exercise.',
                image: '/assets/exercises/burpees.png',
                duration: '4 sets of 15',
                calories: '100-150 cal',
                difficulty: 'Advanced',
                equipment: 'None',
                dietPlan: 'Explosive energy requires glycogen storage; consume complex carbs daily.'
            },
            {
                id: 'mountain-climbers',
                name: 'Mountain Climbers',
                description: 'Engages the core and provides a quick cardio boost.',
                image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=800',
                duration: '4 sets of 30 secs',
                calories: '60-100 cal',
                difficulty: 'Intermediate',
                equipment: 'None',
                dietPlan: 'BCAAs can help preserve muscle mass during high-intensity metabolic conditioning.'
            },
            {
                id: 'jump-squats',
                name: 'Jump Squats',
                description: 'A high-impact exercise that builds explosive power in the lower body.',
                image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800',
                duration: '4 sets of 12',
                calories: '80-120 cal',
                difficulty: 'Intermediate',
                equipment: 'None',
                dietPlan: 'Rebuild with a high-glycemic carb/protein mix within 30 mins after HIIT.'
            },
            {
                id: 'kettlebell-swings',
                name: 'Kettlebell Swings',
                description: 'A foundational movement for power, strength, and cardiovascular health.',
                image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
                duration: '4 sets of 20',
                calories: '100-180 cal',
                difficulty: 'Intermediate',
                equipment: 'Kettlebell',
                dietPlan: 'Supplements like beta-alanine help buffer the burn during intense interval work.'
            }
        ]
    },
    {
        id: 'swimming',
        name: 'Swimming',
        description: 'A full-body, low-impact workout for ultimate conditioning.',
        image: '/assets/body-parts/swimming.png',
        exercises: [
            {
                id: 'freestyle',
                name: 'Freestyle (Front Crawl)',
                description: 'The fastest swimming stroke, great for cardiovascular health.',
                image: 'https://images.unsplash.com/photo-1530549387074-d3d999652396?auto=format&fit=crop&q=80&w=800',
                duration: '20 mins',
                calories: '200-400 cal',
                difficulty: 'Beginner',
                equipment: 'Pool',
                dietPlan: 'Stay hydrated; the pool masks sweat but you still lose fluids.'
            },
            {
                id: 'breaststroke',
                name: 'Breaststroke',
                description: 'A slower, more rhythmic stroke that targets the chest and inner legs.',
                image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=800',
                duration: '20 mins',
                calories: '150-300 cal',
                difficulty: 'Beginner',
                equipment: 'Pool',
                dietPlan: 'Recovery snacks like yogurt and fruit replenish glycogen after pool sessions.'
            },
            {
                id: 'backstroke',
                name: 'Backstroke',
                description: 'Improves shoulder mobility and strengthens the back muscles.',
                image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=800',
                duration: '15 mins',
                calories: '100-250 cal',
                difficulty: 'Intermediate',
                equipment: 'Pool',
                dietPlan: 'Incorporate lean proteins to support back muscle repair post-swim.'
            },
            {
                id: 'butterfly',
                name: 'Butterfly Stroke',
                description: 'A highly demanding stroke that builds immense power and shoulder strength.',
                image: 'https://images.unsplash.com/photo-1508453323049-7c15d522cc70?auto=format&fit=crop&q=80&w=800',
                duration: '10 mins',
                calories: '150-250 cal',
                difficulty: 'Advanced',
                equipment: 'Pool',
                dietPlan: 'High-calorie day required to support the massive energy demand of Butterfly.'
            }
        ]
    }
];
