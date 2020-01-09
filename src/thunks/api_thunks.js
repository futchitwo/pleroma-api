import statusesThunks from './statuses_thunks.js'
import Api from '../reducers/api.js'
import thunks from '../thunks.js'

const makeTimelineFetcher = ({ dispatch, getState, timelineName, type, queries }) => {
  const fetch = () => {
    const config = getState().api.config
    const fullUrl = (getState().api.timelines[timelineName].prev || {}).url

    dispatch(statusesThunks.fetchAndAddTimeline({
      config,
      timelineName,
      type,
      queries,
      fullUrl
    }))
  }
  fetch()
  const fetcher = window.setInterval(fetch, 5000)
  const stop = () => {
    window.clearInterval(fetcher)
  }
  return { stop }
}

const makeFetcher = ({ entity, dispatch, getState, queries }) => {
  const fetch = () => {
    const state = getState().api
    const fullUrl = ((state[entity] && state[entity].prev) || {}).url

    dispatch(thunks[entity].fetch({ config: state.config, fullUrl, queries }))
  }

  fetch()
  const fetcher = window.setInterval(fetch, 5000)
  const stop = () => window.clearInterval(fetcher)

  return { stop }
}

const apiThunks = {
  startFetchingTimeline: ({ timelineName, type, queries }) => {
    return async (dispatch, getState) => {
      const timeline = getState().api.timelines[timelineName] || {}

      // Don't start two fetchers at once
      if (timeline.fetcher) {
        return getState()
      } else {
        const fetcher = makeTimelineFetcher({ dispatch, getState, timelineName, type, queries })
        dispatch(Api.actions.setFetcher({ timelineName, fetcher }))
        return getState()
      }
    }
  },

  stopFetchingTimeline: ({ timelineName }) => {
    return async (dispatch, getState) => {
      const timeline = getState().api.timelines[timelineName] || {}

      if (timeline.fetcher) {
        timeline.fetcher.stop()
        timeline.fetcher = null
      }
      return getState()
    }
  },

  loadOlderOnTimeline: ({ timelineName, type, queries }) => {
    return async (dispatch, getState) => {
      const timeline = getState().api.timelines[timelineName] || {}
      const config = getState().api.config
      const fullUrl = (timeline.next || {}).url
      return dispatch(statusesThunks.fetchAndAddTimeline({
        older: true,
        config,
        timelineName,
        type,
        fullUrl,
        queries
      }))
    }
  },

  startFetchingNotifications: ({ queries }) => {
    return async (dispatch, getState) => {
      const notifications = getState().api.notifications || {}
      const entity = 'notifications'

      if (!notifications.fetcher) {
        const fetcher = makeFetcher({ entity, dispatch, getState, queries })

        dispatch(Api.actions.setFetcher({ entity, fetcher }))
      }
      return getState()
    }
  },

  stopFetchingNotifications: () => {
    return async (dispatch, getState) => {
      const notifications = getState().api.notifications || {}
      if (notifications.fetcher) {
        notifications.fetcher.stop()
        notifications.fetcher = null
      }
      return getState()
    }
  },

  startFetchingConversations: ({ queries }) => {
    return async (dispatch, getState) => {
      const conversations = getState().api.conversations || {}
      const entity = 'conversations'

      if (!conversations.fetcher) {
        const fetcher = makeFetcher({ entity, dispatch, getState, queries })

        dispatch(Api.actions.setFetcher({ entity, fetcher }))
      }
      return getState()
    }
  },
  stopFetchingConversations: () => {
    return async (dispatch, getState) => {
      const conversations = getState().api.conversations || {}
      if (conversations.fetcher) {
        conversations.fetcher.stop()
        conversations.fetcher = null
      }
      return getState()
    }
  }
}

export default apiThunks
