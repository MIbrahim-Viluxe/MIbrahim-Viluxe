<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { t, raw } from "$lib/utils/cms";
    import CmsText from "$lib/components/CmsText.svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";

    let { settings } = $props();

    let displayName = $state("");
    let fullName = $derived(
        $lang === "ar" ? "محمد إبراهيم" : "Mohamed Ibrahim",
    );

    const yearsValue = tweened(0, { duration: 2000, easing: cubicOut });
    const projectsValue = tweened(0, { duration: 2500, easing: cubicOut });

    $effect(() => {
        const textToType = fullName; // Tracks dependency synchronously
        displayName = "";
        let i = 0;
        const typingSpeed = 100;
        const timer = setInterval(() => {
            if (i < textToType.length) {
                displayName += textToType[i];
                i++;
            } else {
                clearInterval(timer);
            }
        }, typingSpeed);

        return () => clearInterval(timer);
    });

    let canvas: HTMLCanvasElement;
    let mouse = $state({ x: 0, y: 0 });

    onMount(() => {
        yearsValue.set(3);
        projectsValue.set(100);

        const ctx = canvas.getContext('2d')!;
        let particles: any[] = [];
        let animationFrame: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
            size = Math.random() * 2 + 0.5;
            spX = Math.random() * 1 - 0.5;
            spY = Math.random() * 1 - 0.5;

            update() {
                this.x += this.spX;
                this.y += this.spY;
                
                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const init = () => {
            resize();
            particles = Array.from({ length: 100 }, () => new Particle());
            window.addEventListener('resize', resize);
            window.addEventListener('mousemove', handleMouseMove);
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrame = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    });
</script>

<div class="hero-container">
    <canvas bind:this={canvas} class="hero-canvas"></canvas>
    <div class="background-layer">
        <div class="star-layer">
            <div
                class="shooting-star"
                style="top: 10%; left: 0%; animation-delay: 0s;"
            ></div>
            <div
                class="shooting-star"
                style="top: 30%; left: 20%; animation-delay: 3s;"
            ></div>
            <div
                class="shooting-star"
                style="top: 15%; left: 50%; animation-delay: 7s;"
            ></div>
        </div>
    </div>

    <div class="content-layer">
        <div class="container hero-grid" dir={$lang === "ar" ? "rtl" : "ltr"}>
            <!-- Avatar Side -->
            <div class="avatar-side animate-on-scroll">
                <div class="avatar-orbit">
                    <div class="avatar-glow"></div>
                    <div class="avatar-image-container">
                        <img
                            src="/profile.jpeg"
                            alt="Mohamed Ibrahim"
                            class="profile-img"
                        />
                    </div>
                </div>
            </div>

            <!-- Text Side -->
            <div class="text-side animate-on-scroll float-medium">
                <span class="hero-welcome">
                    {$lang === "ar" ? "مرحباً، أنا" : "HELLO, I AM"}
                </span>
                <h1 class="hero-name">
                    {displayName}
                    <span class="typing-cursor">|</span>
                </h1>
                <h2 class="hero-title">
                    {$lang === "ar"
                        ? "محرر فيديو محترف"
                        : "Senior Video Editor"}
                </h2>

                <div class="hero-skills">
                    <div
                        class="skill-icon"
                        style="--skill-color: #D291FF"
                        title="Adobe After Effects"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            ><rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="2"
                                fill="#D291FF"
                            /><path
                                fill="#00005B"
                                d="M8.54 10.73c-.1-.31-.19-.61-.29-.92s-.19-.6-.27-.89c-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.13.51-.29.98-.44 1.4h2.54c-.06-.21-.14-.46-.23-.72-.09-.27-.18-.56-.27-.86zm8.58-.29c-.55-.03-1.07.26-1.33.76-.12.23-.19.47-.22.72h2.109c.26 0 .45 0 .57-.01.08-.01.16-.03.23-.08v-.1c0-.13-.021-.25-.061-.37-.178-.56-.708-.94-1.298-.92zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.04 16.511h-2.09c-.07.01-.14-.041-.16-.11l-.82-2.4H5.92l-.76 2.36c-.02.09-.1.15-.19.14H3.09c-.11 0-.14-.06-.11-.18L6.2 7.39c.03-.1.06-.19.1-.31.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.07 0 .12.03.13.08l3.65 10.25c.03.11.001.161-.1.161zm7.851-3.991c-.021.189-.031.33-.041.42-.01.07-.069.13-.14.13-.06 0-.17.01-.33.021-.159.02-.35.029-.579.029-.23 0-.471-.04-.73-.04h-3.17c.039.31.14.62.31.89.181.271.431.48.729.601.4.17.841.26 1.281.25.35-.011.699-.04 1.039-.11.311-.039.61-.119.891-.23.05-.039.08-.02.08.08v1.531c0 .039-.01.08-.021.119-.021.03-.04.051-.069.07-.32.14-.65.24-1 .3-.471.09-.94.13-1.42.12-.761 0-1.4-.12-1.92-.35-.49-.211-.921-.541-1.261-.95-.319-.39-.55-.83-.69-1.31-.14-.471-.209-.961-.209-1.461 0-.539.08-1.07.25-1.59.16-.5.41-.96.75-1.37.33-.4.739-.72 1.209-.95.471-.23 1.03-.31 1.67-.31.531-.01 1.06.09 1.55.31.41.18.77.45 1.05.8.26.34.47.72.601 1.14.129.4.189.81.189 1.22 0 .24-.01.45-.019.64z"
                            /></svg
                        >
                    </div>
                    <div
                        class="skill-icon"
                        style="--skill-color: #9999FF"
                        title="Adobe Premiere Pro"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            ><rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="2"
                                fill="#9999FF"
                            /><path
                                fill="#00005C"
                                d="M10.15 8.42a2.93 2.93 0 00-1.18-.2 13.9 13.9 0 00-1.09.02v3.36l.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03a1.45 1.45 0 00-.93-1.46zM19.75.3H4.25A4.25 4.25 0 000 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.09 11.65c-.4.56-.96.98-1.61 1.22-.68.25-1.43.34-2.25.34l-.5-.01-.43-.01v3.21a.12.12 0 01-.11.14H5.82c-.08 0-.12-.04-.12-.13V6.42c0-.07.03-.11.1-.11l.56-.01.76-.02.87-.02.91-.01c.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.15.42.23.85.23 1.3 0 .86-.2 1.57-.6 2.13zm6.82-3.15v1.95c0 .08-.05.11-.16.11a4.35 4.35 0 00-1.92.37c-.19.09-.37.21-.51.37v5.1c0 .1-.04.14-.13.14h-1.97a.14.14 0 01-.16-.12v-5.58l-.01-.75-.02-.78c0-.23-.02-.45-.04-.68a.1.1 0 01.07-.11h1.78c.1 0 .18.07.2.16a3.03 3.03 0 01.13.92c.3-.35.67-.64 1.08-.86a3.1 3.1 0 011.52-.39c.07-.01.13.04.14.11v.04z"
                            /></svg
                        >
                    </div>
                    <div
                        class="skill-icon"
                        style="--skill-color: #31A8FF"
                        title="Adobe Photoshop"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            ><rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="2"
                                fill="#31A8FF"
                            /><path
                                fill="#001833"
                                d="M9.85 8.42c-.37-.15-.77-.21-1.18-.2-.26 0-.49 0-.68.01-.2-.01-.34 0-.41.01v3.36c.14.01.27.02.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03.01-.31-.07-.62-.23-.89-.17-.26-.41-.46-.7-.57zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.899c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.391 11.65c-.399.56-.959.98-1.609 1.22-.68.25-1.43.34-2.25.34-.24 0-.4 0-.5-.01s-.24-.01-.43-.01v3.209c.01.07-.04.131-.11.141H5.52c-.08 0-.12-.041-.12-.131V6.42c0-.07.03-.11.1-.11.17 0 .33 0 .56-.01.24-.01.49-.01.76-.02s.56-.01.87-.02c.31-.01.61-.01.91-.01.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.149.42.229.85.229 1.3.001.86-.199 1.57-.6 2.13zm7.091 3.89c-.28.4-.671.709-1.12.891-.49.209-1.09.318-1.811.318-.459 0-.91-.039-1.359-.129-.35-.061-.7-.17-1.02-.32-.07-.039-.121-.109-.111-.189v-1.74c0-.029.011-.07.041-.09.029-.02.06-.01.09.01.39.23.8.391 1.24.49.379.1.779.15 1.18.15.38 0 .65-.051.83-.141.16-.07.27-.24.27-.42 0-.141-.08-.27-.24-.4-.16-.129-.489-.279-.979-.471-.51-.18-.979-.42-1.42-.719-.31-.221-.569-.51-.761-.85-.159-.32-.239-.67-.229-1.021 0-.43.12-.84.341-1.21.25-.4.619-.72 1.049-.92.469-.239 1.059-.349 1.769-.349.41 0 .83.03 1.24.09.3.04.59.12.86.23.039.01.08.05.1.09.01.04.02.08.02.12v1.63c0 .04-.02.08-.05.1-.09.02-.14.02-.18 0-.3-.16-.62-.27-.96-.34-.37-.08-.74-.13-1.12-.13-.2-.01-.41.02-.601.07-.129.03-.24.1-.31.2-.05.08-.08.18-.08.27s.04.18.101.26c.09.11.209.2.34.27.229.12.47.23.709.33.541.18 1.061.43 1.541.73.33.209.6.49.789.83.16.318.24.67.23 1.029.011.471-.129.94-.389 1.331z"
                            /></svg
                        >
                    </div>
                    <div
                        class="skill-icon skill-small"
                        style="--skill-color: #FF9A00"
                        title="Adobe Illustrator"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            ><rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="2"
                                fill="#FF9A00"
                            /><path
                                fill="#330000"
                                d="M10.53 10.73c-.1-.31-.19-.61-.29-.92-.1-.31-.19-.6-.27-.89-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.14.51-.29.98-.44 1.4h2.54c-.06-.211-.14-.46-.23-.721-.09-.269-.18-.559-.27-.859zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.83h-2.091c-.069.01-.139-.04-.159-.11l-.82-2.38H7.91l-.76 2.35c-.02.09-.1.15-.19.141H5.08c-.11 0-.14-.061-.11-.18L8.19 7.38c.03-.1.06-.21.1-.33.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.08 0 .12.03.13.08l3.65 10.3c.03.109 0 .16-.1.16zm3.4-.15c0 .11-.039.16-.129.16H16.01c-.1 0-.15-.061-.15-.16v-7.7c0-.1.041-.14.131-.14h1.98c.09 0 .129.05.129.14v7.7zm-.209-9.03c-.231.24-.571.37-.911.35-.33.01-.65-.12-.891-.35-.23-.25-.35-.58-.34-.92-.01-.34.12-.66.359-.89.242-.23.562-.35.892-.35.391 0 .689.12.91.35.22.24.34.56.33.89.01.34-.11.67-.349.92z"
                            /></svg
                        >
                    </div>
                </div>

                <div class="hero-stats">
                    <div class="hero-stat-card">
                        <span class="stat-number"
                            >{Math.floor($yearsValue)}+</span
                        >
                        <span class="stat-label"
                            >{$lang === "ar"
                                ? "سنوات خبرة"
                                : "Years Experience"}</span
                        >
                    </div>
                    <div class="hero-stat-card">
                        <span class="stat-number"
                            >{Math.floor($projectsValue)}+</span
                        >
                        <span class="stat-label"
                            >{$lang === "ar"
                                ? "مشروع منجز"
                                : "Projects Done"}</span
                        >
                    </div>
                    <div class="hero-stat-card">
                        <span class="stat-number">24/7</span>
                        <span class="stat-label"
                            >{$lang === "ar"
                                ? "دعم فني"
                                : "Expert Support"}</span
                        >
                    </div>
                </div>

                <div class="hero-cta">
                    <a
                        href="/portfolio"
                        class="btn-primary-outline"
                    >
                        <span class="btn-text">
                            {$lang === "ar" ? "شاهد أعمالي" : "View My Work"}
                        </span>
                        <div class="btn-scan-line"></div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .hero-container {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: transparent;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .hero-canvas {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
    }

    .background-layer {
        position: absolute;
        inset: 0;
        z-index: 1;
    }

    .content-layer {
        position: relative;
        z-index: 10;
        width: 100%;
        padding: 100px 0;
    }

    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 60px;
        position: relative;
        z-index: 11;
    }

    /* Shooting Stars */
    .star-layer {
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
    }

    .shooting-star {
        position: absolute;
        width: 100px;
        height: 2px;
        background: linear-gradient(-45deg, var(--primary), rgba(0, 0, 255, 0));
        border-radius: 999px;
        filter: drop-shadow(0 0 6px var(--primary-glow));
        animation:
            tail 4s ease-in-out infinite,
            shooting 4s ease-in-out infinite;
        opacity: 0;
    }

    .shooting-star::before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 2px;
        background: white;
        border-radius: 100%;
        box-shadow: 0 0 10px 2px var(--primary);
    }

    @keyframes tail {
        0% {
            width: 0;
        }
        30% {
            width: 100px;
        }
        100% {
            width: 0;
        }
    }

    @keyframes shooting {
        0% {
            transform: translateX(0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        40% {
            transform: translateX(400px) scale(0);
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }

    /* Avatar Floating Animation */
    .avatar-side {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 12;
    }

    @keyframes floatAvatar {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-30px); }
    }

    .avatar-orbit {
        position: relative;
        width: clamp(300px, 40vw, 500px);
        aspect-ratio: 1;
        animation: floatAvatar 6s ease-in-out infinite;
    }

    .avatar-glow {
        position: absolute;
        inset: -15px;
        border-radius: 50%;
        border: 2px solid var(--primary);
        box-shadow:
            0 0 50px var(--primary-glow),
            inset 0 0 50px var(--primary-glow);
        animation: pulseGlow 3s infinite ease-in-out;
    }

    .avatar-image-container {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid var(--bg-dark);
        background: var(--bg-dark);
        position: relative;
        z-index: 2;
    }

    .profile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        transform: scale(1.25) translateY(2%);
        transform-origin: center;
        background-color: transparent;
    }

    /* Text Styling */
    .text-side {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        z-index: 15;
    }

    [dir="rtl"] .text-side {
        align-items: flex-start; /* flex-start in RTL is right side */
        text-align: right;
    }

    .hero-welcome {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 5px;
    }

    .hero-name {
        font-size: clamp(3rem, 6vw, 5.5rem);
        font-weight: 950;
        line-height: 1.2;
        margin: 0;
        padding: 5px 0 15px;
        font-family: var(--font-ar);
        background: linear-gradient(
            90deg,
            var(--primary) 0%,
            #ffffff 50%,
            var(--primary) 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 4s linear infinite;
        display: block;
        filter: drop-shadow(0 0 20px var(--primary-glow));
    }

    .typing-cursor {
        display: inline-block;
        color: #fff;
        margin-inline-start: 5px;
        animation: blink 0.8s infinite;
        -webkit-text-fill-color: #fff;
        font-weight: 100;
        line-height: 1;
    }

    .hero-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(1rem, 2vw, 1.8rem);
        color: var(--primary);
        font-weight: 300;
        opacity: 0.9;
        margin-bottom: 25px;
        letter-spacing: 1px;
    }

    .hero-skills {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
        align-items: center;
    }

    .skill-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .skill-icon:hover {
        transform: translateY(-8px) scale(1.1);
        border-color: var(--skill-color);
        box-shadow: 0 10px 20px var(--primary-glow);
    }

    .hero-stats {
        display: flex;
        gap: 50px;
        margin-bottom: 35px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 25px;
    }

    .hero-stat-card {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .stat-number {
        font-size: clamp(2.2rem, 3.5vw, 3rem);
        font-weight: 900;
        color: #fff;
        font-family: var(--font-en);
    }

    .stat-label {
        font-size: 0.8rem;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 700;
    }

    .hero-cta {
        margin-top: 10px;
    }

    .btn-primary-outline {
        display: inline-block;
        padding: 15px 40px;
        border: 2px solid var(--primary);
        color: var(--primary);
        text-decoration: none;
        border-radius: 50px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 2px;
        position: relative;
        overflow: hidden;
        transition: 0.4s;
    }

    .btn-primary-outline:hover {
        background: var(--primary);
        color: #000;
        box-shadow: 0 0 30px var(--primary-glow);
    }

    .btn-scan-line {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 229, 255, 0.2),
            transparent
        );
        transition: 0.5s;
    }

    .btn-primary-outline:hover .btn-scan-line {
        left: 100%;
    }

    .interactive-glitch:hover .btn-text {
        animation: glitch-text 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both
            infinite;
    }

    @keyframes glitch-text {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }

    @keyframes pulseGlow {
        0%,
        100% {
            transform: scale(1);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.02);
            opacity: 1;
        }
    }

    @media (max-width: 992px) {
        .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
        }
        .avatar-side {
            order: 1;
        }
        .text-side {
            order: 2;
            align-items: center;
        }
        .avatar-orbit {
            width: 280px;
        }
        .hero-skills {
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        .hero-stats {
            justify-content: center;
            flex-wrap: wrap;
            gap: 30px;
        }
    }
</style>
