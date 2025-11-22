// ===== VARIABLES GLOBALES =====
let scrollY = 0;
let ticking = false;

// ===== PANTALLA DE CARGA =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.classList.add('hidden');
    }, 2000);
});

// ===== EFECTO PARALLAX =====
function updateParallax() {
    const sections = document.querySelectorAll('.era-section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        if (scrollPercent >= 0 && scrollPercent <= 1) {
            const bgLayer = section.querySelector('.layer-bg');
            const fgLayer = section.querySelector('.layer-fg');
            
            if (bgLayer) {
                bgLayer.style.transform = `translateY(${scrollPercent * 100}px)`;
            }
            if (fgLayer) {
                fgLayer.style.transform = `translateY(${scrollPercent * -50}px)`;
            }
        }
    });
}

// ===== ANIMACIONES AL HACER SCROLL =====
function revealOnScroll() {
    const elements = document.querySelectorAll('.era-text, .era-image, .intro-content');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
            element.classList.add('fade-in', 'visible');
        }
    });
}

// ===== BOTÓN VOLVER ARRIBA =====
function updateBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// ===== SCROLL SUAVE =====
document.querySelector('.back-to-top')?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.querySelector('.hero-cta')?.addEventListener('click', () => {
    const introSection = document.querySelector('.intro-section');
    introSection?.scrollIntoView({ behavior: 'smooth' });
});

// ===== OPTIMIZACIÓN DE SCROLL =====
function onScroll() {
    scrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            revealOnScroll();
            updateBackToTop();
            ticking = false;
        });
        
        ticking = true;
    }
}

// ===== EVENT LISTENERS =====
window.addEventListener('scroll', onScroll, { passive: true });

// Ejecutar una vez al cargar
window.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    updateBackToTop();
});

// ===== MENÚ HAMBURGUESA (funcionalidad básica) =====
const navToggle = document.querySelector('.nav-toggle');
const hamburger = document.querySelector('.hamburger');

navToggle?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    // Aquí podrías añadir lógica para abrir un menú completo
});

// ===== EFECTO CURSOR PERSONALIZADO (opcional) =====
const cursor = {
    init() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });
        
        // Efecto hover en elementos interactivos
        const interactiveElements = document.querySelectorAll('button, a, .era-image');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
    }
};

// ===== SISTEMA DE AUDIO (opcional para reproducir música de cada época) =====
const audioSystem = {
    currentAudio: null,
    
    init() {
        const sections = document.querySelectorAll('.era-section');
        
        sections.forEach(section => {
            const era = section.dataset.era;
            // Aquí podrías cargar archivos de audio según la época
            // Por ahora solo detectamos qué sección está visible
        });
    },
    
    playEraMusic(era) {
        // Función para reproducir música de la época
        console.log(`Reproduciendo música de: ${era}`);
    }
};

// ===== EFECTOS DE TEXTO (escribir letra por letra) =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== CONTADOR DE VISITAS A SECCIONES =====
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            section.classList.add('in-view');
            
            // Animación especial al entrar
            const title = section.querySelector('.era-title');
            if (title && !title.classList.contains('animated')) {
                title.classList.add('animated');
                // Aquí podrías añadir efectos adicionales
            }
        }
    });
}, {
    threshold: 0.3
});

// Observar todas las secciones
document.querySelectorAll('.era-section').forEach(section => {
    sectionObserver.observe(section);
});

// ===== MODO ALTO CONTRASTE (accesibilidad) =====
let highContrast = false;

function toggleHighContrast() {
    highContrast = !highContrast;
    document.body.classList.toggle('high-contrast', highContrast);
}

// Listener para tecla de accesibilidad (Ctrl + Alt + C)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'c') {
        toggleHighContrast();
    }
});

// ===== DETECCIÓN DE PREFIERE MOVIMIENTO REDUCIDO =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Desactivar animaciones complejas para usuarios que prefieren menos movimiento
    document.body.classList.add('reduce-motion');
}

// ===== SISTEMA DE TEMAS (día/noche) - opcional =====
const themeToggle = {
    isDark: true,
    
    toggle() {
        this.isDark = !this.isDark;
        document.body.classList.toggle('light-theme', !this.isDark);
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },
    
    init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.toggle();
        }
    }
};

// ===== GESTIÓN DE RENDIMIENTO =====
const performanceMonitor = {
    fps: 0,
    lastTime: performance.now(),
    
    init() {
        this.measure();
    },
    
    measure() {
        const currentTime = performance.now();
        this.fps = 1000 / (currentTime - this.lastTime);
        this.lastTime = currentTime;
        
        // Si el FPS es bajo, reducir efectos
        if (this.fps < 30) {
            document.body.classList.add('low-performance');
        } else {
            document.body.classList.remove('low-performance');
        }
        
        requestAnimationFrame(() => this.measure());
    }
};

// Iniciar monitor de rendimiento
performanceMonitor.init();

// ===== PRELOAD DE IMÁGENES =====
function preloadImages() {
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    
    imagePlaceholders.forEach((placeholder, index) => {
        // Aquí podrías cargar imágenes reales
        // Por ahora usamos los fondos de gradiente
        placeholder.style.opacity = '0';
        setTimeout(() => {
            placeholder.style.transition = 'opacity 0.8s ease';
            placeholder.style.opacity = '1';
        }, index * 200);
    });
}

window.addEventListener('load', preloadImages);

// ===== EASTER EGG: Konami Code =====
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
    // Efecto especial al activar el código
    document.body.style.animation = 'rainbow 2s ease infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
    
    console.log('🎵 ¡Has desbloqueado el modo disco! 🎵');
}

// ===== SISTEMA DE TOOLTIPS =====
function createTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    element.addEventListener('mouseenter', (e) => {
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 'px';
        tooltip.style.top = (e.pageY - 40) + 'px';
    });
    
    element.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX + 'px';
        tooltip.style.top = (e.pageY - 40) + 'px';
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}

// ===== LOG DE DESARROLLO =====
console.log('%c🎵 Historia de la Música 🎵', 'font-size: 20px; font-weight: bold; color: #ff6b35;');
console.log('%cWeb diseñada con pasión por la enseñanza musical', 'font-size: 12px; color: #b8b8b8;');
console.log('%cEfectos: ✓ Parallax ✓ Animaciones ✓ Scroll suave', 'font-size: 10px; color: #4CAF50;');

// ===== EXPORT PARA MÓDULOS (si se usa) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateParallax,
        revealOnScroll,
        themeToggle,
        audioSystem
    };
}
