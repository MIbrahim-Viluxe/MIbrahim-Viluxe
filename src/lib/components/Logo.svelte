<a href="/" class="logo-container">
    <img src="/logo.png" alt="Art Vision Studio" class="logo-image" />
</a>

<style>
    .logo-container {
        display: flex;
        align-items: center;
        height: 60px; /* Increased height for better visibility */
        transition: transform 0.3s ease;
    }

    .logo-container:hover {
        transform: scale(1.05);
    }

    .logo-image {
        height: 100%;
        width: auto;
        object-fit: contain;
        filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.2)); /* Subtle glow */
    }

    @media (max-width: 768px) {
        .logo-container {
            height: 35px;
        }
    }
</style>
