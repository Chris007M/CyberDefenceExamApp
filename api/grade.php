<?php
/**
 * api/grade.php
 * -----------------------------------------------------------
 * Optional server-side grading endpoint.
 *
 * The exam works entirely client-side by default (see
 * assets/js/results.js). This endpoint exists for setups that
 * want server-verified grading and persistence in MySQL,
 * for example an instructor dashboard of all student attempts.
 *
 * Usage (POST JSON):
 * {
 *   "studentName": "Jane Doe",
 *   "timeTakenSeconds": 1820,
 *   "answers": { "1": [1], "2": [0], "9": [0,1,2], ... }
 * }
 *
 * Response JSON mirrors the structure produced by
 * includes/functions.php::gradeSubmission()
 * -----------------------------------------------------------
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input) || !isset($input['answers'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body. Expected { studentName, timeTakenSeconds, answers }']);
    exit;
}

$studentName     = $input['studentName'] ?? 'Anonymous';
$timeTaken       = (int)($input['timeTakenSeconds'] ?? 0);
$submittedAnswers = $input['answers'];

try {
    $result = gradeSubmission($submittedAnswers);
    $attemptId = saveAttempt($studentName, $result, $timeTaken);
    $result['attemptId'] = $attemptId; // null if DB not configured — that's fine

    echo json_encode($result);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error during grading.', 'message' => $e->getMessage()]);
}
