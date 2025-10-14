// Multiple Selection System for Catalog
class MultipleSelection {
    constructor() {
        this.isSelectionMode = false;
        this.selectedProducts = new Set();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Toggle selection mode
        const toggleBtn = document.getElementById('toggle-selection');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleSelectionMode());
        }

        // Select all products
        const selectAllBtn = document.getElementById('select-all');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.selectAll());
        }

        // Clear selection
        const clearBtn = document.getElementById('clear-selection');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSelection());
        }

        // Compare selected products
        const compareBtn = document.getElementById('compare-selected');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.compareSelected());
        }

        // Handle individual product selection
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('product-checkbox')) {
                this.handleProductSelection(e.target);
            }
        });

        // Handle HTMX updates
        document.addEventListener('htmx:beforeSwap', () => {
            this.saveSelectionState();
        });

        document.addEventListener('htmx:afterSwap', () => {
            this.restoreSelectionState();
            this.updateSelectionState();
        });
    }

    toggleSelectionMode() {
        this.isSelectionMode = !this.isSelectionMode;
        this.updateUI();
        
        if (!this.isSelectionMode) {
            this.clearSelection();
        }
    }

    updateUI() {
        const toggleBtn = document.getElementById('toggle-selection');
        const actionsDiv = document.getElementById('selection-actions');
        const productCards = document.querySelectorAll('.product-card');

        if (toggleBtn) {
            if (this.isSelectionMode) {
                toggleBtn.classList.add('active');
                toggleBtn.innerHTML = '<i class="fas fa-times"></i> Отменить выбор';
            } else {
                toggleBtn.classList.remove('active');
                toggleBtn.innerHTML = '<i class="fas fa-check-square"></i> Выбрать товары';
            }
        }

        if (actionsDiv) {
            actionsDiv.style.display = this.isSelectionMode ? 'flex' : 'none';
        }

        // Update product cards
        productCards.forEach(card => {
            if (this.isSelectionMode) {
                card.classList.add('selection-mode');
            } else {
                card.classList.remove('selection-mode', 'selected');
            }
        });

        this.updateSelectedCount();
    }

    handleProductSelection(checkbox) {
        const productId = checkbox.dataset.productId;
        const productCard = checkbox.closest('.product-card');

        if (checkbox.checked) {
            this.selectedProducts.add(productId);
            productCard.classList.add('selected');
        } else {
            this.selectedProducts.delete(productId);
            productCard.classList.remove('selected');
        }

        this.updateSelectedCount();
    }

    selectAll() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.checked = true;
                this.handleProductSelection(checkbox);
            }
        });
    }

    clearSelection() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.selectedProducts.clear();
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const countElement = document.getElementById('selected-count');
        const compareBtn = document.getElementById('compare-selected');
        const selectAllBtn = document.getElementById('select-all');
        const clearBtn = document.getElementById('clear-selection');
        
        if (countElement) {
            const count = this.selectedProducts.size;
            countElement.textContent = `Выбрано: ${count}`;
        }
        
        // Обновляем состояние кнопок
        if (compareBtn) {
            if (this.selectedProducts.size < 2) {
                compareBtn.disabled = true;
                compareBtn.classList.add('disabled');
            } else {
                compareBtn.disabled = false;
                compareBtn.classList.remove('disabled');
            }
        }
        
        if (selectAllBtn) {
            const totalProducts = document.querySelectorAll('.product-checkbox').length;
            if (this.selectedProducts.size === totalProducts) {
                selectAllBtn.textContent = 'Снять все';
                selectAllBtn.innerHTML = '<i class="fas fa-times"></i> Снять все';
            } else {
                selectAllBtn.textContent = 'Все';
                selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> Все';
            }
        }
    }

    updateSelectionState() {
        // Update selection state after HTMX updates
        if (this.isSelectionMode) {
            this.updateUI();
        }
    }

    compareSelected() {
        const selectedIds = Array.from(this.selectedProducts);
        
        if (selectedIds.length < 2) {
            alert('Выберите минимум 2 товара для сравнения');
            return;
        }

        if (selectedIds.length > 4) {
            alert('Максимум 4 товара для сравнения');
            return;
        }

        // Redirect to comparison page or show modal
        const compareUrl = `/compare/?products=${selectedIds.join(',')}`;
        window.location.href = compareUrl;
    }

    getSelectedProducts() {
        return Array.from(this.selectedProducts);
    }

    getSelectedCount() {
        return this.selectedProducts.size;
    }

    saveSelectionState() {
        // Сохраняем состояние выбора в localStorage
        const selectedArray = Array.from(this.selectedProducts);
        localStorage.setItem('selectedProducts', JSON.stringify(selectedArray));
        localStorage.setItem('isSelectionMode', this.isSelectionMode.toString());
    }

    restoreSelectionState() {
        // Восстанавливаем состояние выбора из localStorage
        const savedSelected = localStorage.getItem('selectedProducts');
        const savedMode = localStorage.getItem('isSelectionMode');
        
        if (savedSelected) {
            this.selectedProducts = new Set(JSON.parse(savedSelected));
        }
        
        if (savedMode === 'true') {
            this.isSelectionMode = true;
        }
        
        // Восстанавливаем состояние чекбоксов
        this.selectedProducts.forEach(productId => {
            const checkbox = document.querySelector(`input[data-product-id="${productId}"]`);
            if (checkbox) {
                checkbox.checked = true;
                const productCard = checkbox.closest('.product-card');
                if (productCard) {
                    productCard.classList.add('selected');
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.multipleSelection = new MultipleSelection();
});

// Export for global access
window.MultipleSelection = MultipleSelection;
