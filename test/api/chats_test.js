import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

const createMessage = (chatId, id) => ({
  id: `${id}`,
  chat_id: `${chatId}`,
  account_id: '123',
  content: 'hey you',
  created_at: '2020-04-21T15:11:46.000Z',
  emojis: [
    {
      shortcode: 'firefox',
      static_url: 'https://dontbulling.me/emoji/Firefox.gif',
      url: 'https://dontbulling.me/emoji/Firefox.gif',
      visible_in_picker: true
    }
  ]
})

const createChat = (chatId) => ({
  id: `${chatId}`,
  account: {
    id: '123',
    username: 'cofe',
    acct: 'cofe@cofe.club'
  },
  unread: 2
})

describe('Chats api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('/api/v1/pleroma/chats', async () => {
    fetch.mockImplementationOnce(fetchMocker([createChat(1), createChat(2)], {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats'
    }))
    const res = await api.chats.list({ config })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual([createChat(1), createChat(2)])
  })

  it('/api/v1/pleroma/chats/22/messages', async () => {
    fetch.mockImplementationOnce(fetchMocker([createMessage(22, 1), createMessage(22, 2)], {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats/22/messages',
      headers: {
        link: '<https://pleroma.soykaf.com/api/v1/pleroma/chats/22/messages?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/pleroma/chats/22/messages?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
      }
    }))
    const res = await api.chats.getMessages({ config, params: { id: '22' } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual([createMessage(22, 1), createMessage(22, 2)])
    expect(res.links).not.toBe(null)
  })

  it('POST /api/v1/pleroma/chats/by-account-id/:id', async () => {
    fetch.mockImplementationOnce(fetchMocker(createChat(1), {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats/by-account-id/22'
    }))
    const res = await api.chats.create({ config, params: { id: 22 } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual(createChat(1))
  })

  it('POST /api/v1/pleroma/chats/:id/messages', async () => {
    fetch.mockImplementationOnce(fetchMocker(createMessage('22', '1'), {
      expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats/22/messages'
    }))
    const res = await api.chats.post({ config, chatId: '22', params: { content: 'hello' } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual(createMessage('22', '1'))
  })
})
