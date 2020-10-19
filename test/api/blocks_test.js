import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Blocks api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/blocks', () => {
    it('returns list of blocks', async () => {
      fetch.mockImplementationOnce(fetchMocker([{ id: '1', acct: 'nd' }], {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/blocks'
      }))
      const res = await api.blocks.list({ config })

      expect(res.data).toEqual([{ id: '1', acct: 'nd' }])
    })
  })
  describe('/api/v1/domain_blocks', () => {
    it('returns list of blocked domains', async () => {
      fetch.mockImplementationOnce(fetchMocker(['unknown_instance'], {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/domain_blocks'
      }))
      const res = await api.blocks.blockDomain({ config })

      expect(res.data).toEqual(['unknown_instance'])
    })
  })
})
