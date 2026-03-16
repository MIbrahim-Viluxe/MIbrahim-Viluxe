<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase";

    let stats = {
        projects: 0,
        categories: 0,
    };
    let loading = true;

    onMount(async () => {
        // Fetch quick stats
        const [projectsRes, categoriesRes] = await Promise.all([
            supabase
                .from("projects")
                .select("*", { count: "exact", head: true }),
            supabase
                .from("categories")
                .select("*", { count: "exact", head: true }),
        ]);

        stats.projects = projectsRes.count || 0;
        stats.categories = categoriesRes.count || 0;
        loading = false;
    });
</script>

<svelte:head>
    <title>Dashboard - Mohamed Ibrahim</title>
</svelte:head>

<div class="dashboard-overview">
    <div class="header">
        <h1>Dashboard Overview</h1>
        <p>Manage your Mohamed Ibrahim studio content from here.</p>
    </div>

    {#if loading}
        <div class="skeleton-grid">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    {:else}
        <div class="stats-grid">
            <!-- Projects Stat -->
            <div class="stat-card">
                <div class="stat-icon projects-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Total Projects</h3>
                    <p class="stat-number">{stats.projects}</p>
                </div>
            </div>

            <!-- Categories Stat -->
            <div class="stat-card">
                <div class="stat-icon categories-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Categories</h3>
                    <p class="stat-number">{stats.categories}</p>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="actions-grid">
                <a href="/admin/dashboard/projects" class="action-btn primary">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add New Project
                </a>
            </div>
        </div>
    {/if}
</div>

<style>
    .header {
        margin-bottom: 2.5rem;
    }

    .header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: #fff;
    }

    .header p {
        color: #888;
        margin: 0;
        font-size: 1.1rem;
    }

    .stats-grid,
    .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stat-icon svg {
        width: 30px;
        height: 30px;
        color: white;
    }

    .projects-icon {
        background: linear-gradient(135deg, #00aeef, #0056b3);
        box-shadow: 0 10px 20px -5px rgba(0, 174, 239, 0.3);
    }

    .categories-icon {
        background: linear-gradient(135deg, #8b5cf6, #5b21b6);
        box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.3);
    }

    .stat-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        color: #a3a3a3;
        font-weight: 500;
    }

    .stat-number {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 800;
        color: #fff;
        line-height: 1;
    }

    .quick-actions h2 {
        font-size: 1.25rem;
        margin: 0 0 1.5rem 0;
        color: #fff;
        font-weight: 600;
    }

    .actions-grid {
        display: flex;
        gap: 1rem;
    }

    .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .action-btn svg {
        width: 20px;
        height: 20px;
    }

    .action-btn.primary {
        background: #00aeef;
        color: #fff;
        box-shadow: 0 5px 15px -5px rgba(0, 174, 239, 0.5);
    }

    .action-btn.primary:hover {
        background: #0096cf;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px -5px rgba(0, 174, 239, 0.6);
    }

    /* Skeletons */
    .skeleton-card {
        height: 110px;
        background: #111;
        border-radius: 16px;
        position: relative;
        overflow: hidden;
    }

    .skeleton-card::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.02) 20%,
            rgba(255, 255, 255, 0.05) 60%,
            rgba(255, 255, 255, 0)
        );
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        100% {
            transform: translateX(100%);
        }
    }
</style>
