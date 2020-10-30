import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Emoji reactions api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('PUT /api/v1/pleroma/statuses/:id/reactions/:emoji', () => {
    it('should react to a post with an emoji', async () => {
      const id = '1'
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/statuses/1/reactions/%F0%9F%98%80'
      }))
      const res = await api.reactions.react({ config, params: { statusId: id, emoji: '%F0%9F%98%80' } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe('1')
    })
  })
  describe('DELETE /api/v1/pleroma/statuses/:id/reactions/:emoji', () => {
    it('should delete a reaction to the post with an emoji', async () => {
      const id = '1'
      fetch.mockImplementationOnce(fetchMocker({ id }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/statuses/1/reactions/%F0%9F%98%80'
      }))
      const res = await api.reactions.delete({ config, params: { statusId: id, emoji: '%F0%9F%98%80' } })

      expect(res.state).toBe('ok')
      expect(res.data.id).toBe('1')
    })
  })
  describe('GET /api/v1/pleroma/statuses/:id/reactions', () => {
    it('should return list of accounts that reacted to status', async () => {
      const id = '1'
      const reactions = [
        { name: '😀', count: 2, me: true, accounts: [{ id: 'u1' }, { id: 'u2' }] },
        { name: '☕', count: 1, me: false, accounts: [{ id: 'u3' }] }
      ]
      fetch.mockImplementationOnce(fetchMocker(reactions, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/statuses/1/reactions'
      }))
      const res = await api.reactions.list({ config, params: { statusId: id } })

      expect(res.state).toBe('ok')
      expect(res.data).toBe(reactions)
    })
  })
  describe('GET /api/v1/pleroma/statuses/:id/reactions/:emoji', () => {
    it('should return a list of account that reacted with particular emoji', async () => {
      const id = '1'
      const reactions = [
        { name: '😀', count: 2, me: true, accounts: [{ id: 'u1' }, { id: 'u2' }] }
      ]
      fetch.mockImplementationOnce(fetchMocker(reactions, {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/statuses/1/reactions/%F0%9F%98%80'
      }))
      const res = await api.reactions.get({ config, params: { statusId: id, emoji: '%F0%9F%98%80' } })

      expect(res.state).toBe('ok')
      expect(res.data).toBe(reactions)
    })
  })
})
