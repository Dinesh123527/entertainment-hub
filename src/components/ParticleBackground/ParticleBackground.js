import { useCallback, useEffect, useRef } from "react";
import "./ParticleBackground.css";

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);

    const createParticles = useCallback((canvas) => {
        const particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 20000);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.6 + 0.2,
            });
        }
        return particles;
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const particles = particlesRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Detect light/dark mode from data attribute
        const brightness = document.documentElement.getAttribute("data-brightness");
        const isLightMode = brightness === "light";

        // Use dark maroon on light background (matches theme), light particles on dark background
        const particleColor = isLightMode ? "139, 30, 50" : "255, 255, 255";
        const particleOpacity = isLightMode ? 0.5 : 0.4;
        const lineOpacity = isLightMode ? 0.2 : 0.15;

        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Draw particle with theme-aware color
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity * particleOpacity})`;
            ctx.fill();

            // Draw connections to nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const dx = particles[j].x - particle.x;
                const dy = particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${particleColor}, ${lineOpacity * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesRef.current = createParticles(canvas);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Watch for theme changes
        const observer = new MutationObserver(() => {
            // Theme changed, particles will adapt on next frame
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme", "data-brightness"]
        });

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate, createParticles]);

    return <canvas ref={canvasRef} className="particle-background" />;
};

export default ParticleBackground;
