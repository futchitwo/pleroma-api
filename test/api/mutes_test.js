import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Blocks api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/mutes', () => {
    it('returns list of mutes', async () => {
      fetch.mockImplementationOnce(fetchMocker([{ id: '1', acct: 'nd' }], {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/mutes'
      }))
      const res = await api.mutes.list({ config })

      expect(res.data).toEqual([{ id: '1', acct: 'nd' }])
    })
  })
})
