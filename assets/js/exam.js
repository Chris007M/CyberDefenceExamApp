// ============================================================
// CYBER DEFENCE EXAM — exam.js
// Handles: rendering questions, answer capture, navigation,
// the question navigator sidebar, review modal, timer, and submission.
// ============================================================

const TOTAL_Q = EXAM_QUESTIONS.length;

let currentIndex = 0;
let userAnswers = {};      // { questionId: [selectedOptionIndexes] }
let timeRemaining = EXAM_DURATION;
let timerInterval = null;
let examStartTime = null;

// ---------- Initialisation ----------
document.addEventListener('DOMContentLoaded', () => {
  initExamState();
  buildSidebarNav();
  renderQuestion(currentIndex);
  startTimer();
  window.addEventListener('beforeunload', warnBeforeLeave);
});

function initExamState() {
  // Restore in-progress attempt if the page was reloaded accidentally
  const saved = sessionStorage.getItem('cd_exam_state');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      userAnswers = state.userAnswers || {};
      timeRemaining = typeof state.timeRemaining === 'number' ? state.timeRemaining : EXAM_DURATION;
      currentIndex = state.currentIndex || 0;
      examStartTime = state.examStartTime || Date.now();
    } catch (e) {
      examStartTime = Date.now();
    }
  } else {
    examStartTime = Date.now();
  }
  saveState();
}

function saveState() {
  sessionStorage.setItem('cd_exam_state', JSON.stringify({
    userAnswers, timeRemaining, currentIndex, examStartTime
  }));
}

function warnBeforeLeave(e) {
  if (!examSubmittedFlag()) {
    e.preventDefault();
    e.returnValue = '';
  }
}

function examSubmittedFlag() {
  return sessionStorage.getItem('cd_exam_submitted') === 'true';
}

// ---------- Timer ----------
function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    saveState();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      autoSubmitOnTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const el = document.getElementById('timerDisplay');
  if (el) el.textContent = display;

  const box = document.getElementById('timerBox');
  if (box) {
    box.classList.remove('warning', 'danger');
    if (timeRemaining <= 60) box.classList.add('danger');
    else if (timeRemaining <= 300) box.classList.add('warning');
  }
}

function autoSubmitOnTimeout() {
  alert("Time's up! Your exam will now be submitted automatically.");
  submitExam();
}

// ---------- Sidebar Navigator ----------
function buildSidebarNav() {
  const grid = document.getElementById('qNavGrid');
  grid.innerHTML = '';
  for (let i = 0; i < TOTAL_Q; i++) {
    const dot = document.createElement('div');
    dot.className = 'q-dot';
    dot.textContent = i + 1;
    dot.id = `dot-${i}`;
    dot.onclick = () => { saveCurrentAnswerState(); currentIndex = i; renderQuestion(i); };
    grid.appendChild(dot);
  }
  refreshSidebarStates();
}

function refreshSidebarStates() {
  for (let i = 0; i < TOTAL_Q; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) continue;
    dot.classList.remove('answered', 'current');
    const qid = EXAM_QUESTIONS[i].id;
    if (userAnswers[qid] && userAnswers[qid].length > 0) dot.classList.add('answered');
    if (i === currentIndex) dot.classList.add('current');
  }
}

// ---------- Rendering ----------
function renderQuestion(index) {
  const q = EXAM_QUESTIONS[index];

  document.getElementById('currentQ').textContent = index + 1;
  document.getElementById('progressBar').style.width = `${((index + 1) / TOTAL_Q) * 100}%`;
  document.getElementById('qNumber').textContent = `Q${index + 1}`;
  document.getElementById('qText').textContent = q.question;

  const badge = document.getElementById('qTypeBadge');
  if (q.type === 'multiple') badge.textContent = 'Multiple Answers';
  else if (q.type === 'truefalse') badge.textContent = 'True / False';
  else badge.textContent = 'Single Choice';

  const optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';

  const selected = userAnswers[q.id] || [];
  const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';

  q.options.forEach((optText, optIdx) => {
    const item = document.createElement('label');
    item.className = 'option-item';
    if (selected.includes(optIdx)) item.classList.add('selected');

    const input = document.createElement('input');
    input.type = inputType;
    input.name = `q-${q.id}`;
    input.value = optIdx;
    input.checked = selected.includes(optIdx);
    input.onchange = () => handleOptionChange(q, optIdx, inputType, item);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'option-label';
    labelSpan.textContent = optText;

    item.appendChild(input);
    item.appendChild(labelSpan);
    item.onclick = (e) => {
      if (e.target.tagName.toLowerCase() !== 'input') {
        input.checked = !input.checked;
        handleOptionChange(q, optIdx, inputType, item);
      }
    };
    optionsList.appendChild(item);
  });

  // Nav button states
  document.getElementById('btnPrev').disabled = index === 0;
  const isLast = index === TOTAL_Q - 1;
  document.getElementById('btnNext').style.display = isLast ? 'none' : 'inline-block';
  document.getElementById('submitSection').style.display = isLast ? 'block' : 'none';

  refreshSidebarStates();
  saveState();
}

function handleOptionChange(q, optIdx, inputType, itemEl) {
  if (!userAnswers[q.id]) userAnswers[q.id] = [];

  if (inputType === 'radio') {
    userAnswers[q.id] = [optIdx];
    document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
    itemEl.classList.add('selected');
  } else {
    const arr = userAnswers[q.id];
    const pos = arr.indexOf(optIdx);
    if (pos >= 0) {
      arr.splice(pos, 1);
      itemEl.classList.remove('selected');
    } else {
      arr.push(optIdx);
      itemEl.classList.add('selected');
    }
  }

  refreshSidebarStates();
  saveState();
}

function saveCurrentAnswerState() {
  // Answers are already captured live via handleOptionChange; this is a hook
  // kept for clarity/future extension (e.g., flagging questions).
  saveState();
}

// ---------- Navigation ----------
function navigateQ(direction) {
  saveCurrentAnswerState();
  const next = currentIndex + direction;
  if (next < 0 || next >= TOTAL_Q) return;
  currentIndex = next;
  renderQuestion(currentIndex);
}

// ---------- Review Modal ----------
function openReview() {
  const body = document.getElementById('reviewBody');
  body.innerHTML = '';

  EXAM_QUESTIONS.forEach((q, i) => {
    const answered = userAnswers[q.id] && userAnswers[q.id].length > 0;
    const row = document.createElement('div');
    row.className = 'review-item';

    row.innerHTML = `
      <span class="review-num">Q${i + 1}</span>
      <span class="review-q">${escapeHtml(q.question)}</span>
      <span class="review-status ${answered ? 'answered' : 'unanswered'}">
        ${answered ? 'Answered' : 'Unanswered'}
      </span>
      <button class="review-goto" data-idx="${i}">Go to →</button>
    `;
    body.appendChild(row);
  });

  body.querySelectorAll('.review-goto').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      closeReview();
      currentIndex = idx;
      renderQuestion(idx);
    };
  });

  document.getElementById('reviewModal').style.display = 'flex';
}

function closeReview() {
  document.getElementById('reviewModal').style.display = 'none';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Submission ----------
function confirmSubmit() {
  closeReview();
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] && userAnswers[k].length > 0).length;
  const unanswered = TOTAL_Q - answeredCount;
  const msg = unanswered > 0
    ? `You have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Are you sure you want to submit the exam? This action cannot be undone.`
    : `You have answered all ${TOTAL_Q} questions. Are you sure you want to submit the exam?`;
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmModal').style.display = 'flex';
}

function closeConfirm() {
  document.getElementById('confirmModal').style.display = 'none';
}

function submitExam() {
  clearInterval(timerInterval);

  const timeTakenSeconds = EXAM_DURATION - timeRemaining;
  // Require a valid email address before submitting
  const emailEl = document.getElementById('submitEmail');
  const emailErrorEl = document.getElementById('emailError');
  const email = emailEl ? (emailEl.value || '').trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    if (emailErrorEl) {
      emailErrorEl.style.display = 'block';
      emailErrorEl.textContent = 'Please enter a valid email address to receive your results.';
    }
    if (emailEl) emailEl.focus();
    return;
  }

  if (emailErrorEl) { emailErrorEl.style.display = 'none'; }

  const resultsPayload = {
    userAnswers,
    timeTakenSeconds,
    submittedAt: Date.now()
  };

  // Save results to sessionStorage for the results page
  sessionStorage.setItem('cd_exam_results', JSON.stringify(resultsPayload));
  sessionStorage.setItem('cd_exam_submitted', 'true');
  sessionStorage.removeItem('cd_exam_state');

  // Send results to server to email the user (best-effort). Do not block navigation for too long.
  (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch('api/send_results.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers: userAnswers, timeTakenSeconds }),
        signal: controller.signal
      });
      clearTimeout(timeout);
    } catch (e) {
      // ignore network errors — results page will still show local grading
      console.warn('Failed to send results to server:', e);
    }
  })();

  // Navigate to results page
  window.location.href = 'results.html';
}
