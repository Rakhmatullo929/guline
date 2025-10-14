/**
 * Notification System for Django Messages
 * Handles display of success, error, warning, and info messages
 */

class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.notifications = [];
        this.init();
    }

    init() {
        // Process Django messages on page load
        this.processDjangoMessages();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    processDjangoMessages() {
        // Get Django messages from the page
        const messages = document.querySelectorAll('.messages li');
        
        messages.forEach(message => {
            const level = this.getMessageLevel(message);
            const text = message.textContent.trim();
            
            if (text) {
                this.show(level, text);
            }
        });
    }

    getMessageLevel(messageElement) {
        const classes = messageElement.className;
        
        if (classes.includes('success')) return 'success';
        if (classes.includes('error')) return 'error';
        if (classes.includes('warning')) return 'warning';
        if (classes.includes('info')) return 'info';
        
        return 'info'; // default
    }

    setupEventListeners() {
        // Listen for custom notification events
        document.addEventListener('showNotification', (event) => {
            const { level, message, title } = event.detail;
            this.show(level, message, title);
        });
    }

    show(level = 'info', message = '', title = '') {
        const notification = this.createNotification(level, message, title);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show', 'slide-in');
        }, 10);

        // Auto remove after 4 seconds
        setTimeout(() => {
            this.remove(notification);
        }, 4000);

        return notification;
    }

    createNotification(level, message, title = '') {
        const notification = document.createElement('div');
        notification.className = `notification ${level}`;
        
        // Set default titles based on level
        if (!title) {
            switch (level) {
                case 'success':
                    title = 'Успешно!';
                    break;
                case 'error':
                    title = 'Ошибка';
                    break;
                case 'warning':
                    title = 'Внимание';
                    break;
                case 'info':
                default:
                    title = 'Информация';
                    break;
            }
        }

        // Set icons based on level
        let icon = 'ℹ️';
        switch (level) {
            case 'success':
                icon = '✅';
                break;
            case 'error':
                icon = '❌';
                break;
            case 'warning':
                icon = '⚠️';
                break;
            case 'info':
            default:
                icon = 'ℹ️';
                break;
        }

        notification.innerHTML = `
            <div class="notification-header">
                <h4 class="notification-title">
                    <span class="notification-icon">${icon}</span>
                    ${title}
                </h4>
                <button class="notification-close" onclick="notificationSystem.remove(this.parentElement.parentElement)">
                    ×
                </button>
            </div>
            <p class="notification-message">${message}</p>
            <div class="notification-progress"></div>
        `;

        return notification;
    }

    remove(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.add('slide-out');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from notifications array
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }

    // Static method to show notifications from anywhere
    static show(level, message, title) {
        if (window.notificationSystem) {
            return window.notificationSystem.show(level, message, title);
        }
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
});

// Export for use in other scripts
window.NotificationSystem = NotificationSystem;
