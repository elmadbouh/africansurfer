document.addEventListener('DOMContentLoaded', function() {
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
    async function handleFormSubmit(form, successMessage) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
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
                successMessage.style.display = 'block';
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



    // --- Request a Call Popup --- //
    const requestCallPopupOverlay = document.getElementById('request-call-popup-overlay');
    const closeRequestCallPopupButton = document.getElementById('close-request-call-popup');
    const requestCallForm = document.getElementById('request-call-form');
    const requestCallButtons = document.querySelectorAll('.request-call-btn');
    const requestCallSuccessMessage = document.querySelector('#request-call-popup-overlay .success-message');

    // Open the request a call popup
    requestCallButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            requestCallPopupOverlay.style.display = 'flex';
        });
    });

    // Close the request a call popup
    function closeRequestCallPopup() {
        requestCallPopupOverlay.style.display = 'none';
        requestCallForm.style.display = 'block';
        requestCallSuccessMessage.style.display = 'none';
    }

    closeRequestCallPopupButton.addEventListener('click', closeRequestCallPopup);
    requestCallPopupOverlay.addEventListener('click', (e) => {
        if (e.target === requestCallPopupOverlay) {
            closeRequestCallPopup();
        }
    });

    // Handle request a call form submission
    requestCallForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmit(requestCallForm, requestCallSuccessMessage);
    });

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