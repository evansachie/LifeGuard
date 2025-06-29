CREATE TABLE IF NOT EXISTS favorite_sounds (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    sound_id VARCHAR(255) NOT NULL,
    sound_name TEXT NOT NULL,
    sound_url TEXT NOT NULL,
    preview_url TEXT NOT NULL,
    category VARCHAR(100),
    duration DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, sound_id)
);
