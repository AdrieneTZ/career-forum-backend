const { server } = require("./setup")

afterAll(() => {
  console.log("test is over")
  server.close()
})

module.exports = {}
