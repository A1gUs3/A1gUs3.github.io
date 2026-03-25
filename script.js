/* =============================================
   AGUSTIN BENITEZ — CYBERSECURITY PORTFOLIO
   script.js
   ============================================= */

'use strict';

/* ---- DOM READY ---- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingAnimation();
  initParticles();
  initScrollReveal();
  initSkillBars();
  initCertBars();
  initContactForm();
  initSmoothScroll();
  setYear();
  initMobileMenu();
  initTerminal();
  initBlogCards();
  initEasterEgg();
  initEmailProtection();
});

/* =============================================
   NAVBAR — scroll behavior & active link
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    // Sticky style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =============================================
   MOBILE MENU
   ============================================= */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* =============================================
   TYPING ANIMATION
   ============================================= */
function initTypingAnimation() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Cybersecurity Major @ WSU',
    'Junior Security Analyst',
    'Software Engineer in Test',
    'SIEM & Threat Detection',
    'Security Automation Builder',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const typeSpeed   = 65;
  const deleteSpeed = 35;
  const pauseTime   = 2200;

  function type() {
    if (isPaused) return;

    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
        setTimeout(type, deleteSpeed);
      }, pauseTime);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  setTimeout(type, 800);
}

/* =============================================
   PARTICLE SYSTEM (canvas)
   ============================================= */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  const COLORS = ['#00d4ff', '#7c3aed', '#06b6d4', '#10b981'];

  function resize() {
    canvas.width  = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.4,
      r:     Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
    particles = Array.from({ length: count }, createParticle);
  }

  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    animId = requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    animate();
  });
}

/* =============================================
   SCROLL REVEAL
   ============================================= */
function initScrollReveal() {
  // Add reveal classes to elements
  const revealMap = [
    { selector: '.about-text',         cls: 'reveal-left' },
    { selector: '.about-card-col',     cls: 'reveal-right' },
    { selector: '.project-card',       cls: 'reveal' },
    { selector: '.timeline-item',      cls: 'reveal' },
    { selector: '.skill-category',     cls: 'reveal' },
    { selector: '.cert-card',          cls: 'reveal' },
    { selector: '.contact-info',       cls: 'reveal-left' },
    { selector: '.contact-form-wrapper', cls: 'reveal-right' },
    { selector: '.section-header',     cls: 'reveal' },
  ];

  revealMap.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      if (i > 0) el.classList.add(`delay-${Math.min(i, 5)}`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* =============================================
   SKILL BARS — animate on scroll
   ============================================= */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.getAttribute('data-width');
        setTimeout(() => {
          el.style.width = width + '%';
        }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
}

/* =============================================
   CERT PROGRESS BARS
   ============================================= */
function initCertBars() {
  const fills = document.querySelectorAll('.cert-progress-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.getAttribute('data-width');
        setTimeout(() => {
          el.style.width = width + '%';
        }, 300);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
}

/* =============================================
   CONTACT FORM
   ============================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

   // Initialize EmailJS
  emailjs.init("6Z3T44nvFgiyNF15M");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Honeypot check - if filled, it's a bot
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value !== '') {
      // Silently reject - don't reveal it's a honeypot
      console.log('Bot detected via honeypot');
      return;
    }
    // Timing check - if submitted too fast (<3 sec), likely a bot
    const formLoadTime = form.dataset.loadTime;
    if (formLoadTime && (Date.now() - parseInt(formLoadTime)) < 3000) {
      console.log('Form submitted too quickly - possible bot');
      return;
    }
    
        const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      await emailjs.send(
        "service_rj3j2ib",
        "template_x8kfc0u",
        {
          name: form.querySelector('#name').value,
          email: form.querySelector('#email').value,
          subject: form.querySelector('#subject').value,
          message: form.querySelector('#message').value,
        }
      );

      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      note.textContent = '// Message received. I\'ll get back to you soon.';
      note.style.color = 'var(--accent-green)';
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      btn.innerHTML = '<i class="fas fa-times"></i> Error';
      note.textContent = '// Something went wrong. Please try again.';
      note.style.color = '#ff6b6b';
    }

     setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      note.textContent = '';
    }, 4000);
  });
  
  form.dataset.loadTime = Date.now();
}

/* =============================================
   SMOOTH SCROLL (fallback for older browsers)
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* =============================================
   FOOTER YEAR
   ============================================= */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* Active nav styles are defined in style.css */


/* =============================================
   INTERACTIVE TERMINAL
   ============================================= */
function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');
  if (!terminalInput ||!terminalBody) return;

  const commands = {
    help: `Available commands:
  about      - Learn about Agustin
  projects   - View featured projects
  skills     - List technical skills
  experience - Work experience
  contact    - Get contact info
  clear      - Clear terminal
  whoami     - Current user
  ls         - List sections
  hint       - You didn't see this`,
    
    about: `Agustin Benitez
Cybersecurity Major @ Wichita State University
Junior Security Analyst @ WSU | SDET @ NetApp

Passionate about threat detection, SIEM engineering,
and building automated security solutions.

Type 'help' for more commands.`,

    projects: `Featured Projects:
  01 - Azure Sentinel SIEM Dashboard
  02 - Phishing Detection Workflow Automation
  03 - Home SOC Lab (Elastic Stack + Kali)
  04 - Microsoft Security Automation (Graph API)
  05 - Splunk Log Analysis
  06 - NCL / CTF Challenges , NCAE Games 

Type 'help' to see all commands.`,

    skills: `Security Tools:
  • Azure Sentinel (SIEM) - 88%
  • Microsoft Defender - 82%
  • KnowBe4 PhishER - 85%
  • Elastic Stack (ELK) - 78%
  • Splunk - 75%
  • Wireshark - 80%

Programming:
  • Python - 85%
  • PowerShell - 80%
  • Bash/Shell - 70%
  • KQL - 78%
  • SPL - 72%`,

    experience: `Work Experience:

Junior Security Analyst @ Wichita State University
June 2024 - Present | Part-Time
• Azure Sentinel SIEM deployment & management
• Phishing incident response & triage
• Vulnerability assessments & remediation

Software Engineer in Test (SDET) @ NetApp
Feb 2025 - Present | Part-Time
• Automated security test framework development
• CI/CD pipeline integration
• Test infrastructure maintenance`,

    contact: `Contact Information:
Email: [Click the email link in the contact section]
LinkedIn: https://www.linkedin.com/in/agustin-benitez-314140281/
GitHub: github.com/A1gUs3

Status: Open to opportunities ✓`,

    whoami: `Junior Security Analyst @ WSU | Software Engineer in Test @ NetApp`,

    ls: `Sections:
  about/
  projects/
  experience/
  skills/
  certifications/
  blog/
  contact/
  hint/ <- start here if you're curious `,

hint: `// CLASSIFIED TRANSMISSION //
Access level insufficient for direct flag retrieval.
Try a sequence known to gamers since 1986.
↑ ↑ ... good luck, analyst.`,

    clear: null
  };

  function addLine(text, isOutput = false) {
    const line = document.createElement('div');
    line.className = `terminal-line ${isOutput ? 'output' : ''}`;
    
    if (isOutput) {
      line.innerHTML = `<span>${text}</span>`;
    } else {
      line.innerHTML = `<span class="prompt">$</span> <span class="command">${text}</span>`;
    }
    
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';

      if (!input) return;

      addLine(input);

      if (input === 'clear') {
        terminalBody.innerHTML = '';
      } else if (commands[input]) {
        const response = commands[input];
        if (response) {
          response.split('\n').forEach(line => {
            addLine(line, true);
          });
        }
      } else {
        addLine(`Command not found: ${input}`, true);
        addLine('Type "help" for available commands', true);
      }
    }
  });

  // Auto-focus on click
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
}

/* =============================================
   LIVE DASHBOARD SIMULATION
   ============================================= */
function initDashboard() {
  const alertCount = document.getElementById('alertCount');
  const failedCount = document.getElementById('failedCount');
  const threatCount = document.getElementById('threatCount');

  if (!alertCount) return;

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateDashboard() {
    alertCount.textContent = randomBetween(24, 156);
    failedCount.textContent = randomBetween(8, 47);
    threatCount.textContent = randomBetween(2, 12);
  }

  // Initial update
  updateDashboard();

  // Update every 3 seconds
  setInterval(updateDashboard, 3000);
}

/* =============================================
   CODE SNIPPET COPY FUNCTIONALITY
   ============================================= */
function initCodeSnippets() {
  const snippets = document.querySelectorAll('.code-snippet');

  snippets.forEach(snippet => {
    const code = snippet.querySelector('code');
    const header = snippet.querySelector('.snippet-header');
    
    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = 'Copy code';
    copyBtn.style.cssText = `
      background: transparent;
      border: 1px solid rgba(0, 212, 255, 0.2);
      color: var(--accent-blue);
      cursor: pointer;
      padding: 0.3rem 0.6rem;
      border-radius: 3px;
      font-size: 0.8rem;
      transition: all 0.3s ease;
    `;

    copyBtn.addEventListener('mouseover', () => {
      copyBtn.style.background = 'rgba(0, 212, 255, 0.1)';
      copyBtn.style.borderColor = 'var(--accent-blue)';
    });

    copyBtn.addEventListener('mouseout', () => {
      copyBtn.style.background = 'transparent';
      copyBtn.style.borderColor = 'rgba(0, 212, 255, 0.2)';
    });

    copyBtn.addEventListener('click', () => {
      const text = code.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    });

    header.appendChild(copyBtn);
  });
}

/* =============================================
   BLOG CARD INTERACTIONS
   ============================================= */
function initBlogCards() {
  const blogCards = document.querySelectorAll('.blog-card');

  blogCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

/* =============================================
   CTF EASTER EGG (Konami Code)
   ============================================= */
function initEasterEgg() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    // Create matrix rain effect
    const container = document.body;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.1);
    `;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00d4ff';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      canvas.remove();
    }, 5000);

    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 212, 255, 0.1);
      border: 2px solid var(--accent-blue);
      color: var(--accent-blue);
      padding: 2rem;
      border-radius: 10px;
      font-family: monospace;
      font-size: 1.2rem;
      z-index: 10000;
      text-align: center;
      animation: slideIn 0.5s ease;
    `;
    notification.textContent = "🏁FLAG FOUND: You've unlocked the hacker mode!☣︎";
    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

/* ---------------------------------------------
   EMAIL PROTECTION — decode emails on page load
   Prevents scrapers from harvesting plain emails
   --------------------------------------------- */
function initEmailProtection() {
  // Find all protected email elements and decode them
  document.querySelectorAll('.email-protected').forEach(el => {
    const user = el.dataset.user;
    const domain = el.dataset.domain;
    if (user && domain) {
      const email = user + '@' + domain;
      // Update display text if span exists
      const displaySpan = el.querySelector('.email-display');
      if (displaySpan) {
        displaySpan.textContent = email;
      }
    }
  });
}
