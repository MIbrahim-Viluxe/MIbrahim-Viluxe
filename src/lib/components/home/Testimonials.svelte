<script lang="ts">
    import { lang } from "$lib/stores/lang";
    import { supabase } from "$lib/supabase";
    import { fade, slide } from "svelte/transition";

    let { testimonials = [] }: { testimonials: any[] } = $props();

    let showForm = $state(false);
    let name = $state("");
    let rating = $state(5);
    let text = $state("");
    let submitting = $state(false);
    let submitted = $state(false);

    async function handleSubmit() {
        if (!name || !text) return;
        submitting = true;
        
        try {
            const { error } = await supabase.from("testimonials").insert([
                { 
                    name, 
                    rating, 
                    text, 
                    approved: true // Auto-approve as requested
                }
            ]);
            
            if (error) throw error;
            
            submitted = true;
            setTimeout(() => {
                showForm = false;
                submitted = false;
                name = "";
                text = "";
                rating = 5;
            }, 3000);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            submitting = false;
        }
    }
</script>

<section class="testimonials-section">
    <div class="container animate-on-scroll">
        <div class="testi-header">
            <h2 class="section-title">
                {$lang === "ar" ? "آراء عملائنا" : "Client Feedback"}
            </h2>
            <button class="add-review-btn" onclick={() => showForm = !showForm}>
                {showForm 
                    ? ($lang === 'ar' ? 'إغلاق' : 'Close') 
                    : ($lang === 'ar' ? 'أضف رأيك' : 'Add Your Review')}
            </button>
        </div>

        {#if showForm}
            <div class="form-container glass-panel" transition:slide>
                {#if submitted}
                    <div class="success-msg" in:fade>
                        <div class="check-icon">✓</div>
                        <h3>{$lang === 'ar' ? 'شكراً لك!' : 'Thank You!'}</h3>
                        <p>{$lang === 'ar' ? 'تم إضافة رأيك بنجاح.' : 'Your review has been added successfully.'}</p>
                    </div>
                {:else}
                    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="name">{$lang === 'ar' ? 'الاسم' : 'Name'}</label>
                                <input type="text" id="name" bind:value={name} required placeholder="Ahmed..." />
                            </div>
                            <div class="form-group">
                                <label for="rating">{$lang === 'ar' ? 'التقييم' : 'Rating'}</label>
                                <div class="rating-stars">
                                    {#each [1, 2, 3, 4, 5] as star}
                                        <button 
                                            type="button" 
                                            class="star-btn {rating >= star ? 'active' : ''}" 
                                            onclick={() => rating = star}
                                        >★</button>
                                    {/each}
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="review">{$lang === 'ar' ? 'رأيك' : 'Review'}</label>
                            <textarea id="review" bind:value={text} required rows="3" placeholder="..."></textarea>
                        </div>
                        <button type="submit" class="submit-btn" disabled={submitting}>
                            {submitting ? ($lang === 'ar' ? 'جاري الرسل...' : 'Sending...') : ($lang === 'ar' ? 'نشر التعليق' : 'Post Review')}
                        </button>
                    </form>
                {/if}
            </div>
        {/if}

        <div class="testi-grid">
            {#each testimonials as item}
                <div class="testi-card glass-card" in:fade>
                    <div class="card-stars">
                        {#each Array(item.rating) as _}
                            <span>★</span>
                        {/each}
                    </div>
                    <p class="card-text">"{item.text}"</p>
                    <div class="card-footer">
                        <h4 class="card-name">{item.name}</h4>
                        <span class="card-date">{new Date(item.created_at).toLocaleDateString($lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    </div>
                </div>
            {/each}

            {#if testimonials.length === 0 && !showForm}
                <div class="empty-testi">
                    <p>{$lang === 'ar' ? 'لا توجد آراء بعد. كن أول من يشاركنا رأيه!' : 'No reviews yet. Be the first to share your feedback!'}</p>
                </div>
            {/if}
        </div>
    </div>
</section>

<style>
    .testimonials-section {
        padding: 100px 0;
        background: radial-gradient(circle at bottom, rgba(0, 229, 255, 0.05), transparent 70%);
    }

    .testi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 50px;
    }

    .section-title {
        font-family: "Alexandria", sans-serif;
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 900;
        margin: 0;
        background: linear-gradient(110deg, #fff 0%, var(--primary) 50%, #fff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: textShine 6s linear infinite;
    }

    @keyframes textShine { to { background-position: 200% center; } }

    .add-review-btn {
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid var(--primary);
        color: var(--primary);
        padding: 12px 25px;
        border-radius: 50px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.3s;
    }

    .add-review-btn:hover {
        background: var(--primary);
        color: #000;
        box-shadow: 0 0 20px var(--primary-glow);
    }

    .form-container {
        max-width: 700px;
        margin: 0 auto 60px;
        padding: 40px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        backdrop-filter: blur(10px);
    }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { margin-bottom: 20px; text-align: right; }
    .form-group label { display: block; margin-bottom: 8px; color: #aaa; font-size: 0.9rem; }
    
    input, textarea {
        width: 100%;
        padding: 12px 18px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: #fff;
        font-family: inherit;
        outline: none;
    }

    input:focus, textarea:focus { border-color: var(--primary); }

    .rating-stars { display: flex; gap: 5px; direction: ltr; justify-content: flex-end; }
    .star-btn { background: none; border: none; font-size: 1.8rem; color: #333; cursor: pointer; transition: 0.2s; }
    .star-btn.active { color: #ffc107; text-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }

    .submit-btn {
        width: 100%;
        padding: 15px;
        background: var(--primary);
        color: #000;
        border: none;
        border-radius: 12px;
        font-weight: 800;
        cursor: pointer;
        transition: 0.3s;
    }

    .submit-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .testi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
    }

    .testi-card {
        padding: 30px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        transition: 0.3s;
    }

    .testi-card:hover { transform: translateY(-5px); border-color: var(--primary); }

    .card-stars { color: #ffc107; font-size: 0.9rem; margin-bottom: 15px; }
    .card-text { color: #ddd; line-height: 1.6; font-style: italic; margin-bottom: 25px; flex-grow: 1; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px; }
    .card-name { margin: 0; color: #fff; font-size: 1.1rem; }
    .card-date { color: #666; font-size: 0.8rem; }

    .success-msg { text-align: center; color: #4ade80; }
    .check-icon { font-size: 3rem; margin-bottom: 10px; }

    .empty-testi { text-align: center; padding: 40px; color: #666; grid-column: 1 / -1; }

    @media (max-width: 768px) {
        .testi-header { flex-direction: column; gap: 20px; text-align: center; }
        .form-grid { grid-template-columns: 1fr; }
        .form-container { padding: 25px; }
    }
</style>
