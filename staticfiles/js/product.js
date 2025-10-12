// Updated product.js - Removed cart functionality, kept product interactions

let selectedSize = 'M';
let selectedColor = 'white';
let quantity = 1;

// Initialize product page
document.addEventListener('DOMContentLoaded', function() {
    initProductTabs();
    initThumbnailGallery();
});

// Initialize product tabs
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Removed size and color selector functions as they are no longer needed

// Initialize thumbnail gallery
function initThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Here you would typically change the main image
            // For demo purposes, we'll just show a notification
            showNotification('Изображение изменено', 'info');
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#7a7256'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for product page
const productStyle = document.createElement('style');
productStyle.textContent = `
    .breadcrumbs {
        background: #f8f9fa;
        padding: 1rem 0;
        margin-top: 80px;
    }
    
    .breadcrumb-nav {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }
    
    .breadcrumb-nav a {
        color: #7a7256;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .breadcrumb-nav a:hover {
        color: #6b6450;
    }
    
    .breadcrumb-separator {
        color: #666;
    }
    
    .breadcrumb-current {
        color: #333;
        font-weight: 500;
    }
    
    .product-details {
        padding: 3rem 0;
        background: white;
    }
    
    .product-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
    }
    
    .product-gallery {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .main-image {
        width: 100%;
        height: 500px;
        background: #f8f9fa;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    
    .main-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .main-image .product-placeholder {
        font-size: 8rem;
        color: #7a7256;
    }
    
    .thumbnail-images {
        display: flex;
        gap: 1rem;
    }
    
    .thumbnail {
        width: 80px;
        height: 80px;
        background: #f8f9fa;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        overflow: hidden;
    }
    
    .thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .thumbnail:hover,
    .thumbnail.active {
        border-color: #7a7256;
    }
    
    .thumbnail .product-placeholder {
        font-size: 2rem;
        color: #7a7256;
    }
    
    .product-info {
        padding: 1rem 0;
    }
    
    .product-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2c2c2c;
        margin-bottom: 1rem;
    }
    
    .product-rating {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .stars {
        display: flex;
        gap: 0.2rem;
        color: #ffd700;
    }
    
    .rating-text {
        color: #666;
        font-size: 0.9rem;
    }
    
    .product-price {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .current-price {
        font-size: 2rem;
        font-weight: 700;
        color: #7a7256;
    }
    
    .old-price {
        font-size: 1.2rem;
        color: #999;
        text-decoration: line-through;
    }
    
    .discount {
        background: #ff4757;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .product-description {
        margin-bottom: 2rem;
        line-height: 1.6;
        color: #666;
    }
    
    .product-options {
        margin-bottom: 2rem;
    }
    
    .size-selector,
    .color-selector {
        margin-bottom: 1.5rem;
    }
    
    .size-selector label,
    .color-selector label {
        display: block;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .size-options,
    .color-options {
        display: flex;
        gap: 0.5rem;
    }
    
    .size-btn {
        width: 50px;
        height: 50px;
        border: 2px solid #eee;
        background: white;
        color: #333;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
    }
    
    .size-btn:hover,
    .size-btn.active {
        border-color: #7a7256;
        background: #7a7256;
        color: white;
    }
    
    .color-btn {
        width: 40px;
        height: 40px;
        border: 2px solid #eee;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .color-btn:hover,
    .color-btn.active {
        border-color: #7a7256;
        transform: scale(1.1);
    }
    
    .product-tabs {
        background: #f8f9fa;
        padding: 3rem 0;
    }
    
    .tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid #ddd;
    }
    
    .tab-btn {
        padding: 1rem 2rem;
        border: none;
        background: none;
        color: #666;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .tab-btn:hover,
    .tab-btn.active {
        color: #7a7256;
        border-bottom-color: #7a7256;
    }
    
    .tab-content {
        background: white;
        border-radius: 15px;
        padding: 2rem;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
    
    .tab-panel {
        display: none;
    }
    
    .tab-panel.active {
        display: block;
    }
    
    .tab-panel h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2c2c2c;
        margin-bottom: 1rem;
    }
    
    .tab-panel p {
        line-height: 1.6;
        color: #666;
        margin-bottom: 1rem;
    }
    
    .tab-panel ul {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .tab-panel li {
        margin-bottom: 0.5rem;
        color: #666;
    }
    
    .specifications-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .specifications-table td {
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }
    
    .specifications-table td:first-child {
        font-weight: 600;
        color: #333;
        width: 40%;
    }
    
    .reviews-summary {
        margin-bottom: 2rem;
    }
    
    .rating-overview {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .rating-number {
        font-size: 3rem;
        font-weight: 700;
        color: #7a7256;
    }
    
    .reviews-count {
        color: #666;
    }
    
    .reviews-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .review {
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .reviewer-name {
        font-weight: 600;
        color: #333;
    }
    
    .review-rating {
        display: flex;
        gap: 0.2rem;
        color: #ffd700;
    }
    
    .review-text {
        color: #666;
        margin-bottom: 0.5rem;
    }
    
    .review-date {
        font-size: 0.8rem;
        color: #999;
    }
    
    .shipping-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .shipping-option {
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .shipping-option h4 {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .shipping-option p {
        color: #666;
        margin-bottom: 0.3rem;
    }
    
    .payment-info {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .payment-info h4 {
        font-weight: 600;
        color: #333;
        margin-bottom: 1rem;
    }
    
    .payment-info ul {
        margin-left: 1.5rem;
    }
    
    .payment-info li {
        color: #666;
        margin-bottom: 0.5rem;
    }
    
    .related-products {
        padding: 3rem 0;
        background: white;
    }
    
    @media (max-width: 768px) {
        .product-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .tabs {
            flex-wrap: wrap;
        }
        
        .tab-btn {
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
        }
        
        .rating-overview {
            flex-direction: column;
            text-align: center;
        }
        
        .review-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
`;
document.head.appendChild(productStyle);