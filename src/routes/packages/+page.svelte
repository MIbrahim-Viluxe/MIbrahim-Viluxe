<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { t } from "$lib/utils/cms";
    import FAQ from "$lib/components/packages/FAQ.svelte";

    let { data } = $props();
    const settings = $derived(data.settings);

    // Estimator State
    let videoType = $state("social"); // social, youtube, podcast, real_estate, events, corporate
    let duration = $state(1); // minutes
    let deliverySpeed = $state("normal"); // normal, fast, express
    let extras = $state({
        colorCorrection: true,
        soundDesign: true,
        motionGraphics: false,
        subtitles: false,
        thumbnail: false,
    });

    // Base Pricing Configuration (Egyptian Market Rates in EGP)
    const pricing = {
        baseRate: {
            social: 150, // Base per minute (EGP)
            youtube: 300,
            podcast: 20, // 20 per minute -> 600 EGP for 30 mins
            real_estate: 800,
            events: 600,
            corporate: 800,
        },
        deliveryMultipliers: {
            normal: 1, // 5-7 days
            fast: 1.5, // 48 hours
            express: 2.5, // 24 hours
        },
        extrasFlat: {
            colorCorrection: 150,
            soundDesign: 150,
            motionGraphics: 300,
            subtitles: 50,
            thumbnail: 100,
        },
    };

    // Calculate Estimated Total
    let estimatedTotal = $derived.by(() => {
        let total =
            pricing.baseRate[videoType as keyof typeof pricing.baseRate] *
            duration;

        // Add Flat Extras
        if (extras.colorCorrection) total += pricing.extrasFlat.colorCorrection;
        if (extras.soundDesign) total += pricing.extrasFlat.soundDesign;
        if (extras.motionGraphics) total += pricing.extrasFlat.motionGraphics;
        if (extras.subtitles) total += pricing.extrasFlat.subtitles * duration; // Subtitles usually per minute
        if (extras.thumbnail) total += pricing.extrasFlat.thumbnail;

        // Apply Delivery Multiplier
        total =
            total *
            pricing.deliveryMultipliers[
                deliverySpeed as keyof typeof pricing.deliveryMultipliers
            ];

        // Ensure minimum project price is met
        return Math.max(total, 250); // Minimum 250 EGP
    });

    // Whatsapp Generate Message
    const generateWhatsappMessage = () => {
        const typeLabelAr =
            videoType === "social"
                ? "سوشيال ميديا"
                : videoType === "youtube"
                  ? "يوتيوب"
                  : videoType === "podcast"
                    ? "بودكاست"
                    : videoType === "real_estate"
                      ? "عقارات"
                      : videoType === "events"
                        ? "فعاليات وتغطية"
                        : "شركات";
        const typeLabelEn =
            videoType === "social"
                ? "Social Media"
                : videoType === "youtube"
                  ? "YouTube"
                  : videoType === "podcast"
                    ? "Podcast"
                    : videoType === "real_estate"
                      ? "Real Estate"
                      : videoType === "events"
                        ? "Events"
                        : "Corporate";

        const typeLabel = $lang === "ar" ? typeLabelAr : typeLabelEn;

        let msg =
            $lang === "ar"
                ? `مرحباً، أود الاستفسار عن تفاصيل مونتاج:\n\n📹 *نوع الفيديو:* ${typeLabel}\n⏱️ *المدة المطلوبة:* ${duration} ${duration > 1 ? "دقائق" : "دقيقة"}\n🚀 *سرعة التسليم:* ${deliverySpeed === "normal" ? "عادية" : deliverySpeed === "fast" ? "سريعة (48 ساعة)" : "عاجلة (24 ساعة)"}\n\n*إضافات مطلوبة:*`
                : `Hello, I'd like to inquire about video editing services:\n\n📹 *Project Type:* ${typeLabel}\n⏱️ *Duration:* ${duration} ${duration > 1 ? "minutes" : "minute"}\n🚀 *Delivery Speed:* ${deliverySpeed === "normal" ? "Normal" : deliverySpeed === "fast" ? "Fast (48h)" : "Express (24h)"}\n\n*Requested Extras:*`;

        if (extras.colorCorrection)
            msg += $lang === "ar" ? `\n- تصحيح ألوان` : `\n- Color Correction`;
        if (extras.soundDesign)
            msg += $lang === "ar" ? `\n- هندسة صوتية` : `\n- Sound Design`;
        if (extras.motionGraphics)
            msg += $lang === "ar" ? `\n- موشن جرافيك` : `\n- Motion Graphics`;
        if (extras.subtitles)
            msg += $lang === "ar" ? `\n- ترجمة فرعية` : `\n- Subtitles`;
        if (extras.thumbnail)
            msg +=
                $lang === "ar"
                    ? `\n- تصميم صورة مصغرة`
                    : `\n- Thumbnail Design`;

        msg += `\n\n💰 *التكلفة التقديرية المحسوبة:* ${Math.round(estimatedTotal)} EGP`;
        return encodeURIComponent(msg);
    };
</script>

<section class="packages-page">
    <div class="neptune-bg"></div>
    <div class="container relative-z">
        <div class="packages-header animate-on-scroll fade-in">
            <span class="sub-label">
                {$lang === "ar" ? "حدد ميزانيتك" : "CUSTOM QUOTE"}
            </span>
            <h1 class="page-title">
                {$lang === "ar"
                    ? "صمم باقة المونتاج الخاصة بك"
                    : "Build Your Custom Quote"}
            </h1>
            <p class="page-desc">
                {$lang === "ar"
                    ? "حدد متطلبات مشروعك بدقة، احصل على تكلفة تقديرية فورية، وتواصل معنا للبدء في التنفيذ."
                    : "Select your project requirements, get an instant estimate, and contact us to start executing."}
            </p>
        </div>

        <div
            class="estimator-container glass animate-on-scroll fade-in float-medium"
        >
            <div class="estimator-grid">
                <!-- Left Column: Controls -->
                <div class="controls-column">
                    <!-- 1. Video Type -->
                    <div class="control-group">
                        <label class="control-label"
                            >{$lang === "ar"
                                ? "1. نوع الفيديو"
                                : "1. Video Type"}</label
                        >
                        <div class="type-selector">
                            <button
                                class="type-btn {videoType === 'social'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (videoType = "social")}
                            >
                                <i class="fas fa-mobile-alt"></i>
                                {$lang === "ar"
                                    ? "سوشيال ميديا"
                                    : "Social Media"}
                            </button>
                            <button
                                class="type-btn {videoType === 'youtube'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (videoType = "youtube")}
                            >
                                <i class="fab fa-youtube"></i>
                                {$lang === "ar" ? "يوتيوب" : "YouTube"}
                            </button>
                            <button
                                class="type-btn {videoType === 'podcast'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (videoType = "podcast")}
                            >
                                <i class="fas fa-microphone-alt"></i>
                                {$lang === "ar" ? "بودكاست" : "Podcast"}
                            </button>
                            <button
                                class="type-btn {videoType === 'real_estate'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (videoType = "real_estate")}
                            >
                                <i class="fas fa-building"></i>
                                {$lang === "ar" ? "عقارات" : "Real Estate"}
                            </button>
                            <button
                                class="type-btn {videoType === 'events'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (videoType = "events")}
                            >
                                <i class="fas fa-calendar-alt"></i>
                                {$lang === "ar" ? "فعاليات وتغطية" : "Events"}
                            </button>
                            <button
                                class="type-btn {videoType === 'corporate'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (videoType = "corporate")}
                            >
                                <i class="fas fa-briefcase"></i>
                                {$lang === "ar" ? "شركات وتجاري" : "Corporate"}
                            </button>
                        </div>
                    </div>

                    <!-- 2. Duration Slider -->
                    <div class="control-group">
                        <label class="control-label">
                            {$lang === "ar"
                                ? "2. المدة المتوقعة"
                                : "2. Expected Duration"}
                            <span class="value-highlight"
                                >{duration}
                                {$lang === "ar"
                                    ? duration === 1
                                        ? "دقيقة"
                                        : "دقائق"
                                    : duration === 1
                                      ? "Minute"
                                      : "Minutes"}</span
                            >
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="60"
                            bind:value={duration}
                            class="slider"
                        />
                        <div class="slider-labels">
                            <span>1 {$lang === "ar" ? "دقيقة" : "Min"}</span>
                            <span>60 {$lang === "ar" ? "دقيقة" : "Min"}</span>
                        </div>
                    </div>

                    <!-- 3. Delivery Speed -->
                    <div class="control-group">
                        <label class="control-label"
                            >{$lang === "ar"
                                ? "3. موعد التسليم"
                                : "3. Delivery Speed"}</label
                        >
                        <div class="speed-selector">
                            <button
                                class="speed-btn {deliverySpeed === 'normal'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (deliverySpeed = "normal")}
                            >
                                {$lang === "ar"
                                    ? "عادي (5-7 أيام)"
                                    : "Normal (5-7 Days)"}
                            </button>
                            <button
                                class="speed-btn {deliverySpeed === 'fast'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (deliverySpeed = "fast")}
                            >
                                {$lang === "ar"
                                    ? "سريع (48 ساعة)"
                                    : "Fast (48 Hours)"}
                            </button>
                            <button
                                class="speed-btn {deliverySpeed === 'express'
                                    ? 'active'
                                    : ''}"
                                onclick={() => (deliverySpeed = "express")}
                            >
                                ⚡️ {$lang === "ar"
                                    ? "عاجل (24 ساعة)"
                                    : "Express (24 Hours)"}
                            </button>
                        </div>
                    </div>

                    <!-- 4. Extras -->
                    <div class="control-group">
                        <label class="control-label"
                            >{$lang === "ar"
                                ? "4. الإضافات (اختياري)"
                                : "4. Add-ons (Optional)"}</label
                        >
                        <div class="extras-grid">
                            <label
                                class="extra-checkbox {extras.colorCorrection
                                    ? 'active'
                                    : ''}"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={extras.colorCorrection}
                                />
                                <div class="checkbox-visual"></div>
                                <span
                                    >{$lang === "ar"
                                        ? "تصحيح وتلوين سينمائي"
                                        : "Color Grading & Correction"}</span
                                >
                            </label>

                            <label
                                class="extra-checkbox {extras.soundDesign
                                    ? 'active'
                                    : ''}"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={extras.soundDesign}
                                />
                                <div class="checkbox-visual"></div>
                                <span
                                    >{$lang === "ar"
                                        ? "مؤثرات وهندسة صوتية"
                                        : "Sound Design & Mixing"}</span
                                >
                            </label>

                            <label
                                class="extra-checkbox {extras.motionGraphics
                                    ? 'active'
                                    : ''}"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={extras.motionGraphics}
                                />
                                <div class="checkbox-visual"></div>
                                <span
                                    >{$lang === "ar"
                                        ? "إضافة موشن جرافيك"
                                        : "Motion Graphics"}</span
                                >
                            </label>

                            <label
                                class="extra-checkbox {extras.subtitles
                                    ? 'active'
                                    : ''}"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={extras.subtitles}
                                />
                                <div class="checkbox-visual"></div>
                                <span
                                    >{$lang === "ar"
                                        ? "ترجمة فرعية"
                                        : "Subtitles / Captions"}</span
                                >
                            </label>

                            <label
                                class="extra-checkbox {extras.thumbnail
                                    ? 'active'
                                    : ''}"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={extras.thumbnail}
                                />
                                <div class="checkbox-visual"></div>
                                <span
                                    >{$lang === "ar"
                                        ? "تصميم صورة مصغرة"
                                        : "Custom Thumbnail"}</span
                                >
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Result Panel -->
                <div class="result-column">
                    <div class="result-card">
                        <div class="result-glow"></div>
                        <h4>
                            {$lang === "ar"
                                ? "التكلفة التقديرية"
                                : "Estimated Total"}
                        </h4>
                        <div class="price-display">
                            <span class="amount"
                                >{Math.round(estimatedTotal)}</span
                            >
                            <span class="currency">EGP</span>
                        </div>
                        <p class="disclaimer">
                            {$lang === "ar"
                                ? "* هذا السعر تقريبي وقد يتغير قليلاً بناءً على مدى تعقيد التفاصيل المطلوبة."
                                : "* This is an estimated price and may vary slightly depending on project complexity."}
                        </p>

                        <div class="summary-list">
                            <div class="summary-item">
                                <span
                                    >{$lang === "ar"
                                        ? "المدة"
                                        : "Duration"}</span
                                >
                                <span
                                    >{duration}
                                    {$lang === "ar" ? "دقيقة" : "Min"}</span
                                >
                            </div>
                            <div class="summary-item">
                                <span
                                    >{$lang === "ar"
                                        ? "التسليم"
                                        : "Delivery"}</span
                                >
                                <span
                                    >{deliverySpeed === "normal"
                                        ? $lang === "ar"
                                            ? "عادي"
                                            : "Normal"
                                        : deliverySpeed === "fast"
                                          ? $lang === "ar"
                                              ? "سريع"
                                              : "Fast"
                                          : $lang === "ar"
                                            ? "عاجل"
                                            : "Express"}</span
                                >
                            </div>
                            <div class="summary-item">
                                <span
                                    >{$lang === "ar"
                                        ? "الإضافات"
                                        : "Add-ons"}</span
                                >
                                <span
                                    >{Object.values(extras).filter((v) => v)
                                        .length}
                                    {$lang === "ar"
                                        ? "محددة"
                                        : "Selected"}</span
                                >
                            </div>
                        </div>

                        <a
                            href="https://wa.me/{settings?.contact
                                ?.whatsapp}?text={generateWhatsappMessage()}"
                            target="_blank"
                            class="submit-quote-btn"
                        >
                            <i class="fab fa-whatsapp"></i>
                            {$lang === "ar"
                                ? "أرسل الطلب التفصيلي"
                                : "Send Detailed Request"}
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <br /><br /><br />
        <FAQ />
    </div>
</section>

<style>
    .packages-page {
        padding: 150px 0 100px;
        position: relative;
    }

    .neptune-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 50% 10%,
                rgba(0, 229, 255, 0.05),
                transparent 50%
            ),
            radial-gradient(
                circle at 10% 90%,
                rgba(0, 150, 255, 0.08),
                transparent 40%
            );
        pointer-events: none;
        z-index: 0;
    }

    .relative-z {
        position: relative;
        z-index: 2;
    }

    .packages-header {
        text-align: center;
        margin-bottom: 60px;
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

    .page-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(2.8rem, 6vw, 4.5rem);
        font-weight: 900;
        margin: 0 auto 20px;
        padding: 0.2em 0.3em 0.5em; /* Standard padding */
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

    .page-desc {
        font-size: 1.1rem;
        color: var(--text-muted);
        max-width: 650px;
        margin: 0 auto;
        line-height: 1.6;
    }

    .estimator-container {
        padding: 40px;
        border-radius: 20px;
        background: rgba(10, 20, 40, 0.6);
        border: 1px solid rgba(0, 229, 255, 0.2);
        box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.5),
            inset 0 0 20px rgba(0, 229, 255, 0.05);
    }

    .estimator-grid {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 50px;
    }

    /* Controls Styling */
    .controls-column {
        display: flex;
        flex-direction: column;
        gap: 35px;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .control-label {
        font-size: 1.2rem;
        font-weight: 800;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .value-highlight {
        color: var(--primary);
        font-size: 1.4rem;
        font-family: var(--font-en);
        text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
    }

    .type-selector,
    .speed-selector {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 15px;
    }

    .type-btn,
    .speed-btn {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 12px;
        color: #ddd;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .type-btn i {
        font-size: 1.5rem;
        color: #859dbb;
        transition: 0.3s;
    }

    .type-btn:hover,
    .speed-btn:hover {
        background: rgba(0, 229, 255, 0.05);
        border-color: rgba(0, 229, 255, 0.3);
        transform: translateY(-2px);
    }

    .type-btn.active,
    .speed-btn.active {
        background: rgba(0, 229, 255, 0.15);
        border-color: var(--primary);
        color: #fff;
        box-shadow: 0 5px 15px rgba(0, 229, 255, 0.2);
    }

    .type-btn.active i {
        color: var(--primary);
        filter: drop-shadow(0 0 5px var(--primary));
    }

    /* Range Slider */
    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        outline: none;
        position: relative;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--primary);
        cursor: pointer;
        box-shadow: 0 0 15px var(--primary);
        transition: 0.2s;
    }

    .slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    .slider-labels {
        display: flex;
        justify-content: space-between;
        color: #859dbb;
        font-size: 0.85rem;
        margin-top: 5px;
    }

    /* Checkboxes */
    .extras-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }

    .extra-checkbox {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding: 12px 15px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        background: rgba(255, 255, 255, 0.02);
        transition: 0.3s;
        font-size: 0.95rem;
        color: #ccc;
    }

    .extra-checkbox:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .extra-checkbox.active {
        border-color: rgba(0, 229, 255, 0.4);
        background: rgba(0, 229, 255, 0.05);
        color: #fff;
    }

    .extra-checkbox input {
        display: none;
    }

    .checkbox-visual {
        width: 20px;
        height: 20px;
        border: 2px solid #859dbb;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s;
    }

    .extra-checkbox.active .checkbox-visual {
        background: var(--primary);
        border-color: var(--primary);
    }

    .extra-checkbox.active .checkbox-visual::after {
        content: "✓";
        color: #000;
        font-size: 14px;
        font-weight: bold;
    }

    /* Result Panel Styling */
    .result-column {
        position: relative;
    }

    .result-card {
        background: linear-gradient(
            135deg,
            rgba(2, 10, 28, 0.9),
            rgba(5, 20, 45, 0.9)
        );
        border: 1px solid rgba(0, 229, 255, 0.3);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        position: sticky;
        top: 120px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        overflow: hidden;
    }

    .result-glow {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 150px;
        height: 150px;
        background: var(--primary);
        filter: blur(80px);
        opacity: 0.2;
        border-radius: 50%;
        pointer-events: none;
    }

    .result-card h4 {
        color: #859dbb;
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .price-display {
        font-size: 4.5rem;
        font-weight: 900;
        color: #fff;
        line-height: 1;
        font-family: var(--font-en);
        text-shadow: 0 0 30px rgba(0, 229, 255, 0.3);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 5px;
    }

    .currency {
        font-size: 1.5rem;
        color: var(--primary);
        margin-top: 35px;
        font-weight: 700;
        opacity: 0.9;
    }

    .disclaimer {
        font-size: 0.8rem;
        color: #667;
        margin-bottom: 10px;
    }

    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px 0;
        margin-bottom: 10px;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        color: #bbb;
        font-size: 0.95rem;
    }

    .summary-item span:last-child {
        color: #fff;
        font-weight: bold;
    }

    .submit-quote-btn {
        background: var(--primary);
        color: #000;
        padding: 16px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 1.1rem;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: 0.3s;
        box-shadow: 0 10px 20px rgba(0, 229, 255, 0.2);
    }

    .submit-quote-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0, 229, 255, 0.4);
        background: #fff;
    }

    .submit-quote-btn i {
        font-size: 1.3rem;
    }

    @media (max-width: 992px) {
        .estimator-grid {
            grid-template-columns: 1fr;
        }

        .result-card {
            position: relative;
            top: 0;
        }

        .extras-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .packages-page {
            padding: 100px 0 60px;
        }

        .estimator-container {
            padding: 25px;
        }
    }
</style>
