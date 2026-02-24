const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Forward all incoming traffic to Binance
app.use('/', createProxyMiddleware({
  target: 'https://api.binance.com',
  changeOrigin: true, // This is CRITICAL for CloudFront 403 errors
  onProxyReq: (proxyReq, req, res) => {
    // 🛡️ API MASQUERADE: Strip Google headers, enforce standard API ID
    // This tells Binance: "I am a clean, standard program."
    proxyReq.setHeader('User-Agent', 'Binance/1.0');
    proxyReq.removeHeader('x-forwarded-for');
    proxyReq.removeHeader('x-forwarded-proto');
    proxyReq.removeHeader('x-forwarded-port');
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EU Relay active on port ${PORT}`));
