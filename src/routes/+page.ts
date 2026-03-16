import { supabase } from "$lib/supabase";

export const load = async () => {
  const servicesFiles = import.meta.glob("$lib/data/services/*.json", {
    eager: true,
  });

  const [{ data: homeVideos }, { data: categoriesData }, { data: testimonialsData }] = await Promise.all([
    supabase.from("showreel").select("*").order("order_index", { ascending: true }),
    supabase.from("categories").select("*").order("order_index", { ascending: true }),
    supabase.from("testimonials").select("*").eq('approved', true).order("created_at", { ascending: false }),
  ]);

  const portfolioItems = (homeVideos || []).map((p) => ({
    ...p,
    title_ar: p.title || p.title_ar,
    title_en: p.title || p.title_en,
    image: p.cover_image,
    video_url: p.video_url,
    video_type: p.video_type,
    date: p.created_at,
  }));

  const servicesItems = Object.entries(servicesFiles).map(([path, module]) => {
    const data = (module as any).default || module;
    return {
      ...data,
      slug: path.split("/").pop()?.replace(".json", "") || "service",
    };
  });

  return {
    portfolio: portfolioItems,
    categories: categoriesData || [],
    services: servicesItems,
    testimonials: testimonialsData || [],
  };
};
