/* -----------------------------------------
   Saurav Kumar - Portfolio JavaScript
   Interactive Animations, Custom Cursor,
   Canvas Particles, Theme Toggle, Scroll Spy.
-------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. THEME SWITCHER & MEMORY
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Check localStorage or system preferences
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Refresh particle colors based on new theme
    if (typeof initParticles === 'function') {
      initParticles();
    }
  });
  
  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // ==========================================
  // 2. SMOOTH FLUID TRAIL CURSOR
  // ==========================================
  const dotCount = 10;
  const trailDots = [];
  
  // Dynamically create trail container and dots
  const trailContainer = document.createElement('div');
  trailContainer.className = 'cursor-trail-container';
  document.body.appendChild(trailContainer);
  
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    trailContainer.appendChild(dot);
    trailDots.push({
      el: dot,
      x: 0,
      y: 0
    });
  }
  
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  // Track true mouse coordinates
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  // Animate trail dots using LERP
  function updateTrail() {
    let targetX = mouse.x;
    let targetY = mouse.y;
    
    trailDots.forEach((dot, index) => {
      // Each dot follows the coordinate in front of it with delay (LERP)
      const delay = index === 0 ? 0.35 : 0.35;
      
      dot.x += (targetX - dot.x) * delay;
      dot.y += (targetY - dot.y) * delay;
      
      // Decrease scale towards the tail to create a tapered look
      const scale = 1 - (index / dotCount) * 0.75;
      
      dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) scale(${scale})`;
      
      // Set target for the next dot to follow this dot
      targetX = dot.x;
      targetY = dot.y;
    });
    
    requestAnimationFrame(updateTrail);
  }
  requestAnimationFrame(updateTrail);
  
  // Change cursor state on interactive elements
  const hoverElements = document.querySelectorAll('a, button, input, textarea, .filter-btn, .project-card, .timeline-item');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      trailContainer.classList.add('hover');
    });
    elem.addEventListener('mouseleave', () => {
      trailContainer.classList.remove('hover');
    });
  });
  
  // Hide cursor trail when leaving window viewport
  document.addEventListener('mouseleave', () => {
    trailContainer.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    trailContainer.style.opacity = '1';
  });

  // ==========================================
  // 3. CANVAS PARTICLE BACKGROUND (HERO)
  // ==========================================
  const canvas = document.getElementById('hero-particles');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const numberOfParticles = 80;
  
  // Setup sizing
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = Math.random() * 0.6 - 0.3;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Boundary collision wrapping
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      const theme = document.documentElement.getAttribute('data-theme');
      // Blue particles in dark theme, purple in light theme
      ctx.fillStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.45)' : 'rgba(124, 58, 237, 0.35)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();
  
  // Draw connectors
  function connectParticles() {
    const theme = document.documentElement.getAttribute('data-theme');
    const maxDistance = 110;
    const connectorColor = theme === 'dark' ? '59, 130, 246' : '124, 58, 237';
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dist = Math.hypot(particlesArray[a].x - particlesArray[b].x, particlesArray[a].y - particlesArray[b].y);
        
        if (dist < maxDistance) {
          // Opacity fades out the further apart the particles are
          let opacity = (1 - (dist / maxDistance)) * 0.13;
          ctx.strokeStyle = `rgba(${connectorColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Particle Animation Loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  // 4. AUTOTYPING HERO SUBTITLE
  // ==========================================
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    "MERN Stack Developer",
    "React.js / Next.js Expert",
    "Node.js Backend Engineer",
    "Full-Stack Solution Builder"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Types at normal speed
    }
    
    // Typing complete
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Hold role for 2 seconds
    } 
    // Erase complete
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 300; // Small delay before typing next word
    }
    
    setTimeout(typeEffect, typingSpeed);
  }
  setTimeout(typeEffect, 1000); // Initial delay

  // ==========================================
  // 5. NAVBAR SCROLL STYLING & ACTIVE HIGHLIGHT
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    // Add border and background when scrolled
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Scroll Spy active navigation state
    let currentActive = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        currentActive = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 6. MOBILE NAVIGATION TOGGLE
  // ==========================================
  const mobileNavBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const mobileNavIcon = mobileNavBtn.querySelector('i');
  
  mobileNavBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) {
      mobileNavIcon.className = 'fa-solid fa-xmark';
    } else {
      mobileNavIcon.className = 'fa-solid fa-bars';
    }
  });
  
  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      mobileNavIcon.className = 'fa-solid fa-bars';
    });
  });

  // ==========================================
  // 7. SCROLL-REVEAL OBSERVER & SKILLS TRIGGER
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const skillBars = document.querySelectorAll('.skill-bar');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // If it's the skills section, animate the bars
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
        
        // Unobserve to keep element visible once loaded
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  
  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });
  
  function animateSkillBars() {
    skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      bar.style.width = progress;
    });
  }

  // ==========================================
  // 8. PROJECTS FILTERING LOGIC
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Manage active state of buttons
      filterButtons.forEach(button => button.classList.remove('active'));
      e.target.classList.add('active');
      
      const filterValue = e.target.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Animation transition
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hide');
            // Force reflow and re-fade-in
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.classList.add('hide');
          }
        }, 300);
      });
    });
  });

  // ==========================================
  // 9. CONTACT FORM WE3FORMS INTEGRATION (REAL EMAIL SENDING)
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  
  // NOTE: Paste your Web3Forms Access Key here!
  // To get a free key, go to: https://web3forms.com/ and submit your email.
  const WEB3FORMS_ACCESS_KEY = "f296de7a-0ae1-4293-8974-3943f6ac8e1e"; 

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Get field values
      const nameVal = document.getElementById('form-name').value;
      const emailVal = document.getElementById('form-email').value;
      const subjectVal = document.getElementById('form-subject').value;
      const messageVal = document.getElementById('form-message').value;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message... <i class="fa-solid fa-circle-notch fa-spin"></i>';
      
      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
        console.warn("Web3Forms Access Key is not configured. Simulating success instead.");
        // Fallback simulation if key is not configured
        setTimeout(() => {
          submitBtn.innerHTML = 'Mock Sent (Setup Access Key)! <i class="fa-solid fa-triangle-exclamation"></i>';
          submitBtn.style.background = 'var(--color-orange, #f97316)';
          submitBtn.style.boxShadow = '0 0 15px var(--color-orange, #f97316)';
          contactForm.reset();
          
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.style.boxShadow = '';
          }, 3000);
        }, 1500);
        return;
      }
      
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: nameVal,
            email: emailVal,
            subject: subjectVal,
            message: messageVal,
            from_name: "Portfolio Contact Form"
          })
        });
        
        const data = await response.json();
        
        if (response.status === 200 && data.success) {
          submitBtn.innerHTML = 'Message Sent! <i class="fa-solid fa-check-circle"></i>';
          submitBtn.style.background = 'var(--color-green)';
          submitBtn.style.boxShadow = '0 0 15px var(--color-green)';
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        submitBtn.innerHTML = 'Error Sending <i class="fa-solid fa-xmark"></i>';
        submitBtn.style.background = 'var(--color-red, #ef4444)';
        submitBtn.style.boxShadow = '0 0 15px var(--color-red, #ef4444)';
      } finally {
        // Revert submit button back to normal after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.boxShadow = '';
        }, 3000);
      }
    });
  }

  // ==========================================
  // 10. 3D CARD TILT & PARALLAX EFFECT
  // ==========================================
  const tiltCards = document.querySelectorAll('.glass-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      
      // Calculate mouse position relative to card center
      const mouseX = e.clientX - cardRect.left - cardWidth / 2;
      const mouseY = e.clientY - cardRect.top - cardHeight / 2;
      
      // Limit tilt to 12 degrees max
      const maxTilt = 12;
      const rotateX = -(mouseY / (cardHeight / 2)) * maxTilt;
      const rotateY = (mouseX / (cardWidth / 2)) * maxTilt;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Smooth reset on mouse leave
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
});
