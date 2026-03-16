<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import PortfolioCard from "$lib/components/PortfolioCard.svelte";
    import { t } from "$lib/utils/cms";
    import { selectedVideo } from "$lib/stores/video";
    import { fade, scale } from "svelte/transition";
    import { flip } from "svelte/animate";

    let { data }: { data: { portfolio: any[]; categories: any[]; settings: any } } = $props();
    
    const settings = $derived(data.settings);
    const categories = $derived([
        { name: "All", name_ar: "الكل", slug: "all" },
        ...(data.categories || [])
    ]);

    let filter = $state("all");
    let limit = $state(12);

    const filteredPortfolio = $derived(
        (filter === "all"
            ? data.portfolio
            : data.portfolio.filter((item) => item.category === filter)) || []
    );

    const visibleItems = $derived(filteredPortfolio.slice(0, limit));

    function loadMore() {
        limit += 12;
    }

    function setFilter(slug: string) {
        filter = slug;
        limit = 12;
    }
</script>

<svelte:head>
    <title>{$lang === "ar" ? "سابقة الأعمال" : "Portfolio"} | Mohamed Ibrahim</title>
    <meta name="description" content="Explore our creative video editing portfolio, featuring commercials, reels, and documentaries." />
</svelte:head>

<section class="portfolio-page">
    <div class="container">
        <!-- Header Section -->
        <div class="portfolio-header animate-on-scroll fade-in">
            <span class="sub-label">{$lang === 'ar' ? 'معرض الأعمال' : 'CREATIVE PORTFOLIO'}</span>
            <h1 class="page-title">
                {$lang === 'ar' ? 'سابقة أعمالنا الإبداعية' : 'Our Creative Portfolio'}
            </h1>
            <p class="page-desc">
                {$lang === 'ar' 
                    ? 'اكتشف مجموعة مختارة من أفضل أعمالنا في صناعة المحتوى والإخراج والمونتاج.' 
                    : 'Discover a curated selection of our best work in content creation and video editing.'}
            </p>
        </div>

        <!-- Dynamic Category Filters -->
        <div class="filter-wrapper">
            <div class="filter-container">
                {#each categories as cat}
                    <button
                        onclick={() => setFilter(cat.slug)}
                        class="filter-btn {filter === cat.slug ? 'active' : ''}"
                    >
                        {$lang === 'ar' ? (cat.name_ar || cat.name) : cat.name}
                        {#if filter === cat.slug}
                            <span class="count-badge">
                                {data.portfolio.filter(p => cat.slug === 'all' || p.category === cat.slug).length}
                            </span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Portfolio Grid -->
        <div class="portfolio-grid-wrapper">
            {#if visibleItems.length > 0}
                <div class="portfolio-grid">
                    {#each visibleItems as item (item.id)}
                        <div
                            class="grid-item {item.aspect_ratio || 'landscape'}"
                            animate:flip={{ duration: 400 }}
                            in:scale={{ duration: 400, start: 0.9, opacity: 0 }}
                        >
                            <PortfolioCard
                                {item}
                                onclick={() => selectedVideo.set(item)}
                            />
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="empty-state" in:fade>
                    <div class="empty-icon">📂</div>
                    <p>{$lang === 'ar' ? 'لا توجد أعمال في هذا التصنيف حالياً.' : 'No items found in this category yet.'}</p>
                </div>
            {/if}
        </div>

        <!-- Load More Section -->
        {#if limit < filteredPortfolio.length}
            <div class="load-more-container">
                <button onclick={loadMore} class="load-more-btn">
                    <span>{$lang === 'ar' ? 'عرض المزيد من الأعمال' : 'Load More Projects'}</span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        {/if}
    </div>
</section>

<style>
    .portfolio-page {
        padding: 160px 0 100px;
        background: radial-gradient(circle at top right, rgba(0, 229, 255, 0.03), transparent 40%),
                    radial-gradient(circle at bottom left, rgba(0, 229, 255, 0.03), transparent 40%);
    }

    .portfolio-header {
        text-align: center;
        margin-bottom: 80px;
    }

    .sub-label {
        display: inline-block;
        color: var(--primary);
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 6px;
        margin-bottom: 20px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(0, 229, 255, 0.3);
        padding-bottom: 8px;
    }

    .page-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 900;
        margin: 0 auto 25px;
        line-height: 1.2;
        background: linear-gradient(110deg, #fff 0%, var(--primary) 50%, #fff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 8s linear infinite;
    }

    @keyframes shine {
        to { background-position: 200% center; }
    }

    .page-desc {
        font-size: 1.15rem;
        color: var(--text-muted);
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.7;
    }

    .filter-wrapper {
        margin-bottom: 60px;
        display: flex;
        justify-content: center;
        position: sticky;
        top: 100px;
        z-index: 10;
        padding: 10px 0;
    }

    .filter-container {
        display: flex;
        gap: 12px;
        padding: 10px 20px;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 100px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .filter-container::-webkit-scrollbar { display: none; }

    .filter-btn {
        background: transparent;
        border: none;
        color: #888;
        padding: 10px 24px;
        border-radius: 100px;
        cursor: pointer;
        font-weight: 700;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
    }

    .filter-btn:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
    }

    .filter-btn.active {
        background: var(--primary);
        color: #000;
        box-shadow: 0 0 20px var(--primary-glow);
    }

    .count-badge {
        font-size: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        padding: 2px 8px;
        border-radius: 10px;
    }

    .portfolio-grid-wrapper {
        min-height: 500px;
    }

    .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 30px;
    }

    /* Grid mixing of landscape and portrait */
    .grid-item.portrait {
        grid-row: span 2;
    }

    .empty-state {
        text-align: center;
        padding: 100px 0;
        color: var(--text-muted);
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.3;
    }

    .load-more-container {
        text-align: center;
        margin-top: 80px;
    }

    .load-more-btn {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(0, 229, 255, 0.3);
        color: #fff;
        padding: 18px 45px;
        border-radius: 100px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.4s ease;
        display: inline-flex;
        align-items: center;
        gap: 15px;
        backdrop-filter: blur(10px);
    }

    .load-more-btn:hover {
        background: var(--primary);
        color: #000;
        transform: translateY(-5px);
        box-shadow: 0 10px 30px var(--primary-glow);
    }

    @media (max-width: 768px) {
        .portfolio-page { padding-top: 120px; }
        .page-title { font-size: 2.2rem; }
        .filter-wrapper { top: 80px; }
        .portfolio-grid { grid-template-columns: 1fr; gap: 20px; }
        .grid-item.portrait { grid-row: auto; }
        .filter-container { border-radius: 20px; }
    }
</style>
