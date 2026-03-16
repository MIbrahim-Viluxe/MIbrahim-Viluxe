<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { t } from "$lib/utils/cms";
    import type { PortfolioItem } from "$lib/types";
    import PortfolioCard from "$lib/components/PortfolioCard.svelte";
    import { selectedVideo } from "$lib/stores/video";

    let { portfolio }: { portfolio: PortfolioItem[] } = $props();

    // Filtering logic
    const verticalVideos = $derived(portfolio.filter(item => 
        item.aspect_ratio === 'portrait' || item.category === 'reels'
    ));

    const horizontalVideos = $derived(portfolio.filter(item => 
        item.aspect_ratio !== 'portrait' && item.category !== 'reels'
    ));

    function openVideo(item: PortfolioItem) {
        selectedVideo.set(item);
    }
</script>

<section id="portfolio" class="video-tracks-section">
    <div class="container tracks-header animate-on-scroll fade-in">
        <span class="sub-label">
            {$lang === 'ar' ? 'معرض المونتاج' : 'EDITING SHOWCASE'}
        </span>
        <h2 class="section-title">
            {$lang === 'ar' ? 'أعمالنا الإبداعية' : 'Our Creative Works'}
        </h2>
        <p class="section-desc">
            {$lang === 'ar' 
                ? 'استعرض مجموعتنا المتنوعة من الفيديوهات المقسمة حسب نوع المحتوى.' 
                : 'Explore our diverse collection of videos categorized by content type.'}
        </p>
    </div>

    <div class="tracks-container" dir="ltr">
        <!-- Row 1: Horizontal Videos -->
        {#if horizontalVideos.length > 0}
            <div class="track-row horizontal-track">
                <div class="track-label">
                    <span>{$lang === 'ar' ? 'فيديوهات عرضية' : 'LANDSCAPE'}</span>
                </div>
                <div class="marquee-wrap">
                    <div class="marquee-track track-slow">
                        <!-- Double set for loop -->
                        {#each [...horizontalVideos, ...horizontalVideos] as item}
                            <div class="marquee-item landscape-item">
                                <PortfolioCard {item} onclick={() => openVideo(item)} />
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}

        <!-- Row 2: Vertical Videos (Reels) -->
        {#if verticalVideos.length > 0}
            <div class="track-row vertical-track">
                <div class="track-label">
                    <span>{$lang === 'ar' ? 'ريلز وفيديوهات طولية' : 'REELS & VERTICAL'}</span>
                </div>
                <div class="marquee-wrap">
                    <div class="marquee-track track-fast reverse">
                        <!-- Double set for loop -->
                        {#each [...verticalVideos, ...verticalVideos] as item}
                            <div class="marquee-item portrait-item">
                                <PortfolioCard {item} onclick={() => openVideo(item)} />
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <!-- View All CTA -->
    <div class="container tracks-footer">
        <a href="/portfolio" class="view-all-btn">
            {$lang === 'ar' ? 'مشاهدة سابقة الأعمال بالكامل' : 'View Full Portfolio'}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </a>
    </div>
</section>


<style>
    .video-tracks-section {
        padding: 100px 0;
        background: transparent;
        position: relative;
        overflow: hidden;
    }

    .tracks-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .section-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(2.8rem, 6vw, 4.5rem);
        font-weight: 900;
        margin: 0 auto 20px;
        padding: 0.5rem 0.2em 2rem;
        line-height: 1.5;
        display: inline-block;
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
        filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.15));
        animation: textShine 6s linear infinite;
        vertical-align: top;
    }

    @keyframes textShine {
        to { background-position: 200% center; }
    }

    .sub-label {
        display: inline-block;
        color: var(--primary);
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 8px;
        margin-bottom: 22px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(0, 229, 255, 0.3);
        padding-bottom: 8px;
    }

    .section-desc {
        color: var(--text-muted);
        max-width: 600px;
        margin: 0 auto;
        font-size: 1.1rem;
        line-height: 1.6;
    }

    .tracks-container {
        display: flex;
        flex-direction: column;
        gap: 60px;
        padding: 40px 0;
    }

    .track-row {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .track-label {
        padding: 0 60px;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 3px;
        color: var(--primary);
        text-transform: uppercase;
        opacity: 0.8;
    }

    .marquee-wrap {
        position: relative;
        overflow: hidden;
        padding: 20px 0;
        mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    }

    .marquee-track {
        display: flex;
        gap: 30px;
        width: max-content;
        animation: marquee var(--duration, 60s) linear infinite;
        padding: 0 15px;
        will-change: transform;
    }

    .marquee-track:hover {
        animation-play-state: paused;
    }

    .track-slow {
        --duration: 80s;
    }

    .track-fast {
        --duration: 50s;
    }

    .reverse {
        animation-direction: reverse;
    }

    @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    .marquee-item {
        flex-shrink: 0;
        transition: transform 0.3s ease;
    }

    /* Track 1: Landscape Row */
    .landscape-item {
        width: 400px;
    }

    /* Track 2: Portrait Row */
    .portrait-item {
        width: 260px;
    }

    .tracks-footer {
        margin-top: 80px;
        text-align: center;
    }

    .view-all-btn {
        display: inline-flex;
        align-items: center;
        gap: 15px;
        padding: 18px 35px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(0, 229, 255, 0.3);
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 700;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .view-all-btn:hover {
        background: var(--primary);
        color: black;
        box-shadow: 0 0 30px var(--primary-glow);
        transform: translateY(-5px);
    }

    @media (max-width: 768px) {
        .video-tracks-section { padding: 60px 0; }
        .landscape-item { width: 300px; }
        .portrait-item { width: 180px; }
        .track-label { padding: 0 24px; }
        .marquee-track { gap: 15px; }
        .tracks-container { gap: 40px; }
    }
</style>
