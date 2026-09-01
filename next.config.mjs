/** @type {import('next').NextConfig} */
const nextConfig = {
  // Buildul pentru testele E2E folosește un director separat, ca să nu
  // suprascrie buildul obișnuit din `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // firebase-admin e deja pe lista implicită de pachete externe; fără tracing
  // explicit, funcțiile /api de pe Vercel pornesc fără modul și cad pe /500.
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/firebase-admin/**/*",
      "./node_modules/@google-cloud/firestore/**/*",
      "./node_modules/@google-cloud/storage/**/*",
      "./node_modules/@grpc/grpc-js/**/*",
      "./node_modules/sharp/**/*",
    ],
  },
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
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "http", hostname: "127.0.0.1", port: "9199" },
      { protocol: "http", hostname: "localhost", port: "9199" },
    ],
  },
}

export default nextConfig
