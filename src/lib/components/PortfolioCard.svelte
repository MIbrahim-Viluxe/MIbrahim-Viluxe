<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { fade } from "svelte/transition";
    import type { PortfolioItem } from "$lib/types";

    let {
        item,
        onclick,
    }: {
        item: PortfolioItem & { duration?: string; videos_count?: number; aspect_ratio?: 'landscape' | 'portrait' };
        onclick?: () => void;
    } = $props();

    let displayImage = $derived.by(() => {
        // 1. Try explicit image
        if (item.image && typeof item.image === "string" && item.image.trim() !== "") {
            return item.image;
        }

        // 2. Try to extract from youtube link
        let ytId = "";
        const url = item.video_url || item.video || "";

        if (url) {
            try {
                if (url.includes("youtu.be/"))
                    ytId = url.split("youtu.be/")[1]?.split("?")[0];
                else if (url.includes("v="))
                    ytId = url.split("v=")[1]?.split("&")[0];
                else if (url.includes("shorts/"))
                    ytId = url.split("shorts/")[1]?.split("?")[0];
                else if (url.includes("embed/"))
                    ytId = url.split("embed/")[1]?.split("?")[0];
            } catch (err) {}
        }

        if (ytId) {
            // Priority: maxresdefault for high quality, fallback to hqdefault
            return `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
        }

        // 3. Absolute fallback
        return "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80";
    });
    let isHovered = $state(false);

    let embedUrl = $derived.by(() => {
        const url = item.video_url || item.video || "";
        if (!url) return "";
        
        let ytId = "";
        try {
            if (url.includes("youtu.be/")) ytId = url.split("youtu.be/")[1]?.split("?")[0];
            else if (url.includes("v=")) ytId = url.split("v=")[1]?.split("&")[0];
            else if (url.includes("shorts/")) ytId = url.split("shorts/")[1]?.split("?")[0];
            else if (url.includes("embed/")) ytId = url.split("embed/")[1]?.split("?")[0];
        } catch (err) {}

        if (ytId) {
            // Use embed with autoplay, mute, and looping for preview
            return `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0`;
        }
        return "";
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="light-portfolio-card {item.aspect_ratio || 'landscape'}" 
    {onclick}
    onmouseenter={() => isHovered = true}
    onmouseleave={() => isHovered = false}
>
    <div class="card-image-wrapper" style="padding-top: {(item.aspect_ratio === 'portrait') ? '177.77%' : '56.25%'}">
        <img
            src={displayImage}
            alt={$lang === "ar" ? item.title_ar : item.title_en}
            loading="lazy"
            class:hidden={isHovered && embedUrl}
            onerror={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.src.includes('maxresdefault.jpg')) {
                    img.src = img.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                } else if (!img.src.includes('unsplash.com')) {
                    img.src = "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80";
                }
            }}
        />

        {#if isHovered && embedUrl}
            <div class="video-preview-iframe" in:fade={{ duration: 300 }}>
                <iframe
                    src={embedUrl}
                    title="Preview"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
        {/if}

        <div class="card-overlay">
            {#if item.category}
                <span class="category-badge">
                    {#if item.category === "reels"}
                        {$lang === "ar" ? "ريلز" : "Reels"}
                    {:else if item.category === "video" || item.category === "videos"}
                        {$lang === "ar" ? "فيديو" : "Video"}
                    {:else if item.category === "doc" || item.category === "docs"}
                        {$lang === "ar" ? "وثائقي" : "Doc"}
                    {:else if item.category === "ads"}
                        {$lang === "ar" ? "إعلانات" : "Ads"}
                    {:else}
                        {item.category}
                    {/if}
                </span>
            {/if}
            <div class="overlay-icon">
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                >
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </div>
    </div>

    <div class="card-content">
        <h3 class="card-title" dir={$lang === "ar" ? "rtl" : "ltr"}>
            {$lang === "ar" ? item.title_ar : item.title_en}
        </h3>
    </div>
</div>

<style>
    .light-portfolio-card {
        background: linear-gradient(
            145deg,
            rgba(15, 23, 42, 0.6),
            rgba(2, 6, 18, 0.9)
        );
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        transition:
            transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.5s ease,
            border-color 0.5s ease;
        text-decoration: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.05);
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .light-portfolio-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.7),
            0 0 20px rgba(0, 229, 255, 0.2);
        border-color: rgba(0, 229, 255, 0.4);
    }

    .card-image-wrapper img.hidden {
        opacity: 0;
    }

    .video-preview-iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    }

    .video-preview-iframe iframe {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.15); /* Zoom to hide black bars if any */
    }

    .card-image-wrapper {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* 16:9 Aspect Ratio */
        background: #000;
        overflow: hidden;
    }

    .card-image-wrapper img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.5s ease;
        /* Cinematic filter to unify thumbnails */
        filter: contrast(1.1) brightness(0.85) saturate(0.9);
    }

    .light-portfolio-card:hover .card-image-wrapper img {
        transform: scale(1.1);
        filter: contrast(1.1) brightness(1) saturate(1);
    }

    .card-overlay {
        position: absolute;
        inset: 0;
        /* Permanent subtle gradient to unify text backdrop */
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 60%
        );
        opacity: 0.6; /* Semi-visible always */
        transition: all 0.4s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        z-index: 2;
    }

    .light-portfolio-card:hover .card-overlay {
        opacity: 1;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.4) 40%,
            transparent 100%
        );
    }

    .category-badge {
        align-self: flex-start;
        background: linear-gradient(135deg, var(--primary), #ffffff);
        color: #000;
        font-size: 0.7rem;
        font-weight: 900;
        padding: 5px 12px;
        border-radius: 8px;
        text-transform: uppercase;
        box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
        transform: translateY(-10px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s;
    }

    .light-portfolio-card:hover .category-badge {
        transform: translateY(0);
        opacity: 1;
    }

    .overlay-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.5);
        background: rgba(0, 229, 255, 0.9);
        color: #000;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.5);
    }

    .light-portfolio-card:hover .overlay-icon {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }

    @media (max-width: 768px) {
        .overlay-icon {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.8);
            background: rgba(0, 229, 255, 0.7);
        }
        .category-badge {
            opacity: 1;
            transform: translateY(0);
        }
        .card-title {
            font-size: 1rem;
        }
    }

    .card-content {
        padding: 20px;
        background: transparent;
        flex-grow: 1;
        border-top: 1px solid rgba(255, 255, 255, 0.03);
    }

    .card-title {
        font-family: "Alexandria", sans-serif;
        margin: 0;
        font-size: 1.15rem;
        color: #fff;
        font-weight: 700;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: color 0.3s ease;
    }

    .light-portfolio-card:hover .card-title {
        color: var(--primary);
    }
</style>
