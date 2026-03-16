<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { slide } from "svelte/transition";

    const faqs = [
        {
            q_en: "How long does it take to deliver a project?",
            q_ar: "كم يستغرق تسليم المشروع؟",
            a_en: "Delivery time depends on the project's complexity, but most videos are delivered within 3-7 business days.",
            a_ar: "يعتمد وقت التسليم على مدى تعقيد المشروع، ولكن أغلب الفيديوهات يتم تسليمها خلال ٣ إلى ٧ أيام عمل.",
        },
        {
            q_en: "Do you offer revisions?",
            q_ar: "هل تقدمون تعديلات بعد التسليم؟",
            a_en: "Yes! We offer up to 2 free revisions for all packages to ensure you are 100% satisfied with the outcome.",
            a_ar: "نعم! نحن نقدم ما يصل إلى تعديلين مجانيين لجميع الباقات لضمان رضاك التام عن النتيجة.",
        },
        {
            q_en: "What if I need a custom package?",
            q_ar: "ماذا لو احتجت إلى باقة مخصصة؟",
            a_en: "We can easily tailor a custom package specific to your needs. Just contact us via WhatsApp to discuss details.",
            a_ar: "يمكننا بسهولة تصميم باقة مخصصة تلبي احتياجاتك. فقط تواصل معنا عبر واتساب لمناقشة التفاصيل.",
        },
        {
            q_en: "Can I get raw project files?",
            q_ar: "هل يمكنني الحصول على ملفات المشروع الأصلية؟",
            a_en: "Raw files are subject to an additional fee, depending on the project scope. Let us know if you need them before finalizing the agreement.",
            a_ar: "ملفات المشروع الأصلية قابلة للتسليم مقابل رسوم إضافية تعتمد على حجم المشروع. أخبرنا إذا كنت بحاجة إليها قبل الاتفاق النهائي.",
        },
    ];

    let openIndex = $state<number | null>(null);

    function toggleFAQ(index: number) {
        if (openIndex === index) {
            openIndex = null;
        } else {
            openIndex = index;
        }
    }
</script>

<div class="faq-container">
    <h2 class="faq-title">
        {$lang === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
    </h2>
    <div class="faq-list">
        {#each faqs as faq, i}
            <div class="faq-item glass-card" class:active={openIndex === i}>
                <button
                    class="faq-question"
                    onclick={() => toggleFAQ(i)}
                    aria-expanded={openIndex === i}
                >
                    <span dir={$lang === "ar" ? "rtl" : "ltr"}>
                        {$lang === "ar" ? faq.q_ar : faq.q_en}
                    </span>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </button>
                {#if openIndex === i}
                    <div
                        class="faq-answer-wrapper"
                        transition:slide={{ duration: 300 }}
                    >
                        <div
                            class="faq-answer"
                            dir={$lang === "ar" ? "rtl" : "ltr"}
                        >
                            {$lang === "ar" ? faq.a_ar : faq.a_en}
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .faq-container {
        margin-top: 100px;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    }

    .faq-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 40px;
        color: white;
    }

    .faq-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .faq-item {
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .glass-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
    }

    .faq-item.active {
        border-color: rgba(0, 229, 255, 0.3);
        box-shadow: 0 5px 20px rgba(0, 229, 255, 0.1);
    }

    .faq-question {
        width: 100%;
        text-align: inherit;
        background: transparent;
        border: none;
        padding: 24px;
        font-size: 1.1rem;
        font-weight: bold;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: color 0.3s ease;
    }

    .faq-question:hover {
        color: var(--primary, #00eaff);
    }

    .toggle-icon {
        color: var(--primary, #00eaff);
        transition: transform 0.3s ease;
    }

    .faq-item.active .toggle-icon {
        transform: rotate(180deg);
    }

    .faq-answer-wrapper {
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .faq-answer {
        padding: 20px 24px 24px;
        color: #aaa;
        line-height: 1.6;
        font-size: 1rem;
    }

    @media (max-width: 768px) {
        .faq-title {
            font-size: 2rem;
            margin-bottom: 30px;
        }

        .faq-question {
            padding: 18px;
            font-size: 1rem;
        }

        .faq-answer {
            padding: 15px 18px 18px;
        }
    }
</style>
