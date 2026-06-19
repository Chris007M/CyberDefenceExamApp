<?php
/**
 * includes/db.php
 * -----------------------------------------------------------
 * Optional MySQL connection helper.
 *
 * This file is OPTIONAL. The exam app works fully client-side
 * using questions.js and sessionStorage — no database required.
 *
 * Enable this only if you want to persist student attempts and
 * scores server-side (e.g. for instructor reporting).
 *
 * Setup:
 *   1. Create a database: cyber_defence_exam
 *   2. Import schema.sql (see /database/schema.sql)
 *   3. Fill in the credentials below or use environment variables.
 * -----------------------------------------------------------
 */

// Read credentials from environment variables if available,
// otherwise fall back to local defaults for XAMPP/WAMP testing.
$DB_HOST = getenv('CD_DB_HOST') ?: '127.0.0.1';
$DB_NAME = getenv('CD_DB_NAME') ?: 'cyber_defence_exam';
$DB_USER = getenv('CD_DB_USER') ?: 'root';
$DB_PASS = getenv('CD_DB_PASS') ?: '';

function getDbConnection() {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS;

    try {
        $pdo = new PDO(
            "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
            $DB_USER,
            $DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        // Fail soft — the front-end exam still works without the DB.
        error_log('DB connection failed: ' . $e->getMessage());
        return null;
    }
}
