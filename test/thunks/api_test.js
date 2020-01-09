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
      notifications: {}
    }
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

      // stop interval to clean up just in case
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
})
