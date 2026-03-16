<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabase";

    let email = "";
    let password = "";
    let loading = false;
    let errorMsg = "";

    onMount(async () => {
        // Check if user is already logged in
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (session) {
            goto("/admin/dashboard");
        }
    });

    async function handleLogin() {
        loading = true;
        errorMsg = "";

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            errorMsg = error.message;
            loading = false;
        } else {
            loading = false;
            goto("/admin/dashboard");
        }
    }
</script>

<svelte:head>
    <title>Admin Login - Mohamed Ibrahim</title>
</svelte:head>

<div class="login-container">
    <div class="login-card">
        <div class="logo">
            <!-- Add generic logo/text for now -->
            <h2>Mohamed Ibrahim</h2>
            <p>Secure Admin Portal</p>
        </div>

        {#if errorMsg}
            <div class="error-box">{errorMsg}</div>
        {/if}

        <form on:submit|preventDefault={handleLogin}>
            <div class="input-group">
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    bind:value={email}
                    required
                    placeholder="admin@artvision.com"
                />
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    required
                    placeholder="••••••••"
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    </div>
</div>

<style>
    .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #050505;
        background-image: radial-gradient(
                circle at top right,
                #002060 0%,
                transparent 40%
            ),
            radial-gradient(circle at bottom left, #00aeef 0%, transparent 40%);
        font-family: "Inter", sans-serif;
        color: white;
    }

    .login-card {
        background: rgba(20, 20, 20, 0.7);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 3rem;
        border-radius: 24px;
        width: 100%;
        max-width: 420px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .logo {
        text-align: center;
        margin-bottom: 2rem;
    }

    .logo h2 {
        font-size: 2rem;
        font-weight: 800;
        margin: 0 0 0.5rem 0;
        background: linear-gradient(135deg, #fff 0%, #aaa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .logo p {
        color: #888;
        font-size: 0.9rem;
        margin: 0;
    }

    .input-group {
        margin-bottom: 1.5rem;
    }

    .input-group label {
        display: block;
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
        color: #ccc;
        font-weight: 500;
    }

    .input-group input {
        width: 100%;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: white;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    .input-group input:focus {
        outline: none;
        border-color: #00aeef;
        box-shadow: 0 0 0 2px rgba(0, 174, 239, 0.2);
    }

    button {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #002060, #00aeef);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1rem;
    }

    button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -10px rgba(0, 174, 239, 0.5);
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .error-box {
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.3);
        color: #fca5a5;
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        text-align: center;
    }
</style>
