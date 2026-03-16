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

    let { data }: { data: { services: ServiceItem[]; settings: any } } =
        $props();
    const settings = $derived(data.settings);
</script>

<svelte:head>
    <title
        >{t(settings, "pages.services.title", $lang) ||
            ($lang === "ar" ? "خدماتنا" : "Our Services")} | Mohamed Ibrahim</title
    >
</svelte:head>

<section style="padding: 150px 0 100px;">
    <div class="container">
        <div style="text-align: center; margin-bottom: 80px;">
            <h1 style="font-size: 4rem; font-weight: 900; margin-bottom: 20px;">
                {t(settings, "pages.services.title", $lang)}
            </h1>
            <p
                style="font-size: 1.2rem; color: var(--text-muted); max-width: 700px; margin: 0 auto;"
            >
                {t(settings, "pages.services.desc", $lang)}
            </p>
        </div>

        <div style="display: grid; gap: 40px;">
            {#each data.services as service, i}
                <div
                    class="glass animate-on-scroll"
                    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; padding: 50px; align-items: center; border-left: {i %
                        2 ===
                    0
                        ? '4px solid var(--primary)'
                        : '1px solid rgba(255,255,255,0.1)'}; border-right: {i %
                        2 !==
                    0
                        ? '4px solid var(--primary)'
                        : '1px solid rgba(255,255,255,0.1)'};"
                >
                    <div
                        style="text-align: center; order: {i % 2 === 0
                            ? 1
                            : $lang === 'ar'
                              ? 2
                              : 2};"
                    >
                        <div
                            style="font-size: 6rem; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(var(--primary-rgb, 227,30,36),0.3));"
                        >
                            {service.icon}
                        </div>
                    </div>

                    <div
                        style="text-align: {$lang === 'ar'
                            ? 'right'
                            : 'left'}; order: {i % 2 === 0
                            ? 2
                            : $lang === 'ar'
                              ? 1
                              : 1};"
                    >
                        <h2 style="font-size: 2.5rem; margin-bottom: 20px;">
                            {$lang === "ar"
                                ? service.title_ar
                                : service.title_en}
                        </h2>
                        <p
                            style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 30px;"
                        >
                            {$lang === "ar"
                                ? service.description_ar
                                : service.description_en}
                        </p>
                        <a
                            href="https://wa.me/{settings?.contact
                                ?.whatsapp}?text={encodeURIComponent(
                                ($lang === 'ar'
                                    ? 'مرحباً، أود الاستفسار عن خدمة: '
                                    : 'Hello, I would like to inquire about: ') +
                                    ($lang === 'ar'
                                        ? service.title_ar
                                        : service.title_en),
                            )}"
                            target="_blank"
                            class="btn-primary"
                            style="display: inline-flex; align-items: center; gap: 10px;"
                        >
                            {$lang === "ar"
                                ? "اطلب الخدمة الآن"
                                : "Order Service Now"}
                            <span>→</span>
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .glass {
        transition: var(--transition);
    }
    .glass:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.05);
    }
</style>
