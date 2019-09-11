const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy(
      '/api', {
        target: 'http://127.0.0.1:3001/',
        changeOrigin: true
      }
    )
  );
  app.use(
    proxy(
      '/api/lda', {
        target: 'http://localhost:3001/',
        changeOrigin: true
      }
    )
  )
}

