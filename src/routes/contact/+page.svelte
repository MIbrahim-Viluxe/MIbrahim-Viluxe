<script lang="ts">
    import { lang } from "$lib/stores/lang";
    let { data }: { data: { settings: any } } = $props();
    const settings = $derived(data.settings);
</script>

<svelte:head>
    <title>{$lang === "ar" ? "اتصل بنا" : "Contact Us"} | Mohamed Ibrahim</title>
</svelte:head>

<section class="contact-page">
    <div class="neptune-bg"></div>
    <div class="container relative-z">
        <div class="contact-header animate-on-scroll">
            <span class="sub-label">
                {$lang === "ar" ? "ابدأ مشروعك" : "START YOUR PROJECT"}
            </span>
            <h1 class="page-title">
                {$lang === "ar" ? "تواصل معنا" : "Get in Touch"}
            </h1>
            <p class="page-desc">
                {$lang === "ar"
                    ? "نحن هنا للإجابة على استفساراتك ومساعدتك في بدء مشروعك القادم. لا تتردد في التواصل!"
                    : "We are here to answer your inquiries and help you start your next project. Don't hesitate to reach out!"}
            </p>
        </div>

        <div class="contact-grid animate-on-scroll">
            <!-- Information Panel -->
            <div class="info-panel glass" dir={$lang === "ar" ? "rtl" : "ltr"}>
                <div class="panel-blur"></div>
                <h2 class="panel-title">
                    {$lang === "ar" ? "معلومات " : "Contact "}
                    <span class="highlight">{$lang === "ar" ? "التواصل" : "Info"}</span>
                </h2>

                <div class="info-list">
                    <!-- Location -->
                    <div class="info-item">
                        <div class="icon-box">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="content">
                            <h4>{$lang === "ar" ? "المقر" : "Location"}</h4>
                            <p>{$lang === "ar" ? (settings?.contact?.address || 'القاهرة، مصر') : (settings?.contact?.address || "Cairo, Egypt")}</p>
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="info-item">
                        <div class="icon-box">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="content">
                            <h4>{$lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</h4>
                            <p>{settings?.contact?.email || 'mohamedibrahim4125@gmail.com'}</p>
                        </div>
                    </div>

                    <!-- Phone -->
                    <div class="info-item">
                        <div class="icon-box">
                            <i class="fas fa-phone-alt"></i>
                        </div>
                        <div class="content">
                            <h4>{$lang === "ar" ? "الهاتف / واتساب" : "Phone / WhatsApp"}</h4>
                            <p dir="ltr" class="phone-number">{settings?.contact?.phone || '+201505273292'}</p>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <a
                        href="https://wa.me/{settings?.contact?.whatsapp || '201505273292'}"
                        target="_blank"
                        class="btn-wa-fillable flex-btn"
                    >
                        <i class="fab fa-whatsapp"></i>
                        <span>{$lang === "ar" ? "محادثة فورية (واتساب)" : "Live Chat (WhatsApp)"}</span>
                    </a>
                    <a
                        href="mailto:{settings?.contact?.email || 'mohamedibrahim4125@gmail.com'}"
                        class="btn-outline flex-btn"
                    >
                        <i class="fas fa-paper-plane"></i>
                        <span>{$lang === "ar" ? "أرسل إيميل" : "Send Email"}</span>
                    </a>
                </div>
            </div>

            <!-- Contact Form Panel -->
            <div class="form-panel glass" dir={$lang === "ar" ? "rtl" : "ltr"}>
                <h3 class="form-title">
                    {$lang === "ar" ? "أرسل لنا رسالة سريعة" : "Drop Us A Quick Message"}
                </h3>

                <form
                    class="contact-form"
                    onsubmit={(e) => {
                        e.preventDefault();
                        // @ts-ignore
                        const name = e.currentTarget.elements.name_input.value;
                        // @ts-ignore
                        const email = e.currentTarget.elements.email_input.value;
                        // @ts-ignore
                        const msg = e.currentTarget.elements.message_input.value;
                        const fullMsg = $lang === "ar"
                            ? `مرحباً، أنا ${name}. بخصوص الاتصال من موقعك الإلكتروني:\n\nالايميل: ${email}\n\nالرسالة:\n${msg}`
                            : `Hello, I'm ${name}. Contacting you from the website:\n\nEmail: ${email}\n\nMessage:\n${msg}`;
                        window.open(`https://wa.me/${settings?.contact?.whatsapp || '201505273292'}?text=${encodeURIComponent(fullMsg)}`, "_blank");
                    }}
                >
                    <div class="input-group">
                        <label for="name_input">{$lang === "ar" ? "الاسم بالكامل" : "Full Name"}</label>
                        <div class="input-wrapper">
                            <i class="fas fa-user input-icon"></i>
                            <input id="name_input" name="name_input" type="text" required placeholder={$lang === "ar" ? "أدخل اسمك" : "Enter your name"} />
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="email_input">{$lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
                        <div class="input-wrapper">
                            <i class="fas fa-at input-icon"></i>
                            <input id="email_input" name="email_input" type="email" required placeholder={$lang === "ar" ? "أدخل بريدك" : "Enter your email"} />
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="message_input">{$lang === "ar" ? "رسالتك" : "Your Message"}</label>
                        <div class="input-wrapper textarea-wrapper">
                            <i class="fas fa-comment-alt input-icon"></i>
                            <textarea id="message_input" name="message_input" required rows="5" placeholder={$lang === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}></textarea>
                        </div>
                    </div>

                    <button type="submit" class="submit-btn-wa">
                        <span>{$lang === "ar" ? "إرسال عبر واتساب" : "Send via WhatsApp"}</span>
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>

<style>
    .contact-page {
        padding: 150px 0 100px;
        position: relative;
        min-height: 100vh;
        background: #020205;
    }

    .neptune-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 10% 90%, rgba(0, 229, 255, 0.05), transparent 50%),
                    radial-gradient(circle at 90% 10%, rgba(0, 150, 255, 0.08), transparent 50%);
        pointer-events: none;
        z-index: 0;
    }

    .relative-z {
        position: relative;
        z-index: 2;
    }

    .contact-header {
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
        margin-bottom: 22px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(0, 229, 255, 0.3);
        padding-bottom: 8px;
    }

    .page-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(2.8rem, 6vw, 4.5rem);
        font-weight: 900;
        margin: 0;
        padding: 0.2em 0.3em 0.5em; /* Matching Portfolio padding for hamza/dots */
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
        animation: titleShine 6s linear infinite;
        vertical-align: top;
    }

    @keyframes titleShine {
        to { background-position: 200% center; }
    }

    .page-desc {
        font-size: 1.15rem;
        color: #ccd6f6;
        max-width: 650px;
        margin: 15px auto 0;
        line-height: 1.8;
        opacity: 0.85;
        font-weight: 500;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    /* Panels Base */
    .glass {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 32px;
        padding: 50px;
        box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        position: relative;
        overflow: hidden;
    }

    .panel-blur {
        position: absolute;
        top: -100px;
        right: -100px;
        width: 300px;
        height: 300px;
        background: var(--primary);
        filter: blur(120px);
        opacity: 0.1;
        border-radius: 50%;
        pointer-events: none;
    }

    .panel-title {
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 40px;
        color: #fff;
    }

    .highlight {
        color: var(--primary);
    }

    .info-list {
        display: flex;
        flex-direction: column;
        gap: 30px;
        margin-bottom: 40px;
    }

    .info-item {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .icon-box {
        width: 55px;
        height: 55px;
        background: rgba(0, 229, 255, 0.05);
        border: 1px solid rgba(0, 229, 255, 0.1);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        color: var(--primary);
        transition: 0.4s;
    }

    .info-item:hover .icon-box {
        background: var(--primary);
        color: #fff;
        transform: scale(1.1);
    }

    .info-item .content h4 {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 2px;
        font-weight: 500;
        letter-spacing: 0.5px;
    }

    .info-item .content p {
        font-size: 1.15rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
    }

    .phone-number {
        font-family: var(--font-en);
        letter-spacing: 1px;
    }

    .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .flex-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 20px;
        border-radius: 16px;
        font-weight: 800;
        text-decoration: none;
        transition: 0.4s;
        font-size: 1.1rem;
    }

    /* WHATSAPP FILLABLE BUTTON */
    .btn-wa-fillable {
        position: relative;
        background: rgba(37, 211, 102, 0.05);
        border: 2px solid rgba(37, 211, 102, 0.3);
        color: #25D366;
        overflow: hidden;
        z-index: 1;
    }

    .btn-wa-fillable::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0%;
        background: #25D366;
        transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        z-index: -1;
    }

    .btn-wa-fillable:hover {
        color: #fff;
        border-color: #25D366;
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(37, 211, 102, 0.3);
    }

    .btn-wa-fillable:hover::before {
        height: 100%;
    }

    .btn-outline {
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #ccc;
        background: rgba(255, 255, 255, 0.02);
    }

    .btn-outline:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: #fff;
        color: #fff;
    }

    /* Form Panel */
    .form-panel {
        background: rgba(10, 20, 40, 0.5);
    }

    .form-title {
        font-size: 1.5rem;
        margin-bottom: 30px;
        color: #fff;
        font-weight: 800;
    }

    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-group label {
        display: block;
        color: #8892b0;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .input-wrapper {
        position: relative;
    }

    .input-icon {
        position: absolute;
        left: 18px;
        top: 50%;
        transform: translateY(-50%);
        color: #495670;
        font-size: 1rem;
        pointer-events: none;
    }

    [dir="rtl"] .input-icon {
        left: auto;
        right: 18px;
    }

    .textarea-wrapper .input-icon {
        top: 20px;
        transform: none;
    }

    .contact-form input,
    .contact-form textarea {
        width: 100%;
        background: #020c1b;
        border: 1px solid #112240;
        padding: 15px 15px 15px 45px;
        border-radius: 12px;
        color: #e6f1ff;
        font-size: 1rem;
        transition: 0.3s;
    }

    [dir="rtl"] .contact-form input,
    [dir="rtl"] .contact-form textarea {
        padding: 15px 45px 15px 15px;
    }

    .contact-form input:focus,
    .contact-form textarea:focus {
        outline: none;
        border-color: var(--primary);
        background: #0a192f;
    }

    .submit-btn-wa {
        margin-top: 10px;
        background: #fff;
        color: #020c1b;
        border: none;
        padding: 18px;
        font-size: 1.1rem;
        font-weight: 800;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        transition: 0.3s;
    }

    .submit-btn-wa:hover {
        background: #25D366;
        color: #fff;
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
    }

    @media (max-width: 992px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .contact-page {
            padding: 100px 0 60px;
        }
    }
</style>

