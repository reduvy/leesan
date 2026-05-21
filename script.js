document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Number Counter Animation for Stats
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const countOptions = {
        threshold: 0.5
    };

    const countObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                stats.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // ~60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                });
                hasCounted = true;
            }
        });
    }, countOptions);

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        countObserver.observe(statsSection);
    }

    // 4. Background Particle Animation (Warp / Wormhole Effect)
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width, height, centerX, centerY;
        let stars = [];
        let speed = 15; // Warp speed
        
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            centerX = width / 2;
            centerY = height / 2;
            canvas.width = width;
            canvas.height = height;
            
            // Adjust speed relative to screen width so it feels consistent on mobile/desktop
            speed = Math.max(8, width * 0.015);
        }
        
        window.addEventListener('resize', resize);
        resize();
        
        class WarpStar {
            constructor() {
                this.reset(true);
            }
            
            reset(randomZ = false) {
                this.x = (Math.random() - 0.5) * width * 3;
                this.y = (Math.random() - 0.5) * height * 3;
                this.z = randomZ ? Math.random() * width : width;
                this.pz = this.z;
                
                const rand = Math.random();
                if (rand > 0.85) this.color = '210, 230, 255'; // slight blue
                else if (rand > 0.7) this.color = '230, 210, 255'; // slight purple
                else this.color = '255, 255, 255'; // pure white
            }
            
            update() {
                this.pz = this.z;
                this.z -= speed;
                
                if (this.z < 1) {
                    this.reset(false);
                    this.pz = this.z;
                }
            }
            
            draw() {
                const fov = width;
                
                const sx = (this.x / this.z) * fov + centerX;
                const sy = (this.y / this.z) * fov + centerY;
                
                const px = (this.x / this.pz) * fov + centerX;
                const py = (this.y / this.pz) * fov + centerY;
                
                const radius = Math.max(0.5, (1 - this.z / width) * 2.5);
                const opacity = Math.min(1, 1 - (this.z / width));

                ctx.beginPath();
                ctx.strokeStyle = `rgba(${this.color}, ${opacity})`;
                ctx.lineWidth = radius;
                ctx.lineCap = 'round';
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            }
        }
        
        function initWarp() {
            stars = [];
            // Increased density for more light
            const density = Math.min(Math.floor((width * height) / 400), 2500);
            for (let i = 0; i < density; i++) {
                stars.push(new WarpStar());
            }
        }
        
        let mouseX = centerX;
        let mouseY = centerY;
        let targetX = centerX;
        let targetY = centerY;

        document.addEventListener('mousemove', (e) => {
            targetX = width / 2 + (e.clientX - width / 2) * 0.05;
            targetY = height / 2 + (e.clientY - height / 2) * 0.05;
        });

        function animateWarp() {
            ctx.clearRect(0, 0, width, height);
            
            // Smooth mouse follow for wormhole center
            centerX += (targetX - centerX) * 0.1;
            centerY += (targetY - centerY) * 0.1;
            
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            
            requestAnimationFrame(animateWarp);
        }
        
        initWarp();
        animateWarp();
    }
});
