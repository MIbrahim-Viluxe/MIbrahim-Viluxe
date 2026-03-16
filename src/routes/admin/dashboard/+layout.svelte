<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { supabase } from "$lib/supabase";
    import { fade } from "svelte/transition";

    let sessionLoaded = false;
    let user: any = null;

    onMount(() => {
        let subscription: any;

        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                goto("/admin");
            } else {
                user = session.user;
                sessionLoaded = true;
            }

            const { data } = supabase.auth.onAuthStateChange(
                (_event, session) => {
                    if (!session) {
                        goto("/admin");
                    } else {
                        user = session.user;
                    }
                },
            );
            subscription = data.subscription;
        };

        checkAuth();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    });

    async function handleLogout() {
        await supabase.auth.signOut();
        goto("/admin");
    }

    // Define navigation links
    const links = [
        {
            name: "Overview",
            path: "/admin/dashboard",
            icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        },
        {
            name: "Projects",
            path: "/admin/dashboard/projects",
            icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
        },
        {
            name: "Home Page Videos",
            path: "/admin/dashboard/showreel",
            icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z",
        },
        {
            name: "Settings",
            path: "/admin/dashboard/settings",
            icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
        },
        {
            name: "Back to Site",
            path: "/",
            icon: "M10 19l-7-7m0 0l7-7m-7 7h18",
        },
    ];
</script>

{#if sessionLoaded}
    <div class="dashboard-layout" in:fade={{ duration: 300 }}>
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <h2>MI<span>Panel</span></h2>
                </div>
            </div>

            <nav class="sidebar-nav">
                <ul>
                    {#each links as link}
                        <li>
                            <a
                                href={link.path}
                                class:active={$page.url.pathname ===
                                    link.path ||
                                    ($page.url.pathname.startsWith(link.path) &&
                                        link.path !== "/" &&
                                        link.path !== "/admin/dashboard")}
                                target={link.path === "/" ? "_blank" : ""}
                            >
                                <svg
                                    class="nav-icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d={link.icon}
                                    />
                                </svg>
                                {link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>

            <div class="sidebar-footer">
                <button class="logout-btn" on:click={handleLogout}>
                    <svg
                        class="nav-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <div class="header-left">
                    {#if user}
                        <span class="greeting">Welcome back, Admin 👋</span>
                    {/if}
                </div>
                <div class="header-right">
                    <div class="admin-avatar">M</div>
                </div>
            </header>

            <div class="content-wrapper">
                <slot />
            </div>
        </main>
    </div>
{:else}
    <!-- Loading state -->
    <div class="loading-screen">
        <div class="spinner"></div>
    </div>
{/if}

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family:
            "Inter",
            system-ui,
            -apple-system,
            sans-serif;
        background-color: #050505;
        color: #e5e5e5;
    }

    .dashboard-layout {
        display: flex;
        height: 100vh;
        overflow: hidden;
    }

    .sidebar {
        width: 280px;
        background: #0a0a0a;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        z-index: 10;
    }

    .sidebar-header {
        padding: 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .logo h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        color: #fff;
        letter-spacing: -0.5px;
    }

    .logo span {
        color: #00aeef;
    }

    .sidebar-nav {
        flex: 1;
        padding: 2rem 1rem;
        overflow-y: auto;
    }

    .sidebar-nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .sidebar-nav a {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.875rem 1rem;
        color: #888;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .sidebar-nav a:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.03);
    }

    .sidebar-nav a.active {
        color: #fff;
        background: linear-gradient(90deg, rgba(0, 174, 239, 0.1), transparent);
        border-left: 3px solid #00aeef;
    }

    .nav-icon {
        width: 20px;
        height: 20px;
    }

    .sidebar-footer {
        padding: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .logout-btn {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.875rem 1rem;
        background: rgba(220, 38, 38, 0.1);
        color: #fca5a5;
        border: 1px solid rgba(220, 38, 38, 0.2);
        border-radius: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .logout-btn:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
    }

    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
    }

    .main-content::before {
        content: "";
        position: absolute;
        top: -50%;
        right: -20%;
        width: 80%;
        height: 100%;
        background: radial-gradient(
            circle,
            rgba(0, 32, 96, 0.1) 0%,
            transparent 60%
        );
        pointer-events: none;
        z-index: 0;
    }

    .top-header {
        height: 80px;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        background: rgba(10, 10, 10, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 5;
    }

    .greeting {
        font-weight: 600;
        color: #fff;
    }

    .admin-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #002060, #00aeef);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: white;
        font-size: 1.2rem;
    }

    .content-wrapper {
        flex: 1;
        overflow-y: auto;
        padding: 2rem;
        z-index: 1;
    }

    .loading-screen {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #050505;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 174, 239, 0.2);
        border-radius: 50%;
        border-top-color: #00aeef;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
