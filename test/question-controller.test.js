const { server, request, getToken } = require("./setup") // 引用 setup.js 的匯出內容 (測試前的前置作業)
require("./teardown") // 引用執行 teardown.js (此檔為測試後要做的動作)
const API_VERSION = "v1"

describe("test route postQuestion", () => {
  let loginToken = ""
  beforeAll(async () => {
    loginToken = await getToken()
  })
  // 跑測試前先用 getToken()函式拿到登入後發的 Token

  it("return status code of 200 if a question is created", async () => {
    const mockPostQuestion = {
      title: "testQ1title",
      content: "testQ1content",
    }
    const res = await request(server)
      .post(`/api/${API_VERSION}/questions`)
      .set("Authorization", `Bearer ${loginToken}`)
      .send(mockPostQuestion)
    expect(res.statusCode).toBe(200)
  })
})
