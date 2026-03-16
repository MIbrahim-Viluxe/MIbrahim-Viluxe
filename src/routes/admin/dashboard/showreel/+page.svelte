<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase";
    import { fade, slide } from "svelte/transition";
    import Cropper from "cropperjs";
    import "cropperjs/dist/cropper.css";

    let clips = $state<any[]>([]);
    let loading = $state(true);
    let showModal = $state(false);
    let isEditing = $state(false);
    let currentClip = $state({
        id: null,
        title: "",
        video_url: "",
        cover_image: "",
        aspect_ratio: "landscape",
        category: "video",
        video_type: "youtube",
        duration: 5,
        order_index: 0,
    });

    let saving = $state(false);
    let draggingClipIndex = $state<number | null>(null);

    // Cropper State
    let showCropper = $state(false);
    let cropperImageSrc = $state("");
    let cropperInstance = $state<any>(null);

    onMount(async () => {
        await fetchData();
    });

    async function fetchData() {
        loading = true;
        const { data, error } = await supabase
            .from("showreel")
            .select("*")
            .order("order_index", { ascending: true });

        if (data) clips = data;
        loading = false;
    }

    function openModal(clip: any = null) {
        if (clip) {
            isEditing = true;
            currentClip = { ...clip };
        } else {
            isEditing = false;
            currentClip = {
                id: null,
                title: "",
                video_url: "",
                cover_image: "",
                aspect_ratio: "landscape",
                category: "video",
                video_type: "youtube",
                duration: 5,
                order_index: clips.length,
            };
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        closeCropper();
    }

    async function saveClip() {
        saving = true;
        try {
            if (isEditing) {
                const { id, ...updateData } = currentClip;
                const { error } = await supabase
                    .from("showreel")
                    .update(updateData)
                    .eq("id", id);
                if (error) throw error;
            } else {
                const { id, ...insertData } = currentClip;
                const { error } = await supabase
                    .from("showreel")
                    .insert([insertData]);
                if (error) throw error;
            }
            closeModal();
            await fetchData();
        } catch (error: any) {
            console.error("Error saving clip:", error);
            alert("Error: " + (error.message || "Failed to save. Ensure columns exist in 'showreel' table."));
        } finally {
            saving = false;
        }
    }

    async function deleteClip(id: any) {
        if (confirm("Are you sure?")) {
            await supabase.from("showreel").delete().eq("id", id);
            await fetchData();
        }
    }

    // Drag and drop logic
    function handleDragStart(e: any, index: number) {
        draggingClipIndex = index;
        setTimeout(() => e.target.classList.add("dragging"), 0);
    }

    function handleDragOver(e: any, index: number) {
        e.preventDefault();
        if (draggingClipIndex === null || draggingClipIndex === index) return;
        const draggedItem = clips[draggingClipIndex];
        clips.splice(draggingClipIndex, 1);
        clips.splice(index, 0, draggedItem);
        draggingClipIndex = index;
        clips = [...clips];
    }

    function handleDragEnd(e: any) {
        e.target.classList.remove("dragging");
        draggingClipIndex = null;
        saveNewOrder();
    }

    async function saveNewOrder() {
        for (let i = 0; i < clips.length; i++) {
            await supabase.from("showreel").update({ order_index: i }).eq("id", clips[i].id);
        }
    }

    function getDisplayImage(item: any) {
        if (item.cover_image) return item.cover_image;
        let ytId = "";
        const url = item.video_url || "";
        if (url.includes("youtu.be/")) ytId = url.split("youtu.be/")[1]?.split("?")[0];
        else if (url.includes("v=")) ytId = url.split("v=")[1]?.split("&")[0];
        else if (url.includes("shorts/")) ytId = url.split("shorts/")[1]?.split("?")[0];
        if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        return "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=400&q=80";
    }

    // Image Cropper Logic
    function handleImageToCrop(e: any) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target) {
                cropperImageSrc = event.target.result as string;
                showCropper = true;

                setTimeout(() => {
                    const img = document.getElementById("image-to-crop") as HTMLImageElement;
                    if (img) {
                        if (cropperInstance) cropperInstance.destroy();
                        cropperInstance = new Cropper(img, {
                            aspectRatio: currentClip.aspect_ratio === 'portrait' ? 9 / 16 : 16 / 9,
                            viewMode: 1,
                        });
                    }
                }, 100);
            }
        };
        reader.readAsDataURL(file);
    }

    async function uploadCroppedImage() {
        if (!cropperInstance) return;
        saving = true;

        const targetW = currentClip.aspect_ratio === 'portrait' ? 720 : 1280;
        const targetH = currentClip.aspect_ratio === 'portrait' ? 1280 : 720;

        cropperInstance.getCroppedCanvas({ width: targetW, height: targetH }).toBlob(async (blob: any) => {
            if (!blob) { saving = false; return; }
            const fileName = `home_thumb_${Date.now()}.jpg`;
            const filePath = `uploads/${fileName}`;

            try {
                const { error } = await supabase.storage.from("media").upload(filePath, blob, { upsert: true });
                if (error) throw error;
                const { data: publicData } = supabase.storage.from("media").getPublicUrl(filePath);
                currentClip.cover_image = publicData.publicUrl;
                closeCropper();
            } catch (error) {
                console.error("Upload Error:", error);
                alert("Failed to upload thumbnail.");
            } finally {
                saving = false;
            }
        }, "image/jpeg", 0.85);
    }

    function closeCropper() {
        showCropper = false;
        cropperImageSrc = "";
        if (cropperInstance) {
            cropperInstance.destroy();
            cropperInstance = null;
        }
    }
</script>

<div class="projects-page">
    <div class="header">
        <div class="header-text">
            <h1>🏠 Home Page Videos</h1>
            <p>These videos appear in the moving tracks on the home page.</p>
        </div>
        <div class="header-actions">
            <button class="add-btn" onclick={() => openModal()}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add Video
            </button>
        </div>
    </div>

    {#if loading}
        <div class="loading">Loading videos...</div>
    {:else if clips.length === 0}
        <div class="empty-state">
            <div class="empty-icon">🎞️</div>
            <h3>No home videos yet</h3>
            <p>Click "Add Video" to populate the tracks on the home page.</p>
        </div>
    {:else}
        <div class="cards-grid">
            {#each clips as clip, index (clip.id)}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="admin-card {draggingClipIndex === index ? 'dragging' : ''}"
                    draggable="true"
                    ondragstart={(e) => handleDragStart(e, index)}
                    ondragover={(e) => handleDragOver(e, index)}
                    ondragend={handleDragEnd}
                    role="listitem"
                >
                    <div class="card-video-wrapper">
                        <img src={getDisplayImage(clip)} alt={clip.title} class="preview-img" />
                        <div class="card-admin-actions">
                            <button class="icon-btn edit neon-hover" onclick={() => openModal(clip)}>✏️</button>
                            <button class="icon-btn delete neon-hover-danger" onclick={() => deleteClip(clip.id)}>🗑️</button>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">{clip.title || 'Untitled'}</h3>
                        <div class="card-badges">
                            <span class="badge neon">{clip.aspect_ratio}</span>
                            <span class="badge">{clip.category}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if showModal}
    <div class="modal-backdrop" transition:fade>
        <div class="modal-content" transition:slide={{ axis: 'y' }}>
            <div class="modal-header">
                <h2>{isEditing ? "Edit Video" : "Add Video"}</h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>
            <div class="modal-body">
                <form onsubmit={(e) => { e.preventDefault(); saveClip(); }}>
                    <div class="form-group">
                        <span class="field-label">Title</span>
                        <input type="text" bind:value={currentClip.title} required />
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <span class="field-label">Video URL (YouTube/Vimeo/Direct)</span>
                            <input type="text" bind:value={currentClip.video_url} required />
                        </div>
                        <div class="form-group">
                            <span class="field-label">Video Type</span>
                            <select bind:value={currentClip.video_type}>
                                <option value="youtube">YouTube</option>
                                <option value="vimeo">Vimeo</option>
                                <option value="direct">Direct</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <span class="field-label">Aspect Ratio</span>
                            <select bind:value={currentClip.aspect_ratio}>
                                <option value="landscape">Landscape (العرضي)</option>
                                <option value="portrait">Portrait (الطولي/ريلز)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <span class="field-label">Category Badge</span>
                            <input type="text" bind:value={currentClip.category} />
                        </div>
                    </div>
                    <div class="form-group">
                        <span class="field-label">Custom Cover Image (Thumbnail)</span>
                        <div class="thumbnail-upload-wrapper">
                            {#if currentClip.cover_image}
                                <div class="thumbnail-preview">
                                    <img src={currentClip.cover_image} alt="Thumbnail preview" />
                                    <button type="button" class="remove-thumb" onclick={() => currentClip.cover_image = ""}>&times;</button>
                                </div>
                            {/if}
                            <label class="custom-file-upload">
                                <input type="file" accept="image/*" onchange={handleImageToCrop} />
                                <span>{currentClip.cover_image ? "Change Image" : "Upload Image"}</span>
                            </label>
                        </div>
                        <p class="form-helper">Optional: Leave empty for auto YouTube/Vimeo thumbnail.</p>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick={closeModal}>Cancel</button>
                <button type="submit" class="btn-save" onclick={saveClip} disabled={saving}>
                    {saving ? "Saving..." : "Save Video"}
                </button>
            </div>
        </div>
    </div>
{/if}

{#if showCropper}
    <div class="modal-backdrop cropper-backdrop" transition:fade>
        <div class="modal-content cropper-content" transition:slide>
            <div class="modal-header">
                <h2>Crop Thumbnail ({currentClip.aspect_ratio === 'portrait' ? '9:16' : '16:9'})</h2>
                <button class="close-btn" onclick={closeCropper}>&times;</button>
            </div>
            <div class="cropper-container">
                <img id="image-to-crop" src={cropperImageSrc} alt="To crop" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick={closeCropper}>Cancel</button>
                <button type="button" class="btn-save" onclick={uploadCroppedImage} disabled={saving}>
                    {saving ? "Processing..." : "Crop & Upload"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .projects-page {
        padding: 20px;
        color: white;
    }
    .header {
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .header h1 {
        font-size: 2rem;
        color: #fff;
        margin: 0;
    }
    .header p {
        color: #888;
        margin: 0.5rem 0 0;
    }

    .add-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #00aeef;
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .add-btn:hover {
        background: #008cc2;
        transform: translateY(-2px);
    }

    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
        padding: 10px 0;
    }

    .admin-card {
        background: #111;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        position: relative;
    }
    .admin-card:hover {
        transform: translateY(-5px);
        border-color: #00aeef;
    }
    .admin-card.dragging {
        opacity: 0.5;
    }

    .card-video-wrapper {
        position: relative;
        width: 100%;
        height: 180px;
        background: #000;
    }
    .preview-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card-admin-actions {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .admin-card:hover .card-admin-actions {
        opacity: 1;
    }

    .icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        background: rgba(0, 0, 0, 0.7);
    }
    .icon-btn.edit:hover { background: #00aeef; }
    .icon-btn.delete:hover { background: #ef4444; }

    .card-content { padding: 15px; }
    .card-title { margin: 0 0 10px; font-size: 1.1rem; }
    .card-badges { display: flex; gap: 8px; }
    .badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        color: #888;
    }
    .badge.neon { color: #00aeef; border: 1px solid rgba(0, 174, 239, 0.3); }

    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal-content {
        background: #111;
        border-radius: 24px;
        width: 95%;
        max-width: 600px;
        padding: 30px;
        max-height: 90vh;
        overflow-y: auto;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .close-btn { background: none; border: none; color: #888; font-size: 1.5rem; cursor: pointer; }

    .form-group { margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .field-label { display: block; margin-bottom: 8px; color: #888; font-size: 0.9rem; }
    input, select {
        width: 100%;
        padding: 12px;
        background: #000;
        border: 1px solid #333;
        border-radius: 10px;
        color: white;
        color-scheme: dark;
    }

    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
    .btn-cancel { background: none; border: 1px solid #333; color: white; padding: 10px 20px; border-radius: 10px; cursor: pointer; }
    .btn-save { background: #00aeef; border: none; color: white; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; }

    .loading { text-align: center; padding: 100px; }
    .empty-state { text-align: center; padding: 100px; border: 1px dashed #333; border-radius: 20px; }

    .thumbnail-upload-wrapper {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 15px;
    }
    .thumbnail-preview {
        position: relative;
        width: 100%;
        max-width: 300px;
        aspect-ratio: 16/9;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #333;
    }
    .thumbnail-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .remove-thumb {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(239, 68, 68, 0.8);
        color: white;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    .custom-file-upload {
        display: inline-block;
        padding: 12px 24px;
        background: #222;
        border: 1px dashed #444;
        border-radius: 12px;
        cursor: pointer;
        text-align: center;
        transition: all 0.3s;
    }
    .custom-file-upload:hover {
        border-color: #00aeef;
        background: rgba(0, 174, 239, 0.05);
    }
    .custom-file-upload input[type="file"] {
        display: none;
    }

    /* Cropper Styles */
    .cropper-backdrop { z-index: 200; }
    .cropper-content { max-width: 800px; }
    .cropper-container {
        width: 100%;
        max-height: 60vh;
        background: #000;
        overflow: hidden;
    }
    .cropper-container img {
        max-width: 100%;
        display: block;
    }
</style>
