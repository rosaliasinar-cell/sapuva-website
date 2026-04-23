/* ========================================
   SAPUVA WEBSITE - GAME SCRIPT (EDUCANDY STYLE)
   Interactive Quiz Game dengan Scoring System
   ======================================== */

// ========== GAME DATA & CONFIGURATION ==========
const gameQuestions = [
    {
        id: 1,
        question: "Apa nama ilmiah ikan sapu-sapu?",
        type: "multiple", // multiple, true-false, matching
        options: [
            { text: "Hypostomus plecostomus", correct: true },
            { text: "Clarias batrachus", correct: false },
            { text: "Oreochromis niloticus", correct: false },
            { text: "Carassius auratus", correct: false }
        ],
        points: 10,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Hypostomus_plecostomus.jpg/640px-Hypostomus_plecostomus.jpg"
    },
    {
        id: 2,
        question: "Berapa panjang maksimal ikan sapu-sapu?",
        type: "multiple",
        options: [
            { text: "30 cm", correct: false },
            { text: "50 cm", correct: false },
            { text: "60 cm", correct: true },
            { text: "80 cm", correct: false }
        ],
        points: 10
    },
    {
        id: 3,
        question: "Ikan sapu-sapu masuk ke Indonesia melalui apa?",
        type: "multiple",
        options: [
            { text: "Sungai alami", correct: false },
            { text: "Perdagangan ikan hias", correct: true },
            { text: "Migrasi ikan", correct: false },
            { text: "Program peternakan", correct: false }
        ],
        points: 10
    },
    {
        id: 4,
        question: "Bentuk mulut ikan sapu-sapu adalah?",
        type: "multiple",
        options: [
            { text: "Mulut normal", correct: false },
            { text: "Cakram hisap (suckermouth)", correct: true },
            { text: "Mulut besar terbuka", correct: false },
            { text: "Mulut kecil runcing", correct: false }
        ],
        points: 10
    },
    {
        id: 5,
        question: "Berapa fekunditas (jumlah telur) ikan sapu-sapu per siklus?",
        type: "multiple",
        options: [
            { text: "100-500 telur", correct: false },
            { text: "1,000-3,000 telur", correct: true },
            { text: "5,000-10,000 telur", correct: false },
            { text: "10,000+ telur", correct: false }
        ],
        points: 10
    },
    {
        id: 6,
        question: "Siklus reproduksi ikan sapu-sapu berapa lama?",
        type: "multiple",
        options: [
            { text: "1-3 bulan", correct: false },
            { text: "6-12 bulan", correct: true },
            { text: "1-2 tahun", correct: false },
            { text: "2-3 tahun", correct: false }
        ],
        points: 10
    },
    {
        id: 7,
        question: "Apa dampak utama bioturbasi ikan sapu-sapu?",
        type: "multiple",
        options: [
            { text: "Meningkatkan oksigen", correct: false },
            { text: "Resuspensi sedimen & peningkatan kekeruhan", correct: true },
            { text: "Memperbaiki kualitas air", correct: false },
            { text: "Menambah nutrisi", correct: false }
        ],
        points: 15
    },
    {
        id: 8,
        question: "Berapa persen peningkatan kekeruhan (TSS) akibat sapu-sapu?",
        type: "multiple",
        options: [
            { text: "50-100%", correct: false },
            { text: "100-150%", correct: false },
            { text: "200-400%", correct: true },
            { text: "500%+", correct: false }
        ],
        points: 15
    },
    {
        id: 9,
        question: "Tingkat penurunan biodiversitas ikan akibat ikan sapu-sapu?",
        type: "multiple",
        options: [
            { text: "10-20%", correct: false },
            { text: "40-60%", correct: true },
            { text: "70-80%", correct: false },
            { text: "90%+", correct: false }
        ],
        points: 15
    },
    {
        id: 10,
        question: "Ikan sapu-sapu memiliki respirasi tambahan berupa?",
        type: "multiple",
        options: [
            { text: "Paru-paru", correct: false },
            { text: "Labirin insang", correct: true },
            { text: "Kulit pernapasan", correct: false },
            { text: "Kantong udara", correct: false }
        ],
        points: 10
    }
];

// ========== GAME STATE ==========
let gameState = {
    playerName: "",
    playerClass: "",
    playerLanguage: "id",
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    gameStarted: false,
    gameEnded: false,
    startTime: null,
    endTime: null,
    leaderboard: JSON.parse(localStorage.getItem('sapuvaLeaderboard')) || []
};

// ========== PLAYER VERIFICATION ==========
function verifyPlayer(event) {
    event.preventDefault();

    const playerName = document.getElementById('playerName').value.trim();
    const playerLanguage = document.getElementById('playerLanguage').value;
    const playerClass = document.getElementById('playerClass').value.trim();

    if (!playerName || !playerLanguage || !playerClass) {
        showNotification('⚠️ Mohon isi semua field!', 'error');
        return;
    }

    // Set game state
    gameState.playerName = playerName;
    gameState.playerLanguage = playerLanguage;
    gameState.playerClass = playerClass;
    gameState.gameStarted = true;
    gameState.startTime = new Date();

    // Hide form, show game
    document.getElementById('verification-form').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'block';

    // Display player info
    document.getElementById('displayName').textContent = playerName;
    document.getElementById('displayClass').textContent = playerClass;

    // Load first question
    loadQuestion(0);

    showNotification(`🎮 Selamat datang ${playerName}! Mari bermain!`, 'success');
}

// ========== LOAD QUESTION ==========
function loadQuestion(index) {
    if (index >= gameQuestions.length) {
        endGame();
        return;
    }

    const question = gameQuestions[index];
    gameState.currentQuestionIndex = index;

    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    // Card Header
    const card = document.createElement('div');
    card.className = 'quiz-card educandy-style';

    let cardHTML = `
        <div class="card-header">
            <div class="question-badge">Pertanyaan ${index + 1}</div>
            <div class="points-badge">${question.points} Poin</div>
        </div>

        <div class="card-body">
    `;

    // Add image if exists
    if (question.image) {
        cardHTML += `<img src="${question.image}" alt="Question image" class="question-image">`;
    }

    // Question text
    cardHTML += `
        <h3 class="question-text">${question.question}</h3>

        <div class="options-container">
    `;

    // Options (EDUCANDY Style - Colorful Cards)
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
    
    question.options.forEach((option, i) => {
        const isSelected = gameState.answers[index] === i;
        cardHTML += `
            <div class="option-card ${isSelected ? 'selected' : ''}" 
                 style="border-color: ${colors[i % colors.length]};"
                 onclick="selectAnswer(${index}, ${i})">
                <div class="option-letter" style="background-color: ${colors[i % colors.length]};">
                    ${String.fromCharCode(65 + i)}
                </div>
                <div class="option-text">${option.text}</div>
            </div>
        `;
    });

    cardHTML += `
        </div>
        </div>
    `;

    card.innerHTML = cardHTML;
    quizContainer.appendChild(card);

    // Update progress bar
    updateProgress(index + 1, gameQuestions.length);

    // Update button
    const submitBtn = document.getElementById('submitBtn');
    if (index === gameQuestions.length - 1) {
        submitBtn.textContent = '✅ Selesai Game';
    } else {
        submitBtn.textContent = 'Selanjutnya →';
    }
}

// ========== SELECT ANSWER ==========
function selectAnswer(questionIndex, optionIndex) {
    gameState.answers[questionIndex] = optionIndex;

    // Visual feedback
    const options = document.querySelectorAll('.option-card');
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === optionIndex) {
            opt.classList.add('selected');
        }
    });

    // Add animation
    options[optionIndex].style.transform = 'scale(1.05)';
    setTimeout(() => {
        options[optionIndex].style.transform = 'scale(1)';
    }, 200);

    showNotification('✓ Jawaban tercatat!', 'success');
}

// ========== NEXT QUESTION ==========
function nextQuestion() {
    if (gameState.answers[gameState.currentQuestionIndex] === undefined) {
        showNotification('⚠️ Pilih jawaban terlebih dahulu!', 'error');
        return;
    }

    if (gameState.currentQuestionIndex === gameQuestions.length - 1) {
        // Last question - submit
        submitAnswers();
    } else {
        loadQuestion(gameState.currentQuestionIndex + 1);
    }
}

// ========== PREVIOUS QUESTION ==========
function previousQuestion() {
    if (gameState.currentQuestionIndex > 0) {
        loadQuestion(gameState.currentQuestionIndex - 1);
    } else {
        showNotification('📌 Ini adalah pertanyaan pertama!', 'info');
    }
}

// ========== SUBMIT ANSWERS ==========
function submitAnswers() {
    let score = 0;

    // Calculate score
    gameQuestions.forEach((question, index) => {
        const selectedOptionIndex = gameState.answers[index];
        if (selectedOptionIndex !== undefined) {
            if (question.options[selectedOptionIndex].correct) {
                score += question.points;
            }
        }
    });

    gameState.score = score;
    gameState.endTime = new Date();

    // Save to leaderboard
    saveToLeaderboard();

    // Show results
    showResults();
}

// ========== CALCULATE SCORE ==========
function calculateScore(score, maxScore = 100) {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return { grade: 'A', emoji: '🌟' };
    if (percentage >= 80) return { grade: 'B', emoji: '⭐' };
    if (percentage >= 70) return { grade: 'C', emoji: '✅' };
    if (percentage >= 60) return { grade: 'D', emoji: '⚠️' };
    return { grade: 'F', emoji: '❌' };
}

// ========== SAVE TO LEADERBOARD ==========
function saveToLeaderboard() {
    const entry = {
        name: gameState.playerName,
        class: gameState.playerClass,
        score: gameState.score,
        date: new Date().toLocaleString('id-ID'),
        duration: Math.round((gameState.endTime - gameState.startTime) / 1000) + 's'
    };

    gameState.leaderboard.push(entry);
    gameState.leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 20
    if (gameState.leaderboard.length > 20) {
        gameState.leaderboard = gameState.leaderboard.slice(0, 20);
    }

    // Save to localStorage
    localStorage.setItem('sapuvaLeaderboard', JSON.stringify(gameState.leaderboard));
}

// ========== SHOW RESULTS ==========
function showResults() {
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('gameInterface').querySelector('.progress-section').style.display = 'none';
    document.getElementById('gameInterface').querySelector('.game-buttons').style.display = 'none';

    const resultsCard = document.getElementById('resultsCard');
    resultsCard.style.display = 'block';

    const gradeInfo = calculateScore(gameState.score);
    const accuracy = Math.round((gameState.score / 100) * 100);

    let resultsHTML = `
        <div class="results-content">
            <div class="results-header">
                <h2>${gradeInfo.emoji} Hasil Akhir ${gradeInfo.emoji}</h2>
                <p class="player-result">Pemain: <strong>${gameState.playerName}</strong> | Kelas: <strong>${gameState.playerClass}</strong></p>
            </div>

            <div class="score-card">
                <div class="score-number">${gameState.score}</div>
                <div class="score-max">/ 100</div>
                <div class="score-percentage">${accuracy}%</div>
                <div class="score-grade">Grade: <strong>${gradeInfo.grade}</strong></div>
            </div>

            <div class="results-stats">
                <div class="stat-item">
                    <span class="stat-label">⏱️ Waktu:</span>
                    <span class="stat-value">${Math.round((gameState.endTime - gameState.startTime) / 1000)}s</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">✅ Benar:</span>
                    <span class="stat-value">${gameState.answers.filter((_, i) => gameQuestions[i].options[_]?.correct).length} / ${gameQuestions.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">❌ Salah:</span>
                    <span class="stat-value">${gameQuestions.length - gameState.answers.filter((_, i) => gameQuestions[i].options[_]?.correct).length} / ${gameQuestions.length}</span>
                </div>
            </div>

            <div class="leaderboard-section">
                <h3>🏆 Top 10 Leaderboard</h3>
                <div class="leaderboard-table">
                    ${generateLeaderboardHTML()}
                </div>
            </div>

            <div class="results-footer">
                <button class="btn btn-primary" onclick="resetGame()" style="width:100%; margin-top:20px;">
                    🔄 Main Lagi
                </button>
                <button class="btn btn-secondary" onclick="downloadResults()" style="width:100%; margin-top:10px;">
                    📥 Download Hasil
                </button>
            </div>
        </div>
    `;

    resultsCard.innerHTML = resultsHTML;
}

// ========== GENERATE LEADERBOARD HTML ==========
function generateLeaderboardHTML() {
    const topScores = gameState.leaderboard.slice(0, 10);
    let html = '';

    topScores.forEach((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
        html += `
            <div class="leaderboard-row ${index === 0 ? 'winner' : ''}">
                <span class="rank">${medal}</span>
                <span class="name">${entry.name} <small>(${entry.class})</small></span>
                <span class="score">${entry.score}</span>
            </div>
        `;
    });

    return html || '<p style="text-align:center; padding:20px;">Belum ada data</p>';
}

// ========== RESET GAME ==========
function resetGame() {
    gameState = {
        playerName: "",
        playerClass: "",
        playerLanguage: "id",
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        gameStarted: false,
        gameEnded: false,
        startTime: null,
        endTime: null,
        leaderboard: JSON.parse(localStorage.getItem('sapuvaLeaderboard')) || []
    };

    document.getElementById('verification-form').style.display = 'block';
    document.getElementById('gameInterface').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsCard').style.display = 'none';
    document.getElementById('playerForm').reset();
    document.getElementById('currentScore').textContent = '0';

    // Show progress bar and buttons
    document.getElementById('gameInterface').querySelector('.progress-section').style.display = 'block';
    document.getElementById('gameInterface').querySelector('.game-buttons').style.display = 'flex';

    showNotification('🔄 Game direset! Siap untuk bermain lagi?', 'info');
}

// ========== UPDATE PROGRESS BAR ==========
function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('currentQuestion').textContent = current;
    document.getElementById('totalQuestions').textContent = total;
}

// ========== DOWNLOAD RESULTS ==========
function downloadResults() {
    const gradeInfo = calculateScore(gameState.score);
    const resultsText = `
HASIL GAME SAPUVA QUEST
========================
Pemain: ${gameState.playerName}
Kelas: ${gameState.playerClass}
Tanggal: ${new Date().toLocaleString('id-ID')}

SKOR: ${gameState.score} / 100
GRADE: ${gradeInfo.grade}
ACCURACY: ${Math.round((gameState.score / 100) * 100)}%

Waktu: ${Math.round((gameState.endTime - gameState.startTime) / 1000)} detik
Pertanyaan Benar: ${gameState.answers.filter((_, i) => gameQuestions[i].options[_]?.correct).length} / ${gameQuestions.length}

========================
🌊 SMA Negeri 3 Semarang - SAPUVA Project
    `;

    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAPUVA_Result_${gameState.playerName}_${new Date().getTime()}.txt`;
    a.click();

    showNotification('📥 Hasil berhasil diunduh!', 'success');
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const bgColor = type === 'success' ? '#32CD32' : type === 'error' ? '#FF6347' : '#1E90FF';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        background: ${bgColor};
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
        font-family: 'Segoe UI', Tahoma, sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== TAB SWITCHING (ANALYSIS) ==========
function switchTab(tabName) {
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) selectedTab.classList.add('active');
    
    event.target.classList.add('active');
}

// ========== LIGHT PENETRATION CHART (FIXED) ==========
document.addEventListener('DOMContentLoaded', () => {
    drawLightPenetrationChart();
    drawNutrientChart();
    drawPopulationChart();
});

function drawLightPenetrationChart() {
    const canvas = document.getElementById('lightChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = 300;
    
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Data
    const depths = [0, 2, 4, 6, 8];
    const normalLight = [100, 70, 30, 5, 0];
    const sapuSapuLight = [50, 15, 2, 0, 0];

    // Draw background
    ctx.fillStyle = '#E8F4F8';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#D0D0D0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * plotHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw Normal Light Line
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    normalLight.forEach((val, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        const y = (height - padding) - (val / 100) * plotHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Sapu-Sapu Light Line
    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.beginPath();
    sapuSapuLight.forEach((val, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        const y = (height - padding) - (val / 100) * plotHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#228B22';
    normalLight.forEach((val, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        const y = (height - padding) - (val / 100) * plotHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#FF6347';
    sapuSapuLight.forEach((val, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        const y = (height - padding) - (val / 100) * plotHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    depths.forEach((depth, i) => {
        const x = padding + (i / (depths.length - 1)) * plotWidth;
        ctx.fillText(depth + 'm', x, height - padding + 20);
    });

    // Legend
    ctx.fillStyle = '#228B22';
    ctx.fillRect(width - 200, 10, 15, 15);
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('Normal', width - 180, 22);

    ctx.fillStyle = '#FF6347';
    ctx.fillRect(width - 200, 35, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Dengan Sapu-Sapu', width - 180, 47);
}

function drawNutrientChart() {
    const canvas = document.getElementById('nutrientChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = 250;
    
    canvas.width = width;
    canvas.height = height;

    // Simple bar chart
    ctx.fillStyle = '#E8F4F8';
    ctx.fillRect(0, 0, width, height);

    const data = [
        { label: 'N (Normal)', value: 0.5, color: '#228B22' },
        { label: 'N (Sapu)', value: 2.5, color: '#FF6347' },
        { label: 'P (Normal)', value: 0.08, color: '#90EE90' },
        { label: 'P (Sapu)', value: 0.75, color: '#FFB6C1' }
    ];

    const maxValue = 3;
    const barWidth = width / data.length;
    const padding = 40;

    data.forEach((item, i) => {
        const barHeight = (item.value / maxValue) * (height - padding);
        const x = i * barWidth + barWidth / 4;
        const y = height - padding - barHeight;

        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth / 2, barHeight);

        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth / 4, height - 10);
    });
}

function drawPopulationChart() {
    const canvas = document.getElementById('populationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight || 300;
    
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const years = [0, 1, 2, 3, 4, 5];
    const populationData = [10, 25, 60, 150, 300, 600];
    const maxPopulation = Math.max(...populationData);

    // Draw axes
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw data line
    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.beginPath();

    populationData.forEach((value, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        const y = (height - padding) - (value / maxPopulation) * plotHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw points
    populationData.forEach((value, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        const y = (height - padding) - (value / maxPopulation) * plotHeight;

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    years.forEach((year, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        ctx.fillText(year, x, height - padding + 20);
    });
}

// ========== CONTACT FORM ==========
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('⚠️ Mohon isi semua field!', 'error');
            return;
        }

        showNotification(`✅ Terima kasih ${name}! Pesan Anda telah dikirim.`, 'success');
        
        console.log({
            name, email, subject, message,
            timestamp: new Date().toISOString()
        });

        this.reset();
    });
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
