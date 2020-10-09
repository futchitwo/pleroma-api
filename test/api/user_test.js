import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('User api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/accounts/:id', () => {
    it('can fetch a user by id', async () => {
      const id = '10468'
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/10468'
      }))

      const res = await api.users.get({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe('10468')
      expect(res.links).toBe(null)
    })

    it('returns an error state for a bad request', async () => {
      const id = '-10468'
      fetch.mockImplementationOnce(fetchMocker({ error: 'bad request' }, { ok: false }))

      const res = await api.users.get({ config, params: { id } })

      expect(res.state).toBe('error')
    })
  })

  describe('/api/v1/accounts/verify_credentials', () => {
    it('returns invalid credentials for a missing token', async () => {
      fetch.mockImplementationOnce(fetchMocker({ error: 'Invalid credentials.' }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/verify_credentials',
        ok: false
      }))

      const res = await api.users.verifyCredentials({ config, params: {} })
      expect(res.state).toBe('error')
    })

    it('returns valid user data for a valid token', async () => {
      const accessToken = 'qNhQPCb-_lRjt_K6mXkwcrle_AoHWBkOmWjWhn9H6EQ='
      fetch.mockImplementationOnce(fetchMocker({ id: '1' }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/verify_credentials',
        expectedToken: `Bearer ${accessToken}`
      }))

      const res = await api.users.verifyCredentials({ config: { ...config, accessToken } })
      expect(res.state).toBe('ok')
      expect(res.data.id).toBe('1')
    })
  })


  describe('/api/v1/accounts/update_credentials', () => {
    it('returns updated user data', async () => {
      const accessToken = 'qNhQPCb-_lRjt_K6mXkwcrle_AoHWBkOmWjWhn9H6EQ='

      fetch.mockImplementationOnce(fetchMocker({ id: '1', username: 'nd' }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/update_credentials',
        expectedToken: `Bearer ${accessToken}`
      }))

      const res = await api.users.updateCredentials({ config: { ...config, accessToken }, params: { id: '1', username: 'nd' } })
      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: '1', username: 'nd' })
    })
  })

  describe('/api/v1/accounts/:id/statuses', () => {
    it('returns the statuses and the links', async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        [{ id: 1 }, { id: 2 }],
        {
          expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/${id}/statuses?since_id=1`,
          headers: {
            link: '<https://pleroma.soykaf.com/api/v1/accounts/1/statuses?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/accounts/1/statuses?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
          }
        }))
      const res = await api.users.statuses({ config, params: { id }, queries: { since_id: 1 } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
      expect(res.links).not.toBe(null)
    })
  })

  describe('/api/v1/accounts/:id/followers', () => {
    it('returns the followers and the links', async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        [{ id: 1 }, { id: 2 }],
        {
          expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/${id}/followers?max_id=1`,
          headers: {
            link: '<https://pleroma.soykaf.com/api/v1/accounts/1/statuses?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/accounts/1/statuses?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
          }
        }))
      const res = await api.users.followers({ config, params: { id }, queries: { max_id: 1 } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
      expect(res.links).not.toBe(null)
    })
  })


  describe('/api/v1/accounts/:id/following', () => {
    it('returns the following and the links', async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        [{ id: 1 }, { id: 2 }],
        {
          expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/${id}/following?max_id=1`,
          headers: {
            link: '<https://pleroma.soykaf.com/api/v1/accounts/1/following?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/accounts/1/statuses?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
          }
        }))
      const res = await api.users.following({ config, params: { id }, queries: { max_id: 1 } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
      expect(res.links).not.toBe(null)
    })
  })

  describe('POST /api/v1/accounts', () => {
    it('returns a new account', async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        { id: 1, username: 'nastassiad' },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts` }
      ))
      const res = await api.users.register({ config, params: { id } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: 1, username: 'nastassiad' })
    })
  })

  describe('/api/v1/accounts/relationships', () => {
    it('returns array of relationships', async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        [{ id: '1', blocked_by: false, followed_by: true }],
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/relationships?id=1` }
      ))
      const res = await api.users.relationships({ config, queries: { id } })
      expect(res.state).toBe('ok')
      expect(res.data).toEqual([{ id: '1', blocked_by: false, followed_by: true }])
    })
  })

  describe('/api/v1/accounts/:id/follow|unfollow', () => {
    it(`follow`, async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        { id: '1', following: true },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/follow` }
      ))
      const res = await api.users.toggleFollow({ config, params: { id, following: false } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: '1', following: true })
    })
    it(`unfollow`, async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        { id: '1', following: false },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/unfollow` }
      ))
      const res = await api.users.toggleFollow({ config, params: { id, following: true } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: '1', following: false })
    })
  })
  describe('/api/v1/accounts/:id/mute|unmute', () => {
    it(`mute`, async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        { id: '1', muting: true },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/mute` }
      ))
      const res = await api.users.toggleMute({ config, params: { id, muting: false } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: '1', muting: true })
    })
    it(`unmute`, async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        { id: '1', muting: false },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/unmute` }
      ))
      const res = await api.users.toggleMute({ config, params: { id, muting: true } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: '1', muting: false })
    })
  })
  describe('/api/v1/accounts/:id/block|unblock', () => {
    it(`block`, async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        { id: '1', blocking: true },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/block` }
      ))
      const res = await api.users.toggleBlock({ config, params: { id, blocking: false } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: '1', blocking: true })
    })
    it(`unblock`, async () => {
      const id = 1

      fetch.mockImplementationOnce(fetchMocker(
        { id: '1', blocking: false },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/unblock` }
      ))
      const res = await api.users.toggleBlock({ config, params: { id, blocking: true } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual({ id: '1', blocking: false })
    })
  })
})
