-- ============================================================
-- Techiehive Database Migration to Supabase
-- Go to Supabase dashboard → SQL Editor → paste this → Run
-- ============================================================

-- Drop tables in safe order
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  amount INTEGER NOT NULL,
  UNIQUE (user_id, course_id)
);

CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL
);

CREATE TABLE test_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- Insert data
INSERT INTO users (id,full_name,email,password_hash,role,created_at) VALUES (1,'Test User','test@techiehive.com','$2b$10$Q0C5OARP/LpVZ1/x5xX6DuubGeghm4V0ZDeSBs7n9pTpqSRrvfuZC','student','2026-03-20T03:09:19.295139');
INSERT INTO users (id,full_name,email,password_hash,role,created_at) VALUES (2,'Lesley John Jumbo','johnjumbolesley@gmail.com','$2b$10$yrDv4gaKybE7Uf14sEYVxOLK.i88GjBTkCpjK07vrJnYC9KxStltO','student','2026-03-20T03:12:06.39293');
INSERT INTO users (id,full_name,email,password_hash,role,created_at) VALUES (3,'Lesley John Jumbo','xaneai0@gmail.com','$2b$10$wCPRYn5EUgVrB38xv.bZ0up3vRBN6CLyaLTg9a56SmIJ90H0zmRGa','student','2026-03-20T05:26:30.231403');
INSERT INTO users (id,full_name,email,password_hash,role,created_at) VALUES (4,'Lesley John Jumbo','lesleysurveys9@gmail.com','$2b$10$CHNkdfTGKqpml83DxicM0eXPt4.PopqzA.NGxEin5dB4fY6XdNeOG','student','2026-03-20T05:57:39.324382');
INSERT INTO users (id,full_name,email,password_hash,role,created_at) VALUES (5,'Admin','admin@techiehive.com','$2b$10$ILym2b3M1LT3vXUdUAMl8uyI5BMGKhAqkjiD8BTVCWPD1SAHjgpSm','admin','2026-03-20T07:57:19.97303');
INSERT INTO users (id,full_name,email,password_hash,role,created_at) VALUES (6,'Eunice John Jumbo','eunicejohnjumbo@gmail.com','$2b$10$qrbIBs76od2VDlA.wxp6lus.eImQpIcz6yJqulmrJjYKNTcUiMpxC','student','2026-03-20T09:48:49.850916');
INSERT INTO users (id,full_name,email,password_hash,role,created_at) VALUES (7,'Blessed Pepple','blessedpepple20@gmail.com','$2b$10$yFhechptcfRqX9n.2lVBeebz6KvGlE/..5TrevtMmJ8P1PKMfRDDS','student','2026-03-20T20:14:41.702233');

INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (1,1,'Introduction to Web Development','https://youtu.be/nu_pCVPKzTk',1);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (2,1,'HTML & CSS Fundamentals','https://youtu.be/7NaeDBTRY1k',2);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (3,1,'JavaScript Basics','https://youtu.be/dPMk6_HTBq8',3);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (4,2,'Introduction to Video Editing','https://youtu.be/954L0eVIdaE',1);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (5,2,'Editing Techniques','https://youtu.be/sNjyOSADDxE',2);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (6,2,'Advanced Editing','https://youtu.be/MCDVcQIA3UM',3);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (7,3,'Introduction to Graphics Design','https://youtu.be/GQS7wPujL2k',1);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (8,3,'Design Principles','https://youtu.be/SnxFkHqN1RA',2);
INSERT INTO lessons (id,course_id,title,youtube_url,order_index) VALUES (9,3,'Advanced Design Techniques','https://youtu.be/wwo6Gdx3x7s',3);

INSERT INTO enrollments (id,user_id,course_id,paid_at,amount) VALUES (1,2,1,'2026-03-20T04:05:42.482297',15000);
INSERT INTO enrollments (id,user_id,course_id,paid_at,amount) VALUES (2,2,2,'2026-03-20T05:25:35.439287',15000);
INSERT INTO enrollments (id,user_id,course_id,paid_at,amount) VALUES (3,3,3,'2026-03-20T05:27:33.532023',15000);
INSERT INTO enrollments (id,user_id,course_id,paid_at,amount) VALUES (4,2,3,'2026-03-20T07:24:11.051246',15000);
INSERT INTO enrollments (id,user_id,course_id,paid_at,amount) VALUES (5,6,1,'2026-03-20T09:49:25.520293',15000);
INSERT INTO enrollments (id,user_id,course_id,paid_at,amount) VALUES (6,6,2,'2026-03-20T10:12:58.576096',15000);
INSERT INTO enrollments (id,user_id,course_id,paid_at,amount) VALUES (7,7,1,'2026-03-20T20:43:56.159601',15000);

INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (1,1,1,TRUE,'2026-03-20T05:52:43.316326+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (2,2,4,TRUE,'2026-03-20T05:55:40.562276+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (3,2,5,TRUE,'2026-03-20T05:55:47.954251+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (4,2,6,TRUE,'2026-03-20T05:56:03.35752+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (5,2,1,TRUE,'2026-03-20T05:56:22.734494+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (6,2,2,TRUE,'2026-03-20T05:56:25.386495+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (7,2,3,TRUE,'2026-03-20T05:56:28.742835+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (8,2,7,TRUE,'2026-03-20T07:25:09.367645+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (9,2,8,TRUE,'2026-03-20T07:25:17.258684+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (10,2,9,TRUE,'2026-03-20T07:25:19.950376+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (11,6,1,TRUE,'2026-03-20T09:49:42.195019+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (12,6,2,TRUE,'2026-03-20T09:49:47.650514+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (13,6,3,TRUE,'2026-03-20T09:49:53.46619+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (14,7,1,TRUE,'2026-03-20T20:46:50.473101+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (15,7,2,TRUE,'2026-03-20T20:46:54.640645+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (16,7,3,TRUE,'2026-03-20T20:46:57.754808+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (17,6,4,TRUE,'2026-03-20T20:54:13.7837+00:00');
INSERT INTO progress (id,user_id,lesson_id,completed,completed_at) VALUES (18,6,5,TRUE,'2026-03-20T20:54:29.770604+00:00');

INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (1,1,'What does HTML stand for?','Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Logic','Home Tool Markup Language','A');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (2,1,'Which language is used to style web pages?','JavaScript','Python','CSS','PHP','C');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (3,1,'What does API stand for?','Applied Programming Interface','Application Programming Interface','Automated Process Integration','Application Process Index','B');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (4,1,'Which of these is a JavaScript framework?','Django','Laravel','React','Flask','C');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (5,1,'What is a database used for?','Styling web pages','Storing and managing data','Running animations','Connecting to the internet','B');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (6,2,'What is a timeline in video editing?','A clock showing rendering time','A visual arrangement of clips in sequence','A list of video effects','A progress bar for exports','B');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (7,2,'What does FPS stand for?','File Processing Speed','Frames Per Second','Final Production Stage','Format Processing System','B');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (8,2,'What is color grading?','Rating the quality of a video','Adjusting the colors and tone of footage','Adding text to a video','Compressing a video file','B');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (9,2,'Which of these is a popular video editing software?','Photoshop','Illustrator','Adobe Premiere Pro','AutoCAD','C');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (10,2,'What is a cut in video editing?','Deleting an entire video','Adding a transition effect','An instant switch from one clip to another','Slowing down footage','C');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (11,3,'What does RGB stand for?','Red, Green, Blue','Red, Grey, Black','Round, Gradient, Bold','Render, Grade, Blend','A');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (12,3,'What is typography?','The study of maps','The art of arranging text in a visually appealing way','A type of photo filter','A printing machine','B');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (13,3,'Which software is commonly used for graphics design?','Microsoft Word','Adobe Illustrator','VLC Media Player','Google Sheets','B');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (14,3,'What is a vector graphic?','An image made of pixels','A scanned photograph','An image made of mathematical paths that scale without losing quality','A video file format','C');
INSERT INTO questions (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES (15,3,'What is white space in design?','A white background color','Empty or blank space used to improve readability and layout','A design error','A type of font color','B');

INSERT INTO test_results (id,user_id,course_id,score,passed,taken_at) VALUES (1,1,1,5,TRUE,'2026-03-20T07:10:06.830008+00:00');
INSERT INTO test_results (id,user_id,course_id,score,passed,taken_at) VALUES (2,2,1,2,FALSE,'2026-03-20T07:17:01.639987+00:00');
INSERT INTO test_results (id,user_id,course_id,score,passed,taken_at) VALUES (3,2,1,5,TRUE,'2026-03-20T07:17:42.428067+00:00');
INSERT INTO test_results (id,user_id,course_id,score,passed,taken_at) VALUES (4,2,3,3,TRUE,'2026-03-20T07:31:39.509947+00:00');
INSERT INTO test_results (id,user_id,course_id,score,passed,taken_at) VALUES (5,6,1,5,TRUE,'2026-03-20T09:50:13.880889+00:00');
INSERT INTO test_results (id,user_id,course_id,score,passed,taken_at) VALUES (6,7,1,3,TRUE,'2026-03-20T20:47:26.329697+00:00');

INSERT INTO certificates (id,user_id,course_id,issued_at) VALUES (1,1,1,'2026-03-20T07:10:06.864782+00:00');
INSERT INTO certificates (id,user_id,course_id,issued_at) VALUES (2,2,1,'2026-03-20T07:17:42.433718+00:00');
INSERT INTO certificates (id,user_id,course_id,issued_at) VALUES (3,2,3,'2026-03-20T07:31:39.538824+00:00');
INSERT INTO certificates (id,user_id,course_id,issued_at) VALUES (4,6,1,'2026-03-20T09:50:13.884143+00:00');
INSERT INTO certificates (id,user_id,course_id,issued_at) VALUES (5,7,1,'2026-03-20T20:47:26.335343+00:00');

-- Reset tokens table (for Forgot Password flow)
CREATE TABLE IF NOT EXISTS reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS reset_tokens_token_idx ON reset_tokens(token);

-- Reset sequences
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users),1));
SELECT setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons),1));
SELECT setval('enrollments_id_seq', COALESCE((SELECT MAX(id) FROM enrollments),1));
SELECT setval('progress_id_seq', COALESCE((SELECT MAX(id) FROM progress),1));
SELECT setval('questions_id_seq', COALESCE((SELECT MAX(id) FROM questions),1));
SELECT setval('test_results_id_seq', COALESCE((SELECT MAX(id) FROM test_results),1));
SELECT setval('certificates_id_seq', COALESCE((SELECT MAX(id) FROM certificates),1));

-- Done!