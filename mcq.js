const questions = [
    {
        question: "Which of the following schedules of the Constitution of India contains provisions regarding anti-defection?",
        options: ["Second Schedule", "Fifth Schedule", "Eighth Schedule", "Tenth Schedule"],
        answer: 3,
        explanation: "The Tenth Schedule was inserted in the Constitution by the 52nd Amendment Act, 1985. It deals with the disqualification of members of Parliament and State Legislatures on the ground of defection."
    },
    {
        question: "Who was the first Governor-General of independent India?",
        options: ["C. Rajagopalachari", "Lord Mountbatten", "Rajendra Prasad", "Sardar Vallabhbhai Patel"],
        answer: 1,
        explanation: "Lord Mountbatten was the first Governor-General of independent India (1947-1948). C. Rajagopalachari was the first and only Indian Governor-General."
    },
    {
        question: "The concept of 'Public Interest Litigation' (PIL) originated in which country?",
        options: ["United Kingdom", "Australia", "United States", "Canada"],
        answer: 2,
        explanation: "The concept of Public Interest Litigation (PIL) originated and developed in the USA in the 1960s to provide representation to unrepresented groups."
    },
    {
        question: "Which of the following is not a fundamental right in the Indian Constitution?",
        options: ["Right to Equality", "Right to Property", "Right to Freedom", "Right against Exploitation"],
        answer: 1,
        explanation: "The Right to Property was removed from the list of Fundamental Rights by the 44th Constitutional Amendment Act, 1978. It is now a legal right under Article 300A."
    },
    {
        question: "The 'Ring of Fire', known for frequent earthquakes and volcanic eruptions, surrounds which ocean?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: 3,
        explanation: "The Ring of Fire is a horseshoe-shaped belt in the Pacific Ocean basin characterized by active volcanoes and frequent earthquakes."
    },
    {
        question: "What is the primary function of the Finance Commission in India?",
        options: ["To prepare the Union Budget", "To allocate funds to states from tax revenues", "To regulate the stock market", "To audit government accounts"],
        answer: 1,
        explanation: "The primary function of the Finance Commission (Article 280) is to recommend the distribution of the net proceeds of taxes between the Union and the States."
    },
    {
        question: "The Harappan civilization was discovered in which year?",
        options: ["1921", "1922", "1935", "1942"],
        answer: 0,
        explanation: "The Harappan civilization was discovered in 1921 by Dayaram Sahni when he excavated the site of Harappa in the Punjab province (now in Pakistan)."
    },
    {
        question: "In economics, the 'Gini coefficient' is used to measure:",
        options: ["Inflation rate", "Economic growth", "Income inequality", "Unemployment rate"],
        answer: 2,
        explanation: "The Gini coefficient is a statistical measure of economic inequality in a population. A coefficient of 0 represents perfect equality, while 1 represents perfect inequality."
    },
    {
        question: "Which layer of the atmosphere contains the ozone layer?",
        options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
        answer: 1,
        explanation: "The ozone layer is mainly found in the lower portion of the stratosphere, from approximately 15 to 35 kilometers above Earth, protecting life from UV radiation."
    },
    {
        question: "Article 21 of the Indian Constitution ensures:",
        options: ["Right to Religion", "Right to Life and Personal Liberty", "Right to Constitutional Remedies", "Right to Education"],
        answer: 1,
        explanation: "Article 21 states that 'No person shall be deprived of his life or personal liberty except according to a procedure established by law.'"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let isAnswerSubmitted = false;

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();

    document.getElementById('submitBtn').addEventListener('click', submitAnswer);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
});

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    
    // Reset state
    selectedOptionIndex = null;
    isAnswerSubmitted = false;
    
    // Update UI text
    document.getElementById('progressText').innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('scoreText').innerText = `Score: ${score}`;
    document.getElementById('questionText').innerText = q.question;
    
    // Update Progress Bar
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;

    // Render Options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${letters[index]}</span> ${opt}`;
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });

    // Reset Buttons and Feedback
    document.getElementById('submitBtn').style.display = 'block';
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    
    const feedbackBox = document.getElementById('feedbackBox');
    feedbackBox.className = 'quiz-feedback'; // reset classes
}

function selectOption(index) {
    if (isAnswerSubmitted) return; // Prevent changing answer after submit
    
    selectedOptionIndex = index;
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    document.getElementById('submitBtn').disabled = false;
}

function submitAnswer() {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;
    isAnswerSubmitted = true;
    
    const q = questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === q.answer;
    
    const options = document.querySelectorAll('.option-btn');
    
    // Highlight correct and incorrect
    options[q.answer].classList.add('correct');
    if (!isCorrect) {
        options[selectedOptionIndex].classList.add('incorrect');
    } else {
        score++;
        document.getElementById('scoreText').innerText = `Score: ${score}`;
    }
    
    // Show Feedback
    const feedbackBox = document.getElementById('feedbackBox');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackText = document.getElementById('feedbackText');
    
    feedbackBox.classList.add('show');
    if (isCorrect) {
        feedbackBox.classList.add('feedback-correct');
        feedbackTitle.innerHTML = '<i class="fas fa-check-circle"></i> Correct!';
    } else {
        feedbackBox.classList.add('feedback-incorrect');
        feedbackTitle.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect';
    }
    feedbackText.innerText = q.explanation;
    
    // Update Controls
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('nextBtn').innerText = 'Finish Quiz';
    } else {
        document.getElementById('nextBtn').innerText = 'Next Question';
    }
    
    // Update progress fill fully for current question
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        // If going back, user can't re-answer in this simple implementation,
        // we'll just reload the question state fresh for simplicity.
        // A robust system would save their past answer.
        loadQuestion();
    }
}

function showResults() {
    document.getElementById('quizScreen').style.display = 'none';
    const resultsScreen = document.getElementById('resultsScreen');
    resultsScreen.classList.add('show');
    
    document.getElementById('finalScoreText').innerText = `${score}/${questions.length}`;
    
    const msg = document.getElementById('performanceMessage');
    if (score === questions.length) {
        msg.innerText = "Perfect! Excellent preparation.";
    } else if (score >= 7) {
        msg.innerText = "Great job! Keep practicing to reach perfection.";
    } else {
        msg.innerText = "Good effort. Review the explanations and try again!";
    }
}
