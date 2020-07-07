CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (225) NOT NULL,
	first_name VARCHAR (225) NOT NULL
);

CREATE TABLE exercises (
	id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
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

CREATE TABLE workouts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    workouts_name VARCHAR (255) NOT NULL,
	total_length int NOT NULL DEFAULT 0
);

CREATE TABLE workout_details (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    workouts_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
	exercises_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
	exercise_reps int NOT NULL DEFAULT 1
);

INSERT INTO public.users ("email", "password", "first_name") VALUES 
('admin@gmail.com','Admin123', 'Bob'),
('user@gmail.com','User123', 'Bill');


INSERT INTO public.exercises (id,title,description,is_arms,is_legs,is_back,is_chest,is_core,is_cardio,is_advanced) VALUES 
(1,'air squat','keep feet under shoulders, send hips back and down, stand all the way up',0,1,0,0,0,0,0)
,(2,'jumping air squat','perform an air squat and jump at the top',0,1,0,0,0,1,0)
,(3,'sit up','feet on floor or butterflied, sit all the way up so shoulders come through hips',0,0,0,0,1,0,0)
,(4,'push up','hands under shoulders, lower so chest hits ground, push back up until arms are locked out. Scale: put hands on table, bench chair OR knees on floor',1,0,0,1,0,0,0)
,(5,'lunge','step one foot out so there is a 90 degree bend in both knees, alternate legs',0,1,0,0,0,0,0)
,(6,'jumping lunge','perform a lunge and switch legs in the air',0,1,0,0,0,1,0)
,(7,'hollow rock','keep lower back on floor, lift feet, lift shoulder blades, rock back and forth. Scale: Arms can be overhead, by sides, or knees can be bent to 90',0,0,0,0,1,0,0)
,(8,'v up','start laying down, lift upper body and lower body so you come on to your sits bones and touch your feet to your hands',0,0,0,0,1,0,0)
,(9,'jump rope single under','jump rope, passing the rope under your feet once per jump',0,0,0,0,0,1,0)
,(10,'jump rope double under','jump rope, passing the rope under your feet twice per jump',0,0,0,0,0,1,1)
;
INSERT INTO public.exercises (id,title,description,is_arms,is_legs,is_back,is_chest,is_core,is_cardio,is_advanced) VALUES 
(11,'leg lift','laying down, keeping lower back on the floor, lift legs up to 90 degrees and lower back down',0,0,0,0,1,0,0)
,(12,'scissor kick','laying down, move the legs side to side in a scissor motion',0,0,0,0,1,0,0)
,(13,'pike leg lift','seated with legs in front, lean forward and bring straight legs off ground',0,0,0,0,1,0,1)
,(14,'bicycle crunch','laying down, hands behind head, bring opposite elbow to opposite knee, keeping shoulder blades and legs off ground',0,0,0,0,1,0,0)
,(15,'single leg v up','start laying down, sit up on sits bones and touch opposite leg to opposite arm',0,0,0,0,1,0,0)
,(16,'cossack squat','very wide stance, squat down from side to side, keeping chest up',0,1,0,0,0,0,0)
,(17,'prisoner half kneel to stand','start standing, with hands behind head, reverse lunge, one leg at a time and come to a tall kneeling position, then stand back up, one leg at a time',0,1,0,0,0,0,0)
,(18,'tuck jump','start standing, jump in the air and bring knees to chest',0,1,0,0,0,1,0)
,(19,'gorilla burpee','perform a burpee, chest to floor, and at the top do a tuck jump',0,0,0,0,0,1,0)
,(20,'burpee','send legs back to a plank positon, drop knees, get chest to floor, then get all the way up, jumping at the top',0,0,0,0,0,1,0)
;
INSERT INTO public.exercises (id,title,description,is_arms,is_legs,is_back,is_chest,is_core,is_cardio,is_advanced) VALUES 
(21,'pike push up','place feet on ground (or on chair or bench for more challenge) so your body is in an inverted V, drop head in in front of hands, press back up',1,0,0,1,0,0,0)
,(22,'strict handstand push up','against a wall, come up into a handstand, lower your head toward the floor and press back up',1,0,0,0,0,0,1)
,(23,'kipping handstand push up','against a wall, come up into a handstand, lower body down so head touches the floor, bring knees to chest and use your hips to help press back up',1,0,0,0,0,0,1)
,(24,'pistol squat','single leg squat, alternate legs',0,1,0,0,0,0,1)
,(25,'shrimp squat','hold one leg behind you in a quad stretch positon, squat down using your other leg so your knee comes behind your heel, alternate legs',0,1,0,0,0,0,1)
,(26,'curtsey squat','start standing, bring opposite knee behind you to opposite heel, stand back up, switch legs',0,1,0,0,0,0,0)
,(27,'straddle leg circles','seated in a wide straddle, lift one leg off the floor and make circles, perform perscribed number of reps on one leg, then the other',0,1,0,0,1,0,0)
,(28,'glute bridge','laying on back, with arms at sides, bring heels to fingertips, drive through heels to lift your glutes and hamstrings off the floor, pausing for 1 second at the top',0,1,1,0,0,0,0)
,(29,'glute bridge v walk outs','glute bridge position, walk legs out in a "V" until they are straight, but still off the floor, and then walk them back in',0,1,1,0,0,0,1)
,(30,'prisoner death march','start standing with hands behind head, step one foot out about 1.5/2 feet in front of you, hinge at the hips so chest is parallel to ground, come back up and switch sides',0,1,1,0,0,0,0)
;
INSERT INTO public.exercises (id,title,description,is_arms,is_legs,is_back,is_chest,is_core,is_cardio,is_advanced) VALUES 
(31,'dragon flag','laying down, lift legs and lower back straight up off the floor, then without back coming back down, slowly lower legs',0,0,0,0,1,0,1)
,(32,'forward lunge to reverse lunge','perform a forward lunge, and then with the same leg, a reverse lunge, then switch sides',0,1,0,0,0,0,0)
,(33,'scapular push up','in a plank position (on hands), bring shoulder blades together and then press back out, keeping arms straight the whole time',0,0,1,0,1,0,0)
,(34,'side plank leg lifts','in a side plank position, lift top leg up, perform perscribed number of reps on one side then the other',0,0,0,0,1,0,0)
,(35,'single arm/single leg plank','in a plank position on hands, lift opposite arm and opposite leg off ground (one rep), switch sides',0,0,0,0,1,0,0)
,(36,'quadruped shoulder tap','start in a tabletop position, then lift knees off ground 2 inches, tap opposite hand to opposite shoulder, switching sides',0,0,0,0,1,0,0)
,(37,'star jump','squat down, jumping at top into a "star" position - arms and legs out to sides',0,0,0,0,0,1,0)
,(38,'gorilla walk','in a squat, place fists on ground in front of you, and hop your legs to get back into a squat position',0,0,0,0,0,1,0)
,(39,'quadruped walk','start in a tabletop position, lift knees 2 inches off ground, walk forward, keeping back straight',0,0,0,0,1,0,0)
,(40,'bench/chair dip','find a bench or a chair, place hands on the edge, dip down so your arms come to 90 degrees. knees bent = easier, legs straight = harder',1,0,0,1,0,0,0)
;
INSERT INTO public.exercises (id,title,description,is_arms,is_legs,is_back,is_chest,is_core,is_cardio,is_advanced) VALUES 
(41,'skater jump','start standing, bring one leg behind (and to the side of) the other, keeping the leg straight, so the toe touches the ground, switch sides ',0,1,0,0,0,1,0)
,(42,'man maker','start in a plank position, do a push up, do a row (R side), do another push up, row L, jump to a squat position, stand up = 1 rep',0,0,0,0,0,1,0)
,(43,'plank walk out','start standing, walk hands all the way out past a plank position, walk back in',0,0,0,0,1,0,0)
,(44,'side plank rotation','side plank postion, bring top arm underneath body, rotating to a single arm forward plank, perform all reps on one side, then the other',0,0,0,0,1,0,0)
,(45,'step up','step up onto a chair, bench, step, alternating legs',0,1,0,0,0,1,0)
,(46,'diamond push up','with hands in a diamond position, do a push up',1,0,0,1,0,0,0)
,(47,'wide push up','with arms in a wide stance, do a push up',1,0,0,1,0,0,0)
,(48,'single leg glute bridge','perform a glute bridge on one leg at a time, keeping the other leg in the air',0,1,1,0,0,0,0)
,(49,'groiner','aka bottom part of a burpee: going from a plank position, to a squat, and back to a plank',0,0,0,0,0,1,0)
,(50,'spider push up','plank position, bringing knee to same elbow while performing a push up',1,0,0,1,0,0,1)
;
INSERT INTO public.exercises (id,title,description,is_arms,is_legs,is_back,is_chest,is_core,is_cardio,is_advanced) VALUES 
(51,'broad jump','start in a squat position, jump as far forward as you can, taking off and landing on 2 feet',0,1,0,0,0,1,0)
,(52,'mountain climber','plank position on hands, bring knee to same elbow, swiching sides each rep',0,0,0,0,1,0,0)
,(53,'wall climb','starting on stomach with feet against a wall, push yourself up, and walk up the wall until you''re in a handstand position, then walk back down',1,0,0,0,1,0,1)
,(54,'bulgarian split squat','place back leg up on a chair, front leg about 2 feet in front of chair, keep chest up and squat down so your knee hits the ground (softly) right in front of the chair, do all reps on one side then switch',0,1,0,0,0,0,1)
,(55,'superman','on stomach, with arms outstretched, lift both arms and legs off ground',0,0,1,0,1,0,0)
,(56,'box jump','find a box, bench, or any hard surface (not a couch), jump up, standing all the way up at the top, step down',0,1,0,0,0,1,0)
,(57,'clapping push up','push up, and press yourself off your hands and clap at the top',1,0,0,1,0,0,1)
,(58,'single leg romanian deadlift','standing on one leg, with a slight knee bend, hinge at the hips so chest is parallel to ground, and hips are parallel to ground, pause 1 second and come back up',0,1,0,0,0,0,0)
,(59,'jumping deadlift','start standing, hinge at hips, jumping on the way back up (not a squat!)',0,0,0,0,0,1,0)
,(60,'calf raise','using a step, bring heels off, lower heels and then press back up onto your toes',0,1,0,0,0,0,0)
;
INSERT INTO public.exercises (id,title,description,is_arms,is_legs,is_back,is_chest,is_core,is_cardio,is_advanced) VALUES 
(61,'jumping jacks','start standing, jumping legs out while raising arms to the side and above your head',0,0,0,0,0,1,0)
,(62,'donkey kick','tabletop position, bend one knee and lift heel straight up to the ceiling, perform all reps on one side, then switch',0,1,0,0,0,0,0)
,(63,'plank jack','plank position, jump legs out to sides, and back in',0,0,0,0,1,0,0)
,(64,'lateral plank walk','plank position on hands, walk to the side, stepping arm and leg out at the same time',0,0,0,0,1,0,0)
,(65,'up down','start standing, place hands on the floor and kick back to plank position, come back up and end in standing position',0,0,0,0,0,1,0)
,(66,'single leg walk out to push up','start standing with 1 leg off ground, walk out to single leg plank, do a push up, walk back up and switch legs',1,0,0,1,0,0,1)
,(67,'side plank dips','side plank position, dip hips toward floor, press back out, do all reps on one side, then switch',0,0,0,0,1,0,0)
;