import type { NextConfig } from "next";
const WithBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = WithBundleAnalyzer({});
const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
