// Navigation component - injected into all pages
(function() {
    const isHomePage = window.location.pathname === '/' || 
                       window.location.pathname.endsWith('index.html') ||
                       window.location.pathname.endsWith('/');
    
    const prefix = isHomePage ? '' : 'index.html';
    
    const navHTML = `
    <nav class="main-nav">
        <div class="nav-container">
            <a href="${prefix || 'index.html'}" class="nav-logo">
                <img src="img/logo.png" alt="African Surfer logo" class="nav-logo-img">
                African Surfer
            </a>
            <button class="nav-toggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links">
                <li><a href="${prefix}#trips">Trips</a></li>
                <li><a href="${prefix}#approach">Approach</a></li>
                <li><a href="${prefix}#guide">Your Guide</a></li>
                <li><a href="${prefix}#testimonials">Testimonials</a></li>
                <li><a href="${prefix}#gallery">Gallery</a></li>
                <li><a href="${prefix}#next-step">Contact</a></li>
                <li><a href="impressum.html">Impressum</a></li>
            </ul>
        </div>
    </nav>
    `;
    
    // Insert nav at start of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Mobile nav toggle functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Hide nav on scroll down, show on scroll up
    const nav = document.querySelector('.main-nav');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNav() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past header - hide nav
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling up - show nav
            nav.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });
})();
