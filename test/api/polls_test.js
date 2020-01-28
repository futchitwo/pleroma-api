import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Polls API', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/v1/polls/:id', () => {
    it('returns a poll by id', async () => {
      const poll = {
        id: '1',
        expires_at: '2019-12-05T04:05:08.302z',
        voted: true,
        votes_count: 5
      }
      fetch.mockImplementationOnce(fetchMocker(poll, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/polls/1'
      }))
      const res = await api.polls.get({ config, params: { id: 1 } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual(poll)
      expect(res.data.id).toBe('1')
      expect(res.links).toBe(null)
    })
    it('returns an error state for a bad request', async () => {
      const id = '-10468'
      fetch.mockImplementationOnce(fetchMocker({ error: 'bad request' }, { ok: false }))

      const res = await api.users.get({ config, params: { id } })

      expect(res.state).toBe('error')
    })
  })
  describe('/api/v1/polls/:id/votes', () => {
    it('return a voted poll', async () => {
      const poll = {
        id: '1',
        expires_at: '2019-12-05T04:05:08.302z',
        voted: true,
        votes_count: 5
      }
      fetch.mockImplementationOnce(fetchMocker(poll, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/polls/1/votes'
      }))
      const res = await api.polls.vote({ config, params: { id: 1 } })

      expect(res.state).toBe('ok')
      expect(res.data).toEqual(poll)
      expect(res.data.id).toBe('1')
      expect(res.links).toBe(null)
    })
    it('returns an error state for nonexistent poll', async () => {
      const id = '10468'
      fetch.mockImplementationOnce(fetchMocker({ error: 'Record not found' }, { ok: false }))

      const res = await api.polls.vote({ config, params: { id } })

      expect(res.state).toBe('error')
    })
    it('returns an error state for already voted poll', async () => {
      const id = '1'
      fetch.mockImplementationOnce(fetchMocker({ error: 'Validation failed: You have already voted on this poll' }, { ok: false }))

      const res = await api.polls.vote({ config, params: { id } })

      expect(res.state).toBe('error')
    })
  })
})
