<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { t } from "$lib/utils/cms";

    interface ServiceItem {
        title_ar: string;
        title_en: string;
        icon: string;
        description_ar: string;
        description_en: string;
        slug: string;
    }

    let { services, settings }: { services: ServiceItem[]; settings: any } =
        $props();
</script>

<section id="services" class="services-section">
    <div class="container">
        <h2 class="section-title">
            {t(settings, "pages.services.title", $lang)}
        </h2>
        <div class="services-grid">
            {#each services as service}
                <div
                    class="glass service-card animate-on-scroll"
                    style="text-align: {$lang === 'ar' ? 'right' : 'left'};"
                >
                    <div class="service-icon">
                        {service.icon}
                    </div>
                    <h3 class="service-title">
                        {$lang === "ar" ? service.title_ar : service.title_en}
                    </h3>
                    <p class="service-desc">
                        {$lang === "ar"
                            ? service.description_ar
                            : service.description_en}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .services-section {
        padding: 100px 0;
        background: #080808;
    }

    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }

    .service-card {
        padding: 40px;
        transition: var(--transition);
    }

    .service-icon {
        font-size: 3rem;
        margin-bottom: 20px;
    }

    .section-title {
        font-family: "Alexandria", sans-serif;
        text-align: center;
        font-size: clamp(2.4rem, 5vw, 4rem);
        font-weight: 900;
        margin: 0 auto 60px;
        padding: 0.2em 0.3em 0.5em; /* Standard padding */
        line-height: 1.2;
        display: block;
        width: fit-content;
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
    }

    @keyframes textShine {
        to { background-position: 200% center; }
    }

    .service-title {
        margin-bottom: 15px;
        font-size: 1.5rem;
        font-weight: 700;
    }

    .service-desc {
        color: var(--text-muted);
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .services-section {
            padding: 60px 0;
        }

        .services-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .service-card {
            padding: 25px;
        }

        .service-icon {
            font-size: 2.5rem;
        }
    }

    .service-card:hover {
        transform: translateY(-10px);
        border-color: var(--primary);
    }
</style>
