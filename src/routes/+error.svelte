<script>
    import { page } from "$app/stores";
    import { fade } from "svelte/transition";
</script>

<svelte:head>
    <title>{$page.status} | Mohamed Ibrahim</title>
</svelte:head>

<div class="error-page" in:fade={{ duration: 400 }}>
    <div class="error-content">
        <h1 class="error-status">{$page.status}</h1>
        <p class="error-message">{$page.error?.message || "Page Not Found"}</p>
        <p class="error-url" dir="ltr">Path: {$page.url.pathname}</p>

        <div class="error-actions">
            <a href="/" class="btn-primary-outline"> Return to Home </a>

        </div>
    </div>
</div>

<style>
    .error-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        text-align: center;
    }

    .error-content {
        background: rgba(10, 20, 40, 0.6);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 229, 255, 0.15);
        padding: 60px 40px;
        border-radius: 24px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        max-width: 500px;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .error-content::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00e5ff, transparent);
    }

    .error-status {
        font-size: 6rem;
        font-weight: 900;
        margin: 0;
        line-height: 1;
        background: linear-gradient(135deg, #fff, #00e5ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.3));
    }

    .error-message {
        font-size: 1.5rem;
        color: #fff;
        margin: 10px 0 20px;
        font-weight: 600;
    }

    .error-url {
        font-size: 0.9rem;
        color: #888;
        margin-bottom: 40px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        word-break: break-all;
    }

    .error-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }
</style>
