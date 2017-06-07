import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import { Checkpoint } from '../checkpoint' // needed by ref in Journey
import routes, { Journey } from '.'

const app = () => express(routes)

let userSession, anotherSession, journey

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  journey = await Journey.create({ userId: user })
})

test('POST /journeys 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, checkpoints: [], title: 'test', description: 'test', donateUrl: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.checkpoints).toEqual([])
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.donateUrl).toEqual('test')
  expect(typeof body.userId).toEqual('object')
})

test('POST /journeys 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /journeys 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /journeys/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${journey.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(journey.id)
})

test('GET /journeys/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /journeys/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${journey.id}`)
    .send({ access_token: userSession, checkpoints: [], title: 'test', description: 'test', donateUrl: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(journey.id)
  expect(body.checkpoints).toEqual([])
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.donateUrl).toEqual('test')
  expect(typeof body.userId).toEqual('object')
})

test('PUT /journeys/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${journey.id}`)
    .send({ access_token: anotherSession, checkpoints: [], title: 'test', description: 'test', donateUrl: 'test' })
  expect(status).toBe(401)
})

test('PUT /journeys/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${journey.id}`)
  expect(status).toBe(401)
})

test('PUT /journeys/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, checkpoints: [], title: 'test', description: 'test', donateUrl: 'test' })
  expect(status).toBe(404)
})

test('DELETE /journeys/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${journey.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /journeys/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${journey.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /journeys/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${journey.id}`)
  expect(status).toBe(401)
})

test('DELETE /journeys/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
