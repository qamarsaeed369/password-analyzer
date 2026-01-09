import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude TensorFlow.js from server-side bundle to prevent Vercel errors
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@tensorflow/tfjs');
    }
    return config;
  },
};

export default nextConfig;
