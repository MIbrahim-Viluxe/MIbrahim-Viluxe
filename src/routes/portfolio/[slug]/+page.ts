import { error } from "@sveltejs/kit";
import { supabase } from "$lib/supabase";

export const load = async ({ params }) => {
  try {
    const { data: projectData, error: dbError } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (dbError || !projectData) {
      console.error(`[Project Load error]`, dbError);
      throw error(404, "Project not found");
    }

    const { data: recentProjects } = await supabase
      .from("projects")
      .select("*")
      .eq("category", projectData.category)
      .limit(6);

    return {
      project: {
        ...projectData,
        title_ar: projectData.title,
        title_en: projectData.title,
        desc_ar: projectData.description,
        desc_en: projectData.description,
        image: projectData.cover_image,
        video: projectData.video_url,
      },
      portfolio: (recentProjects || [])
        .filter((p) => p.id !== projectData.id)
        .map((p) => ({
          title_ar: p.title,
          title_en: p.title,
          category: p.category,
          image: p.cover_image,
          slug: p.slug,
          video_url: p.video_url,
        })),
    };
  } catch (e: any) {
    if (e.status) throw e;
    console.error(`[Project Load Error] ${e.message}`);
    throw error(500, "Internal Server Error");
  }
};
