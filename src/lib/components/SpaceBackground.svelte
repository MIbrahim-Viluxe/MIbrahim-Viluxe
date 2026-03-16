<script lang="ts">
    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;
    let particles: Particle[] = [];
    const particleCount = 100;

    class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;

        constructor(width: number, height: number) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.1;
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update(width: number, height: number) {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
        }

        draw(ctx: CanvasRenderingContext2D) {
            // Removed shadowBlur — was causing major perf hit (runs 6000x/sec)
            // Slightly boosted opacity to compensate for removed glow
            ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity * 1.4})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let animFrameId: number;

    onMount(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Batch all particles in one save/restore to avoid repeated state changes
            particles.forEach((p) => {
                p.update(canvas.width, canvas.height);
                p.draw(ctx);
            });
            animFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animFrameId);
        };
    });
</script>

<div class="space-background">
    <canvas bind:this={canvas}></canvas>
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    <div class="glow-orb orb-3"></div>
</div>

<style>
    .space-background {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        background: #020813; /* Deep rich base */
        pointer-events: none;
    }

    canvas {
        display: block;
        position: relative;
        z-index: 2;
    }

    .glow-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
        animation: floatOrb 15s infinite alternate ease-in-out;
        z-index: 1;
        will-change: transform;
        contain: strict;
    }

    .orb-1 {
        top: -10%;
        left: -10%;
        width: 50vw;
        height: 50vw;
        background: radial-gradient(
            circle,
            rgba(0, 229, 255, 0.25) 0%,
            transparent 60%
        );
    }

    .orb-2 {
        bottom: -20%;
        right: -20%;
        width: 60vw;
        height: 60vw;
        background: radial-gradient(
            circle,
            rgba(0, 68, 255, 0.2) 0%,
            transparent 60%
        );
        animation-delay: -5s;
        animation-duration: 20s;
    }

    .orb-3 {
        top: 20%;
        left: 40%;
        width: 45vw;
        height: 45vw;
        background: radial-gradient(
            circle,
            rgba(140, 0, 255, 0.15) 0%,
            transparent 60%
        );
        animation-delay: -10s;
        animation-duration: 25s;
    }

    @keyframes floatOrb {
        from {
            transform: translate(0, 0) scale(1);
        }
        to {
            transform: translate(15%, 20%) scale(1.2);
        }
    }
</style>
