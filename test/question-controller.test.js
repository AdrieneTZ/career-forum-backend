const app = require('../app')
const request = require('supertest')
const API_VERSION = 'v1'
const token = process.env.JEST_TEST_TOKEN

describe('test route postQuestion', () => {
  it('return status code of 200 if a question is created', async () => {
    const mockQuestion = {
      title: 'testQ1title',
      content: 'testQ1content',
      userId: 1
    }
    const res = await request(app)
      .post(`/api/${API_VERSION}/questions`)
      .set('Authorization', `Bearer ${token}`)
      .send(mockQuestion)
    expect(res.statusCode).toBe(200)
  })
})