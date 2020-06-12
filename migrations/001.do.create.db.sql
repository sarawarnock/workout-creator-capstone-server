CREATE TABLE public.exercises (
	id int NOT NULL,
	title varchar(255) NOT NULL,
	description varchar(255) NULL,
	is_arms int NOT NULL DEFAULT 0,
	is_legs int NOT NULL DEFAULT 0,
	is_back int NOT NULL DEFAULT 0,
	is_chest int NOT NULL DEFAULT 0,
	is_core int NOT NULL DEFAULT 0,
	is_cardio int NOT NULL DEFAULT 0,
	is_advanced int NOT NULL DEFAULT 0
);