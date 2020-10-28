import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('search api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v2/search', () => {
    it('return search results', async () => {
      fetch.mockImplementationOnce(fetchMocker(
        { accounts: [], statuses: [{ id: '1', content: 'HI!' }], hashtags: [] },
        { expectedUrl: 'https://pleroma.soykaf.com/api/v2/search?q=HI' }
      ))
      const res = await api.search.base({ config, queries: { q: 'HI' } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ accounts: [], hashtags: [], statuses: [{ id: '1', content: 'HI!' }] })
    })
  })

  describe('/api/v1/accounts/search', () => {
    it('return accounts search results', async () => {
      fetch.mockImplementationOnce(fetchMocker(
        [{ id: '1', display_name: 'test' }],
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/search?q=test' }
      ))
      const res = await api.search.users({ config, queries: { q: 'test' } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual([{ id: '1', display_name: 'test' }])
    })
  })
})
