import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Exclude TensorFlow.js from server-side bundle
    // This prevents 500 errors when TensorFlow tries to initialize in Node.js/serverless
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@tensorflow/tfjs': 'commonjs @tensorflow/tfjs',
        '@tensorflow/tfjs-node': 'commonjs @tensorflow/tfjs-node',
      });
    }

    return config;
  },
};

export default nextConfig;
