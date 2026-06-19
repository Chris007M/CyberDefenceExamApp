# 🛡️ Cyber Defence Strategies — Self-Evaluation Exam

A full-stack web application for self-testing on Cyber Defence Strategies. Built as a 50-question timed exam covering risk management, governance, security controls, threat defence, data protection, and incident response.

**[➡️ Live Demo (GitHub Pages)](#deploying-to-github-pages)** — works the moment you enable Pages, no server needed.

---

## ✨ Features

- **50 questions, 2 marks each — 100 marks total.** Pass mark is 50%.
- **Single choice, multiple choice, and True/False** question types.
- **60-minute countdown timer** that persists across accidental refreshes (via `sessionStorage`).
- **Question navigator sidebar** — jump to any question, see which are answered at a glance.
- **Review All Questions** screen before final submission — see every question's answered/unanswered status and jump straight to any of them.
- **Instant grading** with a results page showing your score, pass/fail verdict, and a full breakdown of every question: your answer, the correct answer, and an explanation.
- **Filter results** by Correct / Incorrect / Skipped.
- **Print-friendly results page** for keeping a record.
- **No backend required** to run the exam — it works as static HTML/CSS/JS, so it deploys directly to GitHub Pages.
- **Optional PHP + MySQL backend included** if you want server-side grading and to log every student attempt (pass/fail/score/time) for instructor review.

---

## 📂 Project Structure

```
CyberDefenceExamApp/
│
├── index.html                  # Landing page — exam overview & instructions
├── exam.html                   # The exam itself — timer, questions, navigator
├── results.html                # Score, pass/fail, full answer review
│
├── assets/
│   ├── css/
│   │   └── style.css           # All styling (responsive, dark theme)
│   └── js/
│       ├── questions.js        # 50-question bank embedded for static hosting
│       ├── exam.js              # Timer, navigation, answer capture, review modal
│       └── results.js           # Client-side grading & results rendering
│
├── data/
│   └── questions.json          # Same 50-question bank in JSON (used by the PHP backend)
│
├── includes/                   # PHP backend (optional)
│   ├── db.php                  # MySQL connection helper
│   └── functions.php           # Server-side grading & persistence logic
│
├── api/
│   └── grade.php                # Optional POST endpoint for server-verified grading
│
├── database/
│   └── schema.sql               # Optional MySQL table for storing student attempts
│
└── README.md
```

---

## 🚀 Quick Start — Run Locally (No Server Needed)

The exam runs entirely in the browser. You don't need PHP, XAMPP, or a database to use it.

1. Download or clone this repository.
2. Open `index.html` directly in your browser, **or** serve the folder so relative paths behave consistently:
   ```bash
   # Option A: Python's built-in server
   cd CyberDefenceExamApp
   python3 -m http.server 8000
   # then visit http://localhost:8000

   # Option B: VS Code "Live Server" extension — right-click index.html → "Open with Live Server"
   ```
3. Click **Begin Exam**, answer the 50 questions, use **Review All** to check your progress, then **Submit Exam** to see your score.

---

## 🖥️ Optional: Run With the PHP Backend (XAMPP / WAMP / MAMP)

Only needed if you want server-verified grading or to log attempts in MySQL.

1. Install [XAMPP](https://www.apachefriends.org/) (or WAMP/MAMP).
2. Copy the `CyberDefenceExamApp` folder into your server's web root:
   - XAMPP: `C:\xampp\htdocs\CyberDefenceExamApp`
   - MAMP: `/Applications/MAMP/htdocs/CyberDefenceExamApp`
3. Start Apache (and MySQL, if using the database).
4. **(Optional database setup)**
   ```bash
   mysql -u root -p -e "CREATE DATABASE cyber_defence_exam;"
   mysql -u root -p cyber_defence_exam < database/schema.sql
   ```
   Then edit `includes/db.php` with your MySQL credentials, or set environment variables `CD_DB_HOST`, `CD_DB_NAME`, `CD_DB_USER`, `CD_DB_PASS`.
5. Visit `http://localhost/CyberDefenceExamApp/index.html` in your browser.
6. To use server-side grading instead of the default client-side grading, POST the submitted answers to `api/grade.php` — see the docblock in that file for the expected JSON shape.

---

## 🌐 Deploying to GitHub Pages

Since the exam works entirely client-side, GitHub Pages is the simplest way to give students access — no server required.

1. Create a new repository on GitHub, e.g. `CyberDefenceStrategiesExam`.
2. Push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Cyber Defence Exam Web App"
   git branch -M main
   git remote add origin https://github.com/<your-username>/CyberDefenceStrategiesExam.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**.
4. Under **Source**, choose the `main` branch and `/ (root)` folder, then **Save**.
5. After a minute, your exam will be live at:
   ```
   https://<your-username>.github.io/CyberDefenceStrategiesExam/
   ```
6. Share that link with students. Each student gets their own private session (answers are stored only in their own browser via `sessionStorage`, never sent anywhere) — so no two students see each other's progress, and nothing is uploaded automatically. If you want to *collect* results centrally, use the optional PHP/MySQL backend on a server that supports PHP (GitHub Pages itself only serves static files and cannot run PHP).

---

## 📝 Editing the Question Bank

The 50 questions live in two places that should be kept in sync:

- `assets/js/questions.js` — used by the static, client-side version (GitHub Pages).
- `data/questions.json` — used by the optional PHP backend (`includes/functions.php`).

Each question object follows this shape:

```json
{
  "id": 1,
  "question": "What type of risk assessment is generally considered more valuable, but more difficult to obtain?",
  "type": "single",
  "options": ["Qualitative", "Quantitative", "ISO 31000:2012", "NIST RMF"],
  "correct": [1],
  "explanation": "Quantitative risk assessments assign numerical values to risk..."
}
```

- `"type"` is one of `"single"`, `"multiple"`, or `"truefalse"`.
- `"correct"` is an array of zero-indexed option positions. For `"single"` and `"truefalse"` it has one entry; for `"multiple"` it can have several.

---

## 🎓 Exam Rules (as configured)

| Setting | Value |
|---|---|
| Number of questions | 50 |
| Marks per question | 2 |
| Total marks | 100 |
| Pass mark | 50% (50/100) |
| Time limit | 60 minutes |
| Review before submitting | Yes — "Review All" screen available any time |
| Attempts | Unlimited (use "Retake Exam" on the results page) |

---

## 🧩 Topics Covered

Risk Assessment & Governance · Security Frameworks (ISO 27001, NIST CSF, Essential Eight) · Administrative & Technical Controls · Access Control & AAA · Zero Trust · Data Protection & Classification · Threat Intelligence · Incident Response · Business Continuity & Disaster Recovery · Cloud Security · Red/Blue/Purple Teaming · Change Management & Business Case Development.

---

## 📄 License

This project is provided for educational self-evaluation purposes. Feel free to fork, adapt, and reuse for your own course materials.
