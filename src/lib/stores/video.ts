import { writable } from "svelte/store";

export interface VideoItem {
    title_en?: string;
    title_ar?: string;
    video_url?: string;
    video?: string;
}

export const selectedVideo = writable<VideoItem | null>(null);
