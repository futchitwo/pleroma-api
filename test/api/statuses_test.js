import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Statuses api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/statuses/:id', () => {
    it('returns one status', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1'
      }))
      const res = await api.statuses.get({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe(id)
    })
  })

  describe('/api/v1/statuses/:id/context', () => {
    it('return the context for a status', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ ancestors: [{ id: 2 }], descendants: [{ id: 3 }] }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/context'
      }))
      const res = await api.statuses.context({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.ancestors).toEqual([{ id: 2 }])
      expect(res.data.descendants).toEqual([{ id: 3 }])
    })
  })

  describe('/api/v1/statuses/:id/favourite', () => {
    it('favourite for a status', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/favourite'
      }))
      const res = await api.statuses.favourite({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe(id)
    })
  })

  describe('/api/v1/statuses/:id/unfavourite', () => {
    it('unfavourite for a status', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/unfavourite'
      }))
      const res = await api.statuses.unfavourite({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe(id)
    })
  })

  describe('/api/v1/statuses/:id/reblog', () => {
    it('reblog for a status', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/reblog'
      }))
      const res = await api.statuses.reblog({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe(id)
    })
  })

  describe('/api/v1/statuses/:id/unreblog', () => {
    it('unreblog for a status', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/unreblog'
      }))
      const res = await api.statuses.unreblog({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe(id)
    })
  })

  describe('/api/v1/statuses/:id/mute', () => {
    it('mute conversation', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id, muted: true }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/mute'
      }))
      const res = await api.statuses.mute({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe(id)
    })
  })

  describe('/api/v1/statuses/:id/unmute', () => {
    it('mute conversation', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id, muted: false }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1/mute'
      }))
      const res = await api.statuses.mute({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id, muted: false })
    })
  })

  describe('POST /api/v1/statuses', () => {
    it('posts a status', async () => {
      const id = 1
      const accessToken = 'mytoken'

      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses',
        expectedToken: 'Bearer mytoken'
      }))
      const res = await api.statuses.post({ config: { ...config, accessToken }, params: { status: 'yeah' } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe(id)
    })
  })

  describe('DELETE /api/v1/statuses/:id', () => {
    it('mute conversation', async () => {
      const id = 1
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/statuses/1'
      }))
      const res = await api.statuses.delete({ config, params: { id } })

      expect(res.state).toBe('ok')
    })
  })
})
