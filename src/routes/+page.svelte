<script lang="ts">
    import Hero from "$lib/components/home/Hero.svelte";
    import HomeVideoTracks from "$lib/components/home/HomeVideoTracks.svelte";
    import Testimonials from "$lib/components/home/Testimonials.svelte";
    import ContactCTA from "$lib/components/home/ContactCTA.svelte";

    import type { PortfolioItem } from "$lib/types";

    let {
        data,
    }: {
        data: {
            portfolio: PortfolioItem[];
            categories: any[];
            settings: any;
        };
    } = $props();

    const settings = $derived(data.settings);
</script>

<Hero {settings} />
<HomeVideoTracks portfolio={data.portfolio} />
<Testimonials testimonials={data.testimonials} />
<ContactCTA {settings} />
