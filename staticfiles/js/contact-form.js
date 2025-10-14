/**
 * Contact Form Handler with Notifications
 * Demonstrates how to integrate notifications with existing forms
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showErrorNotification('Пожалуйста, заполните все обязательные поля.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showErrorNotification('Пожалуйста, введите корректный email адрес.');
                return;
            }
            
            // Simulate form submission
            showInfoNotification('Отправляем ваше сообщение...');
            
            // Simulate API call delay
            setTimeout(() => {
                // Simulate success response
                showSuccessNotification('Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.');
                
                // Reset form
                contactForm.reset();
            }, 2000);
        });
    }
});

function showSuccessNotification(message) {
    if (window.notificationSystem) {
        window.notificationSystem.show('success', message);
    }
}

function showErrorNotification(message) {
    if (window.notificationSystem) {
        window.notificationSystem.show('error', message);
    }
}

function showInfoNotification(message) {
    if (window.notificationSystem) {
        window.notificationSystem.show('info', message);
    }
}

function showWarningNotification(message) {
    if (window.notificationSystem) {
        window.notificationSystem.show('warning', message);
    }
}
