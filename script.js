class UserManager {
    constructor() {
        this.apiUrl = 'https://jsonplaceholder.typicode.com/users';
        this.storageKey = 'ins-api-users';
        this.container = document.querySelector('.ins-api-users');
        this.users = [];
        
        this.init();
    }

    async init() {
        this.addStyles();
        this.createUI();
        await this.loadUsers();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                min-height: 100vh;
                padding: 20px;
            }

            .ins-api-users {
                max-width: 1000px;
                margin: 0 auto;
            }

            .header {
                text-align: center;
                margin-bottom: 25px;
                background: white;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }

            .header h1 {
                font-size: 24px;
                margin-bottom: 8px;
                color: #333;
            }

            .header p {
                font-size: 14px;
                color: #666;
            }

            .loading {
                text-align: center;
                color: #666;
                font-size: 16px;
                margin: 40px 0;
                padding: 20px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
            }

            .error {
                background: #f8d7da;
                color: #721c24;
                padding: 12px 16px;
                border: 1px solid #f5c6cb;
                border-radius: 4px;
                margin: 15px 0;
            }

            .success {
                background: #d4edda;
                color: #155724;
                padding: 12px 16px;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
                margin: 15px 0;
            }

            .controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                gap: 10px;
                background: white;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }

            .btn {
                background: #007bff;
                color: white;
                border: 1px solid #007bff;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }

            .btn:hover {
                background: #0056b3;
                border-color: #0056b3;
            }

            .btn-danger {
                background: #dc3545;
                border-color: #dc3545;
            }

            .btn-danger:hover {
                background: #c82333;
                border-color: #bd2130;
            }

            .search-box {
                flex: 1;
                max-width: 300px;
            }

            .search-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
            }

            .search-input:focus {
                outline: none;
                border-color: #007bff;
            }

            .users-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 15px;
            }

            .user-card {
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 20px;
            }

            .user-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }

            .user-name {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }

            .user-username {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .user-info {
                margin-top: 10px;
            }

            .info-item {
                margin-bottom: 8px;
                font-size: 14px;
                color: #555;
            }

            .info-label {
                font-weight: bold;
                display: inline-block;
                width: 60px;
                color: #333;
            }

            .delete-btn {
                background: #dc3545;
                color: white;
                border: 1px solid #dc3545;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }

            .delete-btn:hover {
                background: #c82333;
                border-color: #bd2130;
            }

            .stats {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 20px;
            }

            .stat-item {
                background: white;
                padding: 15px 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                text-align: center;
                min-width: 100px;
            }

            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
                display: block;
            }

            .stat-label {
                color: #666;
                font-size: 12px;
                margin-top: 5px;
            }

            .no-users {
                text-align: center;
                color: #666;
                font-size: 16px;
                margin: 40px 0;
                padding: 20px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
            }

            @media (max-width: 768px) {
                .users-grid {
                    grid-template-columns: 1fr;
                }
                
                .controls {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .search-box {
                    max-width: none;
                    margin-bottom: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createUI() {
        this.container.innerHTML = `
            <div class="header">
                <h1>Kullanıcı Listesi</h1>
                <p>Tüm kullanıcıları görüntüleyin ve yönetin</p>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-number" id="total-users">0</span>
                    <div class="stat-label">Toplam</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="displayed-users">0</span>
                    <div class="stat-label">Gösterilen</div>
                </div>
            </div>

            <div class="controls">
                <div class="search-box">
                    <input type="text" class="search-input" placeholder="Kullanıcı ara..." id="search-input">
                </div>
                <button class="btn" id="refresh-btn">Yenile</button>
                <button class="btn btn-danger" id="clear-storage-btn">Temizle</button>
            </div>

            <div id="message-area"></div>
            <div id="users-container">
                <div class="loading">Yükleniyor...</div>
            </div>
        `;

        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshUsers());
        document.getElementById('clear-storage-btn').addEventListener('click', () => this.clearStorage());
        document.getElementById('search-input').addEventListener('input', (e) => this.filterUsers(e.target.value));
    }

    async loadUsers() {
        try {
            const cachedData = this.getFromCache();
            if (cachedData) {
                this.users = cachedData;
                this.showMessage('Veriler önbellekten yüklendi', 'success');
                this.renderUsers();
            } else {
                await this.fetchUsersFromAPI();
            }
        } catch (error) {
            this.showMessage('Hata: ' + error.message, 'error');
            document.getElementById('users-container').innerHTML = '<div class="no-users">Veriler yüklenemedi</div>';
        }
    }

    async fetchUsersFromAPI() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const users = await response.json();
            if (!Array.isArray(users) || users.length === 0) throw new Error('Geçerli veri alınamadı');
            
            this.users = users;
            this.saveToCache(users);
            this.showMessage('Kullanıcılar başarıyla yüklendi', 'success');
            this.renderUsers();
        } catch (error) {
            this.showMessage('API hatası: ' + error.message, 'error');
            throw error;
        }
    }

    getFromCache() {
        try {
            const cached = JSON.parse(localStorage.getItem(this.storageKey));
            if (cached && cached.timestamp && cached.data) {
                const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
                if (cached.timestamp > oneDayAgo) return cached.data;
                localStorage.removeItem(this.storageKey);
            }
        } catch (error) {
            localStorage.removeItem(this.storageKey);
        }
        return null;
    }

    saveToCache(data) {
        try {
            const cacheData = { timestamp: Date.now(), data: data };
            localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
        } catch (error) {
            this.showMessage('Veriler önbelleğe kaydedilemedi', 'error');
        }
    }

    renderUsers(usersToShow = this.users) {
        const container = document.getElementById('users-container');
        
        if (usersToShow.length === 0) {
            container.innerHTML = '<div class="no-users">Kullanıcı bulunamadı</div>';
            this.updateStats(0);
            return;
        }

        const usersHTML = usersToShow.map(user => this.createUserCard(user)).join('');
        container.innerHTML = `<div class="users-grid">${usersHTML}</div>`;
        
        this.updateStats(usersToShow.length);
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.getAttribute('data-user-id'));
                this.deleteUser(userId);
            });
        });
    }

    createUserCard(user) {
        return `
            <div class="user-card">
                <div class="user-header">
                    <div>
                        <div class="user-name">${user.name}</div>
                        <div class="user-username">${user.username}</div>
                    </div>
                    <button class="delete-btn" data-user-id="${user.id}">Sil</button>
                </div>
                
                <div class="user-info">
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span>${user.email}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tel:</span>
                        <span>${user.phone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Web:</span>
                        <span>${user.website}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Şirket:</span>
                        <span>${user.company.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Adres:</span>
                        <span>${user.address.city}, ${user.address.street}</span>
                    </div>
                </div>
            </div>
        `;
    }

    deleteUser(userId) {
        if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            this.users = this.users.filter(user => user.id !== userId);
            this.saveToCache(this.users);
            this.renderUsers();
            this.showMessage('Kullanıcı silindi', 'success');
        }
    }

    filterUsers(searchTerm) {
        if (!searchTerm.trim()) {
            this.renderUsers();
            return;
        }

        const filtered = this.users.filter(user => {
            const search = searchTerm.toLowerCase();
            return user.name.toLowerCase().includes(search) ||
                   user.email.toLowerCase().includes(search) ||
                   user.username.toLowerCase().includes(search) ||
                   user.address.city.toLowerCase().includes(search) ||
                   user.company.name.toLowerCase().includes(search);
        });

        this.renderUsers(filtered);
    }

    updateStats(displayedCount) {
        document.getElementById('total-users').textContent = this.users.length;
        document.getElementById('displayed-users').textContent = displayedCount;
    }

    async refreshUsers() {
        document.getElementById('users-container').innerHTML = '<div class="loading">Yenileniyor...</div>';
        document.getElementById('search-input').value = '';
        
        try {
            await this.fetchUsersFromAPI();
        } catch (error) {
            if (this.users.length > 0) {
                this.renderUsers();
                this.showMessage('Veriler yenilenemedi, mevcut veriler gösteriliyor', 'error');
            }
        }
    }

    clearStorage() {
        if (confirm('Önbellek temizlenecek. Devam etmek istiyor musunuz?')) {
            localStorage.removeItem(this.storageKey);
            this.showMessage('Önbellek temizlendi', 'success');
        }
    }

    showMessage(message, type = 'info') {
        const messageArea = document.getElementById('message-area');
        const messageDiv = document.createElement('div');
        messageDiv.className = type;
        messageDiv.textContent = message;
        messageArea.appendChild(messageDiv);
        
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => new UserManager());