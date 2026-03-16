<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase";
    import { t } from "$lib/utils/cms";
    import { selectedVideo } from "$lib/stores/video";
    import { fade, scale } from "svelte/transition";
    import type { PortfolioItem } from "$lib/types";

    let { portfolio, settings, categories: dbCategories = [] }: {
        portfolio: PortfolioItem[];
        settings: any;
        categories?: { slug: string; name: string; name_ar?: string; order_index?: number }[];
    } = $props();

    onMount(async () => {
    });

    // Fallback hardcoded إذا قاعدة البيانات فارغة
    const FALLBACK_CATEGORIES = [
        { slug: "ads",    name: "Ads",    name_ar: "إعلانات" },
        { slug: "reels",  name: "Reels",  name_ar: "ريلز" },
        { slug: "videos", name: "Videos", name_ar: "فيديوهات" },
        { slug: "docs",   name: "Docs",   name_ar: "وثائقيات" },
    ];

    const allCategories = $derived(
        (dbCategories && dbCategories.length > 0) ? dbCategories : FALLBACK_CATEGORIES
    );

    const grouped = $derived(
        allCategories.map((cat) => ({
            slug: cat.slug,
            label: $lang === "ar" ? (cat.name_ar || cat.name) : cat.name,
            items: portfolio
                .filter((p) => p.category === cat.slug)
                .sort((a, b) => {
                    const da = a.date ? new Date(a.date).getTime() : 0;
                    const db = b.date ? new Date(b.date).getTime() : 0;
                    return db - da;
                }),
        })).filter((cat) => cat.items.length > 0)
    );

    function getYtId(url: string): string {
        if (!url) return "";
        try {
            if (url.includes("youtu.be/"))  return url.split("youtu.be/")[1]?.split("?")[0] ?? "";
            if (url.includes("v="))          return url.split("v=")[1]?.split("&")[0] ?? "";
            if (url.includes("shorts/"))     return url.split("shorts/")[1]?.split("?")[0] ?? "";
            if (url.includes("embed/"))      return url.split("embed/")[1]?.split("?")[0] ?? "";
        } catch (_) {}
        return "";
    }

    function getThumbnail(item: PortfolioItem): string {
        if (item.image?.trim()) return item.image;
        const ytId = getYtId(item.video_url || item.video || "");
        if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        // Fallback: dark gradient placeholder
        return "";
    }

    function cardStyle(item: PortfolioItem): string {
        const thumb = getThumbnail(item);
        if (thumb) return `background-image: url('${thumb}');`;
        // No thumbnail — show branded gradient
        return `background: linear-gradient(160deg, #0a1628 0%, #030d20 100%);`;
    }


    function getPreviewEmbed(item: PortfolioItem): string {
        const ytId = getYtId(item.video_url || item.video || "");
        if (!ytId) return "";
        return `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&start=3&modestbranding=1&rel=0`;
    }

    function getCategoryLabel(cat: string): string {
        const map: Record<string, { ar: string; en: string }> = {
            ads:    { ar: "إعلان",     en: "Ad"       },
            reels:  { ar: "ريلز",      en: "Reel"     },
            videos: { ar: "فيديو",     en: "Video"    },
            docs:   { ar: "وثائقي",    en: "Doc"      },
        };
        const l = map[cat] ?? { ar: cat, en: cat };
        return $lang === "ar" ? l.ar : l.en;
    }

    // Hover state
    let hoveredItem = $state<PortfolioItem | null>(null);
    let hoverTimer: ReturnType<typeof setTimeout>;
    let popupLeft = $state(0);
    let popupTop  = $state(0);

    const POPUP_W = 260;
    const POPUP_H = 480; // video + info

    function onEnter(item: PortfolioItem, e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top;

        const isLandscape = item.aspect_ratio === 'landscape';
        const p_width = isLandscape ? 400 : 260;
        const p_height = isLandscape ? 300 : 480;

        // حساب X — نمنع خروجه من الشاشة
        const vw = window.innerWidth;
        popupLeft = Math.min(Math.max(cx - p_width / 2, 10), vw - p_width - 10);

        // حساب Y — نحط فوق الكارت لو في مساحة، وإلا تحته
        popupTop = cy > p_height + 20 ? cy - p_height - 14 : cy + rect.height + 8;

        hoverTimer = setTimeout(() => { hoveredItem = item; }, 350);
    }

    function onLeave() {
        clearTimeout(hoverTimer);
        hoveredItem = null;
    }

    function openItem(item: PortfolioItem) {
        onLeave();
        selectedVideo.set(item);
    }
</script>

<section id="portfolio" class="portfolio-rows-section">
    <div class="bg-particles"></div>

    <div class="section-head container">
        <span class="sub-label">
            {$lang === "ar" ? "معرض الأعمال" : "PORTFOLIO"}
        </span>
        <h2 class="section-title">
            {t(settings, "pages.portfolio.title", $lang) || ($lang === "ar" ? "سابقة الأعمال" : "Our Works")}
        </h2>
    </div>

    {#each grouped as cat}
        <div class="category-row">
            <div class="row-header container">
                <h3 class="row-title">
                    {cat.label}
                </h3>
                <span class="row-count">{cat.items.length}</span>
            </div>

            <div class="row-scroll-wrapper" dir="ltr">
                <div class="edge-fade left"></div>
                <div class="edge-fade right"></div>
                
                <div class="items-track">
                    {#each cat.items as item}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                        <div
                            class="thumb-card {hoveredItem?.slug === item.slug ? 'hovered' : ''} {item.aspect_ratio || 'portrait'}"
                            style={cardStyle(item)}
                            onmouseenter={(e) => onEnter(item, e)}
                            onmouseleave={onLeave}
                            onclick={() => openItem(item)}
                            role="button"
                            tabindex="0"
                            onkeydown={(e) => e.key === "Enter" && openItem(item)}
                        >
                            <div class="card-bottom">
                                <p class="card-title-text" dir={$lang === "ar" ? "rtl" : "ltr"}>
                                    {$lang === "ar" ? item.title_ar : item.title_en}
                                </p>
                            </div>
                            <div class="play-hint">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/each}

    <div class="view-all-container container">
        <a href="/portfolio" class="view-all-btn">
            {$lang === "ar" ? "عرض جميع الأعمال" : "View All Works"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
            </svg>
        </a>
    </div>
</section>

<!-- ====== Floating Preview Popup (خارج الـ strip) ====== -->
{#if hoveredItem}
    {@const previewUrl = getPreviewEmbed(hoveredItem)}
    <div
        class="float-popup {hoveredItem.aspect_ratio || 'portrait'}"
        style="left: {popupLeft}px; top: {popupTop}px; width: {(hoveredItem.aspect_ratio === 'landscape') ? '400px' : '260px'}"
        transition:scale={{ duration: 220, start: 0.88 }}
        onmouseenter={() => { clearTimeout(hoverTimer); }}
        onmouseleave={onLeave}
        role="dialog"
        tabindex="-1"
        aria-label="preview"
    >
        <!-- فيديو YouTube أو حتى لو مفيش عرض thumbnail -->
        <div class="popup-video-wrap" style="height: {(hoveredItem.aspect_ratio === 'landscape') ? '225px' : '420px'}">
            {#if previewUrl}
                <iframe
                    src={previewUrl}
                    class="popup-iframe"
                    title="preview"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                ></iframe>
            {:else}
                <div class="popup-no-video">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40" opacity="0.3">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            {/if}
        </div>

        <!-- معلومات -->
        <div class="popup-info" dir={$lang === "ar" ? "rtl" : "ltr"}>
            <span class="popup-cat">{getCategoryLabel(hoveredItem.category)}</span>
            <p class="popup-title">
                {$lang === "ar" ? hoveredItem.title_ar : hoveredItem.title_en}
            </p>
            <button
                class="popup-watch-btn"
                onclick={() => hoveredItem && openItem(hoveredItem)}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                {$lang === "ar" ? "مشاهدة" : "Watch"}
            </button>
        </div>
    </div>
{/if}

<style>
    .portfolio-rows-section {
        padding: 100px 0 120px;
        position: relative;
        overflow: hidden;
    }

    .bg-particles {
        position: absolute;
        inset: 0;
        background-image:
            radial-gradient(1px 1px at 25% 35%, rgba(0,174,239,0.15) 1px, transparent 0),
            radial-gradient(1.5px 1.5px at 75% 65%, rgba(255,255,255,0.07) 1px, transparent 0);
        background-size: 220px 220px;
        pointer-events: none;
        z-index: 0;
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 60px;
        position: relative;
        z-index: 2;
    }

    /* ====== Section Header ====== */
    .section-head {
        text-align: center;
        margin-bottom: 80px;
        position: relative;
        z-index: 2;
    }

    .sub-label {
        display: inline-block;
        color: var(--primary);
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 8px;
        margin-bottom: 18px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(0,229,255,0.3);
        padding-bottom: 6px;
    }

    /* نفس أسلوب عناوين الأقسام الأخرى */
    .section-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(2.4rem, 5vw, 4rem);
        font-weight: 900;
        margin: 0;
        padding: 0.2em 0.3em 0.5em; /* Balanced padding for top hamza and bottom dots */
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
        /* Using text-shadow instead of filter to prevent character disappearing on some browsers */
        text-shadow: 0 0 30px rgba(0, 229, 255, 0.15);
        animation: titleShine 6s linear infinite;
        vertical-align: top;
    }

    @keyframes titleShine {
        to { background-position: 200% center; }
    }

    /* ====== Category Row Header ====== */
    .category-row {
        margin-bottom: 60px;
        position: relative;
        z-index: 2;
    }

    .row-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 22px;
        padding: 0 60px;
        direction: ltr; /* ثابت دايماً عشان الـ neon line تكون على الشمال */
    }

    /* خط نيون جانبي */
    .row-header::before {
        content: "";
        width: 4px;
        height: 26px;
        background: linear-gradient(180deg, var(--primary), transparent);
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        flex-shrink: 0;
    }

    .row-title {
        font-family: "Alexandria", sans-serif;
        font-size: 1.25rem;
        font-weight: 800;
        color: #fff;
        margin: 0;
        letter-spacing: 0.5px;
    }

    .row-count {
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid rgba(0, 229, 255, 0.2);
        color: var(--primary);
        font-size: 0.72rem;
        font-weight: 800;
        padding: 3px 10px;
        border-radius: 20px;
        letter-spacing: 1px;
    }

    /* ---- Scroll Row ---- */
    .row-scroll-wrapper {
        position: relative;
        overflow: hidden;
        padding: 16px 0 30px;
    }

    .edge-fade {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100px;
        z-index: 4;
        pointer-events: none;
    }
    .edge-fade.left {
        left: 0;
        background: linear-gradient(90deg, var(--bg-dark, #020a1c) 0%, transparent 100%);
    }
    .edge-fade.right {
        right: 0;
        background: linear-gradient(-90deg, var(--bg-dark, #020a1c) 0%, transparent 100%);
    }

    .items-track {
        display: flex;
        gap: 16px;
        padding: 8px 60px;
        overflow-x: auto;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        scroll-behavior: smooth;
    }

    .items-track::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    /* ---- Card ---- */
    .thumb-card {
        position: relative;
        width: 180px;
        height: 320px;
        border-radius: 14px;
        overflow: hidden;
        flex-shrink: 0;
        cursor: pointer;
        background-color: #071220;
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        will-change: transform;
        contain: content;
        transition:
            transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.35s ease,
            border-color 0.35s ease;
    }

    .thumb-card.portrait {
        width: 180px;
    }

    .thumb-card.landscape {
        width: 560px;
    }

    .thumb-card:hover,
    .thumb-card.hovered {
        transform: scale(1.06) translateY(-4px);
        box-shadow: 0 20px 45px rgba(0,0,0,0.55), 0 0 20px rgba(0,229,255,0.12);
        border-color: rgba(0, 229, 255, 0.45);
        z-index: 5;
    }

    .muted-copy { cursor: default; pointer-events: none; }

    /* عنوان ثابت */
    .card-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 4;
        padding: 28px 12px 12px;
        background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.88) 100%);
    }

    .play-hint {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        z-index: 4;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(0,0,0,0.5);
        border: 1.5px solid rgba(255,255,255,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
        pointer-events: none;
    }

    .play-hint svg { width: 18px; height: 18px; margin-left: 3px; }

    .thumb-card:hover .play-hint {
        opacity: 1;
        transform: translate(-50%, -50%);
        background: rgba(0, 229, 255, 0.75);
        border-color: rgba(0, 229, 255, 0.9);
        box-shadow: 0 0 22px rgba(0, 229, 255, 0.4);
    }

    .card-title-text {
        font-size: 0.78rem;
        font-weight: 700;
        color: #fff;
        text-align: center;
        margin: 0;
        line-height: 1.35;
        max-width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    /* ---- Floating Preview Popup ---- */
    .float-popup {
        position: fixed;
        width: 260px;
        border-radius: 18px;
        overflow: hidden;
        background: #060e1e;
        border: 1px solid rgba(0, 229, 255, 0.3);
        box-shadow:
            0 30px 80px rgba(0,0,0,0.75),
            0 0 40px rgba(0, 229, 255, 0.1);
        z-index: 9000;
        pointer-events: auto;
        transform-origin: bottom center;
    }

    .popup-video-wrap {
        position: relative;
        width: 100%;
        height: 420px;
        background: #000;
        overflow: hidden;
    }

    .popup-iframe {
        position: absolute;
        inset: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        border: 0;
        pointer-events: none;
    }

    .popup-no-video {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(160deg, #0d1a30, #050d1a);
    }

    .popup-info {
        padding: 14px 16px 16px;
        background: #060e1e;
        border-top: 1px solid rgba(0, 229, 255, 0.1);
    }

    .popup-cat {
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 2px;
        color: var(--primary);
        text-transform: uppercase;
        display: block;
        margin-bottom: 6px;
    }

    .popup-title {
        font-size: 0.88rem;
        font-weight: 700;
        color: #fff;
        margin: 0 0 12px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .popup-watch-btn {
        display: flex;
        align-items: center;
        gap: 7px;
        background: var(--primary);
        color: var(--bg-dark, #020a1c);
        border: none;
        border-radius: 30px;
        padding: 8px 18px;
        font-size: 0.82rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.25s ease;
        width: 100%;
        justify-content: center;
    }

    .popup-watch-btn:hover {
        background: #fff;
        box-shadow: 0 0 20px rgba(0,229,255,0.4);
    }

    /* ---- View All ---- */
    .view-all-container {
        text-align: center;
        margin-top: 50px;
    }

    .view-all-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: var(--primary);
        border: 1px solid var(--primary);
        padding: 14px 36px;
        border-radius: 40px;
        font-weight: 700;
        font-size: 0.95rem;
        text-decoration: none;
        letter-spacing: 1px;
        transition: all 0.35s ease;
        box-shadow: 0 0 20px rgba(0,229,255,0.08);
    }

    .view-all-btn svg { width: 18px; height: 18px; transition: transform 0.3s ease; }

    .view-all-btn:hover {
        background: var(--primary);
        color: var(--bg-dark);
        box-shadow: 0 0 30px rgba(0,229,255,0.3);
    }

    .view-all-btn:hover svg { transform: translateX(4px); }

    /* ---- Responsive ---- */
    @media (max-width: 768px) {
        .portfolio-rows-section { padding: 70px 0 90px; }
        .container { padding: 0 20px; }
        .section-head { margin-bottom: 45px; }
        .category-row { margin-bottom: 35px; }
        
        .thumb-card { height: 260px; }
        .thumb-card.portrait { width: 150px; }
        .thumb-card.landscape { width: 300px; }
        
        .row-header { padding: 0 20px; margin-bottom: 15px; }
        .items-track { padding: 0 20px; gap: 12px; }

        .float-popup { display: none; }
    }
</style>
