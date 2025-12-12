// Main Application State
const appState = {
    currentSection: 'home',
    loanAmount: 2000,
    sliderAutoPlay: null,
    testimonialAutoPlay: null,
    sections: {}
};

// DOM Elements
const domElements = {
    header: document.getElementById('header'),
    mainNav: document.getElementById('main-nav'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mainContent: document.getElementById('main-content'),
    dynamicContent: document.getElementById('dynamic-content'),
    logo: document.getElementById('logo'),
    
    // Hero Slider Elements
    heroSlider: document.getElementById('hero-slider'),
    sliderTrack: document.getElementById('slider-track'),
    sliderDots: document.getElementById('slider-dots'),
    prevSlideBtn: document.getElementById('prev-slide'),
    nextSlideBtn: document.getElementById('next-slide'),
    
    // Loan Calculator Elements
    donationSlider: document.getElementById('donation-slider'),
    donationInput: document.getElementById('donation-input'),
    sliderValue: document.getElementById('slider-value'),
    loanAccess: document.getElementById('loan-access'),
    communityImpact: document.getElementById('community-impact'),
    calculateBtn: document.getElementById('calculate-btn'),
    
    // Testimonial Slider Elements
    testimonialSlider: document.getElementById('testimonial-slider'),
    prevTestimonialBtn: document.getElementById('prev-testimonial'),
    nextTestimonialBtn: document.getElementById('next-testimonial'),
    
    // Navigation Links
    navLinks: document.querySelectorAll('.nav-link'),
    dropdowns: document.querySelectorAll('.dropdown')
};

// Initialize Application
function initApp() {
    console.log('Microokoa Guaranty Capital Website Initializing...');
    
    // Initialize all modules
    initNavigation();
    initHeroSlider();
    initLoanCalculator();
    initTestimonialSlider();
    initDynamicContent();
    initEventListeners();
    
    // Set initial state
    updateLoanCalculator();
    
    console.log('Website initialized successfully.');
}

// Navigation System
function initNavigation() {
    console.log('Initializing navigation system...');
    
    // Mobile menu toggle
    domElements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Navigation click handlers
    domElements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            console.log(`Navigating to section: ${sectionId}`);
            
            // Update active nav link
            domElements.navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // Load section content
            loadSection(sectionId);
            
            // Close dropdown if it's open
            const dropdown = this.closest('.dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        });
    });
    
    // Dropdown toggle
    domElements.dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            domElements.dropdowns.forEach(d => d.classList.remove('active'));
        }
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    domElements.mainNav.classList.toggle('active');
    const icon = domElements.mobileMenuBtn.querySelector('i');
    
    if (domElements.mainNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    domElements.mainNav.classList.remove('active');
    const icon = domElements.mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// Hero Slider System
function initHeroSlider() {
    console.log('Initializing hero slider...');
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Function to show specific slide
    function showSlide(index) {
        // Wrap around if out of bounds
        if (index >= totalSlides) currentSlide = 0;
        if (index < 0) currentSlide = totalSlides - 1;
        
        // Update slider track position
        domElements.sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active classes
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Event listeners for slider controls
    domElements.prevSlideBtn.addEventListener('click', () => {
        currentSlide--;
        showSlide(currentSlide);
        resetAutoPlay();
    });
    
    domElements.nextSlideBtn.addEventListener('click', () => {
        currentSlide++;
        showSlide(currentSlide);
        resetAutoPlay();
    });
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetAutoPlay();
        });
    });
    
    // Auto-play functionality
    function startAutoPlay() {
        appState.sliderAutoPlay = setInterval(() => {
            currentSlide++;
            showSlide(currentSlide);
        }, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(appState.sliderAutoPlay);
        startAutoPlay();
    }
    
    // Initialize auto-play
    startAutoPlay();
    
    // Pause on hover
    domElements.heroSlider.addEventListener('mouseenter', () => {
        clearInterval(appState.sliderAutoPlay);
    });
    
    domElements.heroSlider.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    
    console.log(`Hero slider initialized with ${totalSlides} slides`);
}

// Loan Calculator System
function initLoanCalculator() {
    console.log('Initializing loan calculator...');
    
    // Link slider and input
    domElements.donationSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        domElements.donationInput.value = value;
        domElements.sliderValue.textContent = formatCurrency(value);
        updateLoanCalculator();
    });
    
    domElements.donationInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 200;
        value = Math.min(Math.max(value, 200), 50000);
        this.value = value;
        domElements.donationSlider.value = value;
        domElements.sliderValue.textContent = formatCurrency(value);
        updateLoanCalculator();
    });
    
    // Calculate button
    domElements.calculateBtn.addEventListener('click', () => {
        calculateLoan();
        animateCalculatorResults();
    });
    
    // Initialize with default values
    updateLoanCalculator();
}

function updateLoanCalculator() {
    const donation = parseInt(domElements.donationInput.value) || 200;
    const loanAmount = donation * 10;
    const peopleHelped = Math.floor(donation / 200);
    
    domElements.loanAccess.textContent = formatCurrency(loanAmount) + ' KSH';
    domElements.communityImpact.textContent = `${peopleHelped}+ people helped`;
}

function calculateLoan() {
    const donation = parseInt(domElements.donationInput.value);
    const loanAmount = donation * 10;
    const peopleHelped = Math.floor(donation / 200);
    
    // Show calculation animation
    domElements.calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    
    setTimeout(() => {
        domElements.loanAccess.textContent = formatCurrency(loanAmount) + ' KSH';
        domElements.communityImpact.textContent = `${peopleHelped}+ people helped`;
        domElements.calculateBtn.innerHTML = '<i class="fas fa-check"></i> Calculation Complete!';
        
        // Revert button text after 2 seconds
        setTimeout(() => {
            domElements.calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate Your Loan';
        }, 2000);
    }, 1000);
}

function animateCalculatorResults() {
    const results = document.querySelectorAll('.result-value');
    results.forEach(result => {
        result.style.transform = 'scale(1.1)';
        setTimeout(() => {
            result.style.transform = 'scale(1)';
        }, 300);
    });
}

// Testimonial Slider System
function initTestimonialSlider() {
    console.log('Initializing testimonial slider...');
    
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    const totalTestimonials = testimonials.length;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        currentTestimonial = index;
        testimonials[currentTestimonial].classList.add('active');
    }
    
    // Event listeners for testimonial controls
    domElements.prevTestimonialBtn.addEventListener('click', () => {
        currentTestimonial--;
        if (currentTestimonial < 0) currentTestimonial = totalTestimonials - 1;
        showTestimonial(currentTestimonial);
        resetTestimonialAutoPlay();
    });
    
    domElements.nextTestimonialBtn.addEventListener('click', () => {
        currentTestimonial++;
        if (currentTestimonial >= totalTestimonials) currentTestimonial = 0;
        showTestimonial(currentTestimonial);
        resetTestimonialAutoPlay();
    });
    
    // Auto-play functionality
    function startTestimonialAutoPlay() {
        appState.testimonialAutoPlay = setInterval(() => {
            currentTestimonial++;
            if (currentTestimonial >= totalTestimonials) currentTestimonial = 0;
            showTestimonial(currentTestimonial);
        }, 8000);
    }
    
    function resetTestimonialAutoPlay() {
        clearInterval(appState.testimonialAutoPlay);
        startTestimonialAutoPlay();
    }
    
    // Initialize auto-play
    startTestimonialAutoPlay();
    
    console.log(`Testimonial slider initialized with ${totalTestimonials} testimonials`);
}

// Dynamic Content Loading System
function initDynamicContent() {
    console.log('Initializing dynamic content system...');
    
    // Preload section templates
    loadSectionTemplates();
    
    // Handle initial page load
    window.addEventListener('load', () => {
        // Check for hash in URL
        const hash = window.location.hash.substring(1);
        if (hash && hash !== 'home') {
            loadSection(hash);
        }
    });
}

function loadSectionTemplates() {
    // Define section templates
    appState.sections = {
        about: getAboutSection(),
        products: getProductsSection(),
        quickloans: getQuickLoansSection(),
        businessloans: getBusinessLoansSection(),
        'donate-access': getDonateAccessSection(),
        borrow: getBorrowSection(),
        donate: getDonateSection(),
        contact: getContactSection(),
        careers: getCareersSection(),
        faqs: getFaqsSection()
    };
}

function loadSection(sectionId) {
    console.log(`Loading section: ${sectionId}`);
    
    // Update URL hash
    window.history.pushState({}, '', `#${sectionId}`);
    
    // Update app state
    appState.currentSection = sectionId;
    
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show home section or load dynamic content
    if (sectionId === 'home') {
        document.getElementById('home-section').classList.add('active');
        domElements.dynamicContent.innerHTML = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    // Load dynamic content
    const sectionTemplate = appState.sections[sectionId];
    if (sectionTemplate) {
        domElements.dynamicContent.innerHTML = sectionTemplate;
        
        // Add fade-in animation
        domElements.dynamicContent.style.animation = 'fadeIn 0.6s ease-out';
        
        // Initialize section-specific functionality
        initializeSection(sectionId);
        
        // Scroll to top of content
        setTimeout(() => {
            domElements.dynamicContent.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        domElements.dynamicContent.innerHTML = `
            <div class="dynamic-section" style="text-align: center; padding: 100px 20px;">
                <h2>Section Not Found</h2>
                <p>The requested section is not available.</p>
                <a href="#home" class="cta-button" data-section="home">Return to Home</a>
            </div>
        `;
    }
}

function initializeSection(sectionId) {
    switch(sectionId) {
        case 'faqs':
            initFAQs();
            break;
        case 'contact':
            initContactForm();
            break;
        case 'donate':
            initDonationForm();
            break;
    }
}

// Section Templates
function getAboutSection() {
    return `
        <section class="dynamic-section fade-in" id="about-section">
            <div class="container">
                <h1 class="section-title">About Microokoa Guaranty Capital</h1>
                
                <div class="about-content">
                    <div class="about-hero">
                        <div class="about-text">
                            <h2>Our Mission</h2>
                            <p>To empower communities through innovative, donation-based financing that creates sustainable economic growth and financial inclusion for all.</p>
                            
                            <h2>Our Vision</h2>
                            <p>A world where every individual has access to financial resources to grow their business and improve their livelihood, regardless of their banking status.</p>
                            
                            <h2>Our Model</h2>
                            <p>We operate on a unique community-powered financing model where donations from members create a lending pool that enables 10x loan access for contributors.</p>
                        </div>
                        
                        <div class="about-stats">
                            <div class="stat-card">
                                <h3>10x</h3>
                                <p>Loan Multiplier</p>
                            </div>
                            <div class="stat-card">
                                <h3>2 Hours</h3>
                                <p>Average Processing</p>
                            </div>
                            <div class="stat-card">
                                <h3>100%</h3>
                                <p>Community Reinvestment</p>
                            </div>
                            <div class="stat-card">
                                <h3>0%</h3>
                                <p>Public Deposits</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="values-section">
                        <h2>Our Core Values</h2>
                        <div class="values-grid">
                            <div class="value-card">
                                <i class="fas fa-users"></i>
                                <h3>Community First</h3>
                                <p>All profits are reinvested locally to support community development.</p>
                            </div>
                            <div class="value-card">
                                <i class="fas fa-shield-alt"></i>
                                <h3>Transparency</h3>
                                <p>Clear terms, no hidden fees, complete operational transparency.</p>
                            </div>
                            <div class="value-card">
                                <i class="fas fa-handshake"></i>
                                <h3>Trust</h3>
                                <p>Built on mutual trust between community members.</p>
                            </div>
                            <div class="value-card">
                                <i class="fas fa-rocket"></i>
                                <h3>Innovation</h3>
                                <p>Continuously improving our donation-based model.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="team-section">
                        <h2>Our Commitment</h2>
                        <div class="commitment-box">
                            <p><strong>We are a non-deposit-taking institution:</strong> We do NOT accept savings or deposits from the public. Our funds come solely from community donations that are then multiplied into loans.</p>
                            <p><strong>Regulatory Compliance:</strong> We operate within the guidelines set by relevant financial authorities in Kenya.</p>
                            <p><strong>Customer Protection:</strong> Your data and transactions are secured with bank-level encryption.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function getProductsSection() {
    return `
        <section class="dynamic-section fade-in" id="products-section">
            <div class="container">
                <h1 class="section-title">Our Loan Products</h1>
                <p class="section-subtitle">Tailored financing solutions for your needs</p>
                
                <div class="products-grid">
                    <!-- QuickLoans Card -->
                    <div class="product-card">
                        <div class="product-header">
                            <h3>QuickLoans</h3>
                            <p>Fast, small loans for immediate needs</p>
                        </div>
                        <div class="product-body">
                            <div class="product-amount">Up to Kshs 30,000</div>
                            <ul class="product-features">
                                <li>24-hour approval process</li>
                                <li>Emergency fund access</li>
                                <li>Flexible repayment options</li>
                                <li>Minimum donation: Kshs 200</li>
                                <li>10x loan multiplier</li>
                            </ul>
                            <div class="product-cta">
                                <a href="#quickloans" class="cta-button" data-section="quickloans">Learn More</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- BusinessLoans Card -->
                    <div class="product-card">
                        <div class="product-header">
                            <h3>BusinessLoans</h3>
                            <p>Capital for business expansion</p>
                        </div>
                        <div class="product-body">
                            <div class="product-amount">Up to Kshs 50,000</div>
                            <ul class="product-features">
                                <li>3–6 month repayment terms</li>
                                <li>Business training included</li>
                                <li>Inventory & equipment financing</li>
                                <li>Minimum donation: Kshs 500</li>
                                <li>Growth-focused support</li>
                            </ul>
                            <div class="product-cta">
                                <a href="#businessloans" class="cta-button" data-section="businessloans">Learn More</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Donate & Access Card -->
                    <div class="product-card">
                        <div class="product-header">
                            <h3>Donate & Access</h3>
                            <p>Community participation program</p>
                        </div>
                        <div class="product-body">
                            <div class="product-amount">10x Multiplier</div>
                            <ul class="product-features">
                                <li>Minimum donation: Kshs 200</li>
                                <li>Unlock borrowing potential</li>
                                <li>Build community capital</li>
                                <li>Help others while helping yourself</li>
                                <li>Transparent impact tracking</li>
                            </ul>
                            <div class="product-cta">
                                <a href="#donate-access" class="cta-button" data-section="donate-access">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="comparison-section">
                    <h2>Product Comparison</h2>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>QuickLoans</th>
                                    <th>BusinessLoans</th>
                                    <th>Donate & Access</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Maximum Amount</td>
                                    <td>Kshs 30,000</td>
                                    <td>Kshs 50,000</td>
                                    <td>10x Donation</td>
                                </tr>
                                <tr>
                                    <td>Processing Time</td>
                                    <td>24 hours</td>
                                    <td>48 hours</td>
                                    <td>2 hours</td>
                                </tr>
                                <tr>
                                    <td>Minimum Donation</td>
                                    <td>Kshs 200</td>
                                    <td>Kshs 500</td>
                                    <td>Kshs 200</td>
                                </tr>
                                <tr>
                                    <td>Repayment Period</td>
                                    <td>1-3 months</td>
                                    <td>3-6 months</td>
                                    <td>Flexible</td>
                                </tr>
                                <tr>
                                    <td>Business Training</td>
                                    <td>Basic</td>
                                    <td>Comprehensive</td>
                                    <td>Optional</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function getQuickLoansSection() {
    return `
        <section class="dynamic-section fade-in" id="quickloans-section">
            <div class="container">
                <div class="product-detail-header">
                    <h1 class="section-title">QuickLoans</h1>
                    <p class="section-subtitle">Fast access to emergency funds when you need them most</p>
                </div>
                
                <div class="product-detail-content">
                    <div class="detail-left">
                        <h2>What is QuickLoans?</h2>
                        <p>QuickLoans are designed for urgent financial needs that can't wait. Whether it's medical emergencies, school fees, or unexpected expenses, get the funds you need within 24 hours.</p>
                        
                        <h3>Key Benefits:</h3>
                        <ul class="benefits-list">
                            <li><i class="fas fa-bolt"></i> <strong>24-Hour Approval:</strong> Get approved and funded within one business day</li>
                            <li><i class="fas fa-mobile-alt"></i> <strong>Mobile Disbursement:</strong> Funds sent directly to your M-Pesa or Airtel Money</li>
                            <li><i class="fas fa-shield-alt"></i> <strong>No Collateral:</strong> No physical assets required as security</li>
                            <li><i class="fas fa-sync-alt"></i> <strong>Flexible Repayment:</strong> Choose repayment terms that work for you</li>
                            <li><i class="fas fa-chart-line"></i> <strong>Build Credit:</strong> Timely repayment improves your borrowing capacity</li>
                        </ul>
                        
                        <div class="eligibility-box">
                            <h3>Eligibility Requirements:</h3>
                            <ul>
                                <li>Kenyan citizen aged 18+</li>
                                <li>Active mobile money account (M-Pesa/Airtel Money)</li>
                                <li>Minimum donation of Kshs 200 to community fund</li>
                                <li>Valid national ID</li>
                                <li>Proof of income or business activity</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="detail-right">
                        <div class="calculator-mini">
                            <h3>Quick Loan Calculator</h3>
                            <div class="calculator-mini-content">
                                <div class="input-group">
                                    <label>Desired Loan Amount (KSH)</label>
                                    <input type="range" min="1000" max="30000" step="1000" value="10000" id="quickloan-slider">
                                    <div class="slider-value-mini">
                                        <span id="quickloan-value">10,000</span> KSH
                                    </div>
                                </div>
                                <div class="result-group">
                                    <div class="result-item-mini">
                                        <span>Required Donation:</span>
                                        <span id="required-donation">1,000 KSH</span>
                                    </div>
                                    <div class="result-item-mini">
                                        <span>Estimated Repayment (3 months):</span>
                                        <span id="estimated-repayment">11,000 KSH</span>
                                    </div>
                                </div>
                                <button class="cta-button apply-now-btn" onclick="loadSection('donate')">
                                    <i class="fas fa-paper-plane"></i> Apply Now
                                </button>
                            </div>
                        </div>
                        
                        <div class="process-steps">
                            <h3>Application Process</h3>
                            <ol>
                                <li>Make minimum donation (Kshs 200)</li>
                                <li>Complete online application</li>
                                <li>Upload required documents</li>
                                <li>Get approval within 24 hours</li>
                                <li>Receive funds via mobile money</li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div class="testimonial-quick">
                    <blockquote>
                        "I needed emergency funds for my daughter's school fees. I donated Kshs 500 in the morning and by evening I had Kshs 5,000 in my M-Pesa. Microokoa saved the day!"
                        <cite>- Jane Wanjiru, Nairobi</cite>
                    </blockquote>
                </div>
            </div>
        </section>
    `;
}

function getBusinessLoansSection() {
    return `
        <section class="dynamic-section fade-in" id="businessloans-section">
            <div class="container">
                <div class="product-detail-header">
                    <h1 class="section-title">BusinessLoans</h1>
                    <p class="section-subtitle">Fuel your business growth with capital for expansion and development</p>
                </div>
                
                <div class="product-detail-content">
                    <div class="detail-left">
                        <h2>Grow Your Enterprise</h2>
                        <p>BusinessLoans provide the capital you need to take your business to the next level. Whether it's purchasing inventory, upgrading equipment, or expanding operations, we're here to support your growth journey.</p>
                        
                        <div class="use-cases">
                            <h3>Common Use Cases:</h3>
                            <div class="use-case-grid">
                                <div class="use-case">
                                    <i class="fas fa-boxes"></i>
                                    <h4>Inventory Purchase</h4>
                                    <p>Stock up on products for peak seasons</p>
                                </div>
                                <div class="use-case">
                                    <i class="fas fa-tools"></i>
                                    <h4>Equipment Upgrade</h4>
                                    <p>Modernize your tools and machinery</p>
                                </div>
                                <div class="use-case">
                                    <i class="fas fa-store"></i>
                                    <h4>Business Expansion</h4>
                                    <p>Open new locations or increase capacity</p>
                                </div>
                                <div class="use-case">
                                    <i class="fas fa-graduation-cap"></i>
                                    <h4>Staff Training</h4>
                                    <p>Invest in your team's skills development</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="training-included">
                            <h3><i class="fas fa-chalkboard-teacher"></i> Business Training Included</h3>
                            <p>All BusinessLoan recipients receive complimentary access to our business development workshops covering:</p>
                            <ul>
                                <li>Financial management and record keeping</li>
                                <li>Marketing and customer acquisition</li>
                                <li>Inventory management best practices</li>
                                <li>Digital tools for small businesses</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="detail-right">
                        <div class="loan-options">
                            <h3>Loan Packages</h3>
                            <div class="package-option">
                                <h4>Starter Package</h4>
                                <div class="package-amount">Up to Kshs 20,000</div>
                                <ul>
                                    <li>3-month repayment term</li>
                                    <li>Basic business training</li>
                                    <li>Weekly repayment option</li>
                                </ul>
                                <div class="required-donation">Min. Donation: Kshs 2,000</div>
                            </div>
                            
                            <div class="package-option featured">
                                <h4>Growth Package</h4>
                                <div class="package-amount">Up to Kshs 35,000</div>
                                <ul>
                                    <li>4-month repayment term</li>
                                    <li>Comprehensive training</li>
                                    <li>Monthly repayment option</li>
                                    <li>Business mentoring</li>
                                </ul>
                                <div class="required-donation">Min. Donation: Kshs 3,500</div>
                            </div>
                            
                            <div class="package-option">
                                <h4>Expansion Package</h4>
                                <div class="package-amount">Up to Kshs 50,000</div>
                                <ul>
                                    <li>6-month repayment term</li>
                                    <li>Advanced business training</li>
                                    <li>Flexible repayment schedule</li>
                                    <li>Priority support</li>
                                </ul>
                                <div class="required-donation">Min. Donation: Kshs 5,000</div>
                            </div>
                        </div>
                        
                        <div class="success-metrics">
                            <h3>Business Impact Metrics</h3>
                            <div class="metric">
                                <div class="metric-value">87%</div>
                                <div class="metric-label">Report increased revenue</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">64%</div>
                                <div class="metric-label">Hired additional staff</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">92%</div>
                                <div class="metric-label">Would recommend to others</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="cta-section">
                    <h2>Ready to Grow Your Business?</h2>
                    <p>Take the first step toward business expansion today</p>
                    <div class="cta-buttons">
                        <a href="#donate" class="cta-button" data-section="donate">
                            <i class="fas fa-donate"></i> Start with Donation
                        </a>
                        <a href="#contact" class="cta-button secondary" data-section="contact">
                            <i class="fas fa-phone-alt"></i> Schedule Consultation
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function getDonateAccessSection() {
    return `
        <section class="dynamic-section fade-in" id="donate-access-section">
            <div class="container">
                <div class="product-detail-header">
                    <h1 class="section-title">Donate & Access Program</h1>
                    <p class="section-subtitle">Participate in community funding and unlock your borrowing potential</p>
                </div>
                
                <div class="donate-access-content">
                    <div class="explanation-box">
                        <h2>How It Works</h2>
                        <p>The Donate & Access program is the foundation of our community-powered financing model. When you donate to the community fund, you're not just giving—you're investing in your own and others' financial futures.</p>
                        
                        <div class="mechanism-diagram">
                            <div class="diagram-step">
                                <div class="step-number">1</div>
                                <h3>You Donate</h3>
                                <p>Contribute to the community fund (minimum Kshs 200)</p>
                            </div>
                            <div class="diagram-arrow">→</div>
                            <div class="diagram-step">
                                <div class="step-number">2</div>
                                <h3>Funds Pool</h3>
                                <p>Your donation joins others to create a lending pool</p>
                            </div>
                            <div class="diagram-arrow">→</div>
                            <div class="diagram-step">
                                <div class="step-number">3</div>
                                <h3>Loans Issued</h3>
                                <p>Community members access loans (10x their donation)</p>
                            </div>
                            <div class="diagram-arrow">→</div>
                            <div class="diagram-step">
                                <div class="step-number">4</div>
                                <h3>Repayment & Growth</h3>
                                <p>Loans repaid, fund grows, more loans possible</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="benefits-grid">
                        <div class="benefit-card">
                            <i class="fas fa-hand-holding-heart"></i>
                            <h3>Social Impact</h3>
                            <p>Your donation directly helps other community members access capital for their needs.</p>
                        </div>
                        <div class="benefit-card">
                            <i class="fas fa-unlock-alt"></i>
                            <h3>Access Unlocked</h3>
                            <p>Donating gives you access to loans worth 10x your contribution amount.</p>
                        </div>
                        <div class="benefit-card">
                            <i class="fas fa-chart-network"></i>
                            <h3>Community Growth</h3>
                            <p>As the community fund grows, larger loans become available to all members.</p>
                        </div>
                        <div class="benefit-card">
                            <i class="fas fa-eye"></i>
                            <h3>Full Transparency</h3>
                            <p>Track exactly how your donation is used and who it helps in our monthly reports.</p>
                        </div>
                    </div>
                    
                    <div class="impact-tracker">
                        <h2>Community Impact Tracker</h2>
                        <div class="tracker-stats">
                            <div class="tracker-stat">
                                <div class="stat-value" id="total-donations">Kshs 2,450,800</div>
                                <div class="stat-label">Total Donations Received</div>
                            </div>
                            <div class="tracker-stat">
                                <div class="stat-value" id="loans-issued">Kshs 24,508,000</div>
                                <div class="stat-label">Total Loans Issued (10x)</div>
                            </div>
                            <div class="tracker-stat">
                                <div class="stat-value" id="people-helped">1,842</div>
                                <div class="stat-label">Community Members Helped</div>
                            </div>
                            <div class="tracker-stat">
                                <div class="stat-value" id="repayment-rate">94.7%</div>
                                <div class="stat-label">Loan Repayment Rate</div>
                            </div>
                        </div>
                        
                        <div class="donation-tiers">
                            <h3>Donation Tiers & Benefits</h3>
                            <div class="tiers-grid">
                                <div class="tier">
                                    <h4>Basic Tier</h4>
                                    <div class="tier-amount">Kshs 200 - 999</div>
                                    <ul>
                                        <li>Access to QuickLoans</li>
                                        <li>Community newsletter</li>
                                        <li>Basic impact reports</li>
                                    </ul>
                                </div>
                                <div class="tier featured">
                                    <h4>Community Tier</h4>
                                    <div class="tier-amount">Kshs 1,000 - 4,999</div>
                                    <ul>
                                        <li>Access to BusinessLoans</li>
                                        <li>Priority loan processing</li>
                                        <li>Detailed impact reports</li>
                                        <li>Community voting rights</li>
                                    </ul>
                                </div>
                                <div class="tier">
                                    <h4>Partner Tier</h4>
                                    <div class="tier-amount">Kshs 5,000+</div>
                                    <ul>
                                        <li>All loan products access</li>
                                        <li>Exclusive community events</li>
                                        <li>Personal account manager</li>
                                        <li>Recognition in reports</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="transparency-section">
                        <h2><i class="fas fa-search-dollar"></i> Complete Transparency</h2>
                        <p>We believe in radical transparency. Every month, we publish a detailed report showing:</p>
                        <div class="transparency-list">
                            <div class="transparency-item">
                                <i class="fas fa-file-invoice-dollar"></i>
                                <span>All donations received (anonymous)</span>
                            </div>
                            <div class="transparency-item">
                                <i class="fas fa-hand-holding-usd"></i>
                                <span>All loans issued (anonymous)</span>
                            </div>
                            <div class="transparency-item">
                                <i class="fas fa-chart-pie"></i>
                                <span>Fund allocation breakdown</span>
                            </div>
                            <div class="transparency-item">
                                <i class="fas fa-user-check"></i>
                                <span>Repayment status updates</span>
                            </div>
                            <div class="transparency-item">
                                <i class="fas fa-bullseye"></i>
                                <span>Community impact metrics</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="get-started-box">
                    <h2>Ready to Join the Community?</h2>
                    <p>Start with a donation of any amount (minimum Kshs 200) and begin your journey with community-powered financing.</p>
                    <a href="#donate" class="cta-button large" data-section="donate">
                        <i class="fas fa-heart"></i> Make Your First Donation
                    </a>
                </div>
            </div>
        </section>
    `;
}

function getBorrowSection() {
    return `
        <section class="dynamic-section fade-in" id="borrow-section">
            <div class="container">
                <h1 class="section-title">Borrow from Microokoa</h1>
                <p class="section-subtitle">Access loans tailored to your needs through our community-powered model</p>
                
                <div class="borrow-options">
                    <div class="option-card large">
                        <div class="option-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <div class="option-content">
                            <h2>Need Funds Quickly?</h2>
                            <p>For emergencies and immediate financial needs</p>
                            <div class="option-highlights">
                                <div class="highlight">
                                    <i class="fas fa-clock"></i>
                                    <span>24-hour approval</span>
                                </div>
                                <div class="highlight">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>Mobile disbursement</span>
                                </div>
                                <div class="highlight">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>No collateral needed</span>
                                </div>
                            </div>
                            <div class="option-cta">
                                <a href="#quickloans" class="cta-button" data-section="quickloans">Apply for QuickLoan</a>
                                <a href="#donate" class="cta-button secondary" data-section="donate">Donate First</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="option-card large">
                        <div class="option-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="option-content">
                            <h2>Growing Your Business?</h2>
                            <p>Capital for expansion, inventory, and equipment</p>
                            <div class="option-highlights">
                                <div class="highlight">
                                    <i class="fas fa-graduation-cap"></i>
                                    <span>Business training included</span>
                                </div>
                                <div class="highlight">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span>3-6 month terms</span>
                                </div>
                                <div class="highlight">
                                    <i class="fas fa-handshake"></i>
                                    <span>Mentorship support</span>
                                </div>
                            </div>
                            <div class="option-cta">
                                <a href="#businessloans" class="cta-button" data-section="businessloans">Apply for BusinessLoan</a>
                                <a href="#contact" class="cta-button secondary" data-section="contact">Get Consultation</a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="borrow-process">
                    <h2>How to Borrow</h2>
                    <div class="process-steps-detailed">
                        <div class="process-step">
                            <div class="step-number">1</div>
                            <h3>Make a Donation</h3>
                            <p>Start by donating to the community fund (minimum Kshs 200). This activates your borrowing eligibility.</p>
                            <a href="#donate" class="step-link" data-section="donate">Make Donation →</a>
                        </div>
                        <div class="process-step">
                            <div class="step-number">2</div>
                            <h3>Choose Loan Product</h3>
                            <p>Select between QuickLoans for emergencies or BusinessLoans for growth.</p>
                            <a href="#products" class="step-link" data-section="products">Compare Products →</a>
                        </div>
                        <div class="process-step">
                            <div class="step-number">3</div>
                            <h3>Complete Application</h3>
                            <p>Fill our simple online application with required details and documents.</p>
                            <a href="#contact" class="step-link" data-section="contact">Start Application →</a>
                        </div>
                        <div class="process-step">
                            <div class="step-number">4</div>
                            <h3>Receive Funds</h3>
                            <p>Get approved and receive funds directly to your mobile money account.</p>
                            <a href="#faqs" class="step-link" data-section="faqs">Learn More →</a>
                        </div>
                    </div>
                </div>
                
                <div class="eligibility-checker">
                    <h2>Check Your Eligibility</h2>
                    <div class="checker-form">
                        <div class="form-group">
                            <label>Have you made a donation to the community fund?</label>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="donation" value="yes"> Yes
                                </label>
                                <label>
                                    <input type="radio" name="donation" value="no"> Not yet
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Do you have an active M-Pesa or Airtel Money account?</label>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="mobile-money" value="yes"> Yes
                                </label>
                                <label>
                                    <input type="radio" name="mobile-money" value="no"> No
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Are you 18 years or older?</label>
                            <div class="radio-group">
                                <label>
                                    <input type="radio" name="age" value="yes"> Yes
                                </label>
                                <label>
                                    <input type="radio" name="age" value="no"> No
                                </label>
                            </div>
                        </div>
                        <button class="cta-button" id="check-eligibility">
                            <i class="fas fa-check-circle"></i> Check Eligibility
                        </button>
                        <div id="eligibility-result" class="eligibility-result"></div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function getDonateSection() {
    return `
        <section class="dynamic-section fade-in" id="donate-section">
            <div class="container">
                <h1 class="section-title">Donate to the Community Fund</h1>
                <p class="section-subtitle">Your donation helps others and unlocks your borrowing potential</p>
                
                <div class="donation-content">
                    <div class="donation-left">
                        <div class="impact-calculator">
                            <h2>Calculate Your Impact</h2>
                            <div class="impact-input">
                                <label>Donation Amount (KSH)</label>
                                <div class="amount-options">
                                    <button class="amount-option" data-amount="200">Kshs 200</button>
                                    <button class="amount-option" data-amount="500">Kshs 500</button>
                                    <button class="amount-option" data-amount="1000">Kshs 1,000</button>
                                    <button class="amount-option" data-amount="2000">Kshs 2,000</button>
                                    <button class="amount-option" data-amount="5000">Kshs 5,000</button>
                                </div>
                                <div class="custom-amount">
                                    <input type="number" id="custom-amount" min="200" max="50000" placeholder="Custom amount" value="2000">
                                    <span class="currency">KSH</span>
                                </div>
                            </div>
                            
                            <div class="impact-results">
                                <div class="impact-result">
                                    <div class="impact-icon">
                                        <i class="fas fa-hand-holding-usd"></i>
                                    </div>
                                    <div class="impact-text">
                                        <h4>Loan Access Unlocked</h4>
                                        <p class="impact-value" id="unlocked-loan">Kshs 20,000</p>
                                    </div>
                                </div>
                                <div class="impact-result">
                                    <div class="impact-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="impact-text">
                                        <h4>People Helped</h4>
                                        <p class="impact-value" id="people-helped-count">10+</p>
                                    </div>
                                </div>
                                <div class="impact-result">
                                    <div class="impact-icon">
                                        <i class="fas fa-chart-network"></i>
                                    </div>
                                    <div class="impact-text">
                                        <h4>Community Growth</h4>
                                        <p class="impact-value" id="community-growth">Kshs 200,000+</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="payment-methods">
                            <h3>Payment Methods</h3>
                            <div class="method-options">
                                <div class="method-option active">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>M-Pesa</span>
                                </div>
                                <div class="method-option">
                                    <i class="fas fa-sim-card"></i>
                                    <span>Airtel Money</span>
                                </div>
                                <div class="method-option">
                                    <i class="fas fa-credit-card"></i>
                                    <span>Card Payment</span>
                                </div>
                            </div>
                            
                            <div class="payment-instructions">
                                <h4>To pay via M-Pesa:</h4>
                                <ol>
                                    <li>Go to Lipa na M-Pesa</li>
                                    <li>Select Pay Bill</li>
                                    <li>Enter Business No: <strong>123456</strong></li>
                                    <li>Enter Account No: <strong>DONATE</strong></li>
                                    <li>Enter Amount</li>
                                    <li>Enter your M-Pesa PIN</li>
                                    <li>Confirm payment</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    
                    <div class="donation-right">
                        <div class="donation-form">
                            <h2>Make Your Donation</h2>
                            <form id="donationForm">
                                <div class="form-group">
                                    <label for="donor-name">Full Name *</label>
                                    <input type="text" id="donor-name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="donor-phone">Phone Number *</label>
                                    <input type="tel" id="donor-phone" required placeholder="07XX XXX XXX">
                                </div>
                                
                                <div class="form-group">
                                    <label for="donor-email">Email Address</label>
                                    <input type="email" id="donor-email">
                                </div>
                                
                                <div class="form-group">
                                    <label for="donation-purpose">Purpose of Donation</label>
                                    <select id="donation-purpose">
                                        <option value="general">General Community Fund</option>
                                        <option value="quickloan">To Access QuickLoans</option>
                                        <option value="businessloan">To Access BusinessLoans</option>
                                        <option value="support">Just to Support Community</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label>Receive Updates</label>
                                    <div class="checkbox-group">
                                        <label>
                                            <input type="checkbox" checked>
                                            Send me monthly impact reports
                                        </label>
                                        <label>
                                            <input type="checkbox" checked>
                                            Notify me about community events
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <div class="terms-agreement">
                                        <label>
                                            <input type="checkbox" required>
                                            I agree to the <a href="#terms" onclick="loadSection('faqs')">Terms & Conditions</a>
                                        </label>
                                    </div>
                                </div>
                                
                                <button type="submit" class="cta-button large">
                                    <i class="fas fa-heart"></i> Complete Donation
                                </button>
                            </form>
                            
                            <div class="security-notice">
                                <i class="fas fa-lock"></i>
                                <span>Your donation is secure and protected</span>
                            </div>
                        </div>
                        
                        <div class="donation-benefits">
                            <h3>Benefits of Donating</h3>
                            <ul>
                                <li><i class="fas fa-check-circle"></i> Unlock 10x loan access</li>
                                <li><i class="fas fa-check-circle"></i> Join the community network</li>
                                <li><i class="fas fa-check-circle"></i> Receive impact reports</li>
                                <li><i class="fas fa-check-circle"></i> Priority loan processing</li>
                                <li><i class="fas fa-check-circle"></i> Community voting rights</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="donation-faq">
                    <h3>Common Questions</h3>
                    <div class="faq-items">
                        <div class="faq-item">
                            <div class="faq-question">
                                Is there a minimum donation amount?
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                Yes, the minimum donation is Kshs 200. This is to ensure administrative efficiency while keeping participation accessible.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">
                                When will I be able to borrow after donating?
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                Immediately! Once your donation is confirmed, you can apply for loans right away. The 10x multiplier applies to your total donations.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">
                                Can I donate multiple times?
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                Absolutely! You can donate as many times as you want. Each donation increases your total contribution and corresponding loan access.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function getContactSection() {
    return `
        <section class="dynamic-section fade-in" id="contact-section">
            <div class="container">
                <h1 class="section-title">Contact Us</h1>
                <p class="section-subtitle">Get in touch with our team for support, inquiries, or partnerships</p>
                
                <div class="contact-content">
                    <div class="contact-info-grid">
                        <div class="contact-info-card">
                            <div class="contact-icon">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <h3>Phone Support</h3>
                            <p>+254-710-340-896</p>
                            <p class="contact-hours">Mon-Fri: 8am-6pm EAT</p>
                            <a href="tel:+254710340896" class="contact-link">Call Now</a>
                        </div>
                        
                        <div class="contact-info-card">
                            <div class="contact-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <h3>Email Us</h3>
                            <p>microokoaguarantycapital@gmail.com</p>
                            <p class="contact-hours">Response within 24 hours</p>
                            <a href="mailto:microokoaguarantycapital@gmail.com" class="contact-link">Send Email</a>
                        </div>
                        
                        <div class="contact-info-card">
                            <div class="contact-icon">
                                <i class="fab fa-whatsapp"></i>
                            </div>
                            <h3>WhatsApp</h3>
                            <p>+254-710-340-896</p>
                            <p class="contact-hours">24/7 Chat Support</p>
                            <a href="https://wa.me/254710340896" target="_blank" class="contact-link">Start Chat</a>
                        </div>
                        
                        <div class="contact-info-card">
                            <div class="contact-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>Visit Us</h3>
                            <p>Nairobi, Kenya</p>
                            <p class="contact-hours">By appointment only</p>
                            <a href="#contact-form" class="contact-link">Schedule Visit</a>
                        </div>
                    </div>
                    
                    <div class="contact-form-section">
                        <div class="form-container">
                            <h2>Send Us a Message</h2>
                            <form id="contactForm">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="contact-name">Full Name *</label>
                                        <input type="text" id="contact-name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="contact-phone">Phone Number *</label>
                                        <input type="tel" id="contact-phone" required>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact-email">Email Address *</label>
                                    <input type="email" id="contact-email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact-subject">What are you interested in? *</label>
                                    <select id="contact-subject" required>
                                        <option value="">Select an option</option>
                                        <option value="donation">Making a Donation</option>
                                        <option value="quickloan">QuickLoan Application</option>
                                        <option value="businessloan">BusinessLoan Application</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="partnership">Partnership Opportunity</option>
                                        <option value="support">Customer Support</option>
                                        <option value="career">Career Opportunity</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="contact-message">Message *</label>
                                    <textarea id="contact-message" rows="5" required></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <div class="checkbox-group">
                                        <label>
                                            <input type="checkbox" required>
                                            I agree to the privacy policy and terms of service
                                        </label>
                                    </div>
                                </div>
                                
                                <button type="submit" class="cta-button large">
                                    <i class="fas fa-paper-plane"></i> Send Message
                                </button>
                            </form>
                        </div>
                        
                        <div class="response-time">
                            <h3><i class="fas fa-clock"></i> Typical Response Times</h3>
                            <ul>
                                <li><strong>Loan Applications:</strong> 24 hours</li>
                                <li><strong>Donation Inquiries:</strong> 2 hours</li>
                                <li><strong>General Questions:</strong> 6 hours</li>
                                <li><strong>Partnership Requests:</strong> 48 hours</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="social-contact">
                        <h2>Connect With Us on Social Media</h2>
                        <div class="social-buttons">
                            <a href="#" class="social-button twitter">
                                <i class="fab fa-twitter"></i>
                                <span>Twitter: @MicrookoaGuaCap</span>
                            </a>
                            <a href="#" class="social-button facebook">
                                <i class="fab fa-facebook-f"></i>
                                <span>Facebook: Microokoa Guaranty Capital</span>
                            </a>
                            <a href="#" class="social-button youtube">
                                <i class="fab fa-youtube"></i>
                                <span>YouTube: Microokoa Channel</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function getCareersSection() {
    return `
        <section class="dynamic-section fade-in" id="careers-section">
            <div class="container">
                <h1 class="section-title">Careers at Microokoa</h1>
                <p class="section-subtitle">Join our mission to empower communities through innovative financing</p>
                
                <div class="careers-intro">
                    <div class="intro-content">
                        <h2>Why Work With Us?</h2>
                        <p>At Microokoa Guaranty Capital, we're not just building a company—we're building a movement. We believe in financial inclusion, community empowerment, and innovative solutions that make a real difference in people's lives.</p>
                        
                        <div class="culture-highlights">
                            <div class="culture-item">
                                <i class="fas fa-bullseye"></i>
                                <h4>Purpose-Driven Work</h4>
                                <p>Every role contributes directly to community development</p>
                            </div>
                            <div class="culture-item">
                                <i class="fas fa-users"></i>
                                <h4>Collaborative Culture</h4>
                                <p>Work with passionate professionals who share your values</p>
                            </div>
                            <div class="culture-item">
                                <i class="fas fa-chart-line"></i>
                                <h4>Growth Opportunities</h4>
                                <p>Continuous learning and career advancement</p>
                            </div>
                            <div class="culture-item">
                                <i class="fas fa-balance-scale"></i>
                                <h4>Work-Life Balance</h4>
                                <p>Flexible arrangements and supportive environment</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="job-listings">
                    <h2>Current Openings</h2>
                    
                    <div class="job-card">
                        <div class="job-header">
                            <h3>Community Relations Officer</h3>
                            <div class="job-meta">
                                <span><i class="fas fa-map-marker-alt"></i> Nairobi</span>
                                <span><i class="fas fa-briefcase"></i> Full-time</span>
                                <span><i class="fas fa-clock"></i> Posted 2 days ago</span>
                            </div>
                        </div>
                        <div class="job-body">
                            <h4>Role Overview:</h4>
                            <p>Build and maintain relationships with community members, educate about our donation-based model, and facilitate loan applications.</p>
                            
                            <h4>Responsibilities:</h4>
                            <ul>
                                <li>Engage with community members and explain our model</li>
                                <li>Assist with donation and loan applications</li>
                                <li>Organize community workshops and training sessions</li>
                                <li>Collect feedback and report on community needs</li>
                                <li>Build partnerships with local organizations</li>
                            </ul>
                            
                            <h4>Requirements:</h4>
                            <ul>
                                <li>Degree in Community Development, Social Work, or related field</li>
                                <li>2+ years experience in community engagement</li>
                                <li>Excellent communication skills in Swahili and English</li>
                                <li>Understanding of microfinance or community banking</li>
                                <li>Passion for financial inclusion and community development</li>
                            </ul>
                            
                            <div class="job-cta">
                                <a href="#contact" class="cta-button" data-section="contact">
                                    <i class="fas fa-paper-plane"></i> Apply Now
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="job-card">
                        <div class="job-header">
                            <h3>Digital Marketing Specialist</h3>
                            <div class="job-meta">
                                <span><i class="fas fa-map-marker-alt"></i> Remote</span>
                                <span><i class="fas fa-briefcase"></i> Full-time</span>
                                <span><i class="fas fa-clock"></i> Posted 5 days ago</span>
                            </div>
                        </div>
                        <div class="job-body">
                            <h4>Role Overview:</h4>
                            <p>Drive our digital presence and customer acquisition through strategic marketing campaigns and content creation.</p>
                            
                            <h4>Responsibilities:</h4>
                            <ul>
                                <li>Develop and execute digital marketing strategies</li>
                                <li>Manage social media platforms and content calendar</li>
                                <li>Create engaging content about our community impact</li>
                                <li>Analyze campaign performance and optimize results</li>
                                <li>Collaborate with community team for local outreach</li>
                            </ul>
                            
                            <h4>Requirements:</h4>
                            <ul>
                                <li>3+ years experience in digital marketing</li>
                                <li>Proven track record with social media campaigns</li>
                                <li>Experience with analytics tools (Google Analytics, etc.)</li>
                                <li>Excellent writing and communication skills</li>
                                <li>Understanding of the Kenyan digital landscape</li>
                            </ul>
                            
                            <div class="job-cta">
                                <a href="#contact" class="cta-button" data-section="contact">
                                    <i class="fas fa-paper-plane"></i> Apply Now
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="job-card">
                        <div class="job-header">
                            <h3>Loan Processing Officer</h3>
                            <div class="job-meta">
                                <span><i class="fas fa-map-marker-alt"></i> Nairobi</span>
                                <span><i class="fas fa-briefcase"></i> Full-time</span>
                                <span><i class="fas fa-clock"></i> Posted 1 week ago</span>
                            </div>
                        </div>
                        <div class="job-body">
                            <h4>Role Overview:</h4>
                            <p>Process loan applications efficiently while ensuring compliance and excellent customer service.</p>
                            
                            <h4>Responsibilities:</h4>
                            <ul>
                                <li>Review and process loan applications</li>
                                <li>Verify applicant information and documents</li>
                                <li>Coordinate with mobile money partners for disbursements</li>
                                <li>Maintain accurate records and reports</li>
                                <li>Provide updates to applicants throughout the process</li>
                            </ul>
                            
                            <h4>Requirements:</h4>
                            <ul>
                                <li>Degree in Finance, Business, or related field</li>
                                <li>2+ years experience in loan processing or microfinance</li>
                                <li>Attention to detail and analytical skills</li>
                                <li>Knowledge of regulatory requirements</li>
                                <li>Excellent organizational and communication skills</li>
                            </ul>
                            
                            <div class="job-cta">
                                <a href="#contact" class="cta-button" data-section="contact">
                                    <i class="fas fa-paper-plane"></i> Apply Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="application-process">
                    <h2>Our Hiring Process</h2>
                    <div class="process-steps-career">
                        <div class="process-step-career">
                            <div class="step-number-career">1</div>
                            <h3>Application Review</h3>
                            <p>We review all applications within 5 business days</p>
                        </div>
                        <div class="process-step-career">
                            <div class="step-number-career">2</div>
                            <h3>Initial Interview</h3>
                            <p>30-minute video call with hiring manager</p>
                        </div>
                        <div class="process-step-career">
                            <div class="step-number-career">3</div>
                            <h3>Skills Assessment</h3>
                            <p>Practical task related to the role</p>
                        </div>
                        <div class="process-step-career">
                            <div class="step-number-career">4</div>
                            <h3>Final Interview</h3>
                            <p>Meeting with team members and leadership</p>
                        </div>
                        <div class="process-step-career">
                            <div class="step-number-career">5</div>
                            <h3>Offer & Onboarding</h3>
                            <p>Welcome to the Microokoa family!</p>
                        </div>
                    </div>
                </div>
                
                <div class="general-application">
                    <h2>Don't See Your Dream Role?</h2>
                    <p>We're always looking for talented individuals who share our mission. Send us your CV and tell us how you can contribute to our team.</p>
                    <a href="#contact" class="cta-button secondary" data-section="contact">
                        <i class="fas fa-upload"></i> Submit General Application
                    </a>
                </div>
            </div>
        </section>
    `;
}

function getFaqsSection() {
    return `
        <section class="dynamic-section fade-in" id="faqs-section">
            <div class="container">
                <h1 class="section-title">Frequently Asked Questions</h1>
                <p class="section-subtitle">Find answers to common questions about our donation-based financing model</p>
                
                <div class="faq-categories">
                    <div class="category-tabs">
                        <button class="category-tab active" data-category="general">General Questions</button>
                        <button class="category-tab" data-category="donations">Donations</button>
                        <button class="category-tab" data-category="loans">Loans</button>
                        <button class="category-tab" data-category="security">Security & Trust</button>
                    </div>
                    
                    <div class="faq-category-content">
                        <!-- General Questions -->
                        <div class="faq-category active" id="general-category">
                            <div class="faq-item expanded">
                                <div class="faq-question">
                                    What is Microokoa Guaranty Capital?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>Microokoa Guaranty Capital is a community development financial institution (CDFI) that operates on a unique donation-based financing model. We enable community members to donate to a shared fund and then access loans worth 10x their donation amount. We are a non-deposit-taking institution focused on financial inclusion.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    How does the donation-based model work?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>Our model is simple:</p>
                                    <ol>
                                        <li>You donate any amount (minimum Kshs 200) to the community fund</li>
                                        <li>Your donation pools with others to create a lending capital</li>
                                        <li>You can then access loans worth 10x your total donations</li>
                                        <li>Loan repayments go back into the fund, allowing more loans</li>
                                        <li>The cycle continues, helping more community members</li>
                                    </ol>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    Are you a bank or SACCO?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>No, we are not a bank, SACCO, or deposit-taking institution. We do NOT accept savings or deposits from the public. We operate as a community development financial institution with a unique donation-based model that focuses on peer-to-peer community financing rather than traditional banking.</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Donations Category -->
                        <div class="faq-category" id="donations-category">
                            <div class="faq-item">
                                <div class="faq-question">
                                    What is the minimum donation amount?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>The minimum donation is Kshs 200. This low threshold ensures that everyone can participate in the community fund, regardless of their financial situation. You can donate more to increase your loan access potential.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    How do I make a donation?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>You can donate through multiple channels:</p>
                                    <ol>
                                        <li><strong>M-Pesa:</strong> Go to Lipa na M-Pesa → Pay Bill → Business No: 123456 → Account: DONATE</li>
                                        <li><strong>Airtel Money:</strong> Send money to Till No: 987654</li>
                                        <li><strong>Online:</strong> Use our secure donation portal on this website</li>
                                        <li><strong>Card Payment:</strong> Visa/Mastercard payments accepted online</li>
                                    </ol>
                                    <p>After donating, make sure to register your details so we can link the donation to your account.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    Can I get my donation back?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>Donations to the community fund are not refundable as they become part of the collective lending pool. However, your donation gives you access to loans worth 10x the amount, effectively multiplying your contribution's value. Think of it as converting your donation into loan access credit rather than a traditional deposit.</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Loans Category -->
                        <div class="faq-category" id="loans-category">
                            <div class="faq-item">
                                <div class="faq-question">
                                    How much can I borrow?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>You can borrow up to 10x your total donations. For example:</p>
                                    <ul>
                                        <li>Donate Kshs 200 → Borrow up to Kshs 2,000</li>
                                        <li>Donate Kshs 1,000 → Borrow up to Kshs 10,000</li>
                                        <li>Donate Kshs 5,000 → Borrow up to Kshs 50,000</li>
                                    </ul>
                                    <p>There are product-specific maximums: QuickLoans up to Kshs 30,000 and BusinessLoans up to Kshs 50,000.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    How long does loan processing take?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>Processing times vary by product:</p>
                                    <ul>
                                        <li><strong>QuickLoans:</strong> 24 hours or less for emergencies</li>
                                        <li><strong>BusinessLoans:</strong> 48 hours for standard processing</li>
                                        <li><strong>Donation verification:</strong> 2 hours after payment confirmation</li>
                                    </ul>
                                    <p>We pride ourselves on fast processing to meet urgent financial needs.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    What are the interest rates?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>We don't charge traditional interest rates. Instead, we have a small service fee that covers operational costs and contributes to the community fund's growth. The fee structure is:</p>
                                    <ul>
                                        <li><strong>QuickLoans:</strong> 10% fee added to principal</li>
                                        <li><strong>BusinessLoans:</strong> 15% fee added to principal</li>
                                    </ul>
                                    <p>For example, a Kshs 10,000 QuickLoan would require repayment of Kshs 11,000 over the agreed term. All fees are transparently displayed before you accept any loan.</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Security & Trust Category -->
                        <div class="faq-category" id="security-category">
                            <div class="faq-item">
                                <div class="faq-question">
                                    Is my money safe with Microokoa?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>Yes, we implement multiple security measures:</p>
                                    <ul>
                                        <li><strong>SSL Encryption:</strong> All online transactions are encrypted</li>
                                        <li><strong>Secure Partnerships:</strong> We work with licensed mobile money providers</li>
                                        <li><strong>Regular Audits:</strong> Independent financial audits conducted quarterly</li>
                                        <li><strong>Transparent Reporting:</strong> Monthly public reports on fund status</li>
                                        <li><strong>Regulatory Compliance:</strong> We operate within all applicable regulations</li>
                                    </ul>
                                    <p>However, please remember we are NOT a deposit-taking institution. Your donation becomes part of the community lending pool.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    Do you accept savings from the public?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p><strong>NO.</strong> We do NOT accept savings or deposits from the public. We are not licensed as a deposit-taking institution. The only funds we receive are donations to the community fund, which are then used to provide loans to community members. This is a crucial distinction that sets us apart from banks and SACCOs.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    What happens if I can't repay my loan?
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="faq-answer">
                                    <p>We understand that circumstances can change. If you're facing difficulties:</p>
                                    <ol>
                                        <li><strong>Contact us immediately:</strong> Don't wait until you default</li>
                                        <li><strong>We offer flexibility:</strong> We can restructure your repayment plan</li>
                                        <li><strong>Community support:</strong> We connect you with community resources</li>
                                        <li><strong>Grace periods:</strong> We offer short grace periods for genuine cases</li>
                                    </ol>
                                    <p>Our approach is supportive rather than punitive. However, consistent default affects your future loan access and the community fund's health.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="still-have-questions">
                    <h2>Still Have Questions?</h2>
                    <p>Can't find what you're looking for? Our team is here to help.</p>
                    <div class="contact-options">
                        <a href="#contact" class="cta-button" data-section="contact">
                            <i class="fas fa-envelope"></i> Contact Support
                        </a>
                        <a href="tel:+254710340896" class="cta-button secondary">
                            <i class="fas fa-phone-alt"></i> Call Now: +254-710-340-896
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Helper Functions
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function initFAQs() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Close other FAQs in same category
            const category = faqItem.closest('.faq-category');
            const otherFaqs = category.querySelectorAll('.faq-item');
            otherFaqs.forEach(otherFaq => {
                if (otherFaq !== faqItem) {
                    otherFaq.classList.remove('expanded');
                    otherFaq.querySelector('.faq-answer').classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            faqItem.classList.toggle('expanded');
            answer.classList.toggle('active');
        });
    });
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected category
            const categories = document.querySelectorAll('.faq-category');
            categories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === `${category}-category`) {
                    cat.classList.add('active');
                }
            });
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('contact-name').value,
                phone: document.getElementById('contact-phone').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // In a real application, this would be an API call
                console.log('Form submitted:', formData);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.backgroundColor = '#28a745';
                
                // Reset form
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                    
                    // Show success notification
                    showNotification('Message sent successfully! We\'ll respond within 24 hours.', 'success');
                }, 2000);
            }, 1500);
        });
    }
}

function initDonationForm() {
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get donation amount
            const customAmount = document.getElementById('custom-amount');
            const amount = customAmount ? parseInt(customAmount.value) : 2000;
            
            // Simulate donation processing
            const submitBtn = donationForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Donation...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // In a real application, this would redirect to payment gateway
                console.log(`Processing donation of Kshs ${amount}`);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Donation Complete!';
                submitBtn.style.backgroundColor = '#28a745';
                
                // Show success notification with loan access info
                const loanAccess = amount * 10;
                showNotification(
                    `Thank you! Your donation of Kshs ${formatCurrency(amount)} has been received. ` +
                    `You now have access to loans up to Kshs ${formatCurrency(loanAccess)}.`,
                    'success'
                );
                
                // Reset form after delay
                setTimeout(() => {
                    donationForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        });
        
        // Amount option buttons
        const amountOptions = document.querySelectorAll('.amount-option');
        const customAmountInput = document.getElementById('custom-amount');
        
        amountOptions.forEach(option => {
            option.addEventListener('click', function() {
                const amount = parseInt(this.getAttribute('data-amount'));
                if (customAmountInput) {
                    customAmountInput.value = amount;
                    updateDonationImpact(amount);
                }
                
                // Update active state
                amountOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Custom amount input
        if (customAmountInput) {
            customAmountInput.addEventListener('input', function() {
                const amount = parseInt(this.value) || 200;
                updateDonationImpact(amount);
                
                // Remove active state from amount options
                amountOptions.forEach(opt => opt.classList.remove('active'));
            });
        }
        
        // Payment method selection
        const methodOptions = document.querySelectorAll('.method-option');
        methodOptions.forEach(option => {
            option.addEventListener('click', function() {
                methodOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

function updateDonationImpact(amount) {
    const loanAccess = amount * 10;
    const peopleHelped = Math.floor(amount / 200);
    const communityGrowth = amount * 100; // Simulated community impact
    
    // Update impact display
    const unlockedLoan = document.getElementById('unlocked-loan');
    const peopleHelpedCount = document.getElementById('people-helped-count');
    const communityGrowthEl = document.getElementById('community-growth');
    
    if (unlockedLoan) unlockedLoan.textContent = `Kshs ${formatCurrency(loanAccess)}`;
    if (peopleHelpedCount) peopleHelpedCount.textContent = `${peopleHelped}+`;
    if (communityGrowthEl) communityGrowthEl.textContent = `Kshs ${formatCurrency(communityGrowth)}+`;
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Initialize Event Listeners
function initEventListeners() {
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Scroll handler for sticky header
    window.addEventListener('scroll', handleScroll);
    
    // Back/forward button handler
    window.addEventListener('popstate', handlePopState);
    
    // Eligibility checker
    const checkEligibilityBtn = document.getElementById('check-eligibility');
    if (checkEligibilityBtn) {
        checkEligibilityBtn.addEventListener('click', checkEligibility);
    }
    
    // Quick loan calculator in QuickLoans section
    const quickloanSlider = document.getElementById('quickloan-slider');
    if (quickloanSlider) {
        quickloanSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            const quickloanValue = document.getElementById('quickloan-value');
            const requiredDonation = document.getElementById('required-donation');
            const estimatedRepayment = document.getElementById('estimated-repayment');
            
            if (quickloanValue) quickloanValue.textContent = formatCurrency(value);
            if (requiredDonation) requiredDonation.textContent = formatCurrency(value / 10) + ' KSH';
            if (estimatedRepayment) estimatedRepayment.textContent = formatCurrency(Math.round(value * 1.1)) + ' KSH';
        });
    }
}

function handleResize() {
    // Adjust header height for mobile
    if (window.innerWidth <= 992) {
        domElements.header.style.height = '70px';
        domElements.heroSlider.style.marginTop = '70px';
    } else {
        domElements.header.style.height = '100px';
        domElements.heroSlider.style.marginTop = '100px';
    }
    
    // Close mobile menu if resizing to desktop
    if (window.innerWidth > 992 && domElements.mainNav.classList.contains('active')) {
        closeMobileMenu();
    }
}

function handleScroll() {
    const scrollPosition = window.scrollY;
    
    // Add shadow to header when scrolled
    if (scrollPosition > 50) {
        domElements.header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        domElements.header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
}

function handlePopState() {
    const hash = window.location.hash.substring(1) || 'home';
    loadSection(hash);
}

function checkEligibility() {
    const donation = document.querySelector('input[name="donation"]:checked');
    const mobileMoney = document.querySelector('input[name="mobile-money"]:checked');
    const age = document.querySelector('input[name="age"]:checked');
    
    const resultEl = document.getElementById('eligibility-result');
    
    if (!donation || !mobileMoney || !age) {
        resultEl.innerHTML = '<div class="result-error">Please answer all questions</div>';
        return;
    }
    
    const isEligible = donation.value === 'yes' && 
                      mobileMoney.value === 'yes' && 
                      age.value === 'yes';
    
    if (isEligible) {
        resultEl.innerHTML = `
            <div class="result-success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Congratulations! You're eligible.</h4>
                    <p>You can proceed to apply for loans. Start by making a donation if you haven't already.</p>
                    <div class="result-actions">
                        <a href="#donate" class="cta-button small" data-section="donate">Make Donation</a>
                        <a href="#products" class="cta-button small secondary" data-section="products">View Loan Products</a>
                    </div>
                </div>
            </div>
        `;
    } else {
        let message = '';
        if (donation.value === 'no') message += '• Make a donation to the community fund first<br>';
        if (mobileMoney.value === 'no') message += '• You need an active M-Pesa or Airtel Money account<br>';
        if (age.value === 'no') message += '• You must be 18 years or older<br>';
        
        resultEl.innerHTML = `
            <div class="result-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h4>Not eligible yet</h4>
                    <p>${message}</p>
                    <div class="result-actions">
                        <a href="#faqs" class="cta-button small" data-section="faqs">Learn Requirements</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Add CSS for notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 120px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        padding: 15px 20px;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid var(--primary-green);
        min-width: 300px;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left-color: #28a745;
    }
    
    .notification.warning {
        border-left-color: #ffc107;
    }
    
    .notification.error {
        border-left-color: #dc3545;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 20px;
    }
    
    .notification.success .notification-content i {
        color: #28a745;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--dark-gray);
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
    }
    
    .result-success, .result-warning, .result-error {
        padding: 15px;
        border-radius: 4px;
        margin-top: 15px;
        display: flex;
        gap: 10px;
        align-items: flex-start;
    }
    
    .result-success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    
    .result-warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }
    
    .result-error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .result-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    
    .cta-button.small {
        padding: 8px 16px;
        font-size: 13px;
    }
`;

// Add notification styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// PWA Functionality
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        this.init();
    }
    
    init() {
        console.log('PWA Manager Initializing...');
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupNetworkStatus();
        this.setupSplashScreen();
        this.setupShareTarget();
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful:', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            console.log('New service worker found:', newWorker);
                            
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    this.showUpdatePrompt();
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    }
    
    setupInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.deferredPrompt = null;
            this.hideInstallPrompt();
            this.showNotification('Microokoa app installed successfully!', 'success');
        });
        
        // Check if already installed
        if (this.isStandalone) {
            console.log('App is running in standalone mode');
            this.hideInstallPrompt();
        }
    }
    
    setupNetworkStatus() {
        // Online/offline detection
        window.addEventListener('online', () => {
            console.log('App is online');
            this.hideOfflineBanner();
            this.showNotification('You are back online', 'success');
        });
        
        window.addEventListener('offline', () => {
            console.log('App is offline');
            this.showOfflineBanner();
            this.showNotification('You are offline. Some features may not work.', 'warning');
        });
        
        // Initial check
        if (!navigator.onLine) {
            this.showOfflineBanner();
        }
    }
    
    setupSplashScreen() {
        // Show splash screen for 2 seconds
        setTimeout(() => {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.classList.add('hide');
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 300);
            }
        }, 2000);
    }
    
    setupShareTarget() {
        // Handle share target if app was launched via Web Share Target API
        if (window.location.search.includes('share-target')) {
            this.showShareTarget();
        }
    }
    
    showInstallPrompt() {
        // Create install prompt if it doesn't exist
        if (!document.getElementById('pwa-install-prompt')) {
            const promptHTML = `
                <div class="pwa-install-prompt" id="pwa-install-prompt">
                    <div class="prompt-content">
                        <h4>Install Microokoa App</h4>
                        <p>Get faster access to loans and donations. Install our app for the best experience.</p>
                    </div>
                    <div class="pwa-install-buttons">
                        <button class="pwa-install-btn" id="install-pwa-btn">Install</button>
                        <button class="pwa-install-btn pwa-dismiss-btn" id="dismiss-install-btn">Not Now</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', promptHTML);
            
            // Add event listeners
            document.getElementById('install-pwa-btn').addEventListener('click', () => {
                this.installPWA();
            });
            
            document.getElementById('dismiss-install-btn').addEventListener('click', () => {
                this.hideInstallPrompt();
            });
        }
        
        // Show the prompt
        const prompt = document.getElementById('pwa-install-prompt');
        prompt.classList.add('show');
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (prompt.classList.contains('show')) {
                this.hideInstallPrompt();
            }
        }, 10000);
    }
    
    hideInstallPrompt() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.classList.remove('show');
        }
        
        // Also hide install button in header
        const installBtn = document.getElementById('install-app-btn');
        if (installBtn) {
            installBtn.classList.remove('show');
        }
    }
    
    installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                this.deferredPrompt = null;
            });
        }
        
        this.hideInstallPrompt();
    }
    
    showOfflineBanner() {
        // Create offline banner if it doesn't exist
        if (!document.getElementById('offline-banner')) {
            const bannerHTML = `
                <div class="offline-banner" id="offline-banner">
                    <span>You are currently offline. Some features may not be available.</span>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', bannerHTML);
        }
        
        // Show the banner
        const banner = document.getElementById('offline-banner');
        banner.classList.add('show');
    }
    
    hideOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }
    
    showUpdatePrompt() {
        const shouldUpdate = confirm('A new version of Microokoa is available. Would you like to update now?');
        if (shouldUpdate) {
            window.location.reload();
        }
    }
    
    showShareTarget() {
        // Create share target modal
        const shareModalHTML = `
            <div class="share-target show" id="share-target">
                <div class="share-target-content">
                    <h3 class="share-target-title">Share with Microokoa</h3>
                    <form class="share-target-form" id="share-target-form">
                        <div class="form-group">
                            <label for="share-title">Title</label>
                            <input type="text" id="share-title" name="title">
                        </div>
                        <div class="form-group">
                            <label for="share-text">Message</label>
                            <textarea id="share-text" name="text" rows="4"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="share-url">URL</label>
                            <input type="url" id="share-url" name="url">
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="cta-button">Share</button>
                            <button type="button" class="cta-button secondary" id="cancel-share">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', shareModalHTML);
        
        // Parse shared data from URL
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById('share-title').value = urlParams.get('title') || '';
        document.getElementById('share-text').value = urlParams.get('text') || '';
        document.getElementById('share-url').value = urlParams.get('url') || '';
        
        // Add event listeners
        document.getElementById('share-target-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleShareSubmit();
        });
        
        document.getElementById('cancel-share').addEventListener('click', () => {
            this.hideShareTarget();
        });
    }
    
    hideShareTarget() {
        const shareTarget = document.getElementById('share-target');
        if (shareTarget) {
            shareTarget.classList.remove('show');
            setTimeout(() => {
                shareTarget.remove();
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 300);
        }
    }
    
    handleShareSubmit() {
        const title = document.getElementById('share-title').value;
        const text = document.getElementById('share-text').value;
        const url = document.getElementById('share-url').value;
        
        console.log('Sharing content:', { title, text, url });
        
        // Here you would typically send this to your backend
        // For now, just show a success message
        this.showNotification('Content shared successfully!', 'success');
        this.hideShareTarget();
        
        // Redirect to appropriate section
        if (url.includes('donate')) {
            loadSection('donate');
        } else if (url.includes('loan')) {
            loadSection('products');
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
                if (permission === 'granted') {
                    this.showNotification('Notifications enabled! You\'ll get updates about your loans and donations.', 'success');
                }
            });
        }
    }
    
    syncBackgroundData() {
        if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('donation-sync').then(() => {
                    console.log('Background sync registered');
                }).catch(error => {
                    console.log('Background sync registration failed:', error);
                });
            });
        }
    }
    
    checkForUpdate() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update();
            });
        }
    }
    
    getAppUsageStats() {
        if ('getInstalledRelatedApps' in navigator) {
            navigator.getInstalledRelatedApps().then(apps => {
                console.log('Installed related apps:', apps);
            });
        }
    }
}

// Initialize PWA Manager
let pwaManager;

function initPWA() {
    pwaManager = new PWAManager();
    
    // Add install button to header
    const headerCTA = document.querySelector('.header-cta');
    if (headerCTA && !pwaManager.isStandalone) {
        const installBtnHTML = `
            <button class="install-app-btn" id="install-app-btn">
                <i class="fas fa-download"></i> Install App
            </button>
        `;
        headerCTA.insertAdjacentHTML('beforeend', installBtnHTML);
        
        document.getElementById('install-app-btn').addEventListener('click', () => {
            pwaManager.installPWA();
        });
        
        // Show install button if deferred prompt exists
        if (pwaManager.deferredPrompt) {
            document.getElementById('install-app-btn').classList.add('show');
        }
    }
    
    // Add splash screen
    const splashHTML = `
        <div class="splash-screen" id="splash-screen">
            <img src="assets/logo.svg" alt="Microokoa" class="splash-logo">
            <div class="splash-text">Microokoa Guaranty Capital</div>
            <div class="splash-loading"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', splashHTML);
}

// Update the initApp function to include PWA initialization
function initApp() {
    console.log('Microokoa Guaranty Capital Website Initializing...');
    
    // Initialize PWA first
    initPWA();
    
    // Then initialize all other modules
    initNavigation();
    initHeroSlider();
    initLoanCalculator();
    initTestimonialSlider();
    initDynamicContent();
    initEventListeners();
    
    // Set initial state
    updateLoanCalculator();
    
    console.log('Website initialized successfully.');
}

// Add PWA-specific event listeners
function initEventListeners() {
    // ... existing event listeners ...
    
    // PWA-specific events
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            // App became visible, check for updates
            pwaManager?.checkForUpdate();
        }
    });
    
    // Periodic background sync (every 1 hour)
    setInterval(() => {
        pwaManager?.syncBackgroundData();
    }, 3600000);
    
    // Request notification permission after user interaction
    document.addEventListener('click', () => {
        pwaManager?.requestNotificationPermission();
    }, { once: true });
}

// Update notification function to use Web Notifications API if available
function showNotification(message, type = 'info') {
    // Try to use Web Notifications if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
        const options = {
            body: message,
            icon: '/assets/icon-192x192.png',
            badge: '/assets/badge-72x72.png',
            tag: 'microokoa-notification',
            requireInteraction: type === 'warning',
            actions: [
                {
                    action: 'open',
                    title: 'Open'
                },
                {
                    action: 'close',
                    title: 'Close'
                }
            ]
        };
        
        const notification = new Notification('Microokoa Guaranty Capital', options);
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        notification.onclose = () => {
            console.log('Notification closed');
        };
        
        // Auto-close after 5 seconds (except for warnings)
        if (type !== 'warning') {
            setTimeout(() => {
                notification.close();
            }, 5000);
        }
        
        return;
    }
    
    // Fallback to custom notification
    // ... existing custom notification code ...
// ============================================
// CHECK ELIGIBILITY BUTTON FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Find the "Check Eligibility" button
    const checkEligibilityBtn = document.getElementById('checkEligibilityBtn');
    
    // If button is found, add click event
    if (checkEligibilityBtn) {
        checkEligibilityBtn.addEventListener('click', function(event) {
            // Prevent default link behavior if it's an <a> tag
            event.preventDefault();
            
            // Show eligibility form/modal (you can customize this)
            showEligibilityForm();
        });
    } else {
        console.log('Check Eligibility button not found');
    }
});

// Function to show eligibility form
function showEligibilityForm() {
    // Create a simple modal/form for eligibility check
    const formHTML = `
        <div class="eligibility-modal" id="eligibilityModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Check Your Eligibility</h2>
                
                <form id="eligibilityForm">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #34495e;">
                            Monthly Income (KSH)
                        </label>
                        <input type="number" required style="
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            font-size: 16px;
                        " placeholder="e.g., 30000">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #34495e;">
                            Previous Donation Amount (KSH)
                        </label>
                        <input type="number" required style="
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            font-size: 16px;
                        " placeholder="e.g., 500">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #34495e;">
                            Loan Purpose
                        </label>
                        <select style="
                            width: 100%;
                            padding: 10px;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            font-size: 16px;
                        ">
                            <option value="business">Business Expansion</option>
                            <option value="emergency">Emergency</option>
                            <option value="education">Education</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button type="submit" style="
                            flex: 1;
                            background: #27ae60;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 5px;
                            font-size: 16px;
                            cursor: pointer;
                        ">Check Now</button>
                        
                        <button type="button" onclick="closeEligibilityModal()" style="
                            flex: 1;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 5px;
                            font-size: 16px;
                            cursor: pointer;
                        ">Cancel</button>
                    </div>
                </form>
                
                <p style="margin-top: 15px; font-size: 14px; color: #7f8c8d;">
                    Eligibility requires minimum donation of Kshs 200 and proof of income.
                </p>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    // Add form submission handler
    document.getElementById('eligibilityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        checkEligibility();
    });
}

// Function to check eligibility
function checkEligibility() {
    const income = document.querySelector('#eligibilityForm input[type="number"]:first-of-type').value;
    const donation = document.querySelector('#eligibilityForm input[type="number"]:last-of-type').value;
    
    // Simple eligibility logic (customize this)
    if (donation >= 200) {
        alert(`✅ ELIGIBLE!\n\nBased on your donation of Kshs ${donation}, you qualify for:\n• Loan Amount: Kshs ${donation * 10}\n• Processing: Within 24 hours\n\nPlease proceed with the full application.`);
    } else {
        alert(`❌ NOT ELIGIBLE YET\n\nMinimum donation required: Kshs 200\nYour donation: Kshs ${donation}\n\nPlease make a donation first to unlock borrowing.`);
    }
    
    // Close modal after checking
    closeEligibilityModal();
}

// Function to close modal
function closeEligibilityModal() {
    const modal = document.getElementById('eligibilityModal');
    if (modal) {
        modal.remove();
    }
}

// Also allow closing modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEligibilityModal();
    }
});

}
