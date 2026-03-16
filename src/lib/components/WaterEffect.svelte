<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";

    let { settings } = $props();
    let container: HTMLDivElement;
    let frameId: number;

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        precision highp float;
        uniform float time;
        uniform vec2 mouse;
        uniform vec2 resolution;
        uniform sampler2D uTexture;
        varying vec2 vUv;

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec2 p = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
            
            // Mouse Parallax & Distortion
            vec2 m = (mouse - 0.5) * 0.2; 
            
            // Liquid Distort Logic
            float d = length(p - (mouse - 0.5) * (resolution.xy / min(resolution.y, resolution.x)));
            float ripple = sin(d * 10.0 - time * 1.5) * exp(-d * 3.0) * 0.05;
            
            // Sample Texture with distorted UVs
            vec2 distortedUv = uv + m * (1.0 - length(uv - 0.5)) + ripple;
            
            // Fix aspect ratio for background (Cover style)
            vec2 textureRes = vec2(1200.0, 440.0); // Banner aspect
            float screenAspect = resolution.x / resolution.y;
            float textureAspect = textureRes.x / textureRes.y;
            
            vec2 finalUv = distortedUv;
            if (screenAspect > textureAspect) {
                float s = textureAspect / screenAspect;
                finalUv.y = finalUv.y * s + (1.0 - s) * 0.5;
            } else {
                float s = screenAspect / textureAspect;
                finalUv.x = finalUv.x * s + (1.0 - s) * 0.5;
            }

            vec4 tex = texture2D(uTexture, finalUv);
            
            // Neptune Space Identity (Deep Blue & Bright Cyan)
            vec3 navyBase = vec3(0.01, 0.04, 0.11); // Deep cosmic blue
            vec3 color = mix(navyBase, tex.rgb, 0.8);

            // Neon Cyan Highlights (#00E5FF)
            float highlight = pow(max(0.0, ripple * 12.0), 2.0) * 0.9;
            color += vec3(0.0, 0.90, 1.0) * highlight; 
            
            // Saturation & Scale
            color *= 0.55 + ripple * 2.8; 

            // Vignette & Cinematic Depth
            float vignette = 1.5 - length(p * 1.1) * 0.9;
            gl_FragColor = vec4(color * vignette, 1.0);
        }
    `;

    onMount(() => {
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                failIfMajorPerformanceCaveat: true,
            });
        } catch (error) {
            console.warn(
                "WebGL not supported or hardware acceleration disabled. Showing static fallback background.",
            );
            if (container) {
                container.classList.add("webgl-fallback");
            }
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const loader = new THREE.TextureLoader();
        const texture = loader.load("liquid-bg.svg");
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const updateSize = () => {
            const width = window.innerWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            if (material) {
                material.uniforms.resolution.value.set(
                    width * renderer.getPixelRatio(),
                    height * renderer.getPixelRatio(),
                );
            }
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0.5, 0.5) },
                resolution: { value: new THREE.Vector2() },
                uTexture: { value: texture },
            },
            vertexShader,
            fragmentShader,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        container.appendChild(renderer.domElement);
        updateSize();

        let targetMouse = new THREE.Vector2(0.5, 0.5);
        let currentMouse = new THREE.Vector2(0.5, 0.5);

        const handleMouseMove = (e: MouseEvent) => {
            targetMouse.x = e.clientX / window.innerWidth;
            targetMouse.y = 1.0 - e.clientY / (window.innerHeight || 1);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", updateSize);

        const animate = (t: number) => {
            currentMouse.lerp(targetMouse, 0.05);
            material.uniforms.mouse.value.copy(currentMouse);
            material.uniforms.time.value = t / 1000;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate(0);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", updateSize);
            cancelAnimationFrame(frameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    });
</script>

<div bind:this={container} class="liquid-bg"></div>

<style>
    .liquid-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
    }
    .webgl-fallback {
        background: url("/liquid-bg.svg") no-repeat center center;
        background-size: cover;
        background-color: #01040b;
    }
</style>
