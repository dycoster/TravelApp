// from https://knowledge.udacity.com/questions/336147

// Test the express server
const app = require('./server.js') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('gets the test endpoint', async done => {
  const response = await request.get('/all')

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('pass!')
  done()
})