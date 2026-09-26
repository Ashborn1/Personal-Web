document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SPA Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    function switchPage(targetId) {
        // Remove active class from all links and sections
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        // Add active class to clicked link and target section
        const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        const activeSection = document.getElementById(targetId);
        
        if (activeLink && activeSection) {
            activeLink.classList.add('active');
            activeSection.classList.add('active');
            
            // Scroll to top smoothly when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            switchPage(targetId);
            
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
        });
    });

    // --- 2. Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });

    // --- 3. Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get button and change text to simulate loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        // Simulate network request (setTimeout)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #00d2ff, #00ff88)';
            
            // Reset form
            contactForm.reset();

            // Revert button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = ''; // Revert to CSS default
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }, 3000);
            
        }, 1500);
    });

    // --- 4. Gallery Image Interaction (Simple Lightbox effect) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Simple zoom animation on click
            item.style.transform = 'scale(1.5)';
            item.style.zIndex = '1000';
            item.style.position = 'relative';
            
            setTimeout(() => {
                item.style.transform = '';
                item.style.zIndex = '';
            }, 500);
        });
    });

    // --- 5. Subtle Mouse Parallax on Hero Image ---
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroSection = document.getElementById('home');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            
            if (heroImageWrapper) {
                heroImageWrapper.style.transform = `translateX(${x}px) translateY(${y}px)`;
            }
        });
        
        heroSection.addEventListener('mouseleave', () => {
            if (heroImageWrapper) {
                heroImageWrapper.style.transform = `translateX(0px) translateY(0px)`;
                heroImageWrapper.style.transition = 'transform 0.5s ease';
            }
        });
    }
});