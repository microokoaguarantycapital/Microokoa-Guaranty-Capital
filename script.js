// Add this function to ensure libraries are loaded
function checkCarouselDependencies() {
    if (typeof $ === 'undefined' || typeof $.fn.owlCarousel === 'undefined') {
        console.error('Owl Carousel or jQuery not loaded. Slider disabled.');
        return false;
    }
    return true;
}

// Modify your initializeCarousels function
function initializeCarousels() {
    if (!checkCarouselDependencies()) return;

    // Your existing Owl Carousel initialization code from the commit goes here
    $('.hero-slider').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        // ... keep the rest of your settings
    });
}
// Microokoa Guaranty Capital - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Owl Carousels
    initializeCarousels();
    
    // Initialize Loan Calculator
    initializeLoanCalculator();
    
    // Initialize Mobile Menu
    initializeMobileMenu();
    
    // Initialize Dropdowns
    initializeDropdowns();
    
    // Initialize Smooth Scrolling
    initializeSmoothScrolling();
    
    // Initialize Form Validation
    initializeFormValidation();
    
    // Initialize Trust Indicators Animation
    initializeTrustAnimations();
    
    // Initialize Lazy Loading for Images
    initializeLazyLoading();
});

// Owl Carousel Initialization
function initializeCarousels() {
    // Hero Slider
    $('.hero-slider').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        nav: true,
        dots: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1000,
        navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsive: {
            0: {
                nav: false
            },
            768: {
                nav: true
            }
        }
    });
    
    // Testimonials Slider
    $('.testimonial-slider').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 7000,
        margin: 30,
        nav: true,
        dots: false,
        navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ]
    });
}

// Loan Calculator Functionality
function initializeLoanCalculator() {
    const donationSlider = document.getElementById('donation-amount');
    const currentDonation = document.getElementById('current-donation');
    const loanAmount = document.getElementById('loan-amount');
    const communityImpact = document.getElementById('community-impact');
    
    if (!donationSlider) return;
    
    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    
    // Calculate loan amount (10x multiplier)
    const calculateLoan = (donation) => {
        return donation * 10;
    };
    
    // Calculate community impact
    const calculateImpact = (donation) => {
        const peopleHelped = Math.floor(donation / 200);
        return peopleHelped > 0 ? `${peopleHelped}+ people helped` : 'Community supported';
    };
    
    // Update calculator display
    const updateCalculator = () => {
        const donation = parseInt(donationSlider.value);
        const loan = calculateLoan(donation);
        const impact = calculateImpact(donation);
        
        currentDonation.textContent = formatCurrency(donation);
        loanAmount.textContent = `${formatCurrency(loan)} KSH`;
        communityImpact.textContent = impact;
        
        // Animate the update
        loanAmount.classList.add('pulse');
        setTimeout(() => loanAmount.classList.remove('pulse'), 300);
    };
    
    // Initial calculation
    updateCalculator();
    
    // Event listener for slider
    donationSlider.addEventListener('input', updateCalculator);
    
    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        .pulse {
            animation: pulse 0.3s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!mobileToggle || !navList) return;
    
    mobileToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.innerHTML = navList.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navList.contains(event.target) && !mobileToggle.contains(event.target)) {
            navList.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Dropdown Menu Functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navList = document.querySelector('.nav-list');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active navigation link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Highlight current section on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'This field is required');
                } else {
                    clearError(input);
                    
                    // Email validation
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                            showError(input, 'Please enter a valid email address');
                        }
                    }
                    
                    // Phone validation
                    if (input.type === 'tel' || input.name === 'phone') {
                        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
                        if (!phoneRegex.test(input.value)) {
                            isValid = false;
                            showError(input, 'Please enter a valid phone number');
                        }
                    }
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Thank you for your submission! We will contact you soon.');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    });
    
    function showError(input, message) {
        clearError(input);
        
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = '#dc3545';
        error.style.fontSize = '12px';
        error.style.marginTop = '5px';
        
        input.parentNode.appendChild(error);
        input.style.borderColor = '#dc3545';
    }
    
    function clearError(input) {
        const error = input.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        input.style.borderColor = '';
    }
}

// Trust Indicators Animation
function initializeTrustAnimations() {
    const trustItems = document.querySelectorAll('.trust-item, .trust-badge');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    trustItems.forEach(item => {
        observer.observe(item);
    });
}

// Lazy Loading for Images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Loan Application Simulation
function simulateLoanApplication(loanType) {
    const modal = document.createElement('div');
    modal.className = 'loan-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Apply for ${loanType}</h3>
            <p>You will be redirected to our secure application form.</p>
            <div class="modal-buttons">
                <button class="modal-cancel">Cancel</button>
                <button class="modal-continue">Continue</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .loan-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        
        .modal-buttons {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }
        
        .modal-buttons button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        }
        
        .modal-cancel {
            background: #f5f5f5;
            color: #333;
        }
        
        .modal-continue {
            background: var(--primary-green);
            color: white;
        }
    `;
    document.head.appendChild(modalStyle);
    
    // Event listeners for modal buttons
    modal.querySelector('.modal-cancel').addEventListener('click', () => {
        modal.remove();
        modalStyle.remove();
    });
    
    modal.querySelector('.modal-continue').addEventListener('click', () => {
        alert('Redirecting to application form...');
        modal.remove();
        modalStyle.remove();
    });
}

// Initialize loan application buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.product-cta')) {
        const productCard = e.target.closest('.product-card');
        const loanType = productCard.querySelector('h3').textContent;
        simulateLoanApplication(loanType);
    }
});

// Currency Formatter Helper
function formatKES(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        if (loadTime > 3000) {
            console.log('Page loaded in', loadTime, 'ms. Consider optimizing.');
        }
    });
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

