<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import Logo from "$lib/components/Logo.svelte";
	import { lang } from "$lib/stores/lang";
	import { t } from "$lib/utils/cms";
	import CmsText from "$lib/components/CmsText.svelte";
	import VideoModal from "$lib/components/VideoModal.svelte";
	import { page } from "$app/stores";
	import { fade } from "svelte/transition";

	let { children, data }: { children: any; data: { settings: any } } =
		$props();
	let mobileMenuOpen = $state(false);
	const isAdmin = $derived($page.url.pathname.startsWith("/admin"));
	const settings = $derived(data.settings);
	const siteUrl = $derived(
		(settings?.basic_info?.site_url || "").replace(/\/$/, ""),
	);
	const getAssetUrl = (path: string) => {
		if (!path) return "";
		if (path.startsWith("http")) return path;
		return siteUrl + (path.startsWith("/") ? "" : "/") + path;
	};

	$effect(() => {
		// Run every time path changes
		const CURRENT_PATH = $page.url.pathname;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("fade-in");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: "50px" },
		);

		const trackNewElements = () => {
			document
				.querySelectorAll(
					".animate-on-scroll:not(.fade-in):not(.tracked)",
				)
				.forEach((el) => {
					el.classList.add("tracked");
					observer.observe(el);
				});
		};

		// Track immediately
		trackNewElements();

        // Instead of a heavy interval, we use a MutationObserver 
        // to detect new elements added to the DOM
        const mutationObserver = new MutationObserver(() => {
            trackNewElements();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

		return () => {
			mutationObserver.disconnect();
			observer.disconnect();
		};
	});

	// Dynamic JSON-LD Schemas
	const websiteSchema = $derived({
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: settings?.basic_info?.site_title,
		url: siteUrl,
	});

	const organizationSchema = $derived({
		"@context": "https://schema.org",
		"@type": "Organization",
		name: settings?.meta?.org_name || settings?.basic_info?.site_title,
		url: siteUrl,
		logo: getAssetUrl(settings?.basic_info?.logo),
		contactPoint: {
			"@type": "ContactPoint",
			telephone: settings?.contact?.phone,
			contactType: "customer service",
		},
	});

	function toggleLang() {
		lang.update((l) => (l === "ar" ? "en" : "ar"));
	}

	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
			: "227, 30, 36";
	};
</script>

<svelte:head>
	<style>
		:root {
			--primary: {settings?.theme?.primary_color || '#e31e24'};
			--primary-rgb: {hexToRgb(settings?.theme?.primary_color || '#e31e24')};
			--bg-dark: {settings?.theme?.bg_color || '#0a0a0a'};
		}
	</style>
	<title>{settings?.basic_info?.site_title || "Mohamed Ibrahim"}</title>
	<meta name="description" content={settings?.basic_info?.site_description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:title" content={settings?.basic_info?.site_title} />
	<meta
		property="og:description"
		content={settings?.basic_info?.site_description}
	/>
	<meta property="og:image" content={getAssetUrl(settings?.meta?.og_image)} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={siteUrl} />
	<meta property="twitter:title" content={settings?.basic_info?.site_title} />
	<meta
		property="twitter:description"
		content={settings?.basic_info?.site_description}
	/>
	<meta
		property="twitter:image"
		content={getAssetUrl(settings?.meta?.og_image)}
	/>

	<!-- Favicon -->
	<link
		rel="icon"
		href="/logo.png"
	/>

	<!-- Font Awesome -->
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
	/>

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(organizationSchema)}<\/script>`}
</svelte:head>

<div
	dir={$lang === "ar" ? "rtl" : "ltr"}
	style="--primary: {settings?.theme?.primary_color ||
		'#e31e24'}; --bg-dark: {settings?.theme?.bg_color ||
		'#0a0a0a'}; min-height: 100vh; background-color: transparent; color: white; font-family: {$lang ===
	'ar'
		? 'var(--font-ar)'
		: 'var(--font-en)'}, sans-serif;"
>
	<!-- Tech Background from original portfolio -->
	<div class="tech-background">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="orb orb-3"></div>
	</div>

	{#if !isAdmin}
		<header class="nav glass">
			<div class="nav-left">
                <Logo />
				<div class="mobile-nav-toggle">
					<button
						class="nav-icon-btn"
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						aria-label="Menu"
					>
						<i class="nav-icon fas fa-bars" style="color: #00eaff; font-size: 24px;"></i>
					</button>
					{#if mobileMenuOpen}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="mobile-dropdown glass fade-in"
							onclick={() => (mobileMenuOpen = false)}
						>
							<a href="/"
								>{t(settings, "nav.home", $lang) ||
									($lang === "ar" ? "الرئيسية" : "Home")}</a
							>
							<a href="/portfolio"
								>{t(settings, "nav.portfolio", $lang) ||
									($lang === "ar"
										? "أعمالنا"
										: "Portfolio")}</a
							>
							<a href="/packages"
								>{t(settings, "nav.packages", $lang) ||
									($lang === "ar"
										? "الباقات"
										: "Packages")}</a
							>
							<a href="/contact"
								>{t(settings, "nav.contact", $lang) ||
									($lang === "ar"
										? "تواصل معنا"
										: "Contact")}</a
							>
						</div>
					{/if}
				</div>
			</div>

			<div class="nav-center desktop-nav-menu">
				<a href="/" class="nav-text-link"
					>{t(settings, "nav.home", $lang) ||
						($lang === "ar" ? "الرئيسية" : "Home")}</a
				>
				<a href="/portfolio" class="nav-text-link"
					>{t(settings, "nav.portfolio", $lang) ||
						($lang === "ar" ? "أعمالنا" : "Portfolio")}</a
				>
				<a href="/packages" class="nav-text-link"
					>{t(settings, "nav.packages", $lang) ||
						($lang === "ar" ? "الباقات" : "Packages")}</a
				>
				<a href="/contact" class="nav-text-link"
					>{t(settings, "nav.contact", $lang) ||
						($lang === "ar" ? "تواصل معنا" : "Contact")}</a
				>
			</div>

			<div class="nav-right">
				<button class="lang-btn" onclick={toggleLang}>
					{$lang === "ar" ? "EN" : "AR"}
				</button>
			</div>
		</header>
	{/if}

	<main>
		{@render children()}
	</main>

	<VideoModal />

	{#if !isAdmin}
		<a
			href="https://wa.me/{settings?.contact?.whatsapp}"
			target="_blank"
			class="whatsapp-btn"
			aria-label="Contact us on WhatsApp"
			style="position: fixed; bottom: 30px; left: {$lang === 'ar'
				? '30px'
				: 'auto'}; right: {$lang === 'en'
				? '30px'
				: 'auto'}; width: 60px; height: 60px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); z-index: 1000; transition: var(--transition);"
		>
			<svg width="35" height="35" viewBox="0 0 24 24" fill="white">
				<path
					d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.171.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793 0-.853.448-1.274.607-1.448.159-.174.347-.217.463-.217l.333.004c.101.005.241-.038.376.289.135.327.463 1.129.503 1.21.04.081.066.175.012.28-.054.106-.081.182-.162.277-.081.095-.174.159-.241.241-.073.089-.153.185-.065.337.088.152.392.648.841 1.048.577.513 1.063.673 1.216.749.153.076.241.063.333-.044.091-.107.391-.455.494-.61.104-.155.207-.13.348-.078.14.053.885.419 1.038.497.153.078.256.115.293.18.037.065.037.377-.107.782z"
				/>
			</svg>
		</a>



		<footer class="neptune-footer">
			<div class="footer-glow-top"></div>
			<div class="container footer-grid relative-z">
				<div
					class="footer-col"
					style="text-align: {$lang === 'ar' ? 'right' : 'left'};"
				>
					<div class="footer-brand">
						<h3 class="footer-name">
							{$lang === "ar"
								? "محمد إبراهيم"
								: "Mohamed Ibrahim"}
						</h3>
						<div class="name-glow-line"></div>
					</div>
					<p class="footer-desc">
						{$lang === "ar"
							? "نصنع محتوى إبداعي برؤية فنية دقيقة وتجربة بصرية فريدة."
							: "Crafting creative content with precise artistic vision and unique visual experiences."}
					</p>
					<div
						class="footer-social"
						style="display: flex; gap: 15px; justify-content: {$lang ===
						'ar'
							? 'flex-start'
							: 'flex-start'};"
					>
						<a
							href="https://www.facebook.com/share/16Hn7f5QMs/"
							target="_blank"
							aria-label="Facebook"
							class="social-circle"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-2.21c0-.837.396-1.39 1.162-1.39h2.196v-4.41c-.381-.053-1.691-.165-3.21-.165-3.181 0-5.358 1.942-5.358 5.518v2.657z"
								/>
							</svg>
						</a>
						<a
							href="https://www.instagram.com/viluxe_1/"
							target="_blank"
							aria-label="Instagram"
							class="social-circle"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
								/>
							</svg>
						</a>
						<a
							href="mailto:mohamedibrahim4125@gmail.com"
							aria-label="Email"
							class="social-circle"
						>
							<i class="fas fa-envelope" style="font-size: 18px; position: relative; z-index: 1;"></i>
						</a>
					</div>
				</div>
				<div
					class="footer-col"
					style="text-align: {$lang === 'ar' ? 'right' : 'left'};"
				>
					<h4 style="margin-bottom: 20px;">
						{t(settings, "footer.quick_links", $lang)}
					</h4>
					<ul class="footer-nav-list">
						<li>
							<a href="/" class="footer-link"
								>{$lang === "ar" ? "الرئيسية" : "Home"}</a
							>
						</li>
						<li>
							<a href="/portfolio" class="footer-link"
								>{$lang === "ar" ? "أعمالنا" : "Portfolio"}</a
							>
						</li>
						<li>
							<a href="/packages" class="footer-link"
								>{$lang === "ar" ? "الباقات" : "Packages"}</a
							>
						</li>
					</ul>
				</div>
				<div
					class="footer-col"
					style="text-align: {$lang === 'ar' ? 'right' : 'left'};"
				>
					<h4 style="margin-bottom: 20px;">
						{t(settings, "footer.contact_us", $lang)}
					</h4>
					<ul
						class="footer-info-list"
						dir="ltr"
						style="text-align: left;"
					>
						<li>
							<i class="fas fa-envelope"></i>
							{settings?.contact?.email}
						</li>
						<li>
							<i class="fas fa-phone"></i>
							{settings?.contact?.phone}
						</li>
						<li>
							<i class="fas fa-map-marker-alt"></i>
							{settings?.contact?.address}
						</li>
					</ul>
				</div>
			</div>

			<div class="footer-bottom relative-z">
				<div class="bottom-glow-line"></div>
				<div class="container" style="text-align: center;">
					<p class="copyright-text">
						© {new Date().getFullYear()} Mohamed Ibrahim — Crafted with
						Precision
					</p>
				</div>
			</div>
		</footer>
	{/if}

	<style>
		.nav {
			position: fixed;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			z-index: 1000;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px 20px;
			border-radius: 40px;
			width: 95%;
			max-width: 800px;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
			border: 1px solid rgba(255, 255, 255, 0.05);
			background: rgba(4, 19, 42, 0.85);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
		}

		/* Original Tech Background */
		.tech-background {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: -1;
			overflow: hidden;
			background: radial-gradient(
				circle at center,
				#01142e 0%,
				#000000 100%
			);
		}

		.orb {
			position: absolute;
			border-radius: 50%;
			filter: blur(80px);
			opacity: 0.5;
			animation: floatContainer 10s infinite alternate ease-in-out;
            will-change: transform;
		}

        @media (max-width: 768px) {
            .orb {
                display: none; /* Blurs are the #1 killer of mobile performance */
            }
            .tech-background {
                background: #020a1c; /* Solid color fallback */
            }
        }

		.orb-1 {
			top: -10%;
			left: -10%;
			width: 40vw;
			height: 40vw;
			background: radial-gradient(
				circle,
				rgba(0, 229, 255, 0.3) 0%,
				transparent 70%
			);
		}

		.orb-2 {
			bottom: -10%;
			right: -10%;
			width: 50vw;
			height: 50vw;
			background: radial-gradient(
				circle,
				rgba(0, 102, 255, 0.2) 0%,
				transparent 70%
			);
			animation-delay: -5s;
		}

		.orb-3 {
			top: 40%;
			left: 50%;
			width: 30vw;
			height: 30vw;
			background: radial-gradient(
				circle,
				rgba(138, 43, 226, 0.15) 0%,
				transparent 70%
			);
			animation-delay: -2s;
		}

		@keyframes floatContainer {
			0% {
				transform: translate(0, 0) scale(1);
			}
			100% {
				transform: translate(30px, -30px) scale(1.1);
			}
		}

		.nav-left,
		.nav-right {
			display: flex;
			align-items: center;
			position: relative;
			gap: 15px;
		}

		.nav-brand-text {
			font-size: 1.1rem;
			font-weight: 800;
			color: #ffffff;
			text-decoration: none;
			white-space: nowrap;
			background: linear-gradient(90deg, #ffffff, var(--primary));
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			padding-inline-end: 15px;
			filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.2));
		}

		.nav-center {
			display: flex;
			gap: 20px;
			align-items: center;
		}

		.nav-icon {
			font-size: 20px;
			color: #dff9ff;
			margin: 0 15px;
			position: relative;
			cursor: pointer;
			transition: 0.4s ease;
		}

		/* دائرة خلف الأيقونة */
		.nav-icon::before {
			content: "";
			position: absolute;
			width: 45px;
			height: 45px;
			background: radial-gradient(
				circle,
				rgba(0, 234, 255, 0.15),
				transparent 70%
			);
			border-radius: 50%;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) scale(0);
			transition: 0.4s ease;
			z-index: -1;
		}

		.nav-icon-link {
			text-decoration: none;
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
		}

		.nav-text-link {
			text-decoration: none;
			padding: 8px 10px;
			color: #dff9ff;
			font-family: var(--font-ar);
			font-weight: 700;
			font-size: 0.95rem;
			white-space: nowrap;
			position: relative;
			transition: all 0.3s ease;
			opacity: 0.85;
		}

		.nav-text-link:hover {
			color: #00eaff;
			opacity: 1;
			text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
		}

		.nav-text-link::after {
			content: "";
			position: absolute;
			bottom: 0px;
			left: 50%;
			width: 0;
			height: 2px;
			background: #00eaff;
			transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			transform: translateX(-50%);
			box-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
			border-radius: 2px;
		}

		.nav-text-link:hover::after {
			width: 80%;
		}

		.mobile-only-menu {
			display: none;
		}

		.nav-icon-btn {
			background: none;
			border: none;
			cursor: pointer;
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		/* Hover Effect */
		.nav-icon-link:hover .nav-icon,
		.nav-icon-btn:hover .nav-icon {
			color: #00eaff;
			transform: translateY(-4px);
			text-shadow:
				0 0 8px #00eaff,
				0 0 20px #00eaff;
		}

		.nav-icon-link:hover .nav-icon::before,
		.nav-icon-btn:hover .nav-icon::before {
			transform: translate(-50%, -50%) scale(1);
		}

        @media (max-width: 768px) {
            .nav-icon {
                font-size: 24px !important;
                margin: 0 !important;
            }
            .lang-btn {
                padding: 4px 10px;
                font-size: 0.75rem;
            }
        }

		.lang-btn {
			background: rgba(255, 255, 255, 0.1);
			border: 1px solid rgba(255, 255, 255, 0.2);
			color: white;
			padding: 5px 12px;
			border-radius: 20px;
			cursor: pointer;
			font-weight: bold;
			font-size: 0.8rem;
			font-family: var(--font-en);
			transition: var(--transition-fast);
		}

		.lang-btn:hover {
			background: var(--primary);
			border-color: var(--primary);
			color: var(--bg-dark);
			box-shadow: 0 0 15px var(--primary-glow);
		}

		.mobile-dropdown {
			position: absolute;
			top: calc(100% + 10px);
			right: 0;
			width: 200px;
			display: flex;
			flex-direction: column;
			gap: 5px;
			padding: 15px;
			border-radius: 15px;
			z-index: 1001;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
			animation: slideDown 0.3s ease-out;
		}

		[dir="rtl"] .mobile-dropdown {
			right: auto;
			left: 0;
		}

		@keyframes slideDown {
			from {
				opacity: 0;
				transform: translateY(-10px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		.mobile-dropdown a {
			padding: 10px;
			border-radius: 8px;
			font-size: 0.95rem;
			font-weight: 600;
			transition: var(--transition);
		}

		.mobile-dropdown a:hover {
			background: rgba(255, 255, 255, 0.1);
			color: var(--primary);
		}

		.footer-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 40px;
		}

		/* Neptune Footer Styling */
		.neptune-footer {
			position: relative;
			background: radial-gradient(
				ellipse at center 0%,
				#031433 0%,
				#010816 70%,
				#000000 100%
			);
			padding: 80px 0 0;
			overflow: hidden;
		}

		.footer-glow-top {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 1px;
			background: linear-gradient(
				90deg,
				transparent,
				rgba(0, 229, 255, 0.8),
				transparent
			);
			box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
		}

		.relative-z {
			position: relative;
			z-index: 2;
		}

		.footer-brand {
			display: inline-block;
			margin-bottom: 20px;
		}

		.footer-name {
			font-size: 1.8rem;
			font-weight: 800;
			color: white;
			margin: 0;
			letter-spacing: 1px;
			text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
			font-family: var(--font-en);
		}

		.name-glow-line {
			height: 3px;
			width: 60%;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 2px;
			margin-top: 5px;
			position: relative;
			overflow: hidden;
		}

		.name-glow-line::after {
			content: "";
			position: absolute;
			top: 0;
			left: -50%;
			width: 50%;
			height: 100%;
			background: linear-gradient(
				90deg,
				transparent,
				var(--primary) 40%,
				#ffffff 50%,
				var(--primary) 60%,
				transparent
			);
			animation: scanBeam 2.5s infinite cubic-bezier(0.1, 0.7, 0.8, 0.4);
			filter: drop-shadow(0 0 5px var(--primary-glow));
		}

		@keyframes scanBeam {
			0% {
				transform: translateX(-100%);
			}
			100% {
				transform: translateX(400%);
			}
		}

		[dir="rtl"] .name-glow-line::after {
			left: auto;
			right: -50%;
			animation: scanBeamRtl 2.5s infinite
				cubic-bezier(0.1, 0.7, 0.8, 0.4);
		}

		@keyframes scanBeamRtl {
			0% {
				transform: translateX(100%);
			}
			100% {
				transform: translateX(-400%);
			}
		}

		.footer-desc {
			color: var(--text-muted);
			margin-bottom: 25px;
			line-height: 1.6;
			font-size: 0.95rem;
			opacity: 0.8;
		}

		.social-circle {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: rgba(0, 229, 255, 0.05);
			border: 1px solid rgba(0, 229, 255, 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			position: relative;
			overflow: hidden;
		}

		.social-circle::before {
			content: "";
			position: absolute;
			inset: 0;
			background: radial-gradient(
				circle,
				rgba(0, 229, 255, 0.4) 0%,
				transparent 70%
			);
			opacity: 0;
			transition: opacity 0.4s ease;
		}

		.social-circle:hover {
			transform: translateY(-5px);
			border-color: rgba(0, 229, 255, 0.8);
			color: #fff;
			box-shadow:
				0 5px 15px rgba(0, 229, 255, 0.3),
				inset 0 0 10px rgba(0, 229, 255, 0.2);
		}

		.social-circle:hover::before {
			opacity: 1;
		}

		.social-circle svg {
			position: relative;
			z-index: 1;
		}

		.footer-nav-list,
		.footer-info-list {
			list-style: none;
			padding: 0;
			margin: 0;
			display: grid;
			gap: 12px;
		}

		.footer-info-list li {
			color: var(--text-muted);
			opacity: 0.8;
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 0.95rem;
		}

		.footer-info-list i {
			color: #00eaff;
			opacity: 0.8;
		}

		.footer-link {
			color: var(--text-muted);
			text-decoration: none;
			position: relative;
			display: inline-block;
			transition: color 0.3s ease;
			padding-bottom: 2px;
			opacity: 0.8;
		}

		.footer-link::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			width: 0;
			height: 1px;
			background: #00eaff;
			transition: width 0.3s ease;
			box-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
		}

		[dir="rtl"] .footer-link::after {
			left: auto;
			right: 0;
		}

		.footer-link:hover {
			color: #00eaff;
			opacity: 1;
		}

		.footer-link:hover::after {
			width: 100%;
		}

		.footer-bottom {
			margin-top: 60px;
			padding: 30px 0;
			position: relative;
		}

		.bottom-glow-line {
			position: absolute;
			top: 0;
			left: 10%;
			right: 10%;
			height: 1px;
			background: linear-gradient(
				90deg,
				transparent,
				rgba(255, 255, 255, 0.15),
				transparent
			);
		}

		.copyright-text {
			color: var(--text-muted);
			font-size: 0.9rem;
			opacity: 0.7;
			letter-spacing: 0.5px;
			font-family: var(--font-en);
			margin: 0;
		}

		.social-link {
			color: white;
			transition: var(--transition);
			opacity: 0.7;
		}

		.social-link:hover {
			color: var(--primary);
			transform: scale(1.2);
			opacity: 1;
		}

		@media (max-width: 768px) {
            .nav {
                top: 10px;
                padding: 10px 18px;
                width: 96%;
                border-radius: 30px;
            }

			.desktop-nav-menu {
				display: none !important;
			}

			.mobile-nav-toggle {
				display: block !important;
			}

			.nav-left {
				width: auto;
                gap: 10px;
			}

            .nav-icon {
                margin: 0 5px;
            }

			.footer-grid {
				grid-template-columns: 1fr;
				text-align: center !important;
			}

			.footer-col {
				text-align: center !important;
			}

			.footer-social {
				justify-content: center !important;
			}

			.floating-social-bar {
				display: none !important;
			}
		}
	</style>
</div>
