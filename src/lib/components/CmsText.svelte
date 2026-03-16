<script lang="ts">
    import { t } from "$lib/utils/cms";
    import { lang } from "$lib/stores/lang";

    let {
        settings,
        path,
        class: className = "",
        el = "span",
        style = "",
    }: {
        settings: any;
        path: string;
        class?: string;
        el?: string;
        style?: string;
    } = $props();

    const content = $derived(t(settings, path, $lang));
</script>

{#if content}
    {#if el === "span"}
        <span class={className} {style}>{content}</span>
    {:else if el === "h1"}
        <h1 class={className} {style}>{content}</h1>
    {:else if el === "h2"}
        <h2 class={className} {style}>{content}</h2>
    {:else if el === "h3"}
        <h3 class={className} {style}>{content}</h3>
    {:else if el === "p"}
        <p class={className} {style}>{content}</p>
    {:else if el === "div"}
        <div class={className} {style}>{content}</div>
    {/if}
{/if}
