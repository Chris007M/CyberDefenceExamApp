<?php
/**
 * includes/functions.php
 * -----------------------------------------------------------
 * Server-side exam logic: load questions, grade attempts, and
 * optionally persist results to the database.
 *
 * This mirrors the client-side logic in assets/js/results.js so
 * that grading can be verified or re-run server-side (e.g. for
 * an instructor results dashboard) instead of trusting the
 * browser alone.
 * -----------------------------------------------------------
 */

require_once __DIR__ . '/db.php';

const MARKS_PER_QUESTION = 2;
const TOTAL_MARKS         = 100;
const PASS_MARK           = 50;
const EXAM_DURATION_SEC   = 3600; // 1 hour

/**
 * Load the question bank from the JSON data file.
 */
function loadQuestions(): array {
    $path = __DIR__ . '/../data/questions.json';
    $json = file_get_contents($path);
    $questions = json_decode($json, true);
    if (!is_array($questions)) {
        throw new RuntimeException('Failed to load questions.json');
    }
    return $questions;
}

/**
 * Grade a set of submitted answers against the answer key.
 *
 * @param array $submittedAnswers  Associative array: questionId => [selected option indexes]
 * @return array  Grading summary with per-question detail and total score
 */
function gradeSubmission(array $submittedAnswers): array {
    $questions = loadQuestions();
    $detail = [];
    $totalMarks = 0;
    $correctCount = 0;
    $skippedCount = 0;

    foreach ($questions as $q) {
        $qid = (string)$q['id'];
        $userSel = $submittedAnswers[$qid] ?? [];
        sort($userSel);
        $correctSel = $q['correct'];
        sort($correctSel);

        $answered = count($userSel) > 0;
        $isCorrect = $answered && $userSel === $correctSel;
        $marks = $isCorrect ? MARKS_PER_QUESTION : 0;

        $totalMarks += $marks;
        if ($isCorrect) $correctCount++;
        if (!$answered) $skippedCount++;

        $detail[] = [
            'id'         => $q['id'],
            'question'   => $q['question'],
            'options'    => $q['options'],
            'correct'    => $q['correct'],
            'userSelect' => $userSel,
            'isCorrect'  => $isCorrect,
            'answered'   => $answered,
            'marks'      => $marks,
            'explanation'=> $q['explanation'] ?? ''
        ];
    }

    $passed = $totalMarks >= PASS_MARK;

    return [
        'totalMarks'   => $totalMarks,
        'totalPossible'=> TOTAL_MARKS,
        'correctCount' => $correctCount,
        'wrongCount'   => count($questions) - $correctCount - $skippedCount,
        'skippedCount' => $skippedCount,
        'passed'       => $passed,
        'detail'       => $detail
    ];
}

/**
 * Optionally persist a graded attempt to the database.
 * Silently does nothing if no DB connection is available —
 * the exam remains fully usable without a database.
 */
function saveAttempt(string $studentName, array $gradeResult, int $timeTakenSeconds): ?int {
    $pdo = getDbConnection();
    if (!$pdo) return null;

    try {
        $stmt = $pdo->prepare(
            "INSERT INTO exam_attempts (student_name, total_marks, passed, time_taken_seconds, submitted_at)
             VALUES (:name, :marks, :passed, :time, NOW())"
        );
        $stmt->execute([
            ':name'   => $studentName,
            ':marks'  => $gradeResult['totalMarks'],
            ':passed' => $gradeResult['passed'] ? 1 : 0,
            ':time'   => $timeTakenSeconds,
        ]);
        return (int)$pdo->lastInsertId();
    } catch (PDOException $e) {
        error_log('Failed to save attempt: ' . $e->getMessage());
        return null;
    }
}
