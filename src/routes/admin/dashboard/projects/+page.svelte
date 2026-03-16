<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabase";
    import { fade, slide } from "svelte/transition";
    import Cropper from "cropperjs";
    import "cropperjs/dist/cropper.css";

    let projects = $state<any[]>([]);
    let categories = $state<any[]>([]);
    let loading = $state(true);
    let showModal = $state(false);
    let isEditing = $state(false);
    let currentProject = $state({
        id: null,
        title: "",
        description: "",
        slug: "",
        cover_image: "",
        video_url: "",
        video_type: "youtube",
        category: "",
        aspect_ratio: "landscape",
        order_index: 0,
        meta_title: "",
        meta_description: "",
    });

    let saving = $state(false);
    let draggingProjectIndex = $state<number | null>(null);

    // Cropper State (Consistent with Showreel)
    let showCropper = $state(false);
    let cropperImageSrc = $state("");
    let cropperInstance = $state<any>(null);

    // Filter State
    let filterMode = $state<'all' | 'unfinished'>('all');
    let filteredProjects = $derived(
        filterMode === 'all' 
            ? projects 
            : projects.filter(p => !p.video_url)
    );

    onMount(async () => {
        await fetchData();
    });

    async function fetchData() {
        loading = true;
        const [projRes, catRes] = await Promise.all([
            supabase.from("projects").select("*").order("order_index", { ascending: true }),
            supabase.from("categories").select("*").order("order_index", { ascending: true }),
        ]);

        if (projRes.data) projects = projRes.data;
        if (catRes.data) categories = catRes.data;

        if (categories.length > 0 && !currentProject.category) {
            currentProject.category = categories[0].slug;
        }
        loading = false;
    }

    function openModal(project: any = null) {
        if (project) {
            isEditing = true;
            currentProject = { ...project };
        } else {
            isEditing = false;
            currentProject = {
                id: null,
                title: "",
                description: "",
                slug: "",
                cover_image: "",
                video_url: "",
                video_type: "youtube",
                category: categories.length > 0 ? categories[0].slug : "",
                aspect_ratio: "landscape",
                order_index: projects.length,
                meta_title: "",
                meta_description: "",
            };
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        closeCropper();
    }

    async function saveProject() {
        saving = true;
        try {
            if (!currentProject.slug && currentProject.title) {
                currentProject.slug = currentProject.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
            }
            if (isEditing) {
                const { id, ...updateData } = currentProject;
                const { error } = await supabase.from("projects").update(updateData).eq("id", id);
                if (error) throw error;
            } else {
                const { id, ...insertData } = currentProject;
                const { error } = await supabase.from("projects").insert([insertData]);
                if (error) throw error;
            }
            closeModal();
            await fetchData();
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            saving = false;
        }
    }

    async function deleteProject(id: any) {
        if (confirm("Are you sure?")) {
            await supabase.from("projects").delete().eq("id", id);
            await fetchData();
        }
    }

    async function deleteEmptyProjects() {
        if (confirm("Delete all projects with no video link?")) {
            await supabase.from("projects").delete().or('video_url.eq.,video_url.is.null');
            await fetchData();
        }
    }

    // Drag and Drop
    function handleDragStart(e: any, index: number) {
        draggingProjectIndex = index;
        setTimeout(() => e.target.classList.add("dragging"), 0);
    }
    function handleDragOver(e: any, index: number) {
        e.preventDefault();
        if (draggingProjectIndex === null || draggingProjectIndex === index) return;
        const draggedItem = projects[draggingProjectIndex];
        projects.splice(draggingProjectIndex, 1);
        projects.splice(index, 0, draggedItem);
        draggingProjectIndex = index;
        projects = [...projects];
    }
    function handleDragEnd(e: any) {
        e.target.classList.remove("dragging");
        draggingProjectIndex = null;
        saveNewOrder();
    }
    async function saveNewOrder() {
        for (let i = 0; i < projects.length; i++) {
            await supabase.from("projects").update({ order_index: i }).eq("id", projects[i].id);
        }
    }

    // Thumbnail / Cropper Logic
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
                            aspectRatio: currentProject.aspect_ratio === 'portrait' ? 9 / 16 : 16 / 9,
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
        const targetW = currentProject.aspect_ratio === 'portrait' ? 720 : 1280;
        const targetH = currentProject.aspect_ratio === 'portrait' ? 1280 : 720;

        cropperInstance.getCroppedCanvas({ width: targetW, height: targetH }).toBlob(async (blob: any) => {
            if (!blob) { saving = false; return; }
            const fileName = `proj_thumb_${Date.now()}.jpg`;
            const filePath = `uploads/${fileName}`;
            try {
                const { error } = await supabase.storage.from("media").upload(filePath, blob, { upsert: true });
                if (error) throw error;
                const { data: publicData } = supabase.storage.from("media").getPublicUrl(filePath);
                currentProject.cover_image = publicData.publicUrl;
                closeCropper();
            } catch (error) {
                alert("Upload failed.");
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

    async function handleFileUpload(e: any, field: string) {
        const file = e.target.files[0];
        if (!file) return;
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `uploads/${fileName}`;
        saving = true;
        try {
            const { error } = await supabase.storage.from("media").upload(filePath, file);
            if (error) throw error;
            const { data: publicData } = supabase.storage.from("media").getPublicUrl(filePath);
            (currentProject as any)[field] = publicData.publicUrl;
        } catch (error) {
            alert("Upload failed.");
        } finally {
            saving = false;
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
        return "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80";
    }

    // Category Management
    let showCatPanel = $state(false);
    let catSaving = $state(false);
    let editingCat = $state<any>(null);
    let newCat = $state({ name: "", name_ar: "", slug: "" });

    function openAddCat() { editingCat = null; newCat = { name: "", name_ar: "", slug: "" }; showCatPanel = true; }
    function openEditCat(cat: any) { editingCat = cat; newCat = { name: cat.name, name_ar: cat.name_ar || "", slug: cat.slug }; showCatPanel = true; }
    function autoSlug(name: string) { return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-"); }
    async function saveCat() {
        catSaving = true;
        try {
            if (!newCat.slug) newCat.slug = autoSlug(newCat.name);
            const payload = { name: newCat.name, name_ar: newCat.name_ar, slug: newCat.slug, order_index: editingCat ? editingCat.order_index : categories.length };
            if (editingCat) await supabase.from("categories").update(payload).eq("id", editingCat.id);
            else await supabase.from("categories").insert([payload]);
            showCatPanel = false;
            await fetchData();
        } catch (e: any) { alert("Error: " + e.message); } finally { catSaving = false; }
    }
    async function deleteCat(id: any) {
        if (!confirm("Delete this category?")) return;
        await supabase.from("categories").delete().eq("id", id);
        await fetchData();
    }
</script>

<div class="projects-page">
    <!-- Category Management Section -->
    <div class="categories-section">
        <div class="cat-section-header">
            <div>
                <h2 class="cat-section-title">📂 Categories</h2>
                <p class="cat-section-sub">Manage portfolio categories</p>
            </div>
            <button class="add-btn sm" onclick={openAddCat}>+ New Category</button>
        </div>

        <div class="cat-chips">
            {#each categories as cat}
                <div class="cat-chip">
                    <span class="cat-chip-name">{cat.name} {cat.name_ar ? `(${cat.name_ar})` : ''}</span>
                    <div class="cat-chip-actions">
                        <button class="chip-btn" onclick={() => openEditCat(cat)}>✏️</button>
                        <button class="chip-btn" onclick={() => deleteCat(cat.id)}>🗑️</button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Projects Header -->
    <div class="header">
        <div class="header-text">
            <h1>Portfolio Projects</h1>
            <p>Manage your creative works and filtering categories.</p>
        </div>
        <div class="header-actions">
            <button class="add-btn" onclick={() => openModal()}>
                <span>+ Add Project</span>
            </button>
        </div>
    </div>

    <!-- Tabs/Filters -->
    <div class="filter-tabs">
        <button class="tab-btn {filterMode === 'all' ? 'active' : ''}" onclick={() => filterMode = 'all'}>
            All ({projects.length})
        </button>
        <button class="tab-btn {filterMode === 'unfinished' ? 'active' : ''}" onclick={() => filterMode = 'unfinished'}>
            ⚠️ Unfinished ({projects.filter(p => !p.video_url).length})
        </button>
        {#if projects.some(p => !p.video_url)}
            <button class="cleanup-btn" onclick={deleteEmptyProjects}>Clean Empty</button>
        {/if}
    </div>

    {#if loading}
        <div class="loading">Loading projects...</div>
    {:else}
        <div class="cards-grid">
            {#each filteredProjects as project, index (project.id)}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                    class="admin-card {draggingProjectIndex === index ? 'dragging' : ''}"
                    draggable="true"
                    ondragstart={(e) => handleDragStart(e, index)}
                    ondragover={(e) => handleDragOver(e, index)}
                    ondragend={handleDragEnd}
                    transition:fade
                >
                    <div class="card-image-wrapper">
                        <img src={getDisplayImage(project)} alt={project.title} />
                        <div class="card-admin-actions">
                            <button class="icon-btn edit" onclick={() => openModal(project)}>✏️</button>
                            <button class="icon-btn delete" onclick={() => deleteProject(project.id)}>🗑️</button>
                        </div>
                    </div>
                    <div class="card-content" dir="rtl">
                        <h3 class="card-title">{project.title}</h3>
                        <div class="card-meta">
                            <span class="badge">{project.category}</span>
                            <span class="badge neon">{project.video_type}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Project Modal -->
{#if showModal}
    <div class="modal-backdrop" transition:fade>
        <div class="modal-content" transition:slide>
            <div class="modal-header">
                <h2>{isEditing ? "Edit Project" : "Add Project"}</h2>
                <button class="close-btn" onclick={closeModal}>&times;</button>
            </div>

            <div class="modal-body">
                <form id="projectForm" onsubmit={(e) => { e.preventDefault(); saveProject(); }}>
                    <div class="form-grid">
                        <div class="form-group">
                            <span class="field-label">Title *</span>
                            <input type="text" bind:value={currentProject.title} required placeholder="Project Name" />
                        </div>
                        <div class="form-group">
                            <span class="field-label">Category *</span>
                            <select bind:value={currentProject.category} required>
                                {#each categories as cat}
                                    <option value={cat.slug}>{cat.name} {cat.name_ar ? `(${cat.name_ar})` : ''}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <span class="field-label">Video Location</span>
                        <div class="form-grid">
                            <select bind:value={currentProject.video_type}>
                                <option value="youtube">YouTube</option>
                                <option value="vimeo">Vimeo</option>
                                <option value="direct">Direct Link / MP4</option>
                            </select>
                            <input type="text" bind:value={currentProject.video_url} placeholder="URL or ID" />
                        </div>
                    </div>

                    <div class="form-group">
                        <span class="field-label">Aspect Ratio (Format)</span>
                        <div class="ratio-toggle">
                            <label class="ratio-btn {currentProject.aspect_ratio === 'landscape' ? 'active' : ''}">
                                <input type="radio" bind:group={currentProject.aspect_ratio} value="landscape" hidden />
                                <span>Landscape (16:9)</span>
                            </label>
                            <label class="ratio-btn {currentProject.aspect_ratio === 'portrait' ? 'active' : ''}">
                                <input type="radio" bind:group={currentProject.aspect_ratio} value="portrait" hidden />
                                <span>Portrait (9:16)</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <span class="field-label">Thumbnail (Custom Cover)</span>
                        <div class="thumbnail-upload-wrapper">
                            {#if currentProject.cover_image}
                                <div class="thumbnail-preview">
                                    <img src={currentProject.cover_image} alt="Preview" />
                                    <button type="button" class="remove-thumb" onclick={() => currentProject.cover_image = ""}>&times;</button>
                                </div>
                            {/if}
                            <label class="custom-file-upload">
                                <input type="file" accept="image/*" onchange={handleImageToCrop} />
                                <span>{currentProject.cover_image ? "Change Thumbnail" : "Upload Thumbnail"}</span>
                            </label>
                        </div>
                    </div>

                    <details class="advanced-settings">
                        <summary>SEO & Additional Info</summary>
                        <div class="form-group">
                            <span class="field-label">Description</span>
                            <textarea bind:value={currentProject.description} rows="2"></textarea>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <span class="field-label">Meta Title</span>
                                <input type="text" bind:value={currentProject.meta_title} />
                            </div>
                            <div class="form-group">
                                <span class="field-label">Meta Description</span>
                                <input type="text" bind:value={currentProject.meta_description} />
                            </div>
                        </div>
                    </details>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick={closeModal}>Cancel</button>
                <button type="submit" class="btn-save" onclick={saveProject} disabled={saving}>
                    {saving ? "Saving..." : "Save Project"}
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- Category Modal (Small) -->
{#if showCatPanel}
    <div class="modal-backdrop" transition:fade>
        <div class="modal-content sm" transition:slide>
            <div class="modal-header">
                <h2>{editingCat ? "Edit Category" : "Add Category"}</h2>
                <button class="close-btn" onclick={() => showCatPanel = false}>&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <span class="field-label">Name</span>
                    <input type="text" bind:value={newCat.name} oninput={() => { if(!editingCat) newCat.slug = autoSlug(newCat.name); }} />
                </div>
                <div class="form-group">
                    <span class="field-label">Arabic Name (Optional)</span>
                    <input type="text" bind:value={newCat.name_ar} dir="rtl" />
                </div>
                <div class="form-group">
                    <span class="field-label">Slug</span>
                    <input type="text" bind:value={newCat.slug} />
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick={() => showCatPanel = false}>Cancel</button>
                <button class="btn-save" onclick={saveCat} disabled={catSaving}>Save</button>
            </div>
        </div>
    </div>
{/if}

<!-- Global Cropper Modal -->
{#if showCropper}
    <div class="modal-backdrop cropper-backdrop" transition:fade>
        <div class="modal-content cropper-content" transition:slide>
            <div class="modal-header">
                <h2>Crop Thumbnail ({currentProject.aspect_ratio})</h2>
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
    .projects-page { padding: 30px; color: white; }
    .header { margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 2rem; margin: 0; color: #fff; }
    .header p { color: #888; margin: 5px 0 0; }

    .add-btn { background: #00aeef; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
    .add-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3); }
    .add-btn.sm { padding: 8px 16px; font-size: 0.85rem; }

    .filter-tabs { display: flex; gap: 10px; margin-bottom: 24px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; }
    .tab-btn { background: rgba(255,255,255,0.02); border: 1px solid #333; color: #888; padding: 8px 16px; border-radius: 10px; cursor: pointer; transition: 0.3s; font-weight: 600; }
    .tab-btn.active { background: #00aeef; border-color: #00aeef; color: white; }
    .cleanup-btn { margin-left: auto; background: none; border: 1px solid #ef4444; color: #ef4444; padding: 8px 16px; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }

    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .admin-card { background: #111; border-radius: 16px; border: 1px solid #222; overflow: hidden; transition: 0.3s; position: relative; }
    .admin-card:hover { transform: translateY(-5px); border-color: #00aeef; }
    .admin-card.dragging { opacity: 0.5; }

    .card-image-wrapper { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; overflow: hidden; }
    .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: 0.3s; }
    .admin-card:hover .card-image-wrapper img { opacity: 1; transform: scale(1.05); }

    .card-admin-actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 8px; opacity: 0; transition: 0.3s; }
    .admin-card:hover .card-admin-actions { opacity: 1; }
    .icon-btn { width: 34px; height: 34px; border-radius: 8px; border: none; cursor: pointer; color: white; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .icon-btn.edit:hover { background: #00aeef; }
    .icon-btn.delete:hover { background: #ef4444; }

    .card-content { padding: 15px; text-align: right; }
    .card-title { margin: 0 0 10px; font-size: 1.1rem; font-weight: 700; color: #fff; }
    .card-meta { display: flex; gap: 8px; justify-content: flex-end; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: #888; font-weight: 600; }
    .badge.neon { color: #00aeef; background: rgba(0, 174, 239, 0.1); }

    /* Categories Panel */
    .categories-section { background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 16px; padding: 20px; margin-bottom: 30px; }
    .cat-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .cat-section-title { font-size: 1.1rem; margin: 0; font-weight: 700; }
    .cat-section-sub { font-size: 0.85rem; color: #666; margin: 0; }
    .cat-chips { display: flex; flex-wrap: wrap; gap: 10px; }
    .cat-chip { background: #1a1a1a; border: 1px solid #333; padding: 6px 12px; border-radius: 10px; display: flex; align-items: center; gap: 10px; }
    .cat-chip-name { font-size: 0.9rem; font-weight: 600; }
    .cat-chip-actions { display: flex; gap: 5px; }
    .cat-chip-actions .chip-btn { background: none; border: none; color: #666; cursor: pointer; padding: 2px; font-size: 0.9rem; transition: 0.2s; }
    .cat-chip-actions .chip-btn:hover { color: #fff; }

    /* Modal Styles */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-content { background: #111; border-radius: 20px; width: 100%; max-width: 650px; padding: 25px; max-height: 90vh; overflow-y: auto; position: relative; border: 1px solid #222; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .modal-content.sm { max-width: 420px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .modal-header h2 { font-size: 1.3rem; margin: 0; color: #fff; font-weight: 700; }
    .close-btn { background: none; border: none; color: #888; font-size: 2rem; cursor: pointer; line-height: 1; }

    .modal-body { padding: 10px 5px; }
    .form-group { margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .field-label { display: block; margin-bottom: 8px; color: #aaa; font-size: 0.85rem; font-weight: 600; }
    input, select, textarea { width: 100%; padding: 12px 16px; background: #000; border: 1px solid #333; border-radius: 12px; color: white; font-family: inherit; transition: 0.2s; color-scheme: dark; }
    input:focus, select:focus, textarea:focus { border-color: #00aeef; outline: none; background: rgba(0, 174, 239, 0.05); }
    option { background: #111; color: white; }

    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
    .btn-cancel { background: none; border: 1px solid #333; color: white; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.2s; }
    .btn-cancel:hover { background: rgba(255,255,255,0.05); }
    .btn-save { background: #00aeef; border: none; color: white; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .btn-save:hover { background: #008cc2; transform: scale(1.02); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    /* Video Ratio Toggle */
    .ratio-toggle { display: flex; gap: 8px; background: #000; padding: 5px; border-radius: 14px; border: 1px solid #333; }
    .ratio-btn { flex: 1; padding: 10px; border-radius: 10px; cursor: pointer; text-align: center; transition: 0.3s; font-size: 0.85rem; color: #666; font-weight: 700; }
    .ratio-btn.active { background: #00aeef; color: white; }

    /* Thumbnail Upload */
    .thumbnail-upload-wrapper { display: flex; flex-direction: column; gap: 15px; }
    .thumbnail-preview { position: relative; width: 100%; max-width: 280px; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
    .thumbnail-preview img { width: 100%; height: 100%; object-fit: cover; }
    .remove-thumb { position: absolute; top: 8px; right: 8px; background: #ef4444; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 14px; font-weight: bold; display: flex; align-items: center; justify-content: center; }
    .custom-file-upload { display: inline-block; padding: 20px; background: #1a1a1a; border: 1px dashed #444; border-radius: 14px; cursor: pointer; text-align: center; transition: 0.3s; font-size: 0.9rem; font-weight: 600; color: #888; }
    .custom-file-upload:hover { border-color: #00aeef; color: #fff; background: rgba(0, 174, 239, 0.05); }
    .custom-file-upload input { display: none; }

    /* Advanced Settings */
    .advanced-settings { margin-top: 15px; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
    .advanced-settings summary { cursor: pointer; padding: 12px 15px; background: rgba(255,255,255,0.02); color: #00aeef; font-size: 0.9rem; font-weight: 700; }
    .advanced-settings[open] summary { border-bottom: 1px solid #222; }
    .advanced-settings .form-group { padding: 15px; margin: 0; }

    /* Cropper */
    .cropper-backdrop { z-index: 2000; }
    .cropper-content { max-width: 900px; padding: 20px; }
    .cropper-container { width: 100%; max-height: 65vh; background: #000; overflow: hidden; border-radius: 12px; margin-bottom: 20px; }
    .cropper-container img { max-width: 100%; display: block; }

    .loading { text-align: center; padding: 150px; color: #666; font-size: 1.2rem; font-weight: 600; }
</style>
