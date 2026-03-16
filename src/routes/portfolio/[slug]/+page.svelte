<script lang="ts">
    import { marked } from "marked";
    import { lang } from "$lib/stores/lang";
    import { t } from "$lib/utils/cms";
    import PortfolioCard from "$lib/components/PortfolioCard.svelte";

    let { data } = $props();
    const project = $derived(data.project);
    const portfolio = $derived(data.portfolio);
    const settings = $derived(data.settings);

    let htmlBody = $derived(
        project
            ? ($lang === "ar" ? project.desc_ar : project.desc_en) || ""
            : "",
    );

    function getEmbedUrl(url: string) {
        if (!url) return "";
        let videoId = "";
        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0];
        } else if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split("v=")[1]?.split("&")[0];
        } else if (url.includes("youtube.com/shorts/")) {
            videoId = url.split("shorts/")[1]?.split("?")[0];
        } else if (url.includes("youtube.com/embed/")) {
            return url;
        } else if (url.includes("vimeo.com/")) {
            const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0];
            return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0`;
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
        return url;
    }
</script>

<svelte:head>
    <title>
        {$lang === "ar" ? project.title_ar : project.title_en} | Mohamed Ibrahim
    </title>
    <meta
        name="description"
        content={$lang === "ar"
            ? project.description_ar
            : project.description_en}
    />

    <!-- Open Graph for specific project sharing -->
    <meta
        property="og:title"
        content={$lang === "ar" ? project.title_ar : project.title_en}
    />
    <meta
        property="og:description"
        content={$lang === "ar"
            ? project.description_ar
            : project.description_en}
    />
    {#if project.image}
        <meta property="og:image" content={project.image} />
        <meta name="twitter:image" content={project.image} />
    {/if}
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
        name="twitter:title"
        content={$lang === "ar" ? project.title_ar : project.title_en}
    />
    <meta
        name="twitter:description"
        content={$lang === "ar"
            ? project.description_ar
            : project.description_en}
    />
</svelte:head>

<!-- Cinematic Main Video / Hero Component -->
<div class="project-hero">
    {#if project.video}
        <div class="video-container">
            {#if project.video_type === "direct"}
                <!-- svelte-ignore a11y_media_has_caption -->
                <video src={project.video} controls autoplay class="main-player"
                ></video>
            {:else}
                <iframe
                    src={getEmbedUrl(project.video)}
                    class="main-player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    title={$lang === "ar" ? project.title_ar : project.title_en}
                ></iframe>
            {/if}
        </div>
    {:else}
        <div class="image-container">
            <img
                src={project.image}
                alt={$lang === "ar" ? project.title_ar : project.title_en}
                class="main-player object-cover"
            />
        </div>
    {/if}
</div>

<section class="project-content-section">
    <div class="container">
        <!-- Project Header Details -->
        <div class="project-header fade-in">
            <div class="category-badge">
                {t(settings, `common.${project.category}`, $lang) ||
                    project.category}
            </div>
            <h1 class="project-title">
                {$lang === "ar" ? project.title_ar : project.title_en}
            </h1>
            <p class="project-desc">
                {$lang === "ar"
                    ? project.description_ar
                    : project.description_en}
            </p>
        </div>

        <!-- Two Column Layout: Details and CTA -->
        <div class="content-grid fade-in-delay">
            <div class="main-details glass-card">
                <h3 class="section-heading">
                    {t(settings, "common.project_details", $lang) ||
                        "تفاصيل المشروع"}
                </h3>
                <div class="prose">
                    {@html marked.parse(htmlBody)}
                </div>
            </div>

            <div class="sidebar">
                <div class="cta-card glass-card">
                    <h4 class="cta-title">
                        {t(settings, "common.order_similar_work", $lang) ||
                            "اطلب عملاً مشابهاً"}
                    </h4>
                    <p class="cta-desc">
                        {$lang === "ar"
                            ? "هل أعجبك هذا العمل؟ تواصل معنا لننفذ لك مشروعاً بمستوى احترافي مشابه."
                            : "Did you like this work? Contact us to execute a professional project for you."}
                    </p>
                    <a
                        href="https://wa.me/{settings?.contact
                            ?.whatsapp}?text={encodeURIComponent(
                            (settings?.whatsapp_messages?.portfolio_msg || '') +
                                ($lang === 'ar'
                                    ? project.title_ar
                                    : project.title_en),
                        )}"
                        target="_blank"
                        class="btn-primary full-width interact"
                    >
                        {t(settings, "common.contact_now", $lang) ||
                            "تواصل معنا"}
                    </a>
                </div>
            </div>
        </div>

        <!-- Image Gallery (if exists) -->
        {#if project.gallery && project.gallery.length > 0}
            <div class="gallery-section fade-in">
                <h3 class="section-heading centered">
                    {$lang === "ar" ? "معرض الصور" : "Gallery"}
                </h3>
                <div class="gallery-grid">
                    {#each project.gallery as img}
                        <div class="gallery-item">
                            <img src={img} alt="Gallery" class="gallery-img" />
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Similar Projects Grid -->
        {#if portfolio && portfolio.length > 0}
            <div class="similar-projects-section fade-in">
                <h3 class="section-heading">
                    {$lang === "ar" ? "مشاريع مشابهة" : "Similar Projects"}
                </h3>
                <div class="similar-grid">
                    {#each portfolio.slice(0, 6) as item}
                        <div class="grid-item">
                            <PortfolioCard
                                {item}
                                onclick={() =>
                                    (window.location.href = `/portfolio/${item.slug}`)}
                            />
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</section>

<style>
    /* Dark Theme & Basics */
    :global(body) {
        font-family: var(--font-ar, "Inter", sans-serif);
    }

    .project-hero {
        width: 100%;
        background: transparent;
        padding-top: 80px; /* Offset for navbar */
    }

    .video-container,
    .image-container {
        position: relative;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        aspect-ratio: 16 / 9;
        background: transparent;
    }

    @media (min-width: 1400px) {
        .video-container,
        .image-container {
            border-radius: 0 0 20px 20px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }
    }

    .main-player {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .object-cover {
        object-fit: cover;
    }

    .project-content-section {
        padding: 60px 0 100px;
    }

    .project-header {
        text-align: center;
        margin-bottom: 60px;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    .category-badge {
        display: inline-block;
        color: var(--primary, #00aeef);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 0.9rem;
        margin-bottom: 12px;
        background: rgba(0, 174, 239, 0.1);
        padding: 6px 16px;
        border-radius: 30px;
    }

    .project-title {
        font-size: 3.5rem;
        margin: 0 0 20px;
        font-weight: 900;
        color: #fff;
        line-height: 1.2;
    }

    .project-desc {
        font-size: 1.25rem;
        color: #aaa;
        line-height: 1.6;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
        align-items: start;
        margin-bottom: 80px;
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }

    .section-heading {
        color: var(--primary, #00aeef);
        font-size: 1.5rem;
        margin-bottom: 24px;
        font-weight: 800;
    }

    .centered {
        text-align: center;
    }

    .prose {
        line-height: 1.8;
        font-size: 1.1rem;
        color: #ddd;
    }
    .prose :global(p) {
        margin-bottom: 20px;
    }

    .cta-title {
        font-size: 1.25rem;
        margin-bottom: 15px;
        color: #fff;
    }

    .cta-desc {
        color: #aaa;
        font-size: 0.95rem;
        margin-bottom: 24px;
        line-height: 1.5;
    }

    .full-width {
        width: 100%;
        text-align: center;
        display: block;
        box-sizing: border-box;
        border-radius: 30px;
        padding: 12px;
        font-weight: bold;
        text-decoration: none;
    }

    .interact:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 174, 239, 0.4);
    }

    .gallery-section {
        margin-bottom: 80px;
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    .gallery-item {
        border-radius: 12px;
        overflow: hidden;
        aspect-ratio: 16 / 9;
        cursor: pointer;
    }

    .gallery-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }

    .gallery-item:hover .gallery-img {
        transform: scale(1.05);
    }

    /* Similar Grid (Netflix Card Style Output) */
    .similar-projects-section {
        margin-top: 60px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 60px;
    }

    .similar-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 30px;
    }

    /* Animations */
    .fade-in {
        animation: fadeIn 0.8s ease backwards;
    }
    .fade-in-delay {
        animation: fadeIn 0.8s ease 0.2s backwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 900px) {
        .content-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .project-title {
            font-size: 2.2rem;
        }
        .glass-card {
            padding: 24px;
        }
        .project-content-section {
            padding: 40px 0 60px;
        }
        .similar-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }
    }
</style>
