<script lang="ts">
    import { raw } from "$lib/utils/cms";

    let {
        settings,
        path,
        altPath = "",
        class: className = "",
        style = "",
        fallback = "/placeholder.svg",
    }: {
        settings: any;
        path: string;
        altPath?: string;
        class?: string;
        style?: string;
        fallback?: string;
    } = $props();

    const src = $derived(raw(settings, path) || fallback);
    const alt = $derived(altPath ? raw(settings, altPath) || "" : "");
</script>

{#if src}
    <img {src} {alt} class={className} {style} />
{/if}
