<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { t } from "$lib/utils/cms";

    let { settings } = $props();
</script>

<section id="about" class="about-section">
    <div class="container">
        <div class="about-grid">
            <div class="about-text animate-on-scroll glass-panel">
                <span class="sub-title"
                    >{$lang === "ar" ? "من أنا" : "ABOUT ME"}</span
                >
                <h2 class="title-premium">
                    {$lang === "ar"
                        ? "الخبرات التقنية"
                        : "Technical Experiences"}
                </h2>
                <p class="about-description">
                    {$lang === "ar"
                        ? "أنا محمد إبراهيم، متخصص في المونتاج الاحترافي، أمتلك مهارات تقنية متقدمة في تحرير الفيديو باستخدام أحدث البرامج والأدوات، مع اهتمام فائق بالتفاصيل لدمج التأثيرات البصرية والمؤثرات الصوتية لخلق تجربة سينمائية لا تُنسى. أسخر التقنية الحديثة لتحويل الأفكار إلى واقع مرئي مؤثر."
                        : "I am Mohamed Ibrahim, a specialized professional video editor with advanced technical skills in video editing using the latest software and tools. With extreme attention to detail, I combine visual and sound effects to create unforgettable cinematic experiences. I leverage modern technology to turn ideas into impactful visual realities."}
                </p>
                <div class="tech-tags">
                    <span class="tech-tag">Adobe Premiere Pro</span>
                    <span class="tech-tag">Adobe After Effects</span>
                    <span class="tech-tag">Adobe Photoshop</span>
                    <span class="tech-tag">Adobe Illustrator</span>
                    <span class="tech-tag">Color Grading</span>
                    <span class="tech-tag">Audio Mixing</span>
                    <span class="tech-tag">Visual Effects</span>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .about-section {
        padding: 50px 0 100px 0;
        background: transparent;
        position: relative;
    }

    .about-grid {
        display: flex;
        justify-content: center;
    }

    .about-text {
        max-width: 800px;
        width: 100%;
        padding: 60px;
        border-radius: 32px;
        border: 1px solid var(--glass-border);
        background: radial-gradient(
            circle at top right,
            rgba(0, 229, 255, 0.05),
            transparent
        );
        text-align: center;
    }

    .sub-title {
        color: var(--primary);
        font-weight: 800;
        letter-spacing: 5px;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 20px;
        text-transform: uppercase;
    }

    .title-premium {
        font-size: clamp(2.2rem, 4vw, 3.5rem);
        margin-bottom: 30px;
        font-weight: 950;
        color: white;
    }

    .about-description {
        font-size: 1.15rem;
        color: var(--text-muted);
        line-height: 1.9;
        margin-bottom: 40px;
    }

    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
    }

    .tech-tag {
        padding: 10px 22px;
        border-radius: 50px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #ddd;
        font-size: 0.95rem;
        font-weight: 600;
        transition: var(--transition);
        font-family: var(--font-en);
    }

    .tech-tag:hover {
        border-color: var(--primary);
        background: rgba(0, 229, 255, 0.1);
        color: white;
        box-shadow: 0 0 20px var(--primary-glow);
        transform: translateY(-3px);
    }

    @media (max-width: 768px) {
        .about-section {
            padding: 40px 0 80px 0;
        }
        .about-text {
            padding: 40px 25px;
        }
        .title-premium {
            font-size: 2rem;
        }
    }
</style>
