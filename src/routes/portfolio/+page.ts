import { supabase } from "$lib/supabase";

export const load = async () => {
  const [projRes, showRes, catRes] = await Promise.all([
    supabase.from("projects").select("*").order("order_index", { ascending: true }),
    supabase.from("showreel").select("*").order("order_index", { ascending: true }),
    supabase.from("categories").select("*").order("order_index", { ascending: true }),
  ]);

  const projects = (projRes.data || []).map((p) => ({
    ...p,
    id: `p-${p.id}`,
    source: 'projects',
    title_ar: p.title,
    title_en: p.title,
    image: p.cover_image,
  }));

  const showreel = (showRes.data || []).map((s) => ({
    ...s,
    id: `s-${s.id}`,
    source: 'showreel',
    title_ar: s.title,
    title_en: s.title,
    slug: s.slug || `sr-${s.id}`,
    description: s.description || "",
    image: s.cover_image,
  }));

  // Combine and de-duplicate by video_url
  const allItems = [...showreel, ...projects];
  const seenUrls = new Set();
  const portfolio = allItems.filter(item => {
    const url = (item.video_url || "").toLowerCase().trim();
    if (!url) return true;
    if (seenUrls.has(url)) return false;
    seenUrls.add(url);
    return true;
  });

  return {
    portfolio,
    categories: catRes.data || [],
  };
};
