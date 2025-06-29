CREATE TABLE "UserWorkouts" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "WorkoutId" VARCHAR(50),
    "WorkoutType" VARCHAR(50),
    "CaloriesBurned" INTEGER,
    "DurationMinutes" INTEGER,
    "CompletedAt" TIMESTAMP,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WorkoutGoals" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "GoalType" VARCHAR(50),
    "StartDate" DATE,
    "EndDate" DATE,
    "Status" VARCHAR(20),
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WorkoutStreaks" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "CurrentStreak" INTEGER,
    "LongestStreak" INTEGER,
    "LastWorkoutDate" DATE,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP
);

CREATE TABLE "WeeklyProgress" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "WeekStartDate" DATE,
    "WorkoutsCompleted" INTEGER,
    "TotalCaloriesBurned" INTEGER,
    "TotalDurationMinutes" INTEGER,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
