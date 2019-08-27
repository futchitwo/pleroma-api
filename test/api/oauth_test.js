import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('OAuth api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('POST /api/v1/apps', () => {
    it('creates a new oauth app', async () => {
      fetch.mockImplementationOnce(fetchMocker({ id: '1' }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/apps',
        expectedJSON: {
          client_name: 'Pleroma API Library',
          redirect_uris: 'someuri',
          scopes: 'read write follow push'
        }
      }))

      const res = await api.oauth.createApp({ config, params: { redirect_uris: 'someuri' } })
      expect(res.state).toBe('ok')
      expect(res.data.id).toEqual('1')
    })
  })

  describe('POST /oauth/token', () => {
    it('works for the authorization code flow', async () => {
      fetch.mockImplementationOnce(fetchMocker({ access_token: 'sometoken' }, {
        expectedUrl: 'https://pleroma.soykaf.com/oauth/token',
        expectedJSON: {
          client_id: 'someid',
          client_secret: 'somesecret',
          grant_type: 'authorization_code',
          code: 'somecode',
          redirect_uri: 'someuri'
        }
      }))

      const res = await api.oauth.getTokenWithCode({
        config,
        params: {
          client_id: 'someid',
          client_secret: 'somesecret',
          code: 'somecode',
          redirect_uri: 'someuri'
        }
      })

      expect(res.state).toBe('ok')
      expect(res.data.access_token).toEqual('sometoken')
    })

    it('works for the password flow', async () => {
      fetch.mockImplementationOnce(fetchMocker({ access_token: 'sometoken' }, {
        expectedUrl: 'https://pleroma.soykaf.com/oauth/token',
        expectedJSON: {
          client_id: 'someid',
          client_secret: 'somesecret',
          username: 'lain',
          password: 'alita',
          grant_type: 'password'
        }
      }))

      const res = await api.oauth.getTokenWithPassword({
        config,
        params: {
          client_id: 'someid',
          client_secret: 'somesecret',
          username: 'lain',
          password: 'alita'
        }
      })

      expect(res.state).toBe('ok')
      expect(res.data.access_token).toEqual('sometoken')
    })
  })
})
