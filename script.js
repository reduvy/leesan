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

    // 4. Background Particle Animation (Dynamic Space/Stars)
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let stars = [];
        let shootingStars = [];
        
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        window.addEventListener('resize', resize);
        resize();
        
        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.2;
                // Deeper stars move slower (parallax)
                this.speedX = (Math.random() - 0.5) * (this.size * 0.2);
                this.speedY = (Math.random() - 0.5) * (this.size * 0.2) - (this.size * 0.05); 
                
                // Mostly white, some slight blueish for space feel
                const isBlue = Math.random() > 0.8;
                this.baseColor = isBlue ? '210, 230, 255' : '255, 255, 255';
                
                this.opacity = Math.random();
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Twinkling effect
                this.opacity += this.twinkleSpeed;
                if (this.opacity > 1 || this.opacity < 0.1) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }
                
                // Wrap around screen
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }
            
            draw() {
                ctx.fillStyle = `rgba(${this.baseColor}, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class ShootingStar {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = -10;
                this.length = Math.random() * 80 + 20;
                this.speed = Math.random() * 15 + 10;
                this.size = Math.random() * 1.5 + 0.5;
                this.opacity = 0;
                this.active = false;
                this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // roughly 45 degrees
            }

            spawn() {
                this.reset();
                this.active = true;
                this.opacity = 1;
            }

            update() {
                if (!this.active) return;
                this.x -= Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.opacity -= 0.015;

                if (this.opacity <= 0 || this.x < 0 || this.y > height) {
                    this.active = false;
                }
            }

            draw() {
                if (!this.active) return;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.lineWidth = this.size;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
                ctx.stroke();
            }
        }
        
        function initStars() {
            stars = [];
            // Many more stars for space effect
            const numStars = Math.min(Math.floor((width * height) / 3000), 400);
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }

            shootingStars = [];
            for (let i = 0; i < 3; i++) {
                shootingStars.push(new ShootingStar());
            }
        }
        
        function animateStars() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw regular stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            // Randomly spawn shooting stars
            if (Math.random() < 0.015) {
                const inactiveShootingStar = shootingStars.find(s => !s.active);
                if (inactiveShootingStar) {
                    inactiveShootingStar.spawn();
                }
            }

            // Draw shooting stars
            shootingStars.forEach(sStar => {
                sStar.update();
                sStar.draw();
            });
            
            requestAnimationFrame(animateStars);
        }
        
        initStars();
        animateStars();
    }
});
