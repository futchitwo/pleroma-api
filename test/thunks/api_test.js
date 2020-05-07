import { combineReducers } from 'redux'
import reducers from '../../src/reducers.js'
import apiThunks from '../../src/thunks/api_thunks.js'
import fetchMocker from '../api/fetch_mocker.js'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  statuses: reducers.statuses.reducer,
  users: reducers.users.reducer,
  api: reducers.api.reducer
})

describe('Api thunks', () => {
  const defaultState = () => ({
    api: {
      timelines: {
        home: {}
      },
      notifications: {},
      conversations: {},
      userStatuses: {},
      polls: {},
      conversation: {}
    }
  })

  describe('stopAllFetchers', () => {
    it ('stop all existing fetchers', async () => {
      const state = defaultState()
      const store = { state: { ...state } }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      const getState = () => store.state

      await apiThunks.startFetchingNotifications({})(dispatch, getState)
      await apiThunks.startFetchingPoll({ params: { id: '193', statusId: '11' } })(dispatch, getState)
      await apiThunks.startFetchingTimeline({ timelineName: 'home', type: 'home' })(dispatch, getState)
      apiThunks.stopAllFetchers()(dispatch, getState)

      expect(getState().api.notifications.fetcher).toBeNull()
      expect(getState().api.polls['11'].fetcher).toBeNull()
      expect(getState().api.timelines['home'].fetcher).toBeNull()
    })
  })

  describe('startFetchingTimeline', () => {
    it('creates a timeline fetcher', async () => {
      const store = { state: defaultState() }
      const timelineName = 'home'
      const type = 'home'
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingTimeline({ timelineName, type })(dispatch, getState)

      expect(getState().api.timelines[timelineName].fetcher).toBeDefined()

      expect(typeof getState().api.timelines[timelineName].fetcher.stop)
        .toEqual('function')

      // stop interval to clean up just in case
      getState().api.timelines[timelineName].fetcher.stop()
    })
  })

  describe('stopFetchingTimeline', () => {
    it('stops and removes the timeline fetcher', async () => {
      const store = { state: defaultState() }
      const timelineName = 'home'
      const type = 'home'
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingTimeline({ timelineName, type })(dispatch, getState)

      expect(getState().api.timelines[timelineName].fetcher).toBeDefined()

      await apiThunks.stopFetchingTimeline({ timelineName })(dispatch, getState)

      expect(getState().api.timelines[timelineName].fetcher).toBeNull()
    })
  })

  describe('startFetchingNotifications', () => {
    it('create a notifications fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingNotifications({})(dispatch, getState)

      expect(getState().api.notifications.fetcher).toBeDefined()

      expect(typeof getState().api.notifications.fetcher.stop)
        .toEqual('function')

      getState().api.notifications.fetcher.stop()
    })
  })

  describe('stopFetchingNotifications', () => {
    it('stops and removes the notifications fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingNotifications({})(dispatch, getState)

      expect(getState().api.notifications.fetcher).toBeDefined()

      await apiThunks.stopFetchingNotifications()(dispatch, getState)

      expect(getState().api.notifications.fetcher).toBeNull()
    })
  })

  describe('startFetchingConversations', () => {
    it('create a conversations fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingConversations({})(dispatch, getState)

      expect(getState().api.conversations.fetcher).toBeDefined()

      expect(typeof getState().api.conversations.fetcher.stop)
        .toEqual('function')

      // stop interval to clean up just in case
      getState().api.conversations.fetcher.stop()
    })
  })

  describe('stopFetchingConversations', () => {
    it('stops and removes the conversations fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingConversations({})(dispatch, getState)

      expect(getState().api.conversations.fetcher).toBeDefined()

      await apiThunks.stopFetchingConversations()(dispatch, getState)

      expect(getState().api.conversations.fetcher).toBeNull()
    })
  })

  describe('startFetchingUserStatuses', () => {
    it('creates a userStatuses fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingUserStatuses({ })(dispatch, getState)

      expect(getState().api.userStatuses.fetcher).toBeDefined()

      expect(typeof getState().api.userStatuses.fetcher.stop)
        .toEqual('function')

      // stop interval to clean up just in case
      getState().api.userStatuses.fetcher.stop()
    })
  })

  describe('stopFetchingUserStatuses', () => {
    it('stops and removes the user statuses fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingUserStatuses({})(dispatch, getState)

      expect(getState().api.userStatuses.fetcher).toBeDefined()

      await apiThunks.stopFetchingUserStatuses({})(dispatch, getState)

      expect(getState().api.userStatuses.fetcher).toBeNull()
    })
  })
  describe('polls fetcher', () => {
    it('set and remove poll fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))
      const statusId = '11'
      await apiThunks.startFetchingPoll({ params: { id: '193', statusId } })(dispatch, getState)

      expect(getState().api.polls[statusId].fetcher).toBeDefined()

      await apiThunks.stopFetchingPoll({ params: { statusId } })(dispatch, getState)

      expect(getState().api.polls[statusId].fetcher).toBeNull()
    }
    )
  })
  describe('startFetchingConversationTimeline', () => {
    it('creates a conversationTimeline fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }      
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingConversation({ })(dispatch, getState)

      expect(getState().api.conversation.fetcher).toBeDefined()

      expect(typeof getState().api.conversation.fetcher.stop)
        .toEqual('function')

      getState().api.conversation.fetcher.stop()
    })
  })

  describe('stopFetchingConversationTimeline', () => {
    it('stops and removes the conversation fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingConversation({})(dispatch, getState)

      expect(getState().api.conversation.fetcher).toBeDefined()

      await apiThunks.stopFetchingConversation({})(dispatch, getState)

      expect(getState().api.conversation.fetcher).toBeNull()
    })
  })


  describe('startFetchingTagTimeline', () => {
    it('creates a tagTimeline fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }      
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingTagTimeline({ })(dispatch, getState)

      expect(getState().api.tagTimeline.fetcher).toBeDefined()

      expect(typeof getState().api.tagTimeline.fetcher.stop)
        .toEqual('function')

      getState().api.tagTimeline.fetcher.stop()
    })
  })

  describe('stopFetchingTagTimeline', () => {
    it('stops and removes the tagTimeline fetcher', async () => {
      const store = { state: defaultState() }
      const dispatch = (action) => {
        store.state = reducer(store.state, action)
        return store.state
      }
      const getState = () => store.state

      fetch.mockReset()
      fetch.mockImplementationOnce(fetchMocker([], {}))

      await apiThunks.startFetchingTagTimeline({})(dispatch, getState)

      expect(getState().api.tagTimeline.fetcher).toBeDefined()

      await apiThunks.stopFetchingTagTimeline({})(dispatch, getState)

      expect(getState().api.tagTimeline.fetcher).toBeNull()
    })
  })
})
