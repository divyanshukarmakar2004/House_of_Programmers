// GrowMate Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Form validation
    initializeFormValidation();
    
    // Auto-dismiss alerts
    autoDismissAlerts();
    
    // Add loading states to forms
    addLoadingStates();
});

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}

// Auto-dismiss alerts after 5 seconds
function autoDismissAlerts() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

// Add loading states to forms
function addLoadingStates() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                submitBtn.disabled = true;
                
                // Re-enable after 10 seconds (in case of error)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 10000);
            }
        });
    });
}

// Utility function to show loading state
function showLoading(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${text}`;
    element.disabled = true;
    return originalContent;
}

// Utility function to hide loading state
function hideLoading(element, originalContent) {
    element.innerHTML = originalContent;
    element.disabled = false;
}

// Utility function to format JSON response
function formatJSONResponse(data) {
    return JSON.stringify(data, null, 2);
}

// Utility function to show success message
function showSuccess(message, container = null) {
    const alertHtml = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    if (container) {
        container.innerHTML = alertHtml;
    } else {
        // Add to top of page
        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('afterbegin', alertHtml);
        }
    }
}

// Utility function to show error message
function showError(message, container = null) {
    const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    if (container) {
        container.innerHTML = alertHtml;
    } else {
        // Add to top of page
        const main = document.querySelector('main');
        if (main) {
            main.insertAdjacentHTML('afterbegin', alertHtml);
        }
    }
}

// API Helper Functions
class GrowMateAPI {
    static async makeRequest(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    static async predict(data) {
        return this.makeRequest('/predict', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    static async batchPredict(data) {
        return this.makeRequest('/batch_predict', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    static async getModelInfo() {
        return this.makeRequest('/model_info');
    }
    
    static async csvPredict(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/csv_predict', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
}

// Form Enhancement Functions
function enhanceFormInputs() {
    // Add input validation feedback
    const inputs = document.querySelectorAll('input[type="number"], select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateInput(this);
            }
        });
    });
}

function validateInput(input) {
    const value = input.value;
    const min = parseFloat(input.getAttribute('min'));
    const max = parseFloat(input.getAttribute('max'));
    const required = input.hasAttribute('required');
    
    let isValid = true;
    let message = '';
    
    if (required && (!value || value.trim() === '')) {
        isValid = false;
        message = 'This field is required';
    } else if (value && !isNaN(value)) {
        const numValue = parseFloat(value);
        if (min !== null && numValue < min) {
            isValid = false;
            message = `Value must be at least ${min}`;
        } else if (max !== null && numValue > max) {
            isValid = false;
            message = `Value must be at most ${max}`;
        }
    }
    
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        removeFeedback(input);
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        showFeedback(input, message);
    }
    
    return isValid;
}

function showFeedback(input, message) {
    removeFeedback(input);
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    input.parentNode.appendChild(feedback);
}

function removeFeedback(input) {
    const existingFeedback = input.parentNode.querySelector('.invalid-feedback, .valid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

// Data Visualization Helpers
function createYieldChart(data) {
    // This would integrate with a charting library like Chart.js
    // For now, we'll just log the data
    console.log('Yield data for visualization:', data);
}

function formatYieldValue(value) {
    return parseFloat(value).toFixed(2);
}

function getYieldLevel(value) {
    if (value < 20) return { level: 'Low', class: 'text-danger', icon: '🔴' };
    if (value < 50) return { level: 'Medium', class: 'text-warning', icon: '🟡' };
    return { level: 'High', class: 'text-success', icon: '🟢' };
}

// Export functions for global use
window.GrowMateAPI = GrowMateAPI;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showSuccess = showSuccess;
window.showError = showError;
window.formatJSONResponse = formatJSONResponse;
window.enhanceFormInputs = enhanceFormInputs;
window.createYieldChart = createYieldChart;
window.formatYieldValue = formatYieldValue;
window.getYieldLevel = getYieldLevel;
