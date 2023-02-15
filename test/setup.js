const { server } = require("../app")
const request = require("supertest")
const API_VERSION = "v1"

async function getToken() {
  const loginReqBody = {
    email: "admin@careerforum.com",
    password: "As123456!",
  }
  const res = await request(server)
    .post(`/api/${API_VERSION}/login`)
    .send(loginReqBody)

  return JSON.parse(res.text).token
}

beforeAll(() => {
  if (process.env.NODE_ENV !== "test") {
    console.error("NODE_ENV is not test environment!")
    return
  }
})

module.exports = { getToken, server, request }
