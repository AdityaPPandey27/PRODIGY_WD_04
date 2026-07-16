document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. Custom Cursor ================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only apply if not on touch devices
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Add a slight delay for the outline for a smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effects on clickable items
        const clickables = document.querySelectorAll('a, button, .hamburger');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    /* ================= 2. Mobile Menu Toggle ================= */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* ================= 3. Scroll & Navbar Logic ================= */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section, header');
    
    window.addEventListener('scroll', () => {
        // Sticky Navbar Background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progressHeight = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progressHeight}%`;

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    /* ================= 4. Scroll Reveal Animations ================= */
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
                
                // If it's a skill bar, animate width
                if (reveal.classList.contains('skill-category')) {
                    const progressBars = reveal.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        bar.style.width = bar.parentElement.previousElementSibling.lastElementChild.innerText;
                    });
                }
                
                // If it contains counters, animate them
                const counters = reveal.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const updateCount = () => {
                        const count = +counter.innerText;
                        const inc = target / 50; // Speed adjustment
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 40);
                        } else {
                            counter.innerText = target + "+";
                        }
                    };
                    updateCount();
                    counter.classList.remove('counter'); // Prevent re-triggering
                });
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    /* ================= 5. Typing Effect ================= */
    const textArray = ["Full Stack Developer", "UI/UX Enthusiast", "Problem Solver"];
    const typingSpan = document.querySelector(".typing-text");
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typeSpeed);
    };
    
    // Start typing effect
    setTimeout(typeEffect, 1000);

    /* ================= 6. Contact Form Validation ================= */
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        // Simple UI feedback
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = originalText;
            formMsg.style.color = 'var(--highlight)';
            formMsg.style.marginTop = '1rem';
            formMsg.innerText = 'Thank you! Your message has been sent successfully.';
            contactForm.reset();
            
            setTimeout(() => {
                formMsg.innerText = '';
            }, 5000);
        }, 2000);
    });
});