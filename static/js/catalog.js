// Catalog JavaScript with Advanced Filtering

document.addEventListener('DOMContentLoaded', function() {
    initCatalogFilters();
    initFavorites();
    initPagination();
});

function initCatalogFilters() {
    const filtersForm = document.getElementById('catalog-filters');
    
    if (!filtersForm) return;
    
    // Auto-submit on filter change
    const filterInputs = filtersForm.querySelectorAll('select, input[type="text"]');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Add small delay for search input
            if (input.type === 'text') {
                clearTimeout(input.searchTimeout);
                input.searchTimeout = setTimeout(() => {
                    submitFilters();
                }, 500);
            } else {
                submitFilters();
            }
        });
        
        // For search input, also handle Enter key
        if (input.type === 'text') {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    clearTimeout(input.searchTimeout);
                    submitFilters();
                }
            });
        }
    });
    
    // Handle form submission
    filtersForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitFilters();
    });
}

function submitFilters() {
    const form = document.getElementById('catalog-filters');
    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    // Build URL parameters
    for (let [key, value] of formData.entries()) {
        if (value.trim() !== '') {
            params.set(key, value);
        }
    }
    
    // Remove page parameter to start from first page
    params.delete('page');
    
    // Update URL and reload
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.location.href = newUrl;
}

function initFavorites() {
    // Load favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Update favorites data field
    const favoritesData = document.getElementById('favorites-data');
    if (favoritesData) {
        favoritesData.value = JSON.stringify(favorites);
    }
    
    // Add click handlers to favorite buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('favorite-btn') || e.target.closest('.favorite-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.favorite-btn');
            const productId = btn.dataset.productId;
            
            if (productId) {
                toggleFavorite(productId, btn);
            }
        }
    });
}

function toggleFavorite(productId, btn) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const productIdStr = productId.toString();
    
    if (favorites.includes(productIdStr)) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== productIdStr);
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
    } else {
        // Add to favorites
        favorites.push(productIdStr);
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update favorites data field
    const favoritesData = document.getElementById('favorites-data');
    if (favoritesData) {
        favoritesData.value = JSON.stringify(favorites);
    }
    
    // Update favorites count in header if exists
    updateFavoritesCount(favorites.length);
}

function updateFavoritesCount(count) {
    const countElement = document.querySelector('.favorites-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Pagination functionality
function initPagination() {
    // Page size selector
    const pageSizeSelect = document.getElementById('page-size');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            const newPageSize = this.value;
            updateURL({ page_size: newPageSize, page: 1 });
        });
    }
    
    // Page jump functionality
    const pageJumpInput = document.getElementById('page-jump');
    if (pageJumpInput) {
        pageJumpInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                jumpToPage();
            }
        });
    }
}

function jumpToPage() {
    const pageJumpInput = document.getElementById('page-jump');
    const maxPages = parseInt(pageJumpInput.getAttribute('max'));
    const targetPage = parseInt(pageJumpInput.value);
    
    if (targetPage >= 1 && targetPage <= maxPages) {
        updateURL({ page: targetPage });
    } else {
        // Reset to current page if invalid
        pageJumpInput.value = getCurrentPage();
        showNotification('Неверный номер страницы', 'error');
    }
}

function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#7a7256'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// HTMX event handlers
document.addEventListener('htmx:beforeRequest', function(event) {
    // Show loading indicator
    const loadingIndicator = document.getElementById('catalog-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
});

document.addEventListener('htmx:afterRequest', function(event) {
    // Hide loading indicator
    const loadingIndicator = document.getElementById('catalog-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // Update page jump input
    const pageJumpInput = document.getElementById('page-jump');
    if (pageJumpInput) {
        pageJumpInput.value = getCurrentPage();
    }
    
    // Scroll to top of products
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

document.addEventListener('htmx:responseError', function(event) {
    showNotification('Ошибка загрузки данных', 'error');
});

// Utility function to update URL parameters
function updateURL(params) {
    const url = new URL(window.location);
    
    Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, params[key]);
        }
    });
    
    window.location.href = url.toString();
}