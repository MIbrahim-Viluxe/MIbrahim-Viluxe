<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { fade, scale } from "svelte/transition";

    const videos = [
        {
            id: 1,
            title_ar: "بودكاست بجودة سينمائية",
            title_en: "Cinematic Podcast",
            duration: "01:24",
            image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
        },
        {
            id: 2,
            title_ar: "ريلز سريعة التأثير",
            title_en: "High-Impact Reels",
            duration: "00:45",
            image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
        {
            id: 3,
            title_ar: "توثيق احترافي",
            title_en: "Pro Documentary",
            duration: "02:15",
            image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
    ];

    let activeVideo: (typeof videos)[0] | null = $state(null);

    function openModal(video: (typeof videos)[0]) {
        activeVideo = video;
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        activeVideo = null;
        document.body.style.overflow = "auto";
    }
</script>

<section id="showcase" class="showcase-section">
    <div class="container">
        <div class="section-header animate-on-scroll">
            <h2 class="section-title">
                {$lang === "ar" ? "أعمال سينمائية" : "Cinematic Showcase"}
            </h2>
            <div class="line-decorator"></div>
        </div>

        <div class="video-grid">
            {#each videos as video (video.id)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="video-card glass animate-on-scroll"
                    onclick={() => openModal(video)}
                    style="animation-delay: {video.id * 0.1}s;"
                >
                    <div class="thumbnail-wrapper">
                        <img
                            src={video.image}
                            alt={video.title_en}
                            class="thumbnail"
                        />
                        <div class="play-overlay">
                            <div class="play-btn">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span class="duration">{video.duration}</span>
                        </div>
                    </div>
                    <div
                        class="card-info"
                        style="text-align: {$lang === 'ar' ? 'right' : 'left'}"
                    >
                        <h3>
                            {$lang === "ar" ? video.title_ar : video.title_en}
                        </h3>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

{#if activeVideo}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="modal-backdrop"
        transition:fade={{ duration: 300 }}
        onclick={closeModal}
    >
        <div
            class="modal-content"
            transition:scale={{ start: 0.95, duration: 400 }}
            onclick={(e) => e.stopPropagation()}
        >
            <button class="close-btn" onclick={closeModal}>
                <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="video-container">
                <video
                    src={activeVideo.videoUrl}
                    controls
                    autoplay
                    class="video-player"
                >
                    <track kind="captions" />
                </video>
            </div>
            <h3
                class="modal-title"
                style="text-align: {$lang === 'ar' ? 'right' : 'left'}"
            >
                {$lang === "ar" ? activeVideo.title_ar : activeVideo.title_en}
            </h3>
        </div>
    </div>
{/if}

<style>
    .showcase-section {
        padding: 120px 0;
        background: transparent;
        position: relative;
    }

    .section-header {
        text-align: center;
        margin-bottom: 70px;
    }

    .line-decorator {
        width: 80px;
        height: 3px;
        background: var(--primary);
        margin: 0 auto;
        box-shadow: 0 0 15px var(--primary-glow);
        border-radius: 2px;
    }

    .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 40px;
    }

    .video-card {
        cursor: pointer;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        background: rgba(2, 10, 28, 0.6);
    }

    .video-card:hover {
        border-color: var(--primary);
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
        transform: translateY(-8px);
    }

    .thumbnail-wrapper {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* 16:9 Aspect Ratio */
        overflow: hidden;
    }

    .thumbnail {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .video-card:hover .thumbnail {
        transform: scale(1.1);
    }

    .play-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: background 0.4s ease;
    }

    .video-card:hover .play-overlay {
        background: rgba(0, 0, 0, 0.1);
    }

    .play-btn {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(0, 229, 255, 0.15);
        border: 2px solid var(--primary);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        transform: scale(0.9);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 0 20px transparent;
    }

    .play-btn svg {
        margin-left: 4px; /* Optical center for play triangle */
    }

    .video-card:hover .play-btn {
        transform: scale(1.1);
        background: rgba(0, 229, 255, 0.3);
        box-shadow: 0 0 30px var(--primary-glow);
    }

    .duration {
        position: absolute;
        bottom: 12px;
        right: 12px;
        background: rgba(0, 0, 0, 0.7);
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-family: var(--font-en);
        font-weight: 700;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .card-info {
        padding: 24px;
    }

    .card-info h3 {
        font-size: 1.25rem;
        margin: 0;
        font-weight: 800;
        color: white;
        transition: color 0.3s ease;
    }

    .video-card:hover .card-info h3 {
        color: var(--primary);
    }

    /* Modal Styles */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(1, 3, 8, 0.95);
        backdrop-filter: blur(15px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .modal-content {
        position: relative;
        width: 100%;
        max-width: 1200px;
        background: #000;
        border-radius: 12px;
        border: 1px solid rgba(0, 229, 255, 0.2);
        box-shadow: 0 20px 80px rgba(0, 229, 255, 0.15);
        overflow: hidden;
    }

    .close-btn {
        position: absolute;
        top: -50px;
        right: 0;
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0.7;
        transition:
            opacity 0.3s,
            color 0.3s;
        padding: 8px;
    }

    .close-btn:hover {
        opacity: 1;
        color: var(--primary);
    }

    .video-container {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #000;
    }

    .video-player {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .modal-title {
        padding: 20px 30px;
        background: rgba(2, 10, 28, 0.9);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        color: white;
        margin: 0;
        font-weight: 800;
        font-size: 1.4rem;
    }

    @media (max-width: 768px) {
        .modal-content {
            border-radius: 8px;
        }
        .close-btn {
            top: 10px;
            right: 10px;
            z-index: 10;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
        }
        .modal-title {
            padding: 15px 20px;
            font-size: 1.1rem;
        }
    }
</style>
