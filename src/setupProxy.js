const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/back-end-lokdis-app',
    createProxyMiddleware({
      target: 'https://www.lokdis.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug'
    })
  );
}; 