-- ============================================================
-- Cyber Defence Exam – Optional Database Schema
-- ============================================================
-- This schema is OPTIONAL. The exam app is fully functional
-- without a database (it runs client-side via questions.js).
--
-- Use this only if you want to persist student attempt records,
-- e.g. for an instructor dashboard showing pass/fail history.
--
-- Setup:
--   1. Create the database:  CREATE DATABASE cyber_defence_exam;
--   2. Import this file:     mysql -u root -p cyber_defence_exam < schema.sql
--   3. Configure includes/db.php with your DB credentials.
-- ============================================================

CREATE TABLE IF NOT EXISTS exam_attempts (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    student_name        VARCHAR(150) NOT NULL,
    total_marks         INT NOT NULL,
    passed              TINYINT(1) NOT NULL,
    time_taken_seconds  INT NOT NULL,
    submitted_at        DATETIME NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: index for quick lookups by pass/fail or date
CREATE INDEX idx_passed ON exam_attempts (passed);
CREATE INDEX idx_submitted_at ON exam_attempts (submitted_at);
