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
      fetch.mockImplementationOnce(fetchMocker({id}, {
        expectedUrl: "https://pleroma.soykaf.com/api/v1/accounts/10468"
      }))

      const res = await api.users.get({config, params: {id}})

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe('10468')
      expect(res.links).toBe(null)
    })

    it('returns an error state for a bad request', async () => {
      const id = "-10468"
      fetch.mockImplementationOnce(fetchMocker({error: "bad request"}, {ok: false} ))

      const res = await api.users.get({config, params: {id}})

      expect(res.state).toBe('error')
    })
  })

  describe('/api/v1/accounts/verify_credentials', () => {
    it('returns invalid credentials for a missing token', async () => {
      fetch.mockImplementationOnce(fetchMocker({error: 'Invalid credentials.'}, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/verify_credentials',
        ok: false
      }))

      const res = await api.users.verifyCredentials({config, params: {}})
      expect(res.state).toBe('error')
    })

    it('returns valid user data for a valid token', async () => {
      const accessToken = "qNhQPCb-_lRjt_K6mXkwcrle_AoHWBkOmWjWhn9H6EQ="
      fetch.mockImplementationOnce(fetchMocker({id: "1"}, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/verify_credentials',
        expectedToken: `Bearer ${accessToken}`
      }))

      const res = await api.users.verifyCredentials({config: {...config, accessToken }})
      expect(res.state).toBe('ok')
      expect(res.data.id).toBe('1')
    })
  })

  describe('/api/v1/accounts/:id/status', () => {
    it('returns the statuses and the links', async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        [{id: 1}, {id: 2}],
        {
          expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/${id}/statuses?since_id=1`,
          headers: {
            link: '<https://pleroma.soykaf.com/api/v1/accounts/1/statuses?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/accounts/1/statuses?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"' 
          }
        }))
      const res = await api.users.statuses({config, params: {id}, queries: {since_id: 1}})

      expect(res.state).toBe('ok')
      expect(res.data).toEqual([{id: 1}, {id: 2}])
      expect(res.links).not.toBe(null)
    })
  })
})
