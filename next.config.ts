import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle source-map-support for typescript-json-schema
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "source-map-support": false, // Provides a no-op fallback when the module is imported
    };

    // Add specific handling for typescript-json-schema
    config.module.rules.push({
      test: /[\\/]node_modules[\\/]typescript-json-schema[\\/]/,
      use: {
        loader: "next-ignore-loader",
        options: {
          ignore: ["source-map-support"],
        },
      },
    });

    return config;
  },
};

export default nextConfig;
