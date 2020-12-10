BEGIN;

TRUNCATE
    workout_details,
    workouts,
    exercises,
    users
    RESTART IDENTITY CASCADE;
-- User1234 password
INSERT INTO users (id, email, password, first_name)
VALUES
    (22, 'user', '$2a$12$YirKmnoVinL5zRIuUlqzhuOBHeffvaVoK/K8ov7xexuLbwITlEdH2', 'User');

INSERT INTO workouts (id, user_id, workouts_name, total_length, workout_type)
VALUES
    (122, 22, 'Hailstorm', 15, 'EMOM'),
    (123, 22, 'Shell', 15, 'AMRAP'),
    (124, 22, 'Lime', 10, 'EMOM');

INSERT INTO workout_details (id, workouts_id, exercises_id, exercise_reps)
VALUES
    (228, 122, 24, 9),
    (229, 122, 18, 8),
    (230, 122, 29, 8),
    (231, 123, 2, 14),
    (232, 123, 47, 14),
    (233, 123, 39, 22),
    (234, 124, 24, 8),
    (235, 124, 29, 5);

COMMIT;