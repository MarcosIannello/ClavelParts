const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Forzar a que Turbopack use este proyecto como root
    root: __dirname,
  },
  // También para tracing en build/start
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;

