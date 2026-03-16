<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let showIntro = $state(true);

    onMount(() => {
        // Hide intro after 2.5 seconds
        const timer = setTimeout(() => {
            showIntro = false;
        }, 2500);

        return () => clearTimeout(timer);
    });
</script>

{#if showIntro}
    <div class="intro-container" transition:fade={{ duration: 800 }}>
        <div class="mission-text-container">
            <h1 class="brand-text" data-text="M.IBRAHIM">M.IBRAHIM</h1>
            <div class="energy-line"></div>
        </div>
    </div>
{/if}

<style>
    .intro-container {
        position: fixed;
        inset: 0;
        background-color: var(--bg-dark);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .mission-text-container {
        position: relative;
        display: inline-block;
        padding: 20px;
    }

    .brand-text {
        font-family: var(--font-en);
        font-size: clamp(2.5rem, 8vw, 6rem);
        font-weight: 900;
        color: white;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        margin: 0;
        opacity: 0;
        animation: fadeInText 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        position: relative;
        z-index: 2;
    }

    /* Glow effect on the text itself */
    .brand-text::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: white;
        text-shadow:
            0 0 20px var(--primary-glow),
            0 0 40px var(--primary-glow);
        opacity: 0;
        animation: pulseGlow 2s ease-in-out forwards;
        animation-delay: 0.5s;
    }

    /* The blue energy line passing through */
    .energy-line {
        position: absolute;
        top: 50%;
        left: -50%;
        width: 200%;
        height: 4px;
        background: var(--primary);
        box-shadow:
            0 0 20px var(--primary),
            0 0 40px var(--primary),
            0 0 80px var(--primary);
        transform: translateY(-50%);
        opacity: 0;
        animation: swipeEnergy 1.6s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        animation-delay: 0.2s;
        z-index: 1;
        border-radius: 50%;
        filter: blur(1px);
    }

    @keyframes fadeInText {
        0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            filter: blur(10px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
        }
    }

    @keyframes pulseGlow {
        0% {
            opacity: 0;
        }
        40% {
            opacity: 1;
        }
        100% {
            opacity: 0.5;
        }
    }

    @keyframes swipeEnergy {
        0% {
            left: -100%;
            opacity: 0;
            transform: translateY(-50%) scaleX(0);
        }
        10% {
            opacity: 1;
        }
        50% {
            transform: translateY(-50%) scaleX(1);
        }
        90% {
            opacity: 1;
        }
        100% {
            left: 100%;
            opacity: 0;
            transform: translateY(-50%) scaleX(0);
        }
    }
</style>
