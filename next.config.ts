import type { NextConfig } from "next";

import os from "os";

// Détection automatique de toutes les adresses IP locales pour autoriser les smartphones sur le Wi-Fi
const getLocalDevOrigins = () => {
  const origins = [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "192.168.11.146",
    "192.168.11.146:3000",
    "192.168.11.107",
    "192.168.11.107:3000",
    "172.20.10.8",
    "172.20.10.8:3000",
    "192.168.1.74",
    "192.168.1.74:3000",
    "192.168.1.70",
    "192.168.1.70:3000",
    "192.168.56.1",
    "192.168.56.1:3000"
  ];
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        const family = String(net.family);
        if ((family === "IPv4" || family === "4") && !net.internal) {
          origins.push(net.address);
          origins.push(`${net.address}:3000`);
        }
      }
    }
  } catch {
    // fallback safe
  }
  return Array.from(new Set(origins));
};

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: getLocalDevOrigins(),
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
