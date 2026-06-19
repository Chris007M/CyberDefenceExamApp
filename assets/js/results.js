// ============================================================
// CYBER DEFENCE EXAM — results.js
// Handles: grading, score banner, per-question review with
// explanations, filtering, retake, and print.
// ============================================================

let gradedResults = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  const raw = sessionStorage.getItem('cd_exam_results');
  if (!raw) {
    // No results found — redirect back to start
    window.location.href = 'index.html';
    return;
  }

  const payload = JSON.parse(raw);
  gradedResults = gradeExam(payload.userAnswers);
  renderScoreBanner(gradedResults, payload.timeTakenSeconds);
  renderAnswers(gradedResults, currentFilter);
});

// ---------- Grading ----------
function gradeExam(userAnswers) {
  return EXAM_QUESTIONS.map((q, i) => {
    const userSel = (userAnswers[q.id] || []).slice().sort((a, b) => a - b);
    const correctSel = q.correct.slice().sort((a, b) => a - b);
    const answered = userSel.length > 0;
    const isCorrect = answered &&
      userSel.length === correctSel.length &&
      userSel.every((v, idx) => v === correctSel[idx]);

    return {
      index: i,
      question: q,
      userSelection: userSel,
      isCorrect,
      answered,
      marks: isCorrect ? MARKS_PER_Q : 0
    };
  });
}

// ---------- Score Banner ----------
function renderScoreBanner(results, timeTakenSeconds) {
  const totalScore = results.reduce((sum, r) => sum + r.marks, 0);
  const correctCount = results.filter(r => r.isCorrect).length;
  const skippedCount = results.filter(r => !r.answered).length;
  const wrongCount = TOTAL_Q - correctCount - skippedCount;
  const passed = totalScore >= PASS_MARK;

  const banner = document.getElementById('scoreBanner');
  banner.classList.add(passed ? 'pass' : 'fail');

  document.getElementById('scoreShield').textContent = passed ? '🏆' : '⚠️';
  document.getElementById('scoreNumber').textContent = totalScore;
  document.getElementById('scoreVerdict').textContent = passed
    ? 'PASS — Well done!'
    : 'NOT PASSED — Keep studying';

  document.getElementById('statCorrect').textContent = correctCount;
  document.getElementById('statWrong').textContent = wrongCount;
  document.getElementById('statSkipped').textContent = skippedCount;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;
  document.getElementById('statTime').textContent = `${mins}m ${secs}s`;
}

// ---------- Answer List ----------
function renderAnswers(results, filter) {
  const list = document.getElementById('answersList');
  list.innerHTML = '';

  const filtered = results.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'correct') return r.isCorrect;
    if (filter === 'wrong') return r.answered && !r.isCorrect;
    if (filter === 'skipped') return !r.answered;
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<p style="text-align:center; color:#8899aa; padding:40px 0;">No questions match this filter.</p>`;
    return;
  }

  filtered.forEach(r => {
    const card = document.createElement('div');
    let statusClass = 'wrong';
    let statusLabel = 'Incorrect';
    if (r.isCorrect) { statusClass = 'correct'; statusLabel = 'Correct'; }
    else if (!r.answered) { statusClass = 'skipped'; statusLabel = 'Skipped'; }

    card.className = `answer-card ${statusClass}`;

    const yourAnswerText = r.answered
      ? r.userSelection.map(idx => r.question.options[idx]).join(', ')
      : 'No answer selected';

    const correctAnswerText = r.question.correct.map(idx => r.question.options[idx]).join(', ');

    let html = `
      <div class="answer-card-header">
        <span class="answer-num">Q${r.index + 1}</span>
        <span class="answer-result ${statusClass}">${statusLabel}</span>
        <span class="answer-marks">${r.marks} / ${MARKS_PER_Q} marks</span>
      </div>
      <div class="answer-question">${escapeHtmlR(r.question.question)}</div>
      <div class="answer-detail">
    `;

    if (!r.isCorrect) {
      html += `<div class="your-answer"><strong>Your answer:</strong> ${escapeHtmlR(yourAnswerText)}</div>`;
    }
    html += `<div class="correct-answer"><strong>Correct answer:</strong> ${escapeHtmlR(correctAnswerText)}</div>`;
    html += `<div class="explanation"><strong>Why:</strong> ${escapeHtmlR(r.question.explanation)}</div>`;
    html += `</div>`;

    card.innerHTML = html;
    list.appendChild(card);
  });
}

function escapeHtmlR(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Filtering ----------
function filterResults(filter, btnEl) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  renderAnswers(gradedResults, filter);
}

// ---------- Actions ----------
function retryExam() {
  sessionStorage.removeItem('cd_exam_state');
  sessionStorage.removeItem('cd_exam_results');
  sessionStorage.removeItem('cd_exam_submitted');
  window.location.href = 'exam.html';
}

function goHome() {
  sessionStorage.removeItem('cd_exam_state');
  sessionStorage.removeItem('cd_exam_results');
  sessionStorage.removeItem('cd_exam_submitted');
  window.location.href = 'index.html';
}
