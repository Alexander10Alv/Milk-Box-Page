/**
 * MILK BOX Studio - Main JavaScript
 * 
 * Funcionalidades incluidas:
 * - Animaciones de scroll (fade-in)
 * - Navegación suave
 * - Protección de videos (disable context menu)
 * - Navbar responsive behavior
 * - Smooth scrolling para anclas
 */

// ==========================================================================
// FUNCIONES DEL LOADER
// ==========================================================================

// Función para crear partículas de código
function createCodeParticles() {
    const particles = document.getElementById('codeParticles');
    if (!particles) return;
    
    const codeSymbols = ['{}', '[]', '()', '<>', '/>', '==', '++', '--', '&&', '||', '!=', '==='];
    
    const particleInterval = setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        particle.style.fontSize = (Math.random() * 8 + 10) + 'px';
        
        particles.appendChild(particle);
        
        // Remover partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    }, 300);
    
    // Parar partículas después de 4 segundos
    setTimeout(() => {
        clearInterval(particleInterval);
    }, 4000);
}

// Función para ocultar el loader
function hideLoader() {
    const loader = document.getElementById('loaderOverlay');
    const developerText = document.querySelector('.text-wrapper');
    
    if (!loader) return;
    
    // Esperar 3.2 segundos, luego iniciar glitch
    setTimeout(() => {
        // Aplicar efecto glitch
        loader.classList.add('glitch-effect');
        if (developerText) {
            developerText.classList.add('text-glitch');
        }
        
        // Después del glitch, ocultar el loader
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 800); // Duración del glitch
        
    }, 3200); // Esperar a que termine la barra de progreso
}

// Inicializar loader cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.overflow = 'hidden';
    createCodeParticles();
    hideLoader();
});

// ==========================================================================
// CÍRCULO HOLOGRÁFICO SEGUIDOR DE CURSOR
// ==========================================================================

/**
 * Crear y controlar círculo holográfico
 */
function createHolographicCircle() {
    // Solo en la sección hero
    const heroSection = $('.hero-section');
    if (heroSection.length === 0) return;
    
    const circle = $('<div class="holographic-circle"></div>');
    $('body').append(circle);
    
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Modo ping-pong para móvil
        circle.addClass('mobile-pingpong');
        
        // Posicionar dentro de la sección hero
        circle.css({
            'top': heroSection.offset().top + 20 + 'px',
            'left': '20px'
        });
    } else {
        // Modo seguimiento de cursor para desktop
        let mouseX = 0;
        let mouseY = 0;
        let circleX = 0;
        let circleY = 0;
        
        // Actualizar posición del mouse
        $(document).mousemove(function(e) {
            const heroRect = heroSection[0].getBoundingClientRect();
            
            // Solo seguir el cursor cuando esté sobre la sección hero
            if (e.clientY >= heroRect.top && e.clientY <= heroRect.bottom) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        });
        
        // Animación suave de seguimiento
        function animateCircle() {
            const dx = mouseX - circleX;
            const dy = mouseY - circleY;
            
            circleX += dx * 0.1; // Factor de suavidad
            circleY += dy * 0.1;
            
            circle.css({
                'left': circleX - 10 + 'px', // Centrar el círculo
                'top': circleY - 10 + 'px'
            });
            
            requestAnimationFrame(animateCircle);
        }
        
        // Inicializar en el centro de la pantalla
        circleX = window.innerWidth / 2;
        circleY = window.innerHeight / 2;
        
        animateCircle();
    }
    
    // Limpiar al cambiar de sección
    $(window).scroll(function() {
        const heroRect = heroSection[0].getBoundingClientRect();
        
        if (heroRect.bottom < 0) {
            // Hero section no visible, ocultar círculo
            circle.fadeOut(300);
        } else if (heroRect.top < window.innerHeight) {
            // Hero section visible, mostrar círculo
            circle.fadeIn(300);
        }
    });
}

$(document).ready(function() {
    
    // ==========================================================================
    // CONFIGURACIÓN INICIAL
    // ==========================================================================
    
    console.log('🎬 MILK BOX Studio - JavaScript cargado correctamente');
    
    // ==========================================================================
    // ANIMACIONES DE SCROLL - FADE IN
    // ==========================================================================
    
    /**
     * Observador de intersección para animaciones fade-in
     * Detecta cuando los elementos entran en el viewport
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Una vez visible, no necesitamos seguir observando
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con clase .fade-in
    $('.fade-in').each(function() {
        observer.observe(this);
    });
    
    // ==========================================================================
    // NAVEGACIÓN SUAVE Y NAVBAR BEHAVIOR
    // ==========================================================================
    
    /**
     * Smooth scrolling para enlaces de navegación
     * Calcula la altura del navbar para ajustar el scroll
     */
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            e.preventDefault();
            
            // Calcular offset del navbar
            const navbarHeight = $('.navbar').outerHeight();
            const targetOffset = target.offset().top - navbarHeight - 20;
            
            $('html, body').animate({
                scrollTop: targetOffset
            }, 800, 'swing');
            
            // Cerrar menu móvil si está abierto
            $('.navbar-collapse').collapse('hide');
        }
    });
    
    /**
     * Cambiar apariencia del navbar al hacer scroll
     */
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        const navbar = $('.custom-navbar');
        
        if (scrollTop > 100) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });
    
    // ==========================================================================
    // PROTECCIÓN DE VIDEOS
    // ==========================================================================
    
    /**
     * Deshabilitar clic derecho y atajos de teclado en videos
     * Previene descarga y picture-in-picture
     */
    $('video').each(function() {
        const video = this;
        
        // Deshabilitar menú contextual (clic derecho)
        $(video).on('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Deshabilitar picture-in-picture
        video.disablePictureInPicture = true;
        
        // Prevenir atajos de teclado cuando el video tiene focus
        $(video).on('keydown', function(e) {
            // Lista de teclas a bloquear
            const blockedKeys = [
                83, // S (save)
                67, // C (copy) - cuando está con Ctrl
                65, // A (select all) - cuando está con Ctrl
                80  // P (picture-in-picture) - algunos navegadores
            ];
            
            if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 65 || e.keyCode === 83)) {
                e.preventDefault();
                return false;
            }
            
            if (blockedKeys.includes(e.keyCode)) {
                e.preventDefault();
                return false;
            }
        });
        
        // Event listeners adicionales para protección
        $(video).on('loadstart', function() {
            // Aplicar configuraciones de seguridad cuando el video comienza a cargar
            this.controlsList.add('nodownload', 'noremoteplayback', 'nofullscreen');
        });
    });
    
    // ==========================================================================
    // FORMULARIO DE CONTACTO - VALIDACIÓN Y UX
    // ==========================================================================
    
    /**
     * Mejorar UX del formulario de contacto
     * NOTA: El formulario no es funcional, solo mejoras visuales
     */
    $('.contact-form form').on('submit', function(e) {
        e.preventDefault(); // Prevenir envío real
        
        // Mostrar mensaje temporal (ya que no hay backend)
        const button = $(this).find('button[type="submit"]');
        const originalText = button.html();
        
        // Cambiar botón a estado loading
        button.html('<i class="fas fa-spinner fa-spin me-2"></i>Enviando...');
        button.prop('disabled', true);
        
        // Simular envío (2 segundos)
        setTimeout(function() {
            button.html('<i class="fas fa-check me-2"></i>¡Mensaje Enviado!');
            button.removeClass('btn-primary').addClass('btn-success');
            
            // Volver al estado original después de 3 segundos
            setTimeout(function() {
                button.html(originalText);
                button.prop('disabled', false);
                button.removeClass('btn-success').addClass('btn-primary');
                
                // Mostrar alerta informativa
                showTemporaryAlert('info', 'Formulario demo - Para implementar funcionalidad real, conectar con backend en {{FORM_ACTION_URL}}');
            }, 3000);
        }, 2000);
    });
    
    /**
     * Validación visual en tiempo real para campos del formulario
     */
    $('.form-control').on('blur', function() {
        const field = $(this);
        const value = field.val().trim();
        
        // Validación básica visual
        if (field.prop('required') && value === '') {
            field.addClass('is-invalid');
        } else if (field.attr('type') === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(value)) {
                field.removeClass('is-invalid').addClass('is-valid');
            } else {
                field.addClass('is-invalid');
            }
        } else if (value !== '') {
            field.removeClass('is-invalid').addClass('is-valid');
        }
    });
    
    // ==========================================================================
    // EFECTOS HOVER Y INTERACCIONES
    // ==========================================================================
    
    /**
     * Efectos adicionales para cards de video y servicios
     */
    $('.video-card, .service-card').hover(
        function() {
            // Mouse enter
            $(this).addClass('hovered');
        },
        function() {
            // Mouse leave
            $(this).removeClass('hovered');
        }
    );

/**
 * Efectos hover mejorados con animaciones fluidas
 */
$('.video-card, .service-card').hover(
    function() {
        // Mouse enter
        $(this).addClass('hovered');
        $(this).css({
            'transform': 'translateY(-10px) scale(1.02)',
            'box-shadow': 'var(--shadow-strong)',
            'background': 'linear-gradient(135deg, white 0%, #faf0e6 100%)'
        });
        
        // Agregar partículas al hover
        createHoverSparkles($(this));
    },
    function() {
        // Mouse leave
        $(this).removeClass('hovered');
        $(this).css({
            'transform': 'translateY(0) scale(1)',
            'box-shadow': 'var(--shadow-soft)',
            'background': 'white'
        });
    }
);

/**
 * Crear destellos al hacer hover
 */
function createHoverSparkles(element) {
    for (let i = 0; i < 3; i++) {
        const sparkle = $('<div class="hover-sparkle"></div>');
        const rect = element[0].getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.css({
            'position': 'absolute',
            'left': x + 'px',
            'top': y + 'px',
            'width': '4px',
            'height': '4px',
            'background': '#d4af37',
            'border-radius': '50%',
            'z-index': '10',
            'pointer-events': 'none',
            'animation': 'sparkle 0.8s ease-out forwards'
        });
        
        element.css('position', 'relative').append(sparkle);
        
        setTimeout(() => sparkle.remove(), 800);
    }
}
    
    /**
     * Pausar videos cuando no están visibles (optimización)
     */
    const videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video visible, permitir reproducción
                video.classList.remove('out-of-view');
            } else {
                // Video no visible, pausar para ahorrar recursos
                if (!video.paused) {
                    video.pause();
                }
                video.classList.add('out-of-view');
            }
        });
    }, { threshold: 0.5 });
    
    // Observar todos los videos
    $('video').each(function() {
        videoObserver.observe(this);
    });
    
    // ==========================================================================
    // UTILIDADES Y HELPERS
    // ==========================================================================
    
    /**
     * Mostrar alertas temporales
     * @param {string} type - Tipo de alerta (info, success, warning, error)
     * @param {string} message - Mensaje a mostrar
     */
    function showTemporaryAlert(type, message) {
        const alertClass = {
            'info': 'alert-info',
            'success': 'alert-success', 
            'warning': 'alert-warning',
            'error': 'alert-danger'
        }[type] || 'alert-info';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
                 style="top: 100px; right: 20px; z-index: 9999; max-width: 300px;">
                <i class="fas fa-info-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $('body').append(alertHtml);
        
        // Auto-hide después de 5 segundos
        setTimeout(function() {
            $('.alert').fadeOut(500, function() {
                $(this).remove();
            });
        }, 5000);
    }
    
    /**
     * Lazy loading para imágenes (si se agregan en el futuro)
     */
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Observar imágenes con clase .lazy
        $('.lazy').each(function() {
            imageObserver.observe(this);
        });
    }
    
    // ==========================================================================
    // EVENTOS DE WINDOW Y RESIZE
    // ==========================================================================
    
    /**
     * Ajustes responsive en tiempo real
     */
    $(window).resize(function() {
        // Recalcular alturas si es necesario
        adjustVideoContainers();

        // Recrear círculo holográfico si cambia el tipo de dispositivo
        $('.holographic-circle').remove();
        createHolographicCircle();

    });
    
    /**
     * Ajustar contenedores de video para mantener aspect ratio
     */
    function adjustVideoContainers() {
        $('.video-container').each(function() {
            const container = $(this);
            const video = container.find('video');
            
            if (video.length) {
                // Mantener aspect ratio 16:9
                const width = container.width();
                const height = (width * 9) / 16;
                video.css('height', height + 'px');
            }
        });
    }
    
    // Ejecutar al cargar
    adjustVideoContainers();
    
    // ==========================================================================
    // ANALYTICS Y TRACKING (PLACEHOLDER)
    // ==========================================================================
    
    /**
     * Tracking de eventos importantes (placeholder para Google Analytics, etc.)
     * CAMBIAR: Implementar con tu sistema de analytics real
     */
    function trackEvent(category, action, label) {
        // Placeholder para Google Analytics o similar
        console.log('📊 Tracking:', { category, action, label });
        
        // Ejemplo para Google Analytics 4:
        // gtag('event', action, {
        //     event_category: category,
        //     event_label: label
        // });
    }
    
    $('.btn-cta').on('click', function() {
        trackEvent('CTA', 'click', 'Solicitar Cotización');
        createConfetti(); // Agregar confetti
    });
    
    $('.contact-buttons .btn').on('click', function() {
        const buttonText = $(this).text().trim();
        trackEvent('Contact', 'click', buttonText);
    });
    
    $('video').on('play', function() {
        const videoTitle = $(this).closest('.video-card').find('h4').text() || 'Video';
        trackEvent('Video', 'play', videoTitle);
    });
    
    // ==========================================================================
    // ANIMACIÓN DE HOJAS CAYENDO - SECCIÓN CONTACTO
    // ==========================================================================

    /**
     * Crear y animar hojas cayendo en la sección de contacto
     */
    function createFallingLeaves() {
            const contactSection = $('#contacto');
            
            if (contactSection.length === 0) return;
            
            // Crear contenedor de hojas si no existe
            if (contactSection.find('.leaves-container').length === 0) {
                contactSection.append('<div class="leaves-container"></div>');
            }
            
            const leavesContainer = contactSection.find('.leaves-container');
            const colors = ['brown', 'vanilla', 'chocolate', 'coffee'];
            const sizes = ['small', 'medium', 'large'];
            
        function createLeaf() {
            const leaf = $('<div class="leaf"></div>');
            
            // Propiedades aleatorias
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            const startPosition = Math.random() * 100; // Porcentaje del ancho
            const duration = Math.random() * 4 + 5; // Entre 5-9 segundos
            const delay = Math.random() * 2; // Delay inicial
            
            leaf.addClass(color + ' ' + size);
            leaf.css({
                'left': startPosition + '%',
                'animation-duration': duration + 's',
                'animation-delay': delay + 's'
            });
            
            leavesContainer.append(leaf);
            
            // Remover hoja después de la animación
            setTimeout(() => {
                leaf.remove();
            }, (duration + delay) * 1000);
        }
        
        // Crear hojas cada cierto tiempo
        function startLeafFall() {
            createLeaf();
            
            // Próxima hoja en tiempo aleatorio (1-3 segundos)
            const nextLeafTime = Math.random() * 2000 + 1000;
            setTimeout(startLeafFall, nextLeafTime);
        }
        
        // Iniciar la animación
        startLeafFall();
    }

    // Iniciar hojas cayendo cuando la sección de contacto sea visible
    const contactObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('leaves-initialized')) {
                entry.target.classList.add('leaves-initialized');
                createFallingLeaves();
            }
        });
    }, { threshold: 0.3 });

    // Observar la sección de contacto
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactObserver.observe(contactSection);
    }
    // ==========================================================================
    // INICIALIZACIÓN FINAL
    // ==========================================================================
    
    /**
     * Código de inicialización final
     */
    function initialize() {
        // Marcar elementos inicialmente visibles
        setTimeout(function() {
            $('.fade-in').each(function() {
                const rect = this.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    $(this).addClass('visible');
                }
            });
        }, 100);
        
        // Log de inicialización completa
        console.log('✅ MILK BOX Studio - Inicialización completa');
        
        // CAMBIAR: Aquí puedes agregar más código de inicialización personalizado
        // Inicializar hojas cayendo si la sección de contacto ya es visible
        const contactSectionVisible = document.getElementById('contacto');
        if (contactSectionVisible) {
            const rect = contactSectionVisible.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                createFallingLeaves();
                contactSectionVisible.classList.add('leaves-initialized');
            }
        }
    }
    
    // Ejecutar inicialización
    initialize();
    
}); // Fin de document ready

// ==========================================================================
// FUNCIONES GLOBALES (fuera de document ready)
// ==========================================================================

/**
 * Función global para refrescar observadores (útil si se agrega contenido dinámico)
 */
window.refreshAnimations = function() {
    $('.fade-in:not(.visible)').each(function() {
        const rect = this.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            $(this).addClass('visible');
        }
    });
};

/**
 * Función para debug - mostrar información de placeholder
 * CAMBIAR: Remover en producción
 */
window.showPlaceholders = function() {
    const placeholders = [];
    
    // Buscar todos los placeholders en el HTML
    $('*').each(function() {
        const element = $(this);
        const text = element.text();
        const html = element.html();
        
        if (text.includes('{{') && text.includes('}}')) {
            const matches = text.match(/\{\{[^}]+\}\}/g);
            if (matches) {
                matches.forEach(match => {
                    if (!placeholders.includes(match)) {
                        placeholders.push(match);
                    }
                });
            }
        }
        
        // Revisar atributos también
        $.each(this.attributes, function(i, attrib) {
            if (attrib.value.includes('{{') && attrib.value.includes('}}')) {
                const matches = attrib.value.match(/\{\{[^}]+\}\}/g);
                if (matches) {
                    matches.forEach(match => {
                        if (!placeholders.includes(match)) {
                            placeholders.push(match);
                        }
                    });
                }
            }
        });
    });
    
    console.log('🔍 Placeholders encontrados:', placeholders);
    return placeholders;
};

// ==========================================================================
// ERROR HANDLING
// ==========================================================================
// ==========================================================================
    // EFECTO CONFETTI
    // ==========================================================================
    
    /**
     * Crear efecto confetti con los colores de la marca
     */
    function createConfetti() {
        const colors = ['#ffeec9', '#91665d', '#77616b', '#bcb7d1', '#fbf8d4'];
        const confettiContainer = $('<div class="confetti-container"></div>');
        $('body').append(confettiContainer);
        
        // Crear 50 partículas de confetti
        for (let i = 0; i < 50; i++) {
            const confetti = $('<div class="confetti-piece"></div>');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 4; // Entre 4-12px
            const startPos = Math.random() * window.innerWidth;
            const delay = Math.random() * 1000; // Delay hasta 1 segundo
            const duration = Math.random() * 2 + 3; // Entre 3-5 segundos
            
            confetti.css({
                'position': 'fixed',
                'top': '-10px',
                'left': startPos + 'px',
                'width': size + 'px',
                'height': size + 'px',
                'background-color': color,
                'border-radius': Math.random() > 0.5 ? '50%' : '0',
                'z-index': '10000',
                'pointer-events': 'none',
                'animation': `confettiFall ${duration}s linear ${delay}ms forwards`
            });
            
            confettiContainer.append(confetti);
        }
        
        // Limpiar después de 6 segundos
        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    }
    
    // ==========================================================================
    // PARTÍCULAS DE POLVO PARA REFLEJOS
    // ==========================================================================
    
    /**
     * Crear partículas de polvo flotante
     */
    function createDustParticles() {
        const heroSection = $('.hero-section');
        if (heroSection.length === 0) return;
        
        setInterval(() => {
            const particle = $('<div class="dust-particle"></div>');
            const startX = Math.random() * window.innerWidth;
            const delay = Math.random() * 2000;
            
            particle.css({
                'left': startX + 'px',
                'animation-delay': delay + 'ms'
            });
            
            heroSection.append(particle);
            
            // Remover después de la animación
            setTimeout(() => {
                particle.remove();
            }, 8000 + delay);
        }, 3000); // Nueva partícula cada 3 segundos
    }
    
    // Iniciar partículas de polvo
    createDustParticles();
/**
 * Manejo global de errores JavaScript
 */
window.onerror = function(message, source, lineno, colno, error) {
    console.error('❌ Error JavaScript:', {
        message: message,
        source: source,
        line: lineno,
        column: colno,
        error: error
    });
    
    // En producción, enviar errores a servicio de logging
    // CAMBIAR: Implementar con tu servicio de error tracking
    
    return false; // No prevenir el comportamiento por defecto del navegador
};

/**
 * Manejo de promesas rechazadas
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('❌ Promesa rechazada:', event.reason);
    
    // En producción, enviar a servicio de logging
    // CAMBIAR: Implementar con tu servicio de error tracking
});

// ==========================================================================
// PARTÍCULAS DORADAS FLOTANTES
// ==========================================================================

/**
 * Crear partículas doradas que flotan por toda la página
 */
function createGoldenParticles() {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = $('<div class="golden-particle"></div>');
            const size = Math.random() * 6 + 4; // 4-10px
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight + 20;
            const duration = Math.random() * 15 + 20; // 20-35 segundos
            const delay = Math.random() * 5000;
            
            particle.css({
                'position': 'fixed',
                'width': size + 'px',
                'height': size + 'px',
                'background': 'radial-gradient(circle, #d4af37 0%, #ff7043 100%)',
                'border-radius': '50%',
                'left': startX + 'px',
                'top': startY + 'px',
                'z-index': '1',
                'pointer-events': 'none',
                'opacity': '0.7',
                'animation': `goldenFloat ${duration}s ease-in-out ${delay}ms infinite`,
                'box-shadow': '0 0 10px rgba(212, 175, 55, 0.5)'
            });
            
            $('body').append(particle);
            
            // Remover después del ciclo completo
            setTimeout(() => {
                particle.remove();
            }, duration * 1000 + delay);
        }, i * 2000); // Escalonar creación
    }
}

// Inicializar partículas doradas
$(document).ready(function() {
    createGoldenParticles();
    
    // Renovar partículas cada 30 segundos
    setInterval(createGoldenParticles, 30000);

    // ==========================================================================
    // PARTÍCULAS DECORATIVAS EN NAVBAR
    // ==========================================================================

    function createNavbarParticles() {
        const navbarParticles = document.getElementById('navbarParticles');
        if (!navbarParticles) return;
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'navbar-particle';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            navbarParticles.appendChild(particle);
            
            // Remover después de la animación
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 10000);
        }
        
        // Crear partícula cada 3 segundos
        setInterval(createParticle, 3000);
        
        // Crear algunas partículas iniciales
        for (let i = 0; i < 3; i++) {
            setTimeout(createParticle, i * 1000);
        }
    }

    // Inicializar partículas de navbar
    createNavbarParticles();

    // Inicializar círculo holográfico
    createHolographicCircle();

});