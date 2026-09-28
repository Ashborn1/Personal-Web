document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. App Navigation (SPA Routing) ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.page-section');

    function switchPage(targetId) {
        navItems.forEach(item => item.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        const activeSection = document.getElementById(targetId);
        
        if (activeNav && activeSection) {
            activeNav.classList.add('active');
            activeSection.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                switchPage(targetId);
            });
        });
    }

    // --- 2. Contact Form Handling (Secure Transmission) ---
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> TRANSMITTING...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> TRANSMISSION SUCCESSFUL';
                submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                submitBtn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 3000);
                
            }, 2000); 
        });
    }

    // --- 3. Subtle Mouse Parallax on Hero Image (Home Page) ---
    const heroCard = document.querySelector('.hero-card');
    const homeSection = document.getElementById('home');
    
    if (homeSection && heroCard) {
        homeSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 40;
            const y = (window.innerHeight / 2 - e.pageY) / 40;
            
            heroCard.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        });
        
        homeSection.addEventListener('mouseleave', () => {
            heroCard.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
            heroCard.style.transition = 'transform 0.5s ease';
        });
        
        homeSection.addEventListener('mouseenter', () => {
            heroCard.style.transition = 'transform 0.1s ease-out';
        });
    }

    // --- 4. Subtle Hover Effect on Gallery Items ---
    const vaultItems = document.querySelectorAll('.vault-item');
    vaultItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '1';
        });
    });

});