import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Conversations api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/conversations', () => {
    it('returns conversations for an account', async () => {
      fetch.mockImplementationOnce(fetchMocker([{ id: 1 }, { id: 2 }], {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/conversations'
      }))
      const res = await api.conversations.list({ config, params: { id: 1 } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
    })
  })
  describe('/api/v1/pleroma/conversations/22/statuses', async () => {
    fetch.mockImplementationOnce(fetchMocker([{ id: 1 }, { id: 2 }], {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/conversations/22/statuses'
    }))
    const res = await api.conversations.getTimeline({ config, params: { id: 22 } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
  })
  describe('/api/v1/pleroma/conversations/:id', async () => {
    fetch.mockImplementationOnce(fetchMocker({ id: 22, accounts: [{ acct: 'nd', id: 1 }] }, {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/conversations/22'
    }))
    const res = await api.conversations.get({ config, params: { id: 22 } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual({ id: 22, accounts: [{ acct: 'nd', id: 1 }] })
  })
  describe('PATCH /api/v1/pleroma/conversations/:id', async () => {
    fetch.mockImplementationOnce(fetchMocker({ id: 22, pleroma: { recipients: [{ id: 1 }, { id: 2 }] } }, {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/conversations/22'
    }))
    const res = await api.conversations.update({ config, params: { id: 22, recipients: [{ id: 1 }] } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual({ id: 22, pleroma: { recipients: [{ id: 1 }, { id: 2 }] } })
  })
  describe('/api/v1/pleroma/conversations/read', async () => {
    fetch.mockImplementationOnce(fetchMocker({ id: 22, unread: false }, {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/conversations/read'
    }))
    const res = await api.conversations.read({ config, params: { id: 22 } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual({ id: 22, unread: false })
  })
})
