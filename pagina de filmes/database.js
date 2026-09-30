const DB = {
    // ==========================================
    // CHAVES DO LOCALSTORAGE
    // ==========================================
    KEYS: {
        USERS: 'nobremas_users',
        SESSION: 'nobremas_session',
        SEARCH_HISTORY: 'nobremas_search_history',
        WATCHLIST: 'nobremas_watchlist'
    },

    // ==========================================
    // USUÁRIOS
    // ==========================================
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.USERS)) || [];
        } catch {
            return [];
        }
    },

    saveUsers(users) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    register(username, email, password) {
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'Este nome de usuário já está em uso.' };
        }
        if (username.length < 3) {
            return { success: false, message: 'O nome de usuário deve ter pelo menos 3 caracteres.' };
        }
        if (password.length < 4) {
            return { success: false, message: 'A senha deve ter pelo menos 4 caracteres.' };
        }

        const user = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            username,
            email,
            password: btoa(password),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0072d2&color=fff&bold=true&size=128`,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        this.saveUsers(users);
        return { success: true, message: 'Conta criada com sucesso!' };
    },

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === btoa(password));
        if (!user) {
            return { success: false, message: 'E-mail ou senha incorretos.' };
        }
        const session = { userId: user.id, username: user.username, email: user.email, avatar: user.avatar, loginAt: Date.now() };
        localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
        return { success: true, user: session };
    },

    logout() {
        localStorage.removeItem(this.KEYS.SESSION);
    },

    getSession() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.SESSION));
        } catch {
            return null;
        }
    },

    isLoggedIn() {
        return this.getSession() !== null;
    },

    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // ==========================================
    // HISTÓRICO DE BUSCA
    // ==========================================
    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.SEARCH_HISTORY)) || [];
        } catch {
            return [];
        }
    },

    addSearch(query) {
        if (!query || query.trim().length === 0) return;
        const q = query.trim().toLowerCase();
        let history = this.getSearchHistory();
        history = history.filter(item => item.query.toLowerCase() !== q);
        history.unshift({ query: query.trim(), timestamp: Date.now() });
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem(this.KEYS.SEARCH_HISTORY, JSON.stringify(history));
    },

    removeSearch(query) {
        let history = this.getSearchHistory();
        history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
        localStorage.setItem(this.KEYS.SEARCH_HISTORY, JSON.stringify(history));
    },

    clearSearchHistory() {
        localStorage.removeItem(this.KEYS.SEARCH_HISTORY);
    },

    // ==========================================
    // BUSCA DE FILMES
    // ==========================================
    searchMovies(query) {
        if (!query || !moviesDatabase) return [];
        const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const results = [];

        Object.entries(moviesDatabase).forEach(([key, movie]) => {
            const searchText = [
                movie.title, movie.genre, movie.description, movie.director, movie.cast, movie.tagline
            ].filter(Boolean).join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            if (searchText.includes(q)) {
                results.push({ key, ...movie });
            }
        });

        return results;
    },

    // ==========================================
    // MINHA LISTA (WATCHLIST)
    // ==========================================
    getWatchlist() {
        const session = this.getSession();
        if (!session) return [];
        const key = `${this.KEYS.WATCHLIST}_${session.userId}`;
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    },

    addToWatchlist(movieKey) {
        const session = this.getSession();
        if (!session) return false;
        const key = `${this.KEYS.WATCHLIST}_${session.userId}`;
        const list = this.getWatchlist();
        if (!list.includes(movieKey)) {
            list.push(movieKey);
            localStorage.setItem(key, JSON.stringify(list));
        }
        return true;
    },

    removeFromWatchlist(movieKey) {
        const session = this.getSession();
        if (!session) return false;
        const key = `${this.KEYS.WATCHLIST}_${session.userId}`;
        let list = this.getWatchlist();
        list = list.filter(k => k !== movieKey);
        localStorage.setItem(key, JSON.stringify(list));
        return true;
    },

    isInWatchlist(movieKey) {
        return this.getWatchlist().includes(movieKey);
    }
};
