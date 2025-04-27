const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (pool) => {
    // Get user's exercise statistics
    router.get('/stats', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;

            const stats = await pool.query(`
                SELECT 
                    COALESCE(SUM("CaloriesBurned"), 0) as total_calories,
                    COUNT(*) as workouts_completed
                FROM "UserWorkouts"
                WHERE "UserId" = $1
                AND "CompletedAt" >= NOW() - INTERVAL '7 days'
            `, [userId]);

            const streakData = await pool.query(
                'SELECT "CurrentStreak", "LongestStreak" FROM "WorkoutStreaks" WHERE "UserId" = $1',
                [userId]
            );

            const currentGoal = await pool.query(
                'SELECT "GoalType" FROM "WorkoutGoals" WHERE "UserId" = $1 AND "Status" = $2 ORDER BY "CreatedAt" DESC LIMIT 1',
                [userId, 'active']
            );

            res.json({
                caloriesBurned: stats.rows[0].total_calories,
                workoutsCompleted: stats.rows[0].workouts_completed,
                currentStreak: streakData.rows[0]?.CurrentStreak || 0,
                longestStreak: streakData.rows[0]?.LongestStreak || 0,
                currentGoal: currentGoal.rows[0]?.GoalType || 'Not set'
            });
        } catch (error) {
            console.error('Error fetching exercise stats:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Record completed workout
    router.post('/complete', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { workout_id, workout_type, calories_burned, duration_minutes } = req.body;

            // Record the workout
            await pool.query(
                'INSERT INTO "UserWorkouts" ("UserId", "WorkoutId", "WorkoutType", "CaloriesBurned", "DurationMinutes", "CompletedAt") VALUES ($1, $2, $3, $4, $5, NOW())',
                [userId, workout_id, workout_type, calories_burned, duration_minutes]
            );

            // Update streak
            await updateStreak(pool, userId);

            // Update weekly progress
            await updateWeeklyProgress(pool, userId, calories_burned, duration_minutes);

            res.json({ message: 'Workout completed successfully' });
        } catch (error) {
            console.error('Error completing workout:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Add new goal endpoint
    router.post('/goals', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { goalType } = req.body;

            // Set any existing goals to inactive
            await pool.query(
                'UPDATE "WorkoutGoals" SET "Status" = $1 WHERE "UserId" = $2 AND "Status" = $3',
                ['completed', userId, 'active']
            );

            // Add new goal
            const { rows } = await pool.query(
                'INSERT INTO "WorkoutGoals" ("UserId", "GoalType", "StartDate", "Status") VALUES ($1, $2, CURRENT_DATE, $3) RETURNING *',
                [userId, goalType, 'active']
            );

            res.json(rows[0]);
        } catch (error) {
            console.error('Error setting workout goal:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Get detailed calories history
    router.get('/calories-history', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { period = '7days' } = req.query;

            let timeInterval;
            switch (period) {
                case '30days':
                    timeInterval = 'INTERVAL \'30 days\'';
                    break;
                case '90days':
                    timeInterval = 'INTERVAL \'90 days\'';
                    break;
                default:
                    timeInterval = 'INTERVAL \'7 days\'';
            }

            const caloriesHistory = await pool.query(`
                SELECT 
                    DATE("CompletedAt") as date,
                    SUM("CaloriesBurned") as calories,
                    STRING_AGG("WorkoutType", ', ') as workout_types,
                    COUNT(*) as workout_count
                FROM "UserWorkouts"
                WHERE "UserId" = $1
                AND "CompletedAt" >= NOW() - ${timeInterval}
                GROUP BY DATE("CompletedAt")
                ORDER BY date DESC
            `, [userId]);

            // Get calorie burning trends
            const trends = await pool.query(`
                SELECT 
                    AVG("CaloriesBurned") as avg_calories_per_workout,
                    SUM("CaloriesBurned") as total_calories,
                    COUNT(*) as total_workouts
                FROM "UserWorkouts"
                WHERE "UserId" = $1
                AND "CompletedAt" >= NOW() - ${timeInterval}
            `, [userId]);

            res.json({
                history: caloriesHistory.rows,
                trends: trends.rows[0]
            });
        } catch (error) {
            console.error('Error fetching calories history:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Get detailed workout history
    router.get('/workout-history', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { period = '7days' } = req.query;

            let timeInterval;
            switch (period) {
                case '30days':
                    timeInterval = 'INTERVAL \'30 days\'';
                    break;
                case '90days':
                    timeInterval = 'INTERVAL \'90 days\'';
                    break;
                default:
                    timeInterval = 'INTERVAL \'7 days\'';
            }

            const workoutHistory = await pool.query(`
                SELECT 
                    DATE("CompletedAt") as date,
                    COUNT(*) as workout_count,
                    STRING_AGG("WorkoutType", ', ') as workout_types,
                    SUM("DurationMinutes") as total_duration,
                    SUM("CaloriesBurned") as total_calories
                FROM "UserWorkouts"
                WHERE "UserId" = $1
                AND "CompletedAt" >= NOW() - ${timeInterval}
                GROUP BY DATE("CompletedAt")
                ORDER BY date DESC
            `, [userId]);

            // Get workout type distribution
            const typeDistribution = await pool.query(`
                SELECT 
                    "WorkoutType",
                    COUNT(*) as count,
                    SUM("DurationMinutes") as total_duration,
                    AVG("DurationMinutes") as avg_duration,
                    SUM("CaloriesBurned") as total_calories
                FROM "UserWorkouts"
                WHERE "UserId" = $1
                AND "CompletedAt" >= NOW() - ${timeInterval}
                GROUP BY "WorkoutType"
                ORDER BY count DESC
            `, [userId]);

            // Get aggregate stats
            const stats = await pool.query(`
                SELECT 
                    COUNT(DISTINCT DATE("CompletedAt")) as active_days,
                    COUNT(*) as total_workouts,
                    AVG("DurationMinutes") as avg_duration,
                    SUM("DurationMinutes") as total_duration
                FROM "UserWorkouts"
                WHERE "UserId" = $1
                AND "CompletedAt" >= NOW() - ${timeInterval}
            `, [userId]);

            res.json({
                history: workoutHistory.rows,
                typeDistribution: typeDistribution.rows,
                stats: stats.rows[0]
            });
        } catch (error) {
            console.error('Error fetching workout history:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Get streak history
    router.get('/streak-history', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.uid;
            const { period = '7days' } = req.query;

            let timeInterval;
            switch (period) {
                case '30days':
                    timeInterval = 'INTERVAL \'30 days\'';
                    break;
                case '90days':
                    timeInterval = 'INTERVAL \'90 days\'';
                    break;
                default:
                    timeInterval = 'INTERVAL \'7 days\'';
            }

            // Get daily workout completion status
            const workoutDays = await pool.query(`
                SELECT 
                    DATE("CompletedAt") as date,
                    COUNT(*) as workout_count,
                    STRING_AGG("WorkoutType", ', ') as workout_types
                FROM "UserWorkouts"
                WHERE "UserId" = $1
                AND "CompletedAt" >= NOW() - ${timeInterval}
                GROUP BY DATE("CompletedAt")
                ORDER BY date ASC
            `, [userId]);

            // Get streak milestones
            const streakMilestones = await pool.query(`
                SELECT 
                    "LastWorkoutDate" as milestone_date,
                    "CurrentStreak" as streak_length,
                    "UpdatedAt"
                FROM "WorkoutStreaks"
                WHERE "UserId" = $1
                AND "UpdatedAt" >= NOW() - ${timeInterval}
                ORDER BY "UpdatedAt" ASC
            `, [userId]);

            // Get streak stats
            const streakStats = await pool.query(`
                SELECT 
                    "CurrentStreak",
                    "LongestStreak",
                    "LastWorkoutDate"
                FROM "WorkoutStreaks"
                WHERE "UserId" = $1
            `, [userId]);

            res.json({
                workoutDays: workoutDays.rows,
                streakMilestones: streakMilestones.rows,
                stats: streakStats.rows[0] || {
                    CurrentStreak: 0,
                    LongestStreak: 0,
                    LastWorkoutDate: null
                }
            });
        } catch (error) {
            console.error('Error fetching streak history:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};

// Update the helper functions to use the new schema
async function updateStreak(pool, userId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const streakResult = await client.query(
            'SELECT * FROM "WorkoutStreaks" WHERE "UserId" = $1',
            [userId]
        );

        const today = new Date().toISOString().split('T')[0];
        if (streakResult.rows.length === 0) {
            await client.query(
                'INSERT INTO "WorkoutStreaks" ("UserId", "CurrentStreak", "LongestStreak", "LastWorkoutDate") VALUES ($1, 1, 1, $2)',
                [userId, today]
            );
        } else {
            const streak = streakResult.rows[0];
            const lastWorkout = new Date(streak.LastWorkoutDate);
            const daysSinceLastWorkout = Math.floor((new Date() - lastWorkout) / (1000 * 60 * 60 * 24));

            let newCurrentStreak = daysSinceLastWorkout === 1 ? streak.CurrentStreak + 1 : 1;
            let newLongestStreak = Math.max(streak.LongestStreak, newCurrentStreak);

            await client.query(
                'UPDATE "WorkoutStreaks" SET "CurrentStreak" = $1, "LongestStreak" = $2, "LastWorkoutDate" = $3, "UpdatedAt" = NOW() WHERE "UserId" = $4',
                [newCurrentStreak, newLongestStreak, today, userId]
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateWeeklyProgress(pool, userId, caloriesBurned, durationMinutes) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const progressResult = await client.query(
            'SELECT * FROM "WeeklyProgress" WHERE "UserId" = $1 AND "WeekStartDate" = $2',
            [userId, weekStart.toISOString()]
        );

        if (progressResult.rows.length === 0) {
            await client.query(
                'INSERT INTO "WeeklyProgress" ("UserId", "WeekStartDate", "WorkoutsCompleted", "TotalCaloriesBurned", "TotalDurationMinutes") VALUES ($1, $2, 1, $3, $4)',
                [userId, weekStart.toISOString(), caloriesBurned, durationMinutes]
            );
        } else {
            await client.query(
                'UPDATE "WeeklyProgress" SET "WorkoutsCompleted" = "WorkoutsCompleted" + 1, "TotalCaloriesBurned" = "TotalCaloriesBurned" + $1, "TotalDurationMinutes" = "TotalDurationMinutes" + $2 WHERE "UserId" = $3 AND "WeekStartDate" = $4',
                [caloriesBurned, durationMinutes, userId, weekStart.toISOString()]
            );
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
