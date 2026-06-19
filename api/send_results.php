<?php
/**
 * api/send_results.php
 * Accepts JSON POST: { email, answers, timeTakenSeconds }
 * Validates email, uses server-side grading to compute a result summary,
 * and attempts to email the user a short results summary. This endpoint
 * is best-effort and intended for local/instructor deployments (XAMPP).
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed, use POST']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing email']);
    exit;
}

$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

$answers = is_array($data['answers']) ? $data['answers'] : [];
$timeTakenSeconds = isset($data['timeTakenSeconds']) ? (int)$data['timeTakenSeconds'] : 0;

// Basic rate limiting by IP: one send per 30 seconds
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'send_results_' . preg_replace('/[^a-z0-9_.-]/i', '_', $ip);
if (file_exists($tmp)) {
    $last = (int)file_get_contents($tmp);
    if (time() - $last < 30) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests, please wait before resending']);
        exit;
    }
}
file_put_contents($tmp, (string)time());

// Load grading functions and compute results
require_once __DIR__ . '/../includes/functions.php';

try {
    $normalized = $answers; // functions::gradeSubmission expects questionId=>array
    $result = gradeSubmission($normalized);

    // Build a concise email body
    $subject = 'Your Cyber Defence Exam Results';
    $body = "Cyber Defence Exam Results:\n\n";
    $body .= "Score: {$result['totalMarks']} / {$result['totalPossible']}\n";
    $body .= "Passed: " . ($result['passed'] ? 'Yes' : 'No') . "\n";
    $body .= "Correct: {$result['correctCount']} | Wrong: {$result['wrongCount']} | Skipped: {$result['skippedCount']}\n";
    $body .= "Time taken: {$timeTakenSeconds} seconds\n\n";
    $body .= "Per-question summary:\n";
    foreach ($result['detail'] as $d) {
        $body .= sprintf("Q%d: %s -- %s\n", $d['id'], substr($d['question'], 0, 80), $d['isCorrect'] ? 'Correct' : ($d['answered'] ? 'Incorrect' : 'Skipped'));
    }

    // Prefer PHPMailer via SMTP if available and SMTP settings are configured.
    $smtpHost = getenv('SMTP_HOST');
    $smtpPort = getenv('SMTP_PORT') ?: 587;
    $smtpUser = getenv('SMTP_USER');
    $smtpPass = getenv('SMTP_PASS');
    $smtpSecure = getenv('SMTP_SECURE') ?: 'tls'; // tls or ssl
    $from = getenv('SMTP_FROM') ?: "no-reply@localhost";
    $fromName = getenv('SMTP_FROM_NAME') ?: 'Cyber Defence Exam';

    $sent = false;
    $mailError = null;

    // Try PHPMailer if installed via Composer (or vendored)
    if ($smtpHost && $smtpUser && $smtpPass) {
        try {
            // Load PHPMailer from vendored source to avoid Composer dependency issues
            require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/Exception.php';
            require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php';
            require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/SMTP.php';
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            // Enable debug logging to Apache error log for troubleshooting
            $mail->SMTPDebug = 2;
            $mail->Debugoutput = function($str, $level) { error_log("PHPMailer: [$level] $str"); };
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->Port = (int)$smtpPort;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
            $mail->SMTPSecure = $smtpSecure === 'ssl' ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->setFrom($from, $fromName);
            $mail->addAddress($email);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->AltBody = $body;
            $mail->send();
            $sent = true;
        } catch (Exception $ex) {
            $mailError = $ex->getMessage();
            $sent = false;
        }
    } else {
        // Fallback to PHP mail() if available
        $headers = "From: {$from}" . "\r\n" . "Content-Type: text/plain; charset=UTF-8";
        if (function_exists('mail')) {
            $sent = mail($email, $subject, $body, $headers);
            if (!$sent) $mailError = 'mail() returned false';
        } else {
            $mailError = 'No mailer available (install PHPMailer via Composer or enable mail())';
        }
    }

    if ($sent) {
        echo json_encode(['success' => true, 'message' => 'Email sent']);
    } else {
        // Email may fail on local dev — return success=false but still return results
        http_response_code(202);
        echo json_encode(['success' => false, 'message' => 'Could not send email from this server (check mail configuration).', 'mailError' => $mailError, 'result' => $result]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'message' => $e->getMessage()]);
}
