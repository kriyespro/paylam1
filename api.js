/**
 * THE BASICS - Premium Prelims Module
 * Mock Database & REST API Service
 * This file simulates a real backend (PostgreSQL/MongoDB) and REST APIs using localStorage.
 */


const pyqBank = [
    { id: "PYQ_2022_POL_04", year: "UPSC 2022", subject: "Indian Polity", topic: "Fundamental Rights", difficulty: "Hard", estTime: "1m 30s", question: "With reference to the writs issued by the Courts in India, consider the following statements:<br><br>1. Mandamus will not lie against a private organisation unless it is entrusted with a public duty.<br>2. Mandamus will not lie against a Company even though it may be a Government Company.<br>3. Any public minded person can be a petitioner to move the Court to obtain the writ of Quo Warranto.<br><br>Which of the statements given above are correct?", options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"], correctIndex: 2, explanation: "<strong>Statement 1 is correct:</strong> Mandamus is a command issued by the court to a public official asking him to perform his official duties. It cannot be issued against a private individual or body unless it is entrusted with a public duty.<br><br><strong>Statement 2 is incorrect:</strong> Mandamus CAN be issued against a corporation, including a government company, if it fails to perform a statutory duty.<br><br><strong>Statement 3 is correct:</strong> Unlike other writs, Quo Warranto can be sought by any interested person, not necessarily by the aggrieved person." },
    { id: "PYQ_2021_HIS_01", year: "UPSC 2021", subject: "Ancient History", topic: "Indus Valley", difficulty: "Medium", estTime: "1m 00s", question: "Which one of the following ancient towns is well-known for its elaborate system of water harvesting and management by building a series of dams and channelizing water into connected reservoirs?", options: ["Dholavira", "Kalibangan", "Rakhigarhi", "Ropar"], correctIndex: 0, explanation: "Dholavira is renowned for its sophisticated water management system, comprising a series of reservoirs, check dams, and channels to harvest and store water." },
    { id: "PYQ_2020_GEO_15", year: "UPSC 2020", subject: "Geography", topic: "Indian Rivers", difficulty: "Easy", estTime: "45s", question: "With reference to river Teesta, consider the following statements:<br><br>1. The source of river Teesta is the same as that of Brahmaputra but it flows through Sikkim.<br>2. River Rangeet originates in Sikkim and it is a tributary of river Teesta.<br>3. River Teesta flows into Bay of Bengal on the border of India and Bangladesh.<br><br>Which of the statements given above is/are correct?", options: ["1 and 3 only", "2 only", "2 and 3 only", "1, 2 and 3"], correctIndex: 1, explanation: "<strong>Statement 1 is incorrect:</strong> Teesta originates from Pahunri glacier in Sikkim, while Brahmaputra originates from Chemayungdung glacier in Tibet.<br><strong>Statement 2 is correct:</strong> Rangeet is a major tributary of Teesta, originating in Sikkim.<br><strong>Statement 3 is incorrect:</strong> Teesta joins the Brahmaputra (Jamuna) in Bangladesh, rather than flowing directly into the Bay of Bengal." },
    { id: "PYQ_2019_ECO_09", year: "UPSC 2019", subject: "Economy", topic: "Banking & RBI", difficulty: "Medium", estTime: "1m 15s", question: "The economic cost of food grains to the Food Corporation of India is Minimum Support Price and bonus (if any) paid to the farmers plus:", options: ["transportation cost only", "interest cost only", "procurement incidentals and distribution cost", "procurement incidentals and charges for godowns"], correctIndex: 2, explanation: "The economic cost of food grains to the Food Corporation of India comprises Minimum Support Price (and bonus, if any), procurement incidentals, and the cost of distribution." },
    { id: "PYQ_2018_ENV_12", year: "UPSC 2018", subject: "Environment & Ecology", topic: "Biodiversity", difficulty: "Hard", estTime: "1m 30s", question: "In which of the following regions of India are you most likely to come across the 'Great Indian Hornbill' in its natural habitat?", options: ["Sand deserts of northwest India", "Higher Himalayas of Jammu and Kashmir", "Salt marshes of western Gujarat", "Western Ghats"], correctIndex: 3, explanation: "The Great Indian Hornbill is found in the evergreen and moist deciduous forests of the Western Ghats and the forests of North East India." }
];

const mcqBank = [
    { id: "MCQ_001_POL_04", year: "Mock Test", subject: "Indian Polity", topic: "Fundamental Rights", difficulty: "Hard", estTime: "1m 30s", question: "Which article of the Indian Constitution ensures the abolition of untouchability?", options: ["Article 15", "Article 16", "Article 17", "Article 18"], correctIndex: 2, explanation: "Article 17 of the Indian Constitution abolishes untouchability and forbids its practice in any form." },
    { id: "MCQ_002_HIS_01", year: "Mock Test", subject: "Modern History", topic: "Revolt of 1857", difficulty: "Medium", estTime: "1m 00s", question: "Who among the following was the leader of the 1857 revolt in Lucknow?", options: ["Kunwar Singh", "Begum Hazrat Mahal", "Nana Sahib", "Rani Lakshmibai"], correctIndex: 1, explanation: "Begum Hazrat Mahal led the revolt in Lucknow on behalf of her minor son Birjis Qadir." },
    { id: "MCQ_003_GEO_15", year: "Mock Test", subject: "Geography", topic: "Physical Geography", difficulty: "Easy", estTime: "45s", question: "Which of the following is the highest peak in the Western Ghats?", options: ["Doda Betta", "Anamudi", "Mahendragiri", "Kalsubai"], correctIndex: 1, explanation: "Anamudi, located in Kerala, is the highest peak in the Western Ghats and South India, standing at an elevation of 2,695 meters." }
];

const MockDB = {
    init() {
        if (!localStorage.getItem('tb_users')) {
            this.seedData();
        }
    },

    seedData() {
        // Users & Roles
        const users = [
            { id: 1, name: 'Aspirant', role: 'student', xp: 4500, coins: 1200, streak: 12, longestStreak: 45, joined: '2023-01-15' },
            { id: 2, name: 'Admin', role: 'admin', xp: 0, coins: 0, streak: 0, longestStreak: 0, joined: '2022-01-01' }
        ];

        // Analytics & Progress
        const progress = {
            userId: 1,
            pyqCompleted: 1450,
            mcqCompleted: 2300,
            accuracy: 76,
            studyHours: 420,
            weakTopics: ['Environment', 'Art & Culture'],
            strongTopics: ['Polity', 'Modern History'],
            pendingRevision: 12,
            revisionStats: {
                strong: 4,
                average: 6,
                weak: 7,
                lowPractice: 128
            }
        };

        // Important Topics
        const topics = [
            { id: 101, subject: 'Polity', name: 'Fundamental Rights', pyqs: 45, mcqs: 120, completion: 80 },
            { id: 102, subject: 'History', name: 'Buddhism & Jainism', pyqs: 32, mcqs: 90, completion: 45 },
            { id: 103, subject: 'Economy', name: 'Monetary Policy', pyqs: 28, mcqs: 150, completion: 20 },
            { id: 104, subject: 'Environment', name: 'National Parks', pyqs: 50, mcqs: 200, completion: 10 }
        ];

        // Daily Question
        const dailyQuestion = {
            id: 'dq_001',
            date: new Date().toISOString().split('T')[0],
            text: 'Consider the following statements regarding the Monetary Policy Committee (MPC):\n1. It decides the RBIs benchmark interest rates.\n2. It is a 12-member body including the Governor of RBI.\n3. It functions under the chairmanship of the Union Finance Minister.\nWhich of the statements given above is/are correct?',
            options: ['1 only', '1 and 2 only', '3 only', '1, 2 and 3'],
            correctOption: 0, // '1 only'
            difficulty: 'Hard',
            xp: 50,
            coins: 20,
            attempts: 12450,
            explanation: 'Statement 1 is correct. Statement 2 is incorrect (It is a 6-member body). Statement 3 is incorrect (Governor of RBI is the ex-officio Chairman).'
        };

        localStorage.setItem('tb_users', JSON.stringify(users));
        localStorage.setItem('tb_progress', JSON.stringify(progress));
        localStorage.setItem('tb_topics', JSON.stringify(topics));
        localStorage.setItem('tb_daily_q', JSON.stringify(dailyQuestion));
        localStorage.setItem('tb_currentUser', JSON.stringify(users[0]));
    },

    // REST API Endpoints (Simulated)
    api: {
        
        getPYQs: () => pyqBank,
        getMCQs: () => mcqBank,
        getUser: () => JSON.parse(localStorage.getItem('tb_currentUser')),
        
        getProgress: () => JSON.parse(localStorage.getItem('tb_progress')),
        
        getImportantTopics: () => JSON.parse(localStorage.getItem('tb_topics')),
        
        getDailyQuestion: () => JSON.parse(localStorage.getItem('tb_daily_q')),
        
        submitAnswer: (questionId, selectedIndex) => {
            const q = JSON.parse(localStorage.getItem('tb_daily_q'));
            const user = JSON.parse(localStorage.getItem('tb_currentUser'));
            const isCorrect = selectedIndex === q.correctOption;
            
            const progress = JSON.parse(localStorage.getItem('tb_progress'));
            
            if (isCorrect) {
                user.xp += q.xp;
                user.coins += q.coins;
                // Dynamically improve stats if correct
                progress.revisionStats.strong++;
                if (progress.revisionStats.weak > 0) progress.revisionStats.weak--;
            } else {
                // Dynamically worsen stats if incorrect
                progress.revisionStats.weak++;
                if (progress.revisionStats.average > 0) progress.revisionStats.average--;
            }
            
            localStorage.setItem('tb_currentUser', JSON.stringify(user));
            localStorage.setItem('tb_progress', JSON.stringify(progress));
            
            return {
                success: true,
                isCorrect,
                correctOption: q.correctOption,
                explanation: q.explanation,
                newXp: user.xp,
                newCoins: user.coins
            };
        }
    }
};

// Initialize DB on script load
MockDB.init();
window.API = MockDB.api;
