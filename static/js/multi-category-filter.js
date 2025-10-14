class MultiCategoryFilter {
    constructor() {
        this.isFilterMode = false;
        this.selectedCategories = new Set();
        this.originalFilters = new Map(); // Сохраняем оригинальные фильтры
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Toggle filter mode
        const toggleBtn = document.getElementById('toggle-category-filter');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleFilterMode());
        }

        // Category selection
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('category-checkbox')) {
                this.handleCategorySelection(e.target);
            }
        });

        // Action buttons
        const selectAllBtn = document.getElementById('select-all-categories');
        const clearBtn = document.getElementById('clear-category-filter');
        const applyBtn = document.getElementById('apply-category-filter');

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.selectAllCategories());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCategoryFilter());
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyCategoryFilter());
        }

        // Handle HTMX updates
        document.addEventListener('htmx:beforeSwap', () => {
            this.saveFilterState();
        });

        document.addEventListener('htmx:afterSwap', () => {
            this.restoreFilterState();
            this.updateUI();
        });
    }

    toggleFilterMode() {
        this.isFilterMode = !this.isFilterMode;
        this.updateUI();
    }

    updateUI() {
        const toggleBtn = document.getElementById('toggle-category-filter');
        const actionsDiv = document.getElementById('category-filter-actions');
        const categoryFilters = document.querySelectorAll('.category-filter');

        if (toggleBtn) {
            if (this.isFilterMode) {
                toggleBtn.classList.add('active');
                toggleBtn.innerHTML = '<i class="fas fa-times"></i> Отменить фильтр';
            } else {
                toggleBtn.classList.remove('active');
                toggleBtn.innerHTML = '<i class="fas fa-filter"></i> Фильтр по категориям';
            }
        }

        if (actionsDiv) {
            actionsDiv.style.display = this.isFilterMode ? 'flex' : 'none';
        }

        // Show/hide checkboxes and update category buttons
        categoryFilters.forEach(categoryBtn => {
            const checkbox = categoryBtn.querySelector('.category-checkbox');
            const checkIcon = categoryBtn.querySelector('.fa-check');
            
            if (checkbox) {
                checkbox.style.display = this.isFilterMode ? 'block' : 'none';
                
                if (this.isFilterMode) {
                    categoryBtn.classList.add('filter-mode');
                    if (this.selectedCategories.has(checkbox.dataset.categoryId)) {
                        categoryBtn.classList.add('selected');
                        if (checkIcon) checkIcon.style.display = 'inline';
                    } else {
                        categoryBtn.classList.remove('selected');
                        if (checkIcon) checkIcon.style.display = 'none';
                    }
                } else {
                    categoryBtn.classList.remove('filter-mode', 'selected');
                    if (checkIcon) checkIcon.style.display = 'none';
                }
            }
        });

        this.updateSelectedCount();
    }

    handleCategorySelection(checkbox) {
        const categoryId = checkbox.dataset.categoryId;
        const categoryBtn = checkbox.closest('.category-filter');
        const checkIcon = categoryBtn.querySelector('.fa-check');

        if (checkbox.checked) {
            this.selectedCategories.add(categoryId);
            categoryBtn.classList.add('selected');
            if (checkIcon) checkIcon.style.display = 'inline';
        } else {
            this.selectedCategories.delete(categoryId);
            categoryBtn.classList.remove('selected');
            if (checkIcon) checkIcon.style.display = 'none';
        }

        this.updateSelectedCount();
    }

    selectAllCategories() {
        const checkboxes = document.querySelectorAll('.category-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            this.handleCategorySelection(checkbox);
        });
    }

    clearCategoryFilter() {
        this.selectedCategories.clear();
        const checkboxes = document.querySelectorAll('.category-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            const categoryBtn = checkbox.closest('.category-filter');
            categoryBtn.classList.remove('selected');
            const checkIcon = categoryBtn.querySelector('.fa-check');
            if (checkIcon) checkIcon.style.display = 'none';
        });
        this.updateSelectedCount();
    }

    applyCategoryFilter() {
        if (this.selectedCategories.size === 0) {
            // Если ничего не выбрано, показываем все товары
            this.loadProducts();
            return;
        }

        // Создаем URL с выбранными категориями
        const categoryIds = Array.from(this.selectedCategories).join(',');
        this.loadProducts(`?categories=${categoryIds}`);
    }

    loadProducts(params = '') {
        const url = `/catalog/htmx-filter/${params}`;
        
        fetch(url, {
            method: 'GET',
            headers: {
                'HX-Request': 'true',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.text())
        .then(html => {
            document.getElementById('product-grid').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
    }

    updateSelectedCount() {
        const countElement = document.getElementById('selected-categories-count');
        if (countElement) {
            const count = this.selectedCategories.size;
            countElement.textContent = `Выбрано категорий: ${count}`;
        }
    }

    saveFilterState() {
        localStorage.setItem('selectedCategories', JSON.stringify(Array.from(this.selectedCategories)));
        localStorage.setItem('isFilterMode', this.isFilterMode.toString());
    }

    restoreFilterState() {
        const savedCategories = localStorage.getItem('selectedCategories');
        const savedMode = localStorage.getItem('isFilterMode');
        
        if (savedCategories) {
            this.selectedCategories = new Set(JSON.parse(savedCategories));
        }
        
        if (savedMode === 'true') {
            this.isFilterMode = true;
        }
        
        // Restore checkbox states
        this.selectedCategories.forEach(categoryId => {
            const checkbox = document.querySelector(`input[data-category-id="${categoryId}"]`);
            if (checkbox) {
                checkbox.checked = true;
                const categoryBtn = checkbox.closest('.category-filter');
                categoryBtn.classList.add('selected');
                const checkIcon = categoryBtn.querySelector('.fa-check');
                if (checkIcon) checkIcon.style.display = 'inline';
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.multiCategoryFilter = new MultiCategoryFilter();
});
