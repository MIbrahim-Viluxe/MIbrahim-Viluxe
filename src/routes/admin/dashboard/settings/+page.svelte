<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase";
    import { fade } from "svelte/transition";

    let saving = false;
    let loading = true;
    let settings = {
        site_title: "Mohamed Ibrahim",
        contact_email: "",
        whatsapp_number: "",
        instagram_url: "",
        facebook_url: "",
        youtube_url: ""
    };

    onMount(async () => {
        // Fetch current settings if they exist
        // Note: You'll need to create a 'settings' table if you want to persist these
        loading = false;
    });

    async function saveSettings() {
        saving = true;
        // Logic to save to Supabase would go here
        setTimeout(() => {
            saving = false;
            alert("Settings updated successfully! (Simulation)");
        }, 1000);
    }
</script>

<div class="settings-page" in:fade={{ duration: 300 }}>
    <header class="page-header">
        <h1>Dashboard Settings</h1>
        <p>Manage your website's global information and social links.</p>
    </header>

    <div class="settings-container">
        <form on:submit|preventDefault={saveSettings} class="settings-form">
            <section class="form-section">
                <h2>General Information</h2>
                <div class="form-group">
                    <label for="site_title">Site Title</label>
                    <input type="text" id="site_title" bind:value={settings.site_title} placeholder="Owner Name / Studio Name" />
                </div>
                <div class="form-group">
                    <label for="contact_email">Contact Email</label>
                    <input type="email" id="contact_email" bind:value={settings.contact_email} placeholder="admin@example.com" />
                </div>
            </section>

            <section class="form-section">
                <h2>Social Media & Communication</h2>
                <div class="form-group">
                    <label for="whatsapp">WhatsApp Number</label>
                    <input type="text" id="whatsapp" bind:value={settings.whatsapp_number} placeholder="+201..." />
                </div>
                <div class="form-group">
                    <label for="instagram">Instagram URL</label>
                    <input type="url" id="instagram" bind:value={settings.instagram_url} placeholder="https://instagram.com/..." />
                </div>
                <div class="form-group">
                    <label for="facebook">Facebook URL</label>
                    <input type="url" id="facebook" bind:value={settings.facebook_url} placeholder="https://facebook.com/..." />
                </div>
                <div class="form-group">
                    <label for="youtube">YouTube Channel</label>
                    <input type="url" id="youtube" bind:value={settings.youtube_url} placeholder="https://youtube.com/..." />
                </div>
            </section>

            <footer class="form-footer">
                <button type="submit" class="save-btn" disabled={saving}>
                    {#if saving}
                        <span class="spinner"></span>
                        Saving...
                    {:else}
                        Save Changes
                    {/if}
                </button>
            </footer>
        </form>
    </div>
</div>

<style>
    .page-header {
        margin-bottom: 2.5rem;
    }

    .page-header h1 {
        font-size: 2rem;
        margin: 0 0 0.5rem 0;
        color: #fff;
    }

    .page-header p {
        color: #888;
        margin: 0;
    }

    .settings-container {
        max-width: 800px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 2.5rem;
    }

    .form-section {
        margin-bottom: 3rem;
    }

    .form-section h2 {
        font-size: 1.25rem;
        margin: 0 0 1.5rem 0;
        color: #00aeef;
        font-weight: 600;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #a3a3a3;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .form-group input {
        width: 100%;
        padding: 0.875rem 1rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        color: #fff;
        font-size: 1rem;
        transition: all 0.2s ease;
    }

    .form-group input:focus {
        outline: none;
        border-color: #00aeef;
        background: rgba(0, 0, 0, 0.4);
        box-shadow: 0 0 0 4px rgba(0, 174, 239, 0.1);
    }

    .form-footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .save-btn {
        background: #00aeef;
        color: white;
        border: none;
        padding: 1rem 2.5rem;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .save-btn:hover:not(:disabled) {
        background: #0096cf;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -5px rgba(0, 174, 239, 0.4);
    }

    .save-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>
