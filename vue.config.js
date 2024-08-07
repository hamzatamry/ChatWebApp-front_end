const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:5243',
        changeOrigin: true
      },
      '^/chat': {
        target: 'http://localhost:5243',
        changeOrigin: true
      }
    },
  },
})
