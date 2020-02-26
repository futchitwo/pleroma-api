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
        { expectedUrl: "https://pleroma.soykaf.com/api/v2/search?q=HI" }
      ))
      const res = await api.search({ config, queries: { q: 'HI' } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ accounts: [], hashtags: [], statuses: [{ id: '1', content: 'HI!' }]})
    })
  })
})
