/* ========================================
   SAPUVA WEBSITE - COMPLETE JAVASCRIPT
   Interactive Features, Animations & Functionality
   ======================================== */

// ========== 1. SMOOTH SCROLLING ========== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== 2. NAVBAR ACTIVE LINK & STICKY SHADOW ==========
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    // Update shadow on scroll
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }
    
    // Update active nav link
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========== 3. TAB SWITCHING FUNCTIONALITY ==========
function switchTab(tabName) {
    // Hide all tabs
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Initialize first tab as active
document.addEventListener('DOMContentLoaded', () => {
    const firstPanel = document.querySelector('.tab-panel');
    const firstButton = document.querySelector('.tab-btn');
    
    if (firstPanel && firstButton) {
        firstPanel.classList.add('active');
        firstButton.classList.add('active');
    }
});

// ========== 4. ACCORDION FUNCTIONALITY ==========
const accordionItems = document.querySelectorAll('.accordion-item h4');

accordionItems.forEach(item => {
    item.addEventListener('click', function() {
        const content = this.nextElementSibling;
        
        // Close all other accordion items
        accordionItems.forEach(other => {
            if (other !== this) {
                other.nextElementSibling.classList.remove('show');
            }
        });
        
        // Toggle current item
        content.classList.toggle('show');
    });
});

// ========== 5. CONTACT FORM HANDLING ==========
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const nameInput = this.querySelector('#name');
        const emailInput = this.querySelector('#email');
        const subjectInput = this.querySelector('#subject');
        const messageInput = this.querySelector('#message');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();
        
        // Validation
        if (!name || !email || !subject || !message) {
            showNotification('⚠️ Mohon isi semua field!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('❌ Email tidak valid!', 'error');
            return;
        }
        
        // Success message
        showNotification(`✅ Terima kasih ${name}! Pesan Anda telah dikirim. Kami akan menghubungi Anda segera.`, 'success');
        
        // Log data (in production, send to backend)
        console.log({
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });
        
        // Reset form
        this.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== 6. NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const bgColor = type === 'success' ? '#32CD32' : type === 'error' ? '#FF6347' : '#1E90FF';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        background: ${bgColor};
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
        font-family: 'Segoe UI', Tahoma, sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { 
            opacity: 0; 
            transform: translateX(100px); 
        }
        to { 
            opacity: 1; 
            transform: translateX(0); 
        }
    }
    @keyframes slideOutRight {
        from { 
            opacity: 1; 
            transform: translateX(0); 
        }
        to { 
            opacity: 0; 
            transform: translateX(100px); 
        }
    }
`;
document.head.appendChild(style);

// ========== 7. INTERSECTION OBSERVER (SCROLL ANIMATIONS) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animation-worthy elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.team-card, .learning-module, .solution-card, .stat-card, ' +
        '.impact-card, .content-box, .morph-card, .species-card'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// ========== 8. LAZY LOADING IMAGES ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== 9. POPULATION CHART (CHART.JS SIMULATION) ==========
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('populationChart');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight || 300;
        
        canvas.width = width;
        canvas.height = height;
        
        // Simulate population growth chart
        drawPopulationChart(ctx, width, height);
    }
});

function drawPopulationChart(ctx, width, height) {
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;
    
    // Sample data
    const years = [0, 1, 2, 3, 4, 5];
    const populationData = [10, 25, 60, 150, 300, 600];
    const maxPopulation = Math.max(...populationData);
    
    // Draw axes
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding); // X-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding); // Y-axis
    ctx.stroke();
    
    // Draw data line
    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    populationData.forEach((value, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        const y = (height - padding) - (value / maxPopulation) * plotHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw data points
    populationData.forEach((value, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        const y = (height - padding) - (value / maxPopulation) * plotHeight;
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    years.forEach((year, index) => {
        const x = padding + (index / (years.length - 1)) * plotWidth;
        ctx.fillText(year, x, height - padding + 20);
    });
    
    ctx.textAlign = 'right';
    [0, 150, 300, 450, 600].forEach(value => {
        const y = (height - padding) - (value / maxPopulation) * plotHeight;
        ctx.fillText(value, padding - 10, y);
    });
    
    // Draw axis labels
    ctx.textAlign = 'center';
    ctx.fillText('Tahun', width / 2, height - 5);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Populasi', 0, 0);
    ctx.restore();
}

// ========== 10. DARK MODE TOGGLE (OPTIONAL) ==========
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ========== 11. STATISTICS COUNTER ANIMATION ==========
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stat cards when visible
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const h3 = entry.target.querySelector('h3');
            const text = h3.textContent;
            const number = parseInt(text);
            
            if (!isNaN(number)) {
                animateCounter(h3, number);
                entry.target.dataset.animated = true;
            }
            statObserver.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-card').forEach(card => {
        statObserver.observe(card);
    });
});

// ========== 12. KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K untuk search (future feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Search activated');
    }
    
    // Esc untuk close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
    }
});

// ========== 13. PRINT FRIENDLY STYLING ==========
window.addEventListener('beforeprint', () => {
    document.body.style.background = 'white';
});

// ========== 14. CONSOLE WELCOME MESSAGE ==========
console.clear();
console.log('%c🐟 SAPUVA - Sapu-Sapu Utopia Virtual Advisor', 
    'font-size: 24px; font-weight: bold; color: #228B22; text-shadow: 2px 2px 4px rgba(255,215,0,0.5);');
console.log('%cSelamat datang! Terima kasih telah peduli dengan ekosistem perairan Indonesia 💚💛', 
    'font-size: 14px; color: #666;');
console.log('%c© 2026 Tim SAPUVANIAN - Edukasi & Pelestarian Ekosistem', 
    'font-size: 12px; color: #999;');
console.log('%cWebsite: SAPUVA | Repository: github.com/rosaliasinar-cell/sapuva-website', 
    'font-size: 11px; color: #ccc; font-style: italic;');

// ========== 15. PERFORMANCE MONITORING ==========
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⏱️ Page load time: ${pageLoadTime}ms`);
});

// ========== 16. SERVICE WORKER (PWA SUPPORT) ==========
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// ========== 17. MOBILE MENU TOGGLE ==========
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'none' ? 'flex' : 'none';
    }
}

// ========== 18. EXPORT TO PDF (OPTIONAL - REQUIRES LIBRARY) ==========
function downloadPageAsPDF() {
    // Requires html2pdf library
    // const element = document.body;
    // html2pdf().save(element);
    showNotification('📄 Feature untuk download PDF akan segera tersedia!', 'info');
}

// ========== 19. SHARE TO SOCIAL MEDIA ==========
function shareToSocial(platform) {
    const title = 'SAPUVA - Sapu-Sapu Utopia Virtual Advisor';
    const url = window.location.href;
    const text = 'Belajar tentang ekosistem perairan & dampak ikan sapu-sapu!';
    
    let shareUrl = '';
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

// ========== 20. INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ SAPUVA Website fully initialized');
    updateActiveNavLink();
    
    // Smooth scroll for browser support
    if (!('scrollBehavior' in document.documentElement.style)) {
        console.warn('Smooth scroll not supported in this browser');
    }
});

// ========== HELPER: Copy to Clipboard ==========
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}
