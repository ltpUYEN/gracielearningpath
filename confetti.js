// Confetti.js - Grouped Bursts (3 at a time) with More Shapes for Overlay
const Confetti = (function () {
    let canvas, ctx;
    let particles = [];
    let intervalId = null;

    // --- Tuned Parameters ---
    const particlesPerBurst = 75;    // Particles per single burst
    const burstsPerGroup = 6;       // <--- How many bursts happen together
    const burstGroupFrequency = 800; // <--- Milliseconds between GROUPS of bursts (e.g., 800ms * 3)
    const fadeSpeed = 0.010;
    const initialBurstSpeed = 2.8;
    const gravity = 0.09;
    const drag = 0.98;

    // Pink color palette
    const pinkPalette = [
        "#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093",
        "#C71585", "#F8BBD0", "#E91E63"
    ];

    // Shapes
    const shapes = ['rectangle', 'circle', 'spiral', 'star', 'heart'];

    function init() {
        canvas = document.getElementById("confetti-canvas");
        if (!canvas) {
            console.error("Canvas element with ID 'confetti-canvas' not found.");
            return false;
        }
        ctx = canvas.getContext("2d");
        // Remember CSS for transparency: canvas#confetti-canvas { background-color: transparent; ... }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return true;
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Creates a single burst at specified coordinates (Function remains the same)
    function createBurst(burstX, burstY) {
        if (!canvas) return;
        for (let i = 0; i < particlesPerBurst; i++) {
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * initialBurstSpeed + 0.5;
            const baseSize = Math.random() * 7 + 4;

            particles.push({
                shape: shape, x: burstX, y: burstY, r: baseSize,
                color: pinkPalette[Math.floor(Math.random() * pinkPalette.length)],
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.5,
                alpha: 1, rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.10,
                tilt: Math.floor(Math.random() * 10) - 5,
                tiltAngle: Math.random() * Math.PI,
                tiltAngleIncrement: Math.random() * 0.05 + 0.03
            });
        }
        if (!animationId) { animate(); }
    }

    // --- Shape Drawing Helper Functions (drawStar, drawHeart - unchanged) ---
    function drawStar(ctx, x, y, radius, points, inset, rotation) { /* ... unchanged ... */
        ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.beginPath();
        ctx.moveTo(0, -radius);
        for (let i = 0; i < points; i++) { ctx.rotate(Math.PI / points); ctx.lineTo(0, -(radius * inset)); ctx.rotate(Math.PI / points); ctx.lineTo(0, -radius); }
        ctx.closePath(); ctx.fill(); ctx.restore();
     }
    function drawHeart(ctx, x, y, size, rotation) { /* ... unchanged ... */
        ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
        const topCurveHeight = size * 0.3; const bottomTipY = size * 0.6; const halfWidth = size / 2;
        const controlX1 = halfWidth * 0.9; const controlY1 = -size * 0.1; const controlX2 = halfWidth; const controlY2 = size * 0.4;
        ctx.beginPath(); ctx.moveTo(0, bottomTipY * 0.8);
        ctx.bezierCurveTo(-controlX1, controlY2 * 0.8, -controlX2, controlY1, 0, -topCurveHeight);
        ctx.bezierCurveTo(controlX2, controlY1, controlX1, controlY2 * 0.8, 0, bottomTipY * 0.8);
        ctx.closePath(); ctx.fill(); ctx.restore();
    }

    // --- drawParticles function (unchanged from previous version) ---
    function drawParticles() { /* ... unchanged ... */
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]; if (!p) continue; ctx.save();
            ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`; ctx.strokeStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
            switch (p.shape) {
                case 'rectangle': ctx.lineWidth = p.r * 0.7; ctx.translate(p.x, p.y); ctx.rotate(p.rotation); const rh = p.r * 0.5; const rw = p.r * 1.1; ctx.strokeRect(-rw / 2, -rh / 2, rw, rh); break;
                case 'circle': ctx.beginPath(); ctx.arc(p.x, p.y, p.r / 2.0, 0, Math.PI * 2, false); ctx.fill(); break;
                case 'spiral': ctx.lineWidth = p.r / 3; ctx.beginPath(); const seX = p.x + Math.cos(p.rotation) * p.r * 0.8; const seY = p.y + Math.sin(p.rotation) * p.r * 0.8; const ctX = p.x - Math.sin(p.rotation + p.tilt*0.1) * p.r * 0.6; const ctY = p.y + Math.cos(p.rotation + p.tilt*0.1) * p.r * 0.6; ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(ctX, ctY, seX, seY); ctx.stroke(); break;
                case 'star': drawStar(ctx, p.x, p.y, p.r * 0.7, 5, 0.5, p.rotation); break;
                case 'heart': drawHeart(ctx, p.x, p.y, p.r * 0.8, p.rotation); break;
            }
            ctx.restore();
        }
     }

    // --- updateParticles function (unchanged from previous version) ---
    function updateParticles() { /* ... unchanged ... */
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]; if (!p) continue;
            p.vx *= drag; p.vy += gravity; p.x += p.vx; p.y += p.vy;
            p.rotation += p.rotationSpeed; p.tiltAngle += p.tiltAngleIncrement; p.tilt = Math.sin(p.tiltAngle) * 5;
            p.alpha -= fadeSpeed;
            if (p.alpha <= 0) { particles.splice(i, 1); }
        }
    }

    let animationId = null;
    // --- animate function (unchanged from previous version) ---
    function animate() { /* ... unchanged ... */
        updateParticles(); drawParticles();
        if (particles.length > 0 || intervalId !== null) { animationId = requestAnimationFrame(animate); }
        else { animationId = null; }
     }

    // --- MODIFIED start function ---
    function start() {
        if (!init()) return;
        console.log("Confetti (Grouped Burst Mode) started.");

        // Stop any previous interval
        if (intervalId) clearInterval(intervalId);

        // Start triggering GROUPS of bursts
        intervalId = setInterval(() => {
            if (!canvas) return; // Skip if canvas removed

            // --- Trigger multiple bursts per interval ---
            for (let i = 0; i < burstsPerGroup; i++) {
                // Each burst gets its own random location in the upper area
                const burstX = Math.random() * canvas.width;
                const burstY = Math.random() * canvas.height * 0.4; // Upper 40%
                createBurst(burstX, burstY); // Call the existing function
            }

        }, burstGroupFrequency); // Use the LONGER interval frequency

        // Start the animation loop if not already running
        if (!animationId) {
            animate();
        }
    }

    // --- stop function (unchanged from previous version) ---
    function stop() { /* ... unchanged ... */
        if (intervalId) { clearInterval(intervalId); intervalId = null; } particles = [];
        if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Confetti stopped and cleared.");
     }

    // --- hexToRgb function (unchanged from previous version) ---
    function hexToRgb(hex) { /* ... unchanged ... */
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 192, 203";
     }

    return { start: start, stop: stop };
})();

document.addEventListener("DOMContentLoaded", () => {
    Confetti.start();
});