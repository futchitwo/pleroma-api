import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Notifications api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/notifications', () => {
    it('returns array of notifications', async () => {
      fetch.mockImplementationOnce(fetchMocker([{ id: 1 }, { id: 2 }], {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/notifications'
      }))
      const res = await api.notifications.list({ config })

      expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  describe('/api/v1/notifications/:id', () => {
    it('returns one notification by id', async () => {
      const id = '1'

      fetch.mockImplementationOnce(fetchMocker(({ id }), {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/notifications/1'
      }))
      const res = await api.notifications.get({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id })
    })
  })

  describe('/api/v1/notifications/clear', () => {
    it('delete all notifications', async () => {
      fetch.mockImplementationOnce(fetchMocker((null), {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/notifications/clear'
      }))
      const res = await api.notifications.clear({ config })

      expect(res.state).toBe('ok')
      expect(res.data).toBe(null)
    })
  })

  describe('/api/v1/notifications/dismiss', () => {
    it('dismiss one notification by id', async () => {
      const id = '1'
      fetch.mockImplementationOnce(fetchMocker((null), {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/notifications/dismiss'
      }))
      const res = await api.notifications.dismiss({ config, params: { id } })

      expect(res.state).toBe('ok')
    })
  })
})
