// auth.js
// Client-side demo auth for THE BASICS. No backend — accounts live in localStorage
// under the tb_* keys, same ones index.html's Google sign-in flow already writes to.

const AUTH_KEYS = {
    USERS: 'tb_users',
    SESSION: 'tb_session',
    CURRENT_USER: 'tb_current_user'
};

function tbGetUsers() {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.USERS) || '[]');
}

function tbSaveUsers(users) {
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
}

function tbMakeToken() {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function tbDefaultStats() {
    return {
        xp: 0, coins: 0, streak: 1, lastLogin: new Date().toDateString(),
        subjectsCompleted: 0, questionsAttempted: 0, avgScore: 0, learningTimeMinutes: 0
    };
}

function tbDefaultTargets() {
    return {
        overallProgress: 0, subjectsCompleted: 12, questionsAttempted: 500,
        avgScore: 70, streak: 30, learningTime: 4
    };
}

const Auth = {
    isLoggedIn: function() {
        return !!(localStorage.getItem(AUTH_KEYS.SESSION) && localStorage.getItem(AUTH_KEYS.CURRENT_USER));
    },

    getCurrentUser: function() {
        const data = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    },

    signup: function({ fullName, email, password, targetExam }) {
        fullName = (fullName || '').trim();
        email = (email || '').trim().toLowerCase();
        if (!fullName) return { success: false, message: 'Please enter your full name.' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, message: 'Please enter a valid email address.' };
        if (!password || password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };

        const users = tbGetUsers();
        if (users.some(u => u.email.toLowerCase() === email)) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = {
            id: tbMakeToken(),
            fullName,
            displayName: fullName,
            email,
            password,
            targetExam: targetExam || 'UPSC',
            isGoogleUser: false,
            avatar: '📚',
            profileComplete: false,
            createdAt: new Date().toISOString(),
            stats: tbDefaultStats(),
            targets: tbDefaultTargets()
        };
        users.push(newUser);
        tbSaveUsers(users);
        localStorage.setItem(AUTH_KEYS.SESSION, tbMakeToken());
        localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(newUser));
        return { success: true, message: 'Account created!', user: newUser };
    },

    login: function({ email, password }) {
        email = (email || '').trim().toLowerCase();
        const users = tbGetUsers();
        const user = users.find(u => u.email.toLowerCase() === email);
        if (!user) return { success: false, message: 'No account found with this email.' };
        if (user.isGoogleUser && !user.password) {
            return { success: false, message: 'This account uses Google Sign-In. Please continue with Google.' };
        }
        if (user.password !== password) return { success: false, message: 'Incorrect password.' };

        user.stats = user.stats || tbDefaultStats();
        const today = new Date().toDateString();
        if (user.stats.lastLogin !== today) {
            user.stats.streak = (user.stats.lastLogin === new Date(Date.now() - 86400000).toDateString())
                ? user.stats.streak + 1 : 1;
            user.stats.lastLogin = today;
            tbSaveUsers(users.map(u => u.id === user.id ? user : u));
        }

        localStorage.setItem(AUTH_KEYS.SESSION, tbMakeToken());
        localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));
        return { success: true, message: 'Welcome back!', user };
    },

    logout: function() {
        localStorage.removeItem(AUTH_KEYS.SESSION);
        localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    },

    requestReset: function(email) {
        email = (email || '').trim().toLowerCase();
        const users = tbGetUsers();
        if (!users.some(u => u.email.toLowerCase() === email)) {
            return { success: false, message: 'No account found with this email.' };
        }
        return { success: true, message: 'Reset instructions sent (demo — just set a new password below).' };
    },

    resetPassword: function(email, newPassword) {
        email = (email || '').trim().toLowerCase();
        if (!newPassword || newPassword.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };

        const users = tbGetUsers();
        const user = users.find(u => u.email.toLowerCase() === email);
        if (!user) return { success: false, message: 'No account found with this email.' };

        user.password = newPassword;
        tbSaveUsers(users.map(u => u.id === user.id ? user : u));

        const current = Auth.getCurrentUser();
        if (current && current.id === user.id) {
            localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));
        }
        return { success: true, message: 'Password reset successfully.' };
    },

    updateCurrentUser: function(updates) {
        const current = Auth.getCurrentUser();
        if (!current) return { success: false, message: 'Not logged in.' };

        const updated = Object.assign({}, current, updates);
        localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updated));

        const users = tbGetUsers();
        tbSaveUsers(users.map(u => u.id === updated.id ? updated : u));
        return { success: true, user: updated };
    }
};

window.Auth = Auth;
