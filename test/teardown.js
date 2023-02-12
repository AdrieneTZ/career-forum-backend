const { server } = require("./setup")

afterAll(() => {
  server.close()
})