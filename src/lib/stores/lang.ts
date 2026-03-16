import { writable } from "svelte/store";

const initialLang = typeof window !== "undefined" && window.localStorage.getItem("lang") ? window.localStorage.getItem("lang") : "ar";
export const lang = writable(initialLang);

if (typeof window !== "undefined") {
    lang.subscribe((value) => {
        window.localStorage.setItem("lang", value || "ar");
    });
}
