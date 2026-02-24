const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Forward all incoming traffic to Binance
app.use('/', createProxyMiddleware({
  target: 'https://api.binance.com',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // 🛡️ THE GHOST PROTOCOL: Delete all IP-leaking headers
    proxyReq.removeHeader('x-forwarded-for');
    proxyReq.removeHeader('x-forwarded-host');
    proxyReq.removeHeader('x-forwarded-proto');
    proxyReq.removeHeader('forwarded');
    proxyReq.removeHeader('via');
    
    // 🛡️ WAF SPOOF: Force Binance to see a standard Chrome browser
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EU Relay active on port ${PORT}`));
