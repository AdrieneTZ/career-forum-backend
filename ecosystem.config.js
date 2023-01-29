module.exports = {
  apps: [{
    name: 'career-forum-backend', // 專案名稱
    script: './app.js', // server啟動的路徑
    env: {
      // 此處可放無安全疑慮的環境變數
    }
  }]
}
// this file is for pm2 process config
