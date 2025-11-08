// HTMX Configuration and Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // HTMX Configuration
    htmx.config.globalViewTransitions = true;
    htmx.config.useTemplateFragments = true;
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        // Show/hide search results dropdown
        searchInput.addEventListener('focus', function() {
            if (searchResults.innerHTML.trim()) {
                searchResults.classList.add('show');
            }
        });
        
        searchInput.addEventListener('blur', function() {
            // Delay hiding to allow clicking on results
            setTimeout(() => {
                searchResults.classList.remove('show');
            }, 200);
        });
        
        // Handle search results clicks
        searchResults.addEventListener('click', function(e) {
            if (e.target.closest('.search-result-item')) {
                searchResults.classList.remove('show');
            }
        });
    }
    
    // Quick view modal functionality
    const quickViewModal = document.getElementById('quick-view-modal');
    
    if (quickViewModal) {
        // Close modal when clicking outside
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.style.display = 'none';
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && quickViewModal.style.display === 'flex') {
                quickViewModal.style.display = 'none';
            }
        });
    }
    
    // Cart message auto-hide
    const cartMessage = document.getElementById('cart-message');
    if (cartMessage) {
        setTimeout(() => {
            cartMessage.style.opacity = '0';
            setTimeout(() => {
                cartMessage.remove();
            }, 300);
        }, 3000);
    }
    
    // Filter button active state management
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // HTMX event listeners
    document.body.addEventListener('htmx:beforeRequest', function(event) {
        // Show loading indicators
        const indicator = event.target.querySelector('.htmx-indicator');
        if (indicator) {
            indicator.style.display = 'inline-block';
        }
    });
    
    document.body.addEventListener('htmx:afterRequest', function(event) {
        // Hide loading indicators
        const indicator = event.target.querySelector('.htmx-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        
        // Handle successful responses
        if (event.detail.xhr.status === 200) {
            // Show quick view modal if it was opened
            if (event.detail.xhr.responseURL.includes('htmx_product_details')) {
                const modal = document.getElementById('quick-view-modal');
                if (modal) {
                    modal.style.display = 'flex';
                }
            }
            
            // Show cart message if item was added
            if (event.detail.xhr.responseURL.includes('htmx_add_to_cart')) {
                const cartMessageContainer = document.getElementById('cart-message-container');
                if (cartMessageContainer) {
                    cartMessageContainer.innerHTML = event.detail.xhr.response;
                    const message = cartMessageContainer.querySelector('.cart-message');
                    if (message) {
                        setTimeout(() => {
                            message.style.opacity = '0';
                            setTimeout(() => {
                                message.remove();
                            }, 300);
                        }, 3000);
                    }
                }
            }
        }
    });
    
    // HTMX error handling
    document.body.addEventListener('htmx:responseError', function(event) {
        console.error('HTMX Error:', event.detail);
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'cart-message';
        errorMessage.style.background = '#ff4757';
        errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Произошла ошибка. Попробуйте еще раз.</span>';
        
        const cartMessageContainer = document.getElementById('cart-message-container');
        if (cartMessageContainer) {
            cartMessageContainer.appendChild(errorMessage);
            setTimeout(() => {
                errorMessage.style.opacity = '0';
                setTimeout(() => {
                    errorMessage.remove();
                }, 300);
            }, 3000);
        }
    });
    
    // Infinite scroll for load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMoreBtn.click();
                }
            });
        });
        
        observer.observe(loadMoreBtn);
    }
    
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    console.log('HTMX enhancements loaded successfully');
});

// Telegram Order Function
function sendTelegramMessage(productName, productPrice) {
    const message = `Привет! Хочу заказать товар:\n\n📦 ${productName}\n💰 Цена: ${productPrice} сум\n\nПожалуйста, уточните наличие и условия доставки.`;
    const telegramUrl = `https://t.me/z_gulinigor01?text=${encodeURIComponent(message)}`;
    
    // Открываем Telegram с предзаполненным сообщением
    window.open(telegramUrl, '_blank');
    
    // Показываем уведомление
    showTelegramNotification(productName);
}

function showTelegramNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'telegram-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fab fa-telegram"></i>
            <span>Открываем Telegram для заказа "${productName}"</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
