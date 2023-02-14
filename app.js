if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const API_VERSION = 'v1'

const cors = require('cors')
const passport = require('./config/passport')
const { clearTempFile } = require('./helpers/file-helpers')
const { generalErrorHandler } = require('./middlewares/error-handler')
const routes = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(passport.initialize())

const http = require('http')
const server = http.createServer(app)

app.use(`/api/${API_VERSION}`, routes)
app.use('/', (req, res) => {
  res.send('Fallback: Oops! Something went wrong.')
}) // Fallback route
app.use('/', generalErrorHandler) // Error handler

server.listen(port, () => console.log(`This app is listening on port ${port}.`))
// 為了讓 Jest 測試時可以執行 server.close() 的功能所以不直接用 app.listen()，不然 Jest 就無法在測試結束後 Exit，跟下方 setInterval 的概念一樣，如果 server啟動後持續運行，Jest 測試都無法自行跳出

if (process.env.NODE_ENV !== 'test') {
  // Jest 執行時預設的 NODE_ENV 是 test
  setInterval(clearTempFile, 3600000) // 單位是 ms 毫秒，相當於每 1 小時清理一次
}
// 因為 setInterval 是 server 啟動後會持續運作的 API，而跑測試會讓 server 啟動，接著觸發 setInterval 後 Jest 就無法在測試結束後 Exit，因此這邊的寫法是讓非測試環境時才啟動 setInterval，以免發生測試後 Jest 不會自行 Exit 的問題

module.exports = { server }
