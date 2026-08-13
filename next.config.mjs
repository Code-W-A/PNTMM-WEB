/** @type {import('next').NextConfig} */
const nextConfig = {
  // Buildul pentru testele E2E folosește un director separat, ca să nu
  // suprascrie buildul obișnuit din `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  webpack(config) {
    if (process.env.DISABLE_WEBPACK_CACHE === "1") {
      config.cache = false
    }
    return config
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Dimensiunile implicite pentru care Next.js va genera variante responsive
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
