document.addEventListener('DOMContentLoaded', function() {
    
    // --- Trip Availability Data --- //
    const tripAvailability = {
        france: {
            title: "September – Southwest France & North Spain",
            weeks: [
                { dates: "Sep 5–12, 2026", spots: 3 },
                { dates: "Sep 12–19, 2026", spots: 2 },
                { dates: "Sep 19–26, 2026", spots: 0 }
            ]
        },
        portugal: {
            title: "October – Portugal",
            weeks: [
                { dates: "Oct 3–10, 2026", spots: 4 },
                { dates: "Oct 10–17, 2026", spots: 3 },
                { dates: "Oct 17–24, 2026", spots: 1 }
            ]
        },
        morocco_dec: {
            title: "December – Morocco",
            weeks: [
                { dates: "Dec 5–12, 2026", spots: 2 },
                { dates: "Dec 12–19, 2026", spots: 4 }
            ]
        },
        morocco_jan: {
            title: "January – Morocco",
            weeks: [
                { dates: "Jan 9–16, 2027", spots: 3 },
                { dates: "Jan 16–23, 2027", spots: 4 }
            ]
        }
    };

    // --- Image Sliders --- //
    const sliders = document.querySelectorAll('.slider');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        let currentSlide = 0;

        function showSlide(n) {
            slides.forEach(slide => slide.style.display = 'none');
            slides[n].style.display = 'block';
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Change slide every 3 seconds
        setInterval(nextSlide, 3000);

        // Show the first slide initially
        showSlide(currentSlide);
    });

    // --- Experiences Horizontal Slider --- //
    const experiencesTrack = document.querySelector('.experiences-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (experiencesTrack && prevBtn && nextBtn) {
        const scrollAmount = 400;
        
        prevBtn.addEventListener('click', () => {
            experiencesTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            experiencesTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // --- Contact Validation --- //
    function isValidEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    function isValidWhatsApp(value) {
        // Remove spaces, dashes, parentheses, and plus sign for validation
        const cleaned = value.replace(/[\s\-\(\)\+]/g, '');
        // Should be 7-15 digits (international phone number range)
        return /^\d{7,15}$/.test(cleaned);
    }

    function isValidContact(value) {
        return isValidEmail(value) || isValidWhatsApp(value);
    }

    function setupContactValidation(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && !isValidContact(value)) {
                this.setCustomValidity('Please enter a valid email address or WhatsApp number');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });

        input.addEventListener('input', function() {
            this.setCustomValidity('');
        });
    }

    // Apply validation to contact fields
    setupContactValidation('call-contact');
    setupContactValidation('week-contact');

    // --- Form Submit Handler --- //
    async function handleFormSubmit(form, popup) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const successMessage = popup.querySelector('.success-message');
        
        // Get the title and subtitle to hide on success
        const popupTitle = popup.querySelector('h2');
        const popupSubtitle = popup.querySelector('.popup-subtitle');
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.style.display = 'none';
                if (popupTitle) popupTitle.style.display = 'none';
                if (popupSubtitle) popupSubtitle.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';
            } else {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('An error occurred. Please try again.');
                    }
                });
            }
        } catch (error) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            alert('An error occurred. Please try again.');
        }
    }

    // --- Week Selection Popup --- //
    const weekPopupOverlay = document.getElementById('week-select-popup-overlay');
    const weekPopupTitle = document.getElementById('week-popup-title');
    const weekOptionsContainer = document.getElementById('week-options');
    const requestWeekBtn = document.getElementById('request-week-btn');
    const closeWeekPopupBtn = document.getElementById('close-week-popup');
    const selectWeekButtons = document.querySelectorAll('.select-week-btn');
    
    // Week Form Popup
    const weekFormPopupOverlay = document.getElementById('week-form-popup-overlay');
    const weekFormSummary = document.getElementById('week-form-summary');
    const weekFormTripInput = document.getElementById('week-form-trip');
    const weekFormWeekInput = document.getElementById('week-form-week');
    const closeWeekFormPopupBtn = document.getElementById('close-week-form-popup');
    const weekRequestForm = document.getElementById('week-request-form');
    const weekFormSuccessMessage = document.querySelector('#week-form-popup .success-message');
    
    let selectedTrip = null;
    let selectedWeek = null;

    // Open week selection popup
    selectWeekButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tripId = button.dataset.trip;
            const trip = tripAvailability[tripId];
            
            if (!trip) return;
            
            selectedTrip = trip.title;
            selectedWeek = null;
            
            // Update popup title
            weekPopupTitle.textContent = trip.title;
            
            // Build week options
            weekOptionsContainer.innerHTML = trip.weeks.map((week, index) => {
                const isFull = week.spots === 0;
                const isLimited = week.spots === 1;
                const availText = isFull ? 'Sold Out' : `${week.spots} spot${week.spots > 1 ? 's' : ''} available`;
                const availClass = isFull ? 'full' : (isLimited ? 'limited' : '');
                
                return `
                    <label class="week-option ${isFull ? 'week-option-full' : ''}" data-week="${week.dates}">
                        <input type="radio" name="week" value="${week.dates}" ${isFull ? 'disabled' : ''}>
                        <div class="week-option-content">
                            <span class="week-dates">${week.dates}</span>
                            <span class="week-availability ${availClass}">${availText}</span>
                        </div>
                    </label>
                `;
            }).join('');
            
            // Reset button state
            requestWeekBtn.disabled = true;
            requestWeekBtn.textContent = 'Select a week above';
            
            // Add click handlers to week options
            document.querySelectorAll('.week-option:not(.week-option-full)').forEach(option => {
                option.addEventListener('click', () => {
                    // Remove selected class from all
                    document.querySelectorAll('.week-option').forEach(o => o.classList.remove('selected'));
                    // Add to clicked one
                    option.classList.add('selected');
                    // Check the radio
                    option.querySelector('input').checked = true;
                    // Store selected week
                    selectedWeek = option.dataset.week;
                    // Enable button
                    requestWeekBtn.disabled = false;
                    requestWeekBtn.textContent = 'Request This Week →';
                });
            });
            
            // Show popup
            weekPopupOverlay.style.display = 'flex';
        });
    });

    // Close week popup
    function closeWeekPopup() {
        weekPopupOverlay.style.display = 'none';
    }
    
    if (closeWeekPopupBtn) {
        closeWeekPopupBtn.addEventListener('click', closeWeekPopup);
    }
    
    if (weekPopupOverlay) {
        weekPopupOverlay.addEventListener('click', (e) => {
            if (e.target === weekPopupOverlay) {
                closeWeekPopup();
            }
        });
    }

    // Handle "Request This Week" button -> Open Week Form Popup
    if (requestWeekBtn) {
        requestWeekBtn.addEventListener('click', () => {
            if (!selectedWeek) return;
            
            // Close week selection popup
            closeWeekPopup();
            
            // Set the summary and hidden fields
            weekFormSummary.textContent = `${selectedTrip} — ${selectedWeek}`;
            weekFormTripInput.value = selectedTrip;
            weekFormWeekInput.value = selectedWeek;
            
            // Open week form popup
            weekFormPopupOverlay.style.display = 'flex';
        });
    }

    // Close week form popup
    function closeWeekFormPopup() {
        const popup = document.getElementById('week-form-popup');
        const successMessage = popup ? popup.querySelector('.success-message') : null;
        if (weekFormPopupOverlay) weekFormPopupOverlay.style.display = 'none';
        if (weekRequestForm) weekRequestForm.style.display = 'block';
        if (successMessage) successMessage.style.display = 'none';
        // Restore title and subtitle
        const title = popup ? popup.querySelector('h2') : null;
        const subtitle = popup ? popup.querySelector('.popup-subtitle') : null;
        if (title) title.style.display = 'block';
        if (subtitle) subtitle.style.display = 'block';
        if (weekRequestForm) weekRequestForm.reset();
        selectedTrip = null;
        selectedWeek = null;
    }

    if (closeWeekFormPopupBtn) {
        closeWeekFormPopupBtn.addEventListener('click', closeWeekFormPopup);
    }

    if (weekFormPopupOverlay) {
        weekFormPopupOverlay.addEventListener('click', (e) => {
            if (e.target === weekFormPopupOverlay) {
                closeWeekFormPopup();
            }
        });
    }

    // Handle week request form submission
    if (weekRequestForm) {
        weekRequestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const popup = document.getElementById('week-form-popup');
            await handleFormSubmit(weekRequestForm, popup);
        });
    }

    // Add close button handler for week form success
    const weekFormCloseSuccessBtn = document.querySelector('#week-form-popup .close-success-btn');
    if (weekFormCloseSuccessBtn) {
        weekFormCloseSuccessBtn.addEventListener('click', closeWeekFormPopup);
    }

    // --- Request a Call Popup (General / Flexible Dates) --- //
    const requestCallPopupOverlay = document.getElementById('request-call-popup-overlay');
    const closeRequestCallPopupButton = document.getElementById('close-request-call-popup');
    const requestCallForm = document.getElementById('request-call-form');
    const requestCallButtons = document.querySelectorAll('.request-call-btn');
    const requestCallSuccessMessage = document.querySelector('#request-call-popup .success-message');
    const callInterestSelect = document.getElementById('call-interest');
    const callInterestOptional = callInterestSelect ? callInterestSelect.closest('.form-group').querySelector('.optional') : null;

    // Map trip IDs to dropdown values
    const tripToInterest = {
        'france': 'France',
        'portugal': 'Portugal',
        'morocco_dec': 'Morocco December',
        'morocco_jan': 'Morocco January'
    };

    // Open the request a call popup
    requestCallButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if button is inside a product card
            const card = button.closest('.experience-card');
            if (card && callInterestSelect) {
                const tripId = card.dataset.trip;
                const interestValue = tripToInterest[tripId];
                if (interestValue) {
                    callInterestSelect.value = interestValue;
                    callInterestSelect.disabled = true;
                    // Hide (optional) label when pre-selected
                    if (callInterestOptional) callInterestOptional.style.display = 'none';
                }
            } else if (callInterestSelect) {
                // Reset for general "Schedule a conversation" button
                callInterestSelect.value = '';
                callInterestSelect.disabled = false;
                // Show (optional) label
                if (callInterestOptional) callInterestOptional.style.display = 'inline';
            }
            
            requestCallPopupOverlay.style.display = 'flex';
        });
    });

    // Close the request a call popup
    function closeRequestCallPopup() {
        const popup = document.getElementById('request-call-popup');
        if (requestCallPopupOverlay) requestCallPopupOverlay.style.display = 'none';
        if (requestCallForm) requestCallForm.style.display = 'block';
        if (requestCallSuccessMessage) requestCallSuccessMessage.style.display = 'none';
        // Restore title and subtitle
        const title = popup.querySelector('h2');
        const subtitle = popup.querySelector('.popup-subtitle');
        if (title) title.style.display = 'block';
        if (subtitle) subtitle.style.display = 'block';
        if (requestCallForm) requestCallForm.reset();
        // Re-enable the destination dropdown and show (optional) label
        if (callInterestSelect) callInterestSelect.disabled = false;
        if (callInterestOptional) callInterestOptional.style.display = 'inline';
    }

    if (closeRequestCallPopupButton) {
        closeRequestCallPopupButton.addEventListener('click', closeRequestCallPopup);
    }

    if (requestCallPopupOverlay) {
        requestCallPopupOverlay.addEventListener('click', (e) => {
            if (e.target === requestCallPopupOverlay) {
                closeRequestCallPopup();
            }
        });
    }

    // Handle request a call form submission
    if (requestCallForm) {
        requestCallForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const popup = document.getElementById('request-call-popup');
            await handleFormSubmit(requestCallForm, popup);
        });
    }

    // Add close button handler for request call success
    const requestCallCloseSuccessBtn = document.querySelector('#request-call-popup .close-success-btn');
    if (requestCallCloseSuccessBtn) {
        requestCallCloseSuccessBtn.addEventListener('click', closeRequestCallPopup);
    }

    // --- Cookie Consent --- //
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const cookieAcceptButton = document.getElementById('cookie-consent-accept');

    if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'flex';
    }

    cookieAcceptButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.style.display = 'none';
    });
});