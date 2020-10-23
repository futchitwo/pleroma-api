import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Follow requests api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/follow_requests', () => {
    it('returns accounts that are requesting a follow', async () => {
      const accounts = [
        { id: 1, acct: 'test1' },
        { id: 2, acct: 'test2' }
      ]
      fetch.mockImplementationOnce(fetchMocker(accounts, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests'
      }))
      const res = await api.followRequests.getPendingFollows({ config })

      expect(res.data).toEqual(accounts)
    })
  })
  describe('/api/v1/follow_requests/:id/authorize', () => {
    it('accept the follow, returns relationships with te account', async () => {
      fetch.mockImplementationOnce(fetchMocker({ id: 1, requested: false }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests/1/authorize'
      }))
      const res = await api.followRequests.acceptFollow({ config, params: { id: 1 } })

      expect(res.data).toEqual({ id: 1, requested: false })
    })
  })
  describe('/api/v1/follow_requests/1/reject', () => {
    it('reject the follow, returns relationships with te account', async () => {
      fetch.mockImplementationOnce(fetchMocker({ id: 1, requested: false }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/follow_requests/1/reject'
      }))
      const res = await api.followRequests.rejectFollow({ config, params: { id: 1 } })

      expect(res.data).toEqual({ id: 1, requested: false })
    })
  })
})
