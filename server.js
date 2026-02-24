const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Forward all incoming traffic to Binance
app.use('/', createProxyMiddleware({
  target: 'https://api.binance.com',
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EU Relay active on port ${PORT}`));
