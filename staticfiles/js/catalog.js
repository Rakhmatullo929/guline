// Updated catalog.js - Removed cart functionality, kept filtering and search

let currentCategory = 'all';
let currentSort = 'name';
let searchQuery = '';

// Initialize catalog
document.addEventListener('DOMContentLoaded', function() {
    initCatalogFilters();
    initSearch();
    initSorting();
    loadProductsFromURL();
});

// Initialize catalog filters
function initCatalogFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current category
            currentCategory = this.dataset.category;
            
            // Filter products
            filterProducts();
        });
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase();
            filterProducts();
        });
    }
}

// Initialize sorting
function initSorting() {
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortProducts();
        });
    }
}

// Load products from URL parameters
function loadProductsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        currentCategory = category;
        
        // Update active filter button
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        filterProducts();
    }
}

// Filter products based on category and search query
function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const productCategory = product.dataset.category;
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        
        const categoryMatch = currentCategory === 'all' || productCategory === currentCategory;
        const searchMatch = searchQuery === '' || productName.includes(searchQuery);
        
        if (categoryMatch && searchMatch) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Show "no products found" message if needed
    showNoProductsMessage(visibleCount === 0);
}

// Show/hide "no products found" message
function showNoProductsMessage(show) {
    let noProductsMsg = document.getElementById('noProductsMsg');
    
    if (show && !noProductsMsg) {
        noProductsMsg = document.createElement('div');
        noProductsMsg.id = 'noProductsMsg';
        noProductsMsg.className = 'no-products-message';
        noProductsMsg.innerHTML = `
            <div class="no-products-content">
                <i class="fas fa-search"></i>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
        `;
        
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.appendChild(noProductsMsg);
        }
    } else if (!show && noProductsMsg) {
        noProductsMsg.remove();
    }
}

// Sort products
function sortProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    // Filter visible products only
    const visibleProducts = products.filter(product => 
        product.style.display !== 'none'
    );
    
    visibleProducts.sort((a, b) => {
        const nameA = a.querySelector('.product-name').textContent;
        const nameB = b.querySelector('.product-name').textContent;
        const priceA = parseInt(a.querySelector('.product-price .current-price').textContent.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.querySelector('.product-price .current-price').textContent.replace(/[^\d]/g, ''));
        
        switch (currentSort) {
            case 'name':
                return nameA.localeCompare(nameB);
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                // For demo purposes, sort by product ID (higher ID = newer)
                const idA = parseInt(a.querySelector('.view-btn').href.match(/\d+/)[0]) || 0;
                const idB = parseInt(b.querySelector('.view-btn').href.match(/\d+/)[0]) || 0;
                return idB - idA;
            default:
                return 0;
        }
    });
    
    // Re-append sorted products
    visibleProducts.forEach(product => {
        productsGrid.appendChild(product);
    });
}

// Add CSS for catalog page
const style = document.createElement('style');
style.textContent = `
    .no-products-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
    }
    
    .no-products-content i {
        font-size: 4rem;
        color: #ddd;
        margin-bottom: 1rem;
    }
    
    .no-products-content h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #333;
    }
    
    .no-products-content p {
        color: #666;
    }
    
    .page-header {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 120px 0 60px;
        text-align: center;
    }
    
    .page-header h1 {
        font-size: 3rem;
        font-weight: 700;
        color: #2c2c2c;
        margin-bottom: 1rem;
    }
    
    .page-header p {
        font-size: 1.2rem;
        color: #666;
    }
    
    .filters-section {
        background: white;
        padding: 2rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .filters-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
    }
    
    .search-box {
        position: relative;
        flex: 1;
        min-width: 300px;
    }
    
    .search-input {
        width: 100%;
        padding: 0.8rem 1rem 0.8rem 3rem;
        border: 2px solid #eee;
        border-radius: 25px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #7a7256;
    }
    
    .search-box i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
    }
    
    .filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        padding: 0.6rem 1.2rem;
        border: 2px solid #eee;
        background: white;
        color: #666;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        text-decoration: none;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        border-color: #7a7256;
        background: #7a7256;
        color: white;
    }
    
    .sort-options {
        min-width: 200px;
    }
    
    .sort-select {
        width: 100%;
        padding: 0.8rem 1rem;
        border: 2px solid #eee;
        border-radius: 8px;
        background: white;
        color: #333;
        font-size: 1rem;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }
    
    .sort-select:focus {
        outline: none;
        border-color: #7a7256;
    }
    
    .products-section {
        padding: 3rem 0;
        background: #fafafa;
    }
    
    @media (max-width: 768px) {
        .filters-container {
            flex-direction: column;
            align-items: stretch;
        }
        
        .search-box {
            min-width: auto;
        }
        
        .filters {
            justify-content: center;
        }
        
        .page-header h1 {
            font-size: 2rem;
        }
    }
`;
document.head.appendChild(style);