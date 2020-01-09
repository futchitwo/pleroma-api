import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import conversationsThunks from '../../src/thunks/conversations_thunks'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  api: reducers.api.reducer,
  conversations: reducers.conversations.reducer
})

describe('Conversations thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetch conversations', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const conversations = [
      {
        id: 21,
        unread: true,
        last_status: { id: 1 }
      },
      {
        id: 23,
        unread: false,
        last_status: { id: 2 }
      }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      conversations,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/conversations`,
        headers: {
          link: `<https://pleroma.soykaf.com/api/v1/conversations?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/conversations?min_id=16>; rel="prev"`
        }
      }
    ))

    let state = await conversationsThunks.fetch({ config })(dispatch, getState)

    expect(state.conversations.conversationsByIds)
      .toEqual({ 21: conversations[0], 23: conversations[1] })

    expect(state.conversations.list)
      .toEqual([21, 23])

    expect(state.api.conversations.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/conversations?min_id=16'
      })
  })

  it('fetcher a conversations by a full url', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const conversations = [
      {
        id: 21,
        last_status: {},
        unread: true
      },
      {
        id: 23,
        unread: false,
        last_status: { id: 2 }
      }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      conversations,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/conversations`,
        headers: {
          link: `<https://pleroma.soykaf.com/api/v1/conversations?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/conversations?min_id=16>; rel="prev"`
        }
      }
    ))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/conversations'

    let state = await conversationsThunks.fetch({ config, fullUrl })(dispatch, getState)
    expect(state.conversations.conversationsByIds)
      .toEqual({ 21: conversations[0], 23: conversations[1] })

    expect(state.conversations.list)
      .toEqual([21, 23])

    expect(state.api.conversations.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/conversations?min_id=16'
      })
  })

  it('fetch conversation timeline', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const conversation = {
      id: 22,
      last_status: { id: 1, content: 'hi' }
    }
    const statuses = [
      { id: 1, content: 'hi' },
      { id: 2, content: 'test message' }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      conversation,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/conversations/22`,
      }
    ))
      .mockImplementationOnce(fetchMocker(
        statuses,
        {
          expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/conversations/22/statuses`
        }
      ))

    let state = await conversationsThunks.fetchConversationTimeline({ config, params: { id: 22 } })(dispatch, getState)

    expect(state.conversations.conversationsByIds)
      .toEqual({ 22: { ...conversation, timeline: statuses } })

  })
  it('change conversation recipients', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const conversation = {
      id: 22
    }
    const statuses = [
      { id: 1, content: 'hi' },
      { id: 2, content: 'test message' }
    ]
    const recipients = [1, 2]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/conversations/22`
      }
    ))

    let state = await conversationsThunks.changeConversationRecipients({ config, params: { id: 22, recipients: [1, 2] } })(dispatch, getState)

    expect(state.conversations.conversationsByIds)
      .toEqual({ 22: { ...conversation, timeline: statuses, pleroma: { recipients } } })

    expect(state.conversations.list)
      .toEqual([22])
  })
  it('read conversations', async () => {
    const store = { state: { conversations: {
      list: [1],
      conversationsByIds: {
        1: { id: 1, unread: true }
      }
    }} }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const conversations = [{
      id: 1,
      unread: false
    }]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      conversations,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/conversations/read`
      }
    ))

    let state = await conversationsThunks.readConversations({ config })(dispatch, getState)

    expect(state.conversations.conversationsByIds)
      .toEqual({ 1: { id: 1, unread: false } })

    expect(state.conversations.list)
      .toEqual([1])
  })
})
