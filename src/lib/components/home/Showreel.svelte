<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase";

    let clips: { url: string; duration: number }[] = [];
    let loading = true;


    onMount(async () => {
        try {
            const { data, error } = await supabase
                .from("showreel")
                .select("video_url, duration")
                .order("order_index", { ascending: true });

            if (!error && data && data.length > 0) {
                clips = data.map((d) => ({
                    url: d.video_url,
                    duration: d.duration || 5,
                }));
            }
        } catch (e) {}

        loading = false;
    });

    function isValidVideoUrl(url: string) {
        if (!url) return false;
        return url.startsWith("http") || url.startsWith("/") || url.startsWith("./");
    }

    $: marqueeSpeed = clips.length > 0 ? clips.length * 8 : 40;
</script>

{#if !loading && clips.length > 0}
    <section class="showreel-section">
        <div class="bg-glow"></div>

        <div class="container">
            <div class="section-header">
                <span class="sub-label">
                    {$lang === "ar" ? "أفضل الأعمال" : "BEST WORKS"}
                </span>
                <h2 class="section-title">
                    {$lang === "ar" ? "أفضل اللقطات" : "Showreel Highlights"}
                </h2>
                <p class="section-desc">
                    {$lang === "ar"
                        ? "شريط سينمائي يستعرض أفضل مقتطفات الأعمال التي قمنا بمونتاجها."
                        : "A cinematic filmstrip showcasing the best highlights of our edited works."}
                </p>
            </div>
        </div>

        <!-- Marquee -->
        <div class="scroll-wrap" dir="ltr">
            <!-- طمس الحواف -->
            <div class="edge-fade left"></div>
            <div class="edge-fade right"></div>

            <div class="clips-track" style="animation-duration: {marqueeSpeed}s">
                <!-- Original Set -->
                {#each clips as clip}
                    {#if isValidVideoUrl(clip.url)}
                        <div class="clip-card">
                            <video
                                src={clip.url}
                                muted
                                autoplay
                                loop
                                playsinline
                                preload="metadata"
                                class="clip-video"
                            ></video>
                            <div class="clip-overlay"></div>
                        </div>
                    {/if}
                {/each}
                <!-- Duplicate Set for Seamless Loop -->
                {#each clips as clip}
                    {#if isValidVideoUrl(clip.url)}
                        <div class="clip-card">
                            <video
                                src={clip.url}
                                muted
                                autoplay
                                loop
                                playsinline
                                preload="metadata"
                                class="clip-video"
                            ></video>
                            <div class="clip-overlay"></div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </section>
{/if}

<style>
    .showreel-section {
        padding: 100px 0 130px;
        position: relative;
        overflow: hidden;
    }

    .bg-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 350px;
        background: radial-gradient(ellipse,
            rgba(0, 229, 255, 0.1) 0%,
            rgba(0, 80, 200, 0.06) 50%,
            transparent 70%
        );
        pointer-events: none;
        z-index: 0;
        will-change: transform;
    }

    .container {
        position: relative;
        z-index: 2;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 60px;
    }

    /* ---- Header ---- */
    .section-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .sub-label {
        display: block;
        color: var(--primary);
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 6px;
        margin-bottom: 14px;
        text-transform: uppercase;
    }

    .section-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(2.4rem, 5vw, 4rem);
        font-weight: 900;
        margin: 0;
        padding: 0.2em 0.3em 0.5em; /* Matching standard padding */
        line-height: 1.2;
        display: inline-block;
        overflow: visible;
        background: linear-gradient(
            110deg,
            var(--primary) 0%,
            #ffffff 25%,
            #ffffff 75%,
            var(--primary) 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(0, 229, 255, 0.15);
        animation: textShine 6s linear infinite;
        vertical-align: top;
    }

    @keyframes textShine {
        to { background-position: 200% center; }
    }

    .section-desc {
        font-size: 1.05rem;
        color: var(--text-muted);
        max-width: 520px;
        margin: 0 auto;
        line-height: 1.7;
    }

    /* ---- Scroll Row ---- */
    .scroll-wrap {
        position: relative;
        width: 100%;
        overflow: hidden;
        padding: 30px 0;
        z-index: 2;
    }

    .edge-fade {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 120px;
        z-index: 4;
        pointer-events: none;
    }
    .edge-fade.left {
        left: 0;
        background: linear-gradient(90deg, var(--bg-dark) 0%, transparent 100%);
    }
    .edge-fade.right {
        right: 0;
        background: linear-gradient(-90deg, var(--bg-dark) 0%, transparent 100%);
    }

    .clips-track {
        display: flex;
        gap: 18px;
        padding: 8px 0;
        width: max-content;
        animation: marquee linear infinite;
        will-change: transform;
    }

    .clips-track:hover {
        animation-play-state: paused;
    }

    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(-50% - 9px)); }
    }

    /* ---- كارت الكليب ---- */
    .clip-card {
        position: relative;
        width: 230px;
        height: 400px;
        border-radius: 20px;
        overflow: hidden;
        flex-shrink: 0;
        background: #060e1e;
        border: 1px solid rgba(255, 255, 255, 0.07);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        will-change: transform;
        contain: content;

        /* تأثير tilt خفيف ثابت — CSS فقط بدون JS */
        transform: perspective(900px) rotateY(-4deg) scale(0.95);
        opacity: 0.78;

        transition:
            transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            opacity 0.45s ease,
            border-color 0.45s ease,
            box-shadow 0.45s ease;
    }

    .clip-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        inset: 0;
        z-index: 1;
        display: block;
        opacity: 0.88;
    }

    .clip-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            180deg,
            transparent 50%,
            rgba(0, 0, 0, 0.65) 100%
        );
        z-index: 2;
    }

    /* ---- Responsive ---- */
    @media (max-width: 768px) {
        .showreel-section { padding: 70px 0 90px; }
        .container { padding: 0 24px; }
        .clip-card {
            width: 170px;
            height: 300px;
        }
        .section-header { margin-bottom: 40px; }
    }
</style>
