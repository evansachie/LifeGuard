CREATE TABLE "HealthMetrics" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" VARCHAR(255) NOT NULL,
    "Age" INTEGER,
    "Weight" DECIMAL(5,2),
    "Height" INTEGER,
    "Gender" VARCHAR(10),
    "ActivityLevel" VARCHAR(20),
    "Goal" VARCHAR(20),
    "BMR" INTEGER,
    "TDEE" INTEGER,
    "Unit" VARCHAR(10),
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_metrics_user ON "HealthMetrics" ("UserId");
