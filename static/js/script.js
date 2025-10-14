// Updated script.js - Removed cart functionality, kept UI interactions

// Quick view product
function quickView(productId) {
    // This would typically open a modal with product details
    // For now, we'll just show an alert
    const products = {
        1: { name: 'Классическая рубашка', price: 2500, description: 'Элегантная рубашка из качественного хлопка' },
        2: { name: 'Джинсы скинни', price: 3200, description: 'Стильные джинсы скинни с современным кроем' },
        3: { name: 'Платье макси', price: 4500, description: 'Роскошное платье макси для особых случаев' },
        4: { name: 'Куртка джинсовая', price: 5800, description: 'Классическая джинсовая куртка' }
    };
    
    const product = products[productId];
    if (product) {
        alert(`${product.name}\nЦена: ${product.price.toLocaleString()} ₽\n\n${product.description}`);
    }
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

// Smooth scrolling for anchor links
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const name = product.querySelector('.product-name').textContent.toLowerCase();
                const isVisible = name.includes(query);
                product.style.display = isVisible ? 'block' : 'none';
            });
        });
    }
}

// Filter functionality
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products based on category
            const category = this.dataset.category;
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Tab functionality
function initTabs() {
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

// Size and color selectors
function initSelectors() {
    // Size selector
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color selector
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    smoothScroll();
    initSearch();
    initFilters();
    initLazyLoading();
    initTabs();
    initSelectors();
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });
});

// Handle window resize - handled by SidebarManager

// Add to cart animation (for visual feedback)
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Update button click handlers
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-btn') || e.target.classList.contains('quick-view-btn')) {
        animateButton(e.target);
    }
});

// Enhanced Sidebar functionality
class SidebarManager {
    constructor() {
        console.log('SidebarManager constructor called');
        this.sidebar = document.getElementById('sidebar');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.isOpen = false;
        
        console.log('Elements found:', {
            sidebar: !!this.sidebar,
            mobileMenuBtn: !!this.mobileMenuBtn,
            sidebarToggle: !!this.sidebarToggle,
            sidebarOverlay: !!this.sidebarOverlay
        });
        
        // Wait a bit for DOM to be fully ready
        setTimeout(() => this.init(), 100);
    }
    
    init() {
        console.log('Initializing sidebar...');
        
        // Mobile menu button click
        if (this.mobileMenuBtn) {
            console.log('Adding click listener to mobile menu button');
            this.mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu button clicked');
                this.openSidebar();
            });
        } else {
            console.error('Mobile menu button not found!');
        }
        
        // Sidebar toggle button click
        if (this.sidebarToggle) {
            console.log('Adding click listener to sidebar toggle');
            this.sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Sidebar toggle clicked');
                this.closeSidebar();
            });
        }
        
        // Overlay click
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Overlay clicked');
                this.closeSidebar();
            });
        }
        
        // Close sidebar when clicking on links
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        console.log(`Found ${sidebarLinks.length} sidebar links`);
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Sidebar link clicked, closing sidebar');
                setTimeout(() => this.closeSidebar(), 300);
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                console.log('Escape key pressed, closing sidebar');
                this.closeSidebar();
            }
        });
        
        console.log('Sidebar initialization complete');
    }
    
    openSidebar() {
        console.log('Opening sidebar...');
        this.isOpen = true;
        
        if (this.sidebar) {
            this.sidebar.classList.add('open');
        }
        
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.add('active');
        }
        
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.classList.add('hidden');
        }
        
        document.body.style.overflow = 'hidden';
        
        // Add animation to sidebar items
        this.animateSidebarItems();
        
        console.log('Sidebar opened');
    }
    
    closeSidebar() {
        console.log('Closing sidebar...');
        this.isOpen = false;
        
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
        }
        
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.remove('active');
        }
        
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.classList.remove('hidden');
        }
        
        document.body.style.overflow = '';
        
        console.log('Sidebar closed');
    }
    
    animateSidebarItems() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    handleResize() {
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeSidebar();
        }
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing SidebarManager...');
    try {
        window.sidebarManager = new SidebarManager();
        console.log('SidebarManager initialized successfully');
    } catch (error) {
        console.error('Error initializing SidebarManager:', error);
    }
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    console.log('DOM already loaded, initializing SidebarManager immediately...');
    try {
        window.sidebarManager = new SidebarManager();
        console.log('SidebarManager initialized successfully (fallback)');
    } catch (error) {
        console.error('Error initializing SidebarManager (fallback):', error);
    }
}

// Enhanced Video Handling
class VideoManager {
    constructor() {
        this.videos = document.querySelectorAll('.hero-video');
        this.init();
    }

    init() {
        this.videos.forEach(video => {
            this.setupVideo(video);
        });
    }

    setupVideo(video) {
        // Handle video load errors
        video.addEventListener('error', (e) => {
            console.warn('Video failed to load:', e);
            this.showFallback(video);
        });

        // Handle video load success
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
            this.hideFallback(video);
        });

        // Handle video can't play
        video.addEventListener('canplay', () => {
            console.log('Video can play');
            this.hideFallback(video);
        });

        // Handle video can't play through
        video.addEventListener('canplaythrough', () => {
            console.log('Video can play through');
            this.hideFallback(video);
        });

        // Try to play video
        this.attemptPlay(video);
    }

    attemptPlay(video) {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video started playing');
                this.hideFallback(video);
            }).catch(error => {
                console.warn('Video play failed:', error);
                this.showFallback(video);
            });
        }
    }

    showFallback(video) {
        const container = video.closest('.hero-video-container');
        if (container) {
            const fallback = container.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'flex';
            }
        }
    }

    hideFallback(video) {
        const container = video.closest('.hero-video-container');
        if (container) {
            const fallback = container.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'none';
            }
        }
    }
}

// Initialize video manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing VideoManager...');
    try {
        window.videoManager = new VideoManager();
        console.log('VideoManager initialized successfully');
    } catch (error) {
        console.error('Error initializing VideoManager:', error);
    }
});