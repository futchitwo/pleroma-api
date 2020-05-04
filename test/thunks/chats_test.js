import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import chatsThunks from '../../src/thunks/chats_thunks'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const createMessage = (chatId, id) => ({
  'id': `${id}`,
  'chat_id': `${chatId}`,
  'account_id': '123',
  'content': 'hey you',
  'created_at': '2020-04-21T15:11:46.000Z',
  'emojis': [
    {
      'shortcode': 'firefox',
      'static_url': 'https://dontbulling.me/emoji/Firefox.gif',
      'url': 'https://dontbulling.me/emoji/Firefox.gif',
      'visible_in_picker': true
    }
  ]
})

const createChat = (chatId) => ({
  'id': `${chatId}`,
  'account': {
    'id': '123',
    'username': 'cofe',
    'acct': 'cofe@cofe.club'
  },
  'unread': 2
})

const reducer = combineReducers({
  api: reducers.api.reducer,
  chats: reducers.chats.reducer
})

describe('Chats thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetch chats', async () => {
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
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/chats`,
        headers: {
          link: `<https://pleroma.soykaf.com/api/v1/pleroma/chats?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/pleroma/chats?min_id=16>; rel="prev"`
        }
      }
    ))

    let state = await chatsThunks.fetch({ config })(dispatch, getState)

    expect(state.chats.chatsByIds)
      .toEqual({ '1': chats[0], '2': chats[1] })

    expect(state.chats.list)
      .toEqual(['1', '2'])

    /*
    expect(state.api.chats.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/pleroma/chats?min_id=16'
      })
    */
  })

  it('fetcher a chats by a full url', async () => {
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
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/chats`,
        headers: {
          link: `<https://pleroma.soykaf.com/api/v1/pleroma/chats?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/pleroma/chats/?min_id=16>; rel="prev"`
        }
      }
    ))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/pleroma/chats'

    let state = await chatsThunks.fetch({ config, fullUrl })(dispatch, getState)
    expect(state.chats.chatsByIds)
      .toEqual({ '1': chats[0], '2': chats[1] })

    expect(state.chats.list)
      .toEqual(['1', '2'])

    /*
    expect(state.api.chats.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/chats?min_id=16'
      })
    */
  })

  it('post a message to chat', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }

    const getState = () => store.state

    store.state = {
      ...store.state,
      chats: {
        chatsByIds: {
          '1': {
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
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/chats/1/messages`
      }
    ))

    const params = { id: '1', content: 'hey you' }

    await chatsThunks.postChatMessage({ config, params })(dispatch, getState)

    expect(getState().chats.chatsByIds['1'].last_message)
      .toEqual(createMessage(1, 2))

    expect(getState().chats.chatsByIds['1'].messages)
      .toEqual([createMessage(1, 2)])
  })

  /*
  it('fetch chat timeline', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const statuses = [
      { id: 1, content: 'hi' },
      { id: 2, content: 'test message' }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/chats/22/statuses`
      }
    ))

    let state = await chatsThunks.fetchChatTimeline({ config, params: { id: 22 } })(dispatch, getState)

    expect(state.chats.chatsByIds)
      .toEqual({ 22: { id: 22, last_status: { id: 2, content: 'test message' },timeline: statuses } })
  })

  it('update chat timeline', async () => {
    const store = { state: {
      chats: {
        chatsByIds: {
          22: {
            id: 22,
            last_status: { id: '1' },
            timeline: [{ id: 1, content: 'hi' }]
          }
        }
      }
    } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const statuses = [
      { id: 2, content: 'test message' }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/chats/22/statuses`
      }
    ))

    let state = await chatsThunks.fetchChatTimeline({ config, params: { id: 22 } })(dispatch, getState)

    expect(state.chats.chatsByIds)
      .toEqual({ 22: { id: 22, timeline: [{ id: 1, content: 'hi' },{ id: 2, content: 'test message' }] , last_status: { id: 2, content: 'test message' } } })
  })
  */
})
