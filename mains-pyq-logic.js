// Subject map per paper
const subjectMap = {
    all: [],
    GS1: ['Indian Society', 'Art & Culture', 'History', 'Geography', 'World History', 'Modern History', 'Post Independence History'],
    GS2: ['Polity', 'Governance', 'Social Justice', 'International Relations'],
    GS3: ['Economy', 'Agriculture', 'Science & Technology', 'Environment', 'Disaster Management', 'Internal Security'],
    GS4: ['Ethics', 'Integrity', 'Aptitude', 'Case Studies'],
    Essay: ['Philosophical Essays', 'Social Issues', 'Economic Issues', 'Governance', 'Technology', 'Environment'],
    Optional: ['History Optional', 'Geography Optional', 'Political Science Optional', 'Sociology Optional', 'Public Administration Optional', 'Economics Optional']
};

let selectedPaper = 'all';
let filteredQuestions = [];
let currentIndex = 0;
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;
let isSubmitted = false;
let stats = { total: 0, attempted: 0, skipped: 0, unattempted: 0 };
let bookmarks = JSON.parse(localStorage.getItem('mainsBookmarks') || '[]');
const evalScores = { content: 0, structure: 0, examples: 0, language: 0 };

window.onload = function () {
    initYearFilter();
    initStarRatings();
};

function initYearFilter() {
    const sel = document.getElementById("yearFilter");
    sel.innerHTML = '<option value="">All Years</option>';
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2013; y--) {
        const o = document.createElement("option");
        o.value = y; o.innerText = y;
        sel.appendChild(o);
    }
}

function initStarRatings() {
    const criteria = [
        { key: 'content', max: 6 },
        { key: 'structure', max: 4 },
        { key: 'examples', max: 3 },
        { key: 'language', max: 2 }
    ];
    criteria.forEach(c => {
        const container = document.getElementById('stars-' + c.key);
        if (!container) return;
        for (let i = 1; i <= c.max; i++) {
            const btn = document.createElement('button');
            btn.className = 'sk-star-btn';
            btn.textContent = i;
            btn.dataset.val = i;
            btn.onclick = function () {
                evalScores[c.key] = i;
                container.querySelectorAll('.sk-star-btn').forEach(b => {
                    b.classList.toggle('sel', parseInt(b.dataset.val) <= i);
                });
                updateTotalScore();
            };
            container.appendChild(btn);
        }
    });
}

function updateTotalScore() {
    const total = Object.values(evalScores).reduce((a, b) => a + b, 0);
    const el = document.getElementById('totalScore');
    if (el) el.textContent = total;
}

function resetStarRatings() {
    ['content', 'structure', 'examples', 'language'].forEach(k => {
        evalScores[k] = 0;
        const c = document.getElementById('stars-' + k);
        if (c) c.querySelectorAll('.sk-star-btn').forEach(b => b.classList.remove('sel'));
    });
    const el = document.getElementById('totalScore');
    if (el) el.textContent = '0';
}

function updateSubjectFilter(paper) {
    const sel = document.getElementById('subjectFilter');
    sel.innerHTML = '<option value="">All Subjects</option>';
    const subjects = subjectMap[paper] || [];
    subjects.forEach(s => {
        const o = document.createElement('option');
        o.value = s; o.innerText = s;
        sel.appendChild(o);
    });
}

function selectPaper(el, paper) {
    document.querySelectorAll('.paper-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedPaper = paper;
    updateSubjectFilter(paper);
}

function selectMode(mode) {
    document.querySelectorAll('.mode-box').forEach(b => b.classList.remove('active'));
    if (mode === 'practice') {
        document.querySelectorAll('.mode-box')[0].classList.add('active');
        document.getElementById('startBtn').innerHTML = '<i class="fas fa-play"></i> Start Practice';
    } else {
        document.querySelectorAll('.mode-box')[1].classList.add('active');
        document.getElementById('startBtn').innerHTML = '<i class="fas fa-stopwatch"></i> Start Test';
    }
}

function startSession() {
    const subject = document.getElementById("subjectFilter").value;
    const year = document.getElementById("yearFilter").value;
    const type = document.getElementById("typeFilter").value;
    const marks = document.getElementById("marksFilter").value;

    filteredQuestions = mainsPYQData.filter(q => {
        if (selectedPaper !== 'all' && q.paper !== selectedPaper) return false;
        if (subject && q.subject !== subject) return false;
        if (year && q.year !== parseInt(year)) return false;
        if (marks && q.marks !== parseInt(marks)) return false;
        if (type === 'bookmarked' && !bookmarks.includes(q.id)) return false;
        return true;
    });

    if (!filteredQuestions.length) {
        alert("No questions found for selected filters. Please adjust your filters.");
        return;
    }

    document.getElementById('infoPaper').textContent = selectedPaper === 'all' ? 'All Papers' : selectedPaper;
    document.getElementById('infoYear').textContent = year || 'All Years';
    document.getElementById('infoSubject').textContent = subject || 'All Subjects';
    document.getElementById('infoTotal').textContent = filteredQuestions.length;

    stats = { total: filteredQuestions.length, attempted: 0, skipped: 0, unattempted: filteredQuestions.length };
    currentIndex = 0;

    document.getElementById('mainArea').style.display = 'block';
    document.getElementById('analyticsArea').style.display = 'block';
    document.getElementById('filterSidebar').style.display = 'none';
    document.getElementById('mainContainer').style.justifyContent = 'flex-start';

    renderNavDots();
    loadQuestion(0);
    updateAnalytics();
}

function loadQuestion(idx) {
    if (idx >= filteredQuestions.length) { showEndMessage(); return; }
    const q = filteredQuestions[idx];
    isSubmitted = false;

    document.getElementById('qId').textContent = 'MAINS PYQ: #' + String(q.id).padStart(3, '0');
    document.getElementById('qText').textContent = q.question;
    document.getElementById('answerBox').value = '';
    document.getElementById('wordCount').textContent = '0';
    
    // Clear upload preview
    const preview = document.getElementById('uploadPreview');
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
    const fileInput = document.getElementById('answerFileInput');
    if (fileInput) fileInput.value = '';

    document.getElementById('answerTabsSection').style.display = 'none';
    document.getElementById('expContent').innerHTML = '';
    document.getElementById('expTags').innerHTML = '';
    if (document.getElementById('keyPointsBox')) document.getElementById('keyPointsBox').style.display = 'none';
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-paper-plane"></i> Submit Answer';

    // Reset eval tab
    resetStarRatings();
    const notes = document.querySelector('.sk-notes-area');
    if (notes) notes.value = '';

    document.getElementById('marksInfo').innerHTML =
        '<span class="marks-pill"><i class="fas fa-star"></i> ' + q.marks + ' Marks</span>';

    document.getElementById('qBadges').innerHTML =
        '<span class="badge badge-paper"><i class="fas fa-file-alt"></i> ' + q.paper + '</span>' +
        '<span class="badge badge-year"><i class="fas fa-calendar"></i> ' + q.year + '</span>' +
        '<span class="badge badge-subject"><i class="fas fa-book"></i> ' + q.subject + '</span>';

    // Update model meta
    const meta = document.getElementById('modelMeta');
    if (meta) meta.textContent = q.paper + ' | ' + q.subject + ' | ' + q.year + ' | ' + q.marks + ' Marks';

    // Bookmark state
    updateBookmarkBtn(q.id);

    renderNavDots();
    startTimer();
}

function updateBookmarkBtn(qId) {
    const btn = document.getElementById('bookmarkBtn');
    const icon = document.getElementById('bookmarkIcon');
    const label = document.getElementById('bookmarkLabel');
    if (!btn) return;
    if (bookmarks.includes(qId)) {
        btn.classList.add('bookmarked');
        if (icon) icon.className = 'fas fa-bookmark';
        if (label) label.textContent = 'Saved!';
    } else {
        btn.classList.remove('bookmarked');
        if (icon) icon.className = 'far fa-bookmark';
        if (label) label.textContent = 'Save';
    }
}

function renderNavDots() {
    const nav = document.getElementById('qNav');
    nav.innerHTML = '';
    filteredQuestions.forEach((q, i) => {
        const d = document.createElement('div');
        d.className = 'q-nav-dot';
        d.textContent = i + 1;
        if (i === currentIndex) d.classList.add('current');
        d.onclick = function () { currentIndex = i; loadQuestion(i); };
        nav.appendChild(d);
    });
}

function updateWordCount() {
    const text = document.getElementById('answerBox').value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    document.getElementById('wordCount').textContent = count;
}

function handleAnswerUpload(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const preview = document.getElementById('uploadPreview');
        if (preview) {
            preview.src = ev.target.result;
            preview.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

function renderModelAnswer(q) {
    const ma = q.modelAnswer;
    let html = '';

    // Gradient Header
    html += `<div style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:18px 22px;border-radius:14px 14px 0 0;color:white;display:flex;align-items:center;gap:12px;margin:-1px -1px 0;">
        <i class="fas fa-graduation-cap" style="font-size:1.4rem;"></i>
        <div>
            <div style="font-size:1.05rem;font-weight:800;">Model Answer</div>
            <div style="font-size:0.82rem;opacity:0.9;margin-top:2px;font-family:var(--font-ui);">${q.paper} &nbsp;|&nbsp; ${q.subject} &nbsp;|&nbsp; ${q.year} &nbsp;|&nbsp; ${q.marks} Marks</div>
        </div>
    </div>`;

    // Introduction
    html += `<div style="padding:20px 22px;border-bottom:1px solid var(--border-glass);">
        <div style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#3b82f6;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
            <i class="fas fa-play-circle"></i> Introduction
        </div>
        <div style="font-family:var(--font-ui);font-size:0.96rem;line-height:1.85;color:#334155;">${ma.intro}</div>
    </div>`;

    // Arguments For (Green)
    if (ma.forPoints && ma.forPoints.length) {
        html += `<div style="padding:20px 22px;border-bottom:1px solid var(--border-glass);">
            <div style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#10b981;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
                <i class="fas fa-shield-alt"></i> Key Arguments / Points
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">`;
        ma.forPoints.forEach(p => {
            html += `<div style="display:flex;gap:12px;align-items:flex-start;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);border-radius:10px;padding:12px 14px;">
                <i class="fas fa-check-circle" style="color:#10b981;margin-top:2px;flex-shrink:0;"></i>
                <div style="font-family:var(--font-ui);font-size:0.91rem;color:#1e293b;line-height:1.65;">
                    <strong style="color:#059669;">${p.head}:</strong> ${p.body}
                </div>
            </div>`;
        });
        html += `</div></div>`;
    }

    // Counter Arguments / Challenges (Red)
    if (ma.againstPoints && ma.againstPoints.length) {
        html += `<div style="padding:20px 22px;border-bottom:1px solid var(--border-glass);">
            <div style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#ef4444;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
                <i class="fas fa-exclamation-triangle"></i> Challenges / Counter Arguments
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">`;
        ma.againstPoints.forEach(p => {
            html += `<div style="display:flex;gap:12px;align-items:flex-start;background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.15);border-radius:10px;padding:12px 14px;">
                <i class="fas fa-times-circle" style="color:#ef4444;margin-top:2px;flex-shrink:0;"></i>
                <div style="font-family:var(--font-ui);font-size:0.91rem;color:#1e293b;line-height:1.65;">
                    <strong style="color:#dc2626;">${p.head}:</strong> ${p.body}
                </div>
            </div>`;
        });
        html += `</div></div>`;
    }

    // Way Forward (Blue numbered)
    if (ma.wayForward && ma.wayForward.length) {
        html += `<div style="padding:20px 22px;border-bottom:1px solid var(--border-glass);">
            <div style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#8b5cf6;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
                <i class="fas fa-balance-scale"></i> Way Forward
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">`;
        ma.wayForward.forEach((s, i) => {
            html += `<div style="display:flex;gap:14px;align-items:flex-start;background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.15);border-radius:10px;padding:13px 15px;">
                <div style="width:28px;height:28px;border-radius:8px;background:#3b82f6;color:white;font-size:0.8rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:var(--font-ui);">${i+1}</div>
                <div>
                    <div style="font-weight:700;font-size:0.88rem;color:#2563eb;margin-bottom:4px;">${s.label}</div>
                    <div style="font-size:0.88rem;color:var(--text-main);font-family:var(--font-ui);line-height:1.6;">${s.desc}</div>
                </div>
            </div>`;
        });
        html += `</div></div>`;
    }

    // Conclusion
    html += `<div style="padding:20px 22px;border-bottom:1px solid var(--border-glass);">
        <div style="font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#f59e0b;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
            <i class="fas fa-flag-checkered"></i> Conclusion
        </div>
        <div style="font-family:var(--font-ui);font-size:0.96rem;line-height:1.85;color:#334155;">${ma.conclusion}</div>
    </div>`;

    // Score Hints
    if (ma.scoreHints && ma.scoreHints.length) {
        html += `<div style="padding:16px 22px;border-bottom:1px solid var(--border-glass);">
            <div style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:15px 17px;">
                <div style="font-weight:700;color:#059669;font-size:0.85rem;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                    <i class="fas fa-star"></i> Score Criteria (${q.marks} Marks)
                </div>
                <div style="display:flex;flex-direction:column;gap:7px;">`;
        ma.scoreHints.forEach(h => {
            html += `<div style="display:flex;align-items:center;gap:10px;font-size:0.84rem;font-family:var(--font-ui);color:var(--text-main);">
                <i class="fas fa-circle" style="color:#10b981;font-size:0.5rem;"></i> ${h}
            </div>`;
        });
        html += `</div></div></div>`;
    }

    // Tags
    if (ma.tags && ma.tags.length) {
        html += `<div style="padding:14px 22px;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">`;
        ma.tags.forEach(t => {
            html += `<span style="background:rgba(245,158,11,0.1);color:#d97706;padding:5px 12px;border-radius:20px;font-size:0.8rem;font-weight:700;font-family:var(--font-ui);">${t}</span>`;
        });
        html += `</div></div>`;
    }

    return html;
}

function showAnswerTabs() {
    if (isSubmitted) return;
    
    // Validate that either text is written or image is uploaded
    const text = document.getElementById('answerBox').value.trim();
    const previewSrc = document.getElementById('uploadPreview') ? document.getElementById('uploadPreview').src : '';
    if (!text && (!previewSrc || previewSrc === window.location.href)) {
        alert('Please write or upload your answer first!');
        return;
    }

    isSubmitted = true;
    const q = filteredQuestions[currentIndex];

    document.getElementById('expContent').innerHTML = renderModelAnswer(q);
    document.getElementById('answerTabsSection').style.display = 'block';
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-check-circle"></i> Submitted';
    showTab('evaluate');

    stats.attempted++;
    stats.unattempted = Math.max(0, stats.unattempted - 1);
    updateNavDot(currentIndex, 'attempted');
    updateAnalytics();
    stopTimer();
}

function quickModelAnswer() {
    const q = filteredQuestions[currentIndex];
    document.getElementById('expContent').innerHTML = renderModelAnswer(q);
    document.getElementById('answerTabsSection').style.display = 'block';
    showTab('model');
}

function showTab(tab) {
    document.querySelectorAll('.sk-tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sk-tab-panel').forEach(p => p.classList.remove('active'));
    const tabEl = document.getElementById('tab-' + tab);
    const panelEl = document.getElementById('panel-' + tab);
    if (tabEl) tabEl.classList.add('active');
    if (panelEl) panelEl.classList.add('active');
}

function skipQuestion() {
    if (!isSubmitted) {
        stats.skipped++;
        stats.unattempted = Math.max(0, stats.unattempted - 1);
        updateNavDot(currentIndex, 'skipped');
        updateAnalytics();
    }
    nextQuestion();
}

function nextQuestion() {
    if (currentIndex < filteredQuestions.length - 1) {
        currentIndex++;
        loadQuestion(currentIndex);
    } else {
        showEndMessage();
    }
}

function updateNavDot(idx, state) {
    const dots = document.querySelectorAll('.q-nav-dot');
    if (dots[idx]) {
        dots[idx].classList.remove('current', 'attempted', 'skipped');
        dots[idx].classList.add(state);
    }
}

function toggleBookmark() {
    const q = filteredQuestions[currentIndex];
    if (bookmarks.includes(q.id)) {
        bookmarks = bookmarks.filter(id => id !== q.id);
    } else {
        bookmarks.push(q.id);
    }
    localStorage.setItem('mainsBookmarks', JSON.stringify(bookmarks));
    updateBookmarkBtn(q.id);
}

function startTimer() {
    stopTimer();
    timerSeconds = 0;
    timerRunning = true;
    timerInterval = setInterval(function () {
        timerSeconds++;
        const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const s = String(timerSeconds % 60).padStart(2, '0');
        document.getElementById('timerDisplay').textContent = m + ':' + s;
    }, 1000);
}

function stopTimer() { clearInterval(timerInterval); timerRunning = false; }

function toggleTimer() {
    const btn = document.getElementById('timerToggleBtn');
    if (timerRunning) {
        stopTimer();
        btn.innerHTML = '<i class="fas fa-play"></i> Resume';
    } else {
        startTimer();
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
}

function updateAnalytics() {
    document.getElementById('qSolved').textContent = stats.attempted;
    document.getElementById('qAttempted').textContent = stats.attempted;
    document.getElementById('qSkipped').textContent = stats.skipped;
    document.getElementById('qUnattempted').textContent = stats.unattempted;
    const t = stats.total || 1;
    document.getElementById('barAttempted').style.width = (stats.attempted / t * 100) + '%';
    document.getElementById('barSkipped').style.width = (stats.skipped / t * 100) + '%';
    document.getElementById('barUnattempted').style.width = (stats.unattempted / t * 100) + '%';
}

function endSession() {
    if (confirm('End session and return to filters?')) {
        stopTimer();
        document.getElementById('mainArea').style.display = 'none';
        document.getElementById('analyticsArea').style.display = 'none';
        document.getElementById('filterSidebar').style.display = 'block';
        document.getElementById('mainContainer').style.justifyContent = 'center';
    }
}

function showEndMessage() {
    stopTimer();
    document.getElementById('mainQuestionCard').innerHTML =
        '<div style="text-align:center;padding:60px 20px;">' +
        '<div style="font-size:4rem;margin-bottom:20px;">🎉</div>' +
        '<h2 style="font-size:2rem;font-weight:800;margin-bottom:10px;background:var(--primary-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Session Complete!</h2>' +
        '<p style="color:var(--text-muted);font-family:var(--font-ui);margin-bottom:30px;">You completed all ' + filteredQuestions.length + ' questions in this session.</p>' +
        '<div style="display:flex;gap:15px;justify-content:center;">' +
        '<button class="btn btn-primary" onclick="endSession()"><i class="fas fa-redo"></i> New Session</button>' +
        '<a href="mains.html" class="btn btn-outline" style="text-decoration:none;"><i class="fas fa-home"></i> Dashboard</a>' +
        '</div></div>';
}
