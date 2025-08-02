// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.coingecko.com/api/v3',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // rewrite path
      },
      onProxyRes: function (proxyRes, req, res) {
        // You can add headers here to debug if needed
        // proxyRes.headers['x-added'] = 'proxy-middleware';
      },
      logLevel: 'debug', // helpful for debugging
    })
  );
};