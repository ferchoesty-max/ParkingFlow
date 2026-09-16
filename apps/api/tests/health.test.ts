import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'

describe('GET /api/v1/health', () => {
  it('returns API health', async () => {
    const response = await request(createApp())
      .get('/api/v1/health')
      .expect(200)

    expect(response.body).toEqual({
      ok: true,
      service: 'parking-flow-api',
    })
  })
})
