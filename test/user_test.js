import api from '../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('User api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/accounts/:id', () => {
    it('can fetch a user by id', async () => {
      const id = "10468"
      fetch.mockImplementation(fetchMocker({id}, {
        expectedUrl: "https://pleroma.soykaf.com/api/v1/accounts/10468"
      }))

      const res = await api.users.get({config, params: {id}})

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe('10468')
      expect(res.links).toBe(null)
    })

    it('returns an error state for a bad request', async () => {
      const id = "-10468"
      fetch.mockImplementation(fetchMocker({error: "bad request"}, {ok: false} ))

      const res = await api.users.get({config, params: {id}})

      expect(res.state).toBe('error')
    })
  })
})
