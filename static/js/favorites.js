/**
 * Favorites System - Без регистрации пользователей
 * Использует localStorage для хранения избранных товаров
 */

class FavoritesManager {
    constructor() {
        this.storageKey = 'guline_favorites';
        this.favorites = this.loadFavorites();
        this.init();
    }

    /**
     * Инициализация системы избранного
     */
    init() {
        this.updateAllFavoriteButtons();
        this.updateFavoritesCounter();
        this.bindEvents();
    }

    /**
     * Загрузка избранных товаров из localStorage
     */
    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Ошибка загрузки избранного:', error);
            return [];
        }
    }

    /**
     * Сохранение избранных товаров в localStorage
     */
    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Ошибка сохранения избранного:', error);
        }
    }

    /**
     * Добавление товара в избранное
     */
    addToFavorites(productId) {
        if (!this.favorites.includes(productId)) {
            this.favorites.push(productId);
            this.saveFavorites();
            this.updateFavoritesCounter();
            this.showNotification('Товар добавлен в избранное', 'success');
            return true;
        }
        return false;
    }

    /**
     * Удаление товара из избранного
     */
    removeFromFavorites(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.updateFavoritesCounter();
            this.showNotification('Товар удален из избранного', 'info');
            return true;
        }
        return false;
    }

    /**
     * Переключение статуса избранного
     */
    toggleFavorite(productId) {
        if (this.isFavorite(productId)) {
            return this.removeFromFavorites(productId);
        } else {
            return this.addToFavorites(productId);
        }
    }

    /**
     * Проверка, находится ли товар в избранном
     */
    isFavorite(productId) {
        return this.favorites.includes(productId);
    }

    /**
     * Получение списка всех избранных товаров
     */
    getFavorites() {
        return [...this.favorites];
    }

    /**
     * Получение количества избранных товаров
     */
    getFavoritesCount() {
        return this.favorites.length;
    }

    /**
     * Очистка всех избранных товаров
     */
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
        this.updateFavoritesCounter();
        this.updateAllFavoriteButtons();
        this.showNotification('Список избранного очищен', 'info');
    }

    /**
     * Обновление всех кнопок избранного на странице
     */
    updateAllFavoriteButtons() {
        const buttons = document.querySelectorAll('.favorite-btn');
        buttons.forEach(button => {
            const productId = this.getProductIdFromButton(button);
            if (productId) {
                this.updateFavoriteButton(button, productId);
            }
        });
    }

    /**
     * Обновление конкретной кнопки избранного
     */
    updateFavoriteButton(button, productId) {
        const isFavorite = this.isFavorite(productId);
        const icon = button.querySelector('i');
        const textSpan = button.querySelector('.favorite-text');
        
        if (isFavorite) {
            button.classList.add('active');
            button.setAttribute('title', 'Удалить из избранного');
            if (icon) {
                icon.className = 'fas fa-heart';
            }
            if (textSpan) {
                textSpan.textContent = 'В избранном';
            }
        } else {
            button.classList.remove('active');
            button.setAttribute('title', 'Добавить в избранное');
            if (icon) {
                icon.className = 'far fa-heart';
            }
            if (textSpan) {
                textSpan.textContent = 'Добавить в избранное';
            }
        }
    }

    /**
     * Получение ID товара из кнопки
     */
    getProductIdFromButton(button) {
        // Пробуем разные способы получения ID
        const productId = button.getAttribute('data-product-id');
        if (productId) {
            return parseInt(productId);
        }
        
        const href = button.getAttribute('hx-post');
        if (href) {
            const match = href.match(/(\d+)/);
            return match ? parseInt(match[1]) : null;
        }
        return null;
    }

    /**
     * Обновление счетчика избранного
     */
    updateFavoritesCounter() {
        const counters = document.querySelectorAll('.favorites-counter');
        const count = this.getFavoritesCount();
        
        counters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'inline' : 'none';
        });

        // Обновляем ссылку на страницу избранного
        const favoritesLink = document.querySelector('.favorites-link');
        if (favoritesLink) {
            if (count > 0) {
                favoritesLink.style.display = 'block';
            } else {
                favoritesLink.style.display = 'none';
            }
        }
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Обработка кликов по кнопкам избранного
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target.closest('.favorite-btn');
                const productId = this.getProductIdFromButton(button);
                
                if (productId) {
                    this.toggleFavorite(productId);
                    this.updateFavoriteButton(button, productId);
                }
            }
        });

        // Обработка HTMX событий
        document.addEventListener('htmx:afterSwap', (e) => {
            if (e.target.id === 'product-grid' || e.target.classList.contains('product-card')) {
                this.updateAllFavoriteButtons();
            }
        });

        // Обработка изменения localStorage в других вкладках
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.favorites = this.loadFavorites();
                this.updateAllFavoriteButtons();
                this.updateFavoritesCounter();
            }
        });
    }

    /**
     * Показ уведомлений
     */
    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Добавляем стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Получение данных избранных товаров с сервера
     */
    async getFavoritesData() {
        if (this.favorites.length === 0) {
            return [];
        }

        try {
            const response = await fetch('/api/favorites/data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({
                    product_ids: this.favorites
                })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Ошибка получения данных избранного:', error);
        }

        return [];
    }

    /**
     * Получение CSRF токена
     */
    getCSRFToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    }
}

// Инициализация системы избранного
document.addEventListener('DOMContentLoaded', function() {
    window.favoritesManager = new FavoritesManager();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FavoritesManager;
}
