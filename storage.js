// storage.js
// Handles all LocalStorage interactions for the Prelims Platform

const STORAGE_KEYS = {
    USER_STATS: 'prelims_user_stats',
    BOOKMARKS: 'prelims_bookmarks',
    ATTEMPTS: 'prelims_attempts',
    SESSION: 'prelims_active_session',
    TOPIC_STATS: 'prelims_topic_stats'
};

const StorageManager = {
    // --- User Stats (XP, Coins, Streak) ---
    getUserStats: function() {
        const defaultStats = { xp: 0, coins: 0, streak: 0, lastLogin: null };
        const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
        return data ? JSON.parse(data) : defaultStats;
    },
    
    saveUserStats: function(stats) {
        localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    },

    updateStreak: function() {
        const stats = this.getUserStats();
        const today = new Date().toDateString();
        
        if (stats.lastLogin !== today) {
            // Check if last login was exactly yesterday
            if (stats.lastLogin) {
                const last = new Date(stats.lastLogin);
                const current = new Date();
                const diffTime = Math.abs(current - last);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (diffDays === 1) {
                    stats.streak += 1;
                } else if (diffDays > 1) {
                    stats.streak = 1; // reset streak
                }
            } else {
                stats.streak = 1;
            }
            stats.lastLogin = today;
            this.saveUserStats(stats);
        }
        return stats.streak;
    },

    addReward: function(xp, coins) {
        const stats = this.getUserStats();
        stats.xp += xp;
        stats.coins += coins;
        this.saveUserStats(stats);
        return stats;
    },

    // --- Bookmarks ---
    getBookmarks: function() {
        const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
        return data ? JSON.parse(data) : [];
    },

    toggleBookmark: function(questionId) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.indexOf(questionId);
        if (index === -1) {
            bookmarks.push(questionId);
            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
            return true; // Bookmarked
        } else {
            bookmarks.splice(index, 1);
            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
            return false; // Removed
        }
    },
    
    isBookmarked: function(questionId) {
        return this.getBookmarks().includes(questionId);
    },

    // --- Session State (Continue Learning) ---
    saveSession: function(module, subject, topic, index, filters = {}) {
        const session = {
            module: module, // e.g., 'mcq-module.html'
            subject: subject,
            topic: topic,
            index: index,
            filters: filters,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    },

    getSession: function() {
        const data = localStorage.getItem(STORAGE_KEYS.SESSION);
        return data ? JSON.parse(data) : null;
    },

    clearSession: function() {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    },
    
    // --- Attempts Logging (For Analytics) ---
    logAttempt: function(questionId, isCorrect, subject, topic) {
        const attempts = this.getAttempts();
        attempts.push({
            questionId: questionId,
            isCorrect: isCorrect,
            subject: subject,
            topic: topic,
            timestamp: new Date().getTime()
        });
        localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
        
        // Also update topic stats directly for faster retrieval
        this.updateTopicStats(subject, topic, isCorrect);
    },

    getAttempts: function() {
        const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
        return data ? JSON.parse(data) : [];
    },

    // --- Topic Analytics ---
    updateTopicStats: function(subject, topic, isCorrect) {
        const stats = this.getTopicStats();
        if (!stats[subject]) stats[subject] = {};
        if (!stats[subject][topic]) stats[subject][topic] = { total: 0, correct: 0 };
        
        stats[subject][topic].total += 1;
        if (isCorrect) {
            stats[subject][topic].correct += 1;
        }
        
        localStorage.setItem(STORAGE_KEYS.TOPIC_STATS, JSON.stringify(stats));
    },

    getTopicStats: function() {
        const data = localStorage.getItem(STORAGE_KEYS.TOPIC_STATS);
        return data ? JSON.parse(data) : {};
    }
};

window.StorageManager = StorageManager;
