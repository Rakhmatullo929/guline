// Enhanced category filter script with modern UI
let isFilterMode = false;
let selectedCategories = new Set();

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced category filter script loaded');
    initializeFilterMode();
    initializeEffects();
    updateUI();
    
    // Добавляем обработчики для HTMX событий
    document.body.addEventListener('htmx:afterRequest', function(event) {
        if (event.detail.xhr.status === 200) {
            console.log('HTMX request completed successfully');
            // Обновляем UI после успешного запроса
            updateUI();
        }
    });
});

// Инициализация режима фильтрации
function initializeFilterMode() {
    const toggleBtn = document.getElementById('toggle-category-filter');
    const actionsDiv = document.getElementById('category-filter-actions');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleFilterMode);
    }
    
    if (actionsDiv) {
        // Добавляем класс show для анимации
        actionsDiv.classList.add('show');
    }
    
    // Привязываем события к кнопкам действий
    bindActionButtons();
}

// Переключение режима фильтрации
function toggleFilterMode() {
    isFilterMode = !isFilterMode;
    console.log('Filter mode:', isFilterMode);
    updateUI();
    
    // Анимация для кнопки
    const toggleBtn = document.getElementById('toggle-category-filter');
    if (toggleBtn) {
        toggleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

// Переключение выбора категории с анимацией
function toggleCategorySelection(button) {
    if (!isFilterMode) {
        // Если не в режиме фильтрации, переключаем режим
        toggleFilterMode();
    }
    
    const categoryId = button.dataset.categoryId;
    const checkbox = button.querySelector('.category-checkbox');
    const checkIcon = button.querySelector('.category-check-icon');
    
    // Анимация кнопки
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    if (selectedCategories.has(categoryId)) {
        // Убираем из выбора
        selectedCategories.delete(categoryId);
        checkbox.checked = false;
        button.classList.remove('selected');
        if (checkIcon) {
            checkIcon.style.opacity = '0';
            checkIcon.style.transform = 'scale(0.8)';
        }
    } else {
        // Добавляем в выбор
        selectedCategories.add(categoryId);
        checkbox.checked = true;
        button.classList.add('selected');
        if (checkIcon) {
            checkIcon.style.opacity = '1';
            checkIcon.style.transform = 'scale(1)';
        }
    }
    
    updateSelectedCount();
    console.log('Selected categories:', Array.from(selectedCategories));
}

// Выбрать все категории с анимацией
function selectAllCategories() {
    const categoryButtons = document.querySelectorAll('.category-filter');
    categoryButtons.forEach((button, index) => {
        setTimeout(() => {
            const categoryId = button.dataset.categoryId;
            const checkbox = button.querySelector('.category-checkbox');
            const checkIcon = button.querySelector('.category-check-icon');
            
            selectedCategories.add(categoryId);
            checkbox.checked = true;
            button.classList.add('selected');
            if (checkIcon) {
                checkIcon.style.opacity = '1';
                checkIcon.style.transform = 'scale(1)';
            }
            
            // Анимация
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }, index * 50); // Задержка для каскадного эффекта
    });
    
    updateSelectedCount();
}

// Очистить выбор категорий с анимацией
function clearCategoryFilter() {
    selectedCategories.clear();
    const categoryButtons = document.querySelectorAll('.category-filter');
    categoryButtons.forEach((button, index) => {
        setTimeout(() => {
            const checkbox = button.querySelector('.category-checkbox');
            const checkIcon = button.querySelector('.category-check-icon');
            
            checkbox.checked = false;
            button.classList.remove('selected');
            if (checkIcon) {
                checkIcon.style.opacity = '0';
                checkIcon.style.transform = 'scale(0.8)';
            }
            
            // Анимация
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }, index * 30); // Задержка для каскадного эффекта
    });
    
    updateSelectedCount();
}

// Применить фильтр с анимацией загрузки
function applyCategoryFilter() {
    const applyBtn = document.getElementById('apply-category-filter');
    if (applyBtn) {
        applyBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            applyBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    if (selectedCategories.size === 0) {
        // Если ничего не выбрано, показываем все товары
        console.log('No categories selected, loading all products');
        // Используем HTMX для загрузки всех товаров
        htmx.ajax('GET', '/htmx/catalog/filter/', {
            target: '#catalog-content',
            swap: 'innerHTML',
            indicator: '#filter-loading'
        });
        return;
    }
    
    const categoryIds = Array.from(selectedCategories).join(',');
    console.log('Applying filter with categories:', categoryIds);
    console.log('Selected categories set:', selectedCategories);
    
    // Используем HTMX для загрузки с фильтром
    htmx.ajax('GET', `/htmx/catalog/filter/?categories=${categoryIds}`, {
        target: '#catalog-content',
        swap: 'innerHTML',
        indicator: '#filter-loading'
    });
}

// Загрузка товаров с HTMX
function loadProducts(params = '') {
    const url = `/htmx/catalog/filter/${params}`;
    console.log('Loading products from:', url);
    
    // Показываем индикатор загрузки
    const loadingIndicator = document.getElementById('filter-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
    
    // Используем HTMX для загрузки
    htmx.ajax('GET', url, {
        target: '#catalog-content',
        swap: 'innerHTML',
        indicator: '#filter-loading'
    });
}

// Обновление UI с современными анимациями
function updateUI() {
    const toggleBtn = document.getElementById('toggle-category-filter');
    const actionsDiv = document.getElementById('category-filter-actions');
    const categoryButtons = document.querySelectorAll('.category-filter');
    
    if (toggleBtn) {
        if (isFilterMode) {
            toggleBtn.classList.add('active');
            toggleBtn.innerHTML = '<i class="fas fa-times"></i> Отменить фильтр';
            toggleBtn.style.background = 'linear-gradient(135deg, #7a7256 0%, #6a6250 100%)';
            toggleBtn.style.color = 'white';
        } else {
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fas fa-filter"></i> Расширенные фильтры';
            toggleBtn.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
            toggleBtn.style.color = '#555';
        }
    }
    
    if (actionsDiv) {
        if (isFilterMode) {
            actionsDiv.classList.add('show');
            actionsDiv.style.display = 'flex';
        } else {
            actionsDiv.classList.remove('show');
            setTimeout(() => {
                if (!isFilterMode) {
                    actionsDiv.style.display = 'none';
                }
            }, 300);
        }
    }
    
    // Обновляем кнопки категорий
    categoryButtons.forEach((button, index) => {
        const checkbox = button.querySelector('.category-checkbox');
        const checkIcon = button.querySelector('.category-check-icon');
        
        if (checkbox) {
            if (isFilterMode) {
                button.classList.add('filter-mode');
                if (selectedCategories.has(checkbox.dataset.categoryId)) {
                    button.classList.add('selected');
                    if (checkIcon) {
                        checkIcon.style.opacity = '1';
                        checkIcon.style.transform = 'scale(1)';
                    }
                } else {
                    button.classList.remove('selected');
                    if (checkIcon) {
                        checkIcon.style.opacity = '0';
                        checkIcon.style.transform = 'scale(0.8)';
                    }
                }
            } else {
                button.classList.remove('filter-mode', 'selected');
                if (checkIcon) {
                    checkIcon.style.opacity = '0';
                    checkIcon.style.transform = 'scale(0.8)';
                }
            }
        }
    });
    
    updateSelectedCount();
}

// Обновление счетчика с анимацией
function updateSelectedCount() {
    const countElement = document.getElementById('selected-categories-count');
    if (countElement) {
        const count = selectedCategories.size;
        countElement.innerHTML = `<i class="fas fa-tag"></i> Выбрано: ${count}`;
        
        // Анимация счетчика
        countElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            countElement.style.transform = 'scale(1)';
        }, 200);
        
        console.log('Updated count:', count);
    }
}

// Привязка событий к кнопкам действий
function bindActionButtons() {
    // Кнопка "Все категории"
    const selectAllBtn = document.getElementById('select-all-categories');
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', selectAllCategories);
    }
    
    // Кнопка "Очистить фильтр"
    const clearBtn = document.getElementById('clear-category-filter');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCategoryFilter);
    }
    
    // Кнопка "Применить фильтр"
    const applyBtn = document.getElementById('apply-category-filter');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyCategoryFilter);
    }
    
    console.log('Action buttons bound');
}

// Добавление эффектов при наведении
function addHoverEffects() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected') && !this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Добавляем обработчики для кнопок фильтрации по полу
    const genderButtons = document.querySelectorAll('.gender-filter');
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            genderButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
        });
    });
}

// Инициализация всех эффектов
function initializeEffects() {
    addHoverEffects();
    addSortHandlers();
    console.log('All effects initialized');
}

// Добавление обработчиков для сортировки
function addSortHandlers() {
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Sort changed to:', this.value);
            // HTMX автоматически обработает изменение
        });
    }
}
