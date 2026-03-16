<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { selectedVideo } from "$lib/stores/video";
    import { fade, scale } from "svelte/transition";
    import { onMount } from "svelte";

    let videoUrl = $derived.by(() => {
        if (!$selectedVideo) return null;
        let url = $selectedVideo.video_url || $selectedVideo.video || "";

        // Convert watch or short links to embed links
        if (url.includes("youtu.be/")) {
            const id = url.split("youtu.be/")[1]?.split("?")[0];
            return `https://www.youtube.com/embed/${id}?autoplay=1`;
        } else if (url.includes("v=")) {
            const id = url.split("v=")[1]?.split("&")[0];
            return `https://www.youtube.com/embed/${id}?autoplay=1`;
        } else if (url.includes("shorts/")) {
            const id = url.split("shorts/")[1]?.split("?")[0];
            return `https://www.youtube.com/embed/${id}?autoplay=1`;
        }

        // If it's already an embed link or other source
        if (url.includes("embed/")) {
            return url.includes("?")
                ? `${url}&autoplay=1`
                : `${url}?autoplay=1`;
        }

        return url;
    });

    function close() {
        selectedVideo.set(null);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") close();
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $selectedVideo && videoUrl}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="modal-backdrop"
        transition:fade={{ duration: 250 }}
        onclick={close}
    >
        <div
            class="modal-content"
            transition:scale={{ duration: 300, start: 0.95 }}
            onclick={(e) => e.stopPropagation()}
        >
            <button class="close-btn" onclick={close} aria-label="Close modal">
                <i class="fas fa-times"></i>
            </button>
            <div class="video-container">
                {#if videoUrl}
                    <iframe
                        src={videoUrl}
                        title={$lang === "ar"
                            ? $selectedVideo.title_ar
                            : $selectedVideo.title_en}
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                {:else}
                    <div class="video-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>{$lang === 'ar' ? 'عذراً، لا يمكن تشغيل هذا الفيديو حالياً' : 'Sorry, this video cannot be played right now'}</p>
                    </div>
                {/if}
            </div>
            <div class="video-info" dir={$lang === "ar" ? "rtl" : "ltr"}>
                <h3>
                    {$lang === "ar"
                        ? $selectedVideo.title_ar
                        : $selectedVideo.title_en}
                </h3>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 5, 15, 0.9);
        backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .modal-content {
        position: relative;
        background: radial-gradient(
            circle at top right,
            #0a1c40 0%,
            #030a14 100%
        );
        border: 1px solid rgba(0, 229, 255, 0.2);
        box-shadow: 0 25px 50px -12px rgba(0, 229, 255, 0.15);
        border-radius: 16px;
        width: 100%;
        max-width: 1000px;
        overflow: hidden;
    }

    .close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 10;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(4px);
    }

    .close-btn:hover {
        background: rgba(227, 30, 36, 0.8);
        border-color: rgba(227, 30, 36, 1);
        transform: rotate(90deg) scale(1.1);
    }

    .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
        background: #000;
    }

    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .video-info {
        padding: 20px 25px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .video-info h3 {
        margin: 0;
        color: white;
        font-size: 1.25rem;
        font-weight: 700;
    }

    .video-error {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: #859dbb;
        text-align: center;
        padding: 20px;
    }

    .video-error i {
        font-size: 3rem;
        color: var(--primary);
        opacity: 0.5;
    }
</style>
