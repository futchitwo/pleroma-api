import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import chatsThunks from '../../src/thunks/chats_thunks'
import fetch from 'cross-fetch'

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

const reducer = combineReducers({
  api: reducers.api.reducer,
  chats: reducers.chats.reducer
})

describe('Chats thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetchChat', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const chats = [
      createChat(1),
      createChat(2)
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      chats,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/pleroma/chats?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/pleroma/chats?min_id=16>; rel="prev"'
        }
      }
    ))

    const state = await chatsThunks.fetch({ config })(dispatch, getState)

    expect(state.chats.chatsByIds)
      .toEqual({ 1: chats[0], 2: chats[1] })

    expect(state.chats.list)
      .toEqual(['1', '2'])
  })

  it('fetchChat fullUrl', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const chats = [
      createChat(1),
      createChat(2)
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      chats,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/pleroma/chats?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/pleroma/chats/?min_id=16>; rel="prev"'
        }
      }
    ))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/pleroma/chats'

    const state = await chatsThunks.fetch({ config, fullUrl })(dispatch, getState)
    expect(state.chats.chatsByIds)
      .toEqual({ 1: chats[0], 2: chats[1] })

    expect(state.chats.list)
      .toEqual(['1', '2'])
  })

  it('postChatMessage', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }

    const getState = () => store.state

    store.state = {
      ...store.state,
      chats: {
        chatsByIds: {
          1: {
            ...createChat(1),
            messages: [],
            last_message: undefined
          }
        }
      }
    }

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      createMessage(1, 2),
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats/1/messages'
      }
    ))

    const params = { id: '1', content: 'hey you' }

    await chatsThunks.postChatMessage({ config, params, chatId: '1' })(dispatch, getState)

    expect(getState().chats.chatsByIds['1'].last_message)
      .toEqual(createMessage(1, 2))

    expect(getState().chats.chatsByIds['1'].messages)
      .toEqual([createMessage(1, 2)])
  })

  it('fetchChatMessages', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }

    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      [createMessage('1', '2'), createMessage('1', '3')],
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/pleroma/chats/1/messages'
      }
    ))

    await chatsThunks.fetchChatMessages({ config, params: { id: '1' }, older: true })(dispatch, getState)

    expect(getState().chats.chatsByIds['1'].last_message)
      .toEqual(createMessage('1', '3'))

    expect(getState().chats.chatsByIds['1'].messages.length).toEqual(2)
  })
})
