/** @type {import('next').NextConfig} */
const nextConfig = {
  // 關閉 React Strict Mode（避免 useEffect 在 dev 執行兩次）
  reactStrictMode: false,

  // ESLint 設定
  eslint: {
    // 忽略 build 時的 ESLint 錯誤（避免 CI 被卡）
    ignoreDuringBuilds: true,
  },

  // TypeScript 設定
  typescript: {
    // 是否忽略 build 時的 TypeScript 錯誤
    // false = 有型別錯誤就中斷 build（較安全）
    ignoreBuildErrors: false,
  },

  // Next Image 設定
  images: {
    // 允許從 Unsplash 載入遠端圖片
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],

    // 關閉 Next.js Image Optimization
    // 適合 Vercel / SSG / SVG / public 圖片
    unoptimized: true,
  },
};

module.exports = nextConfig;
