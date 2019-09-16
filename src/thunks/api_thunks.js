import statusesThunks from './statuses_thunks.js'
import Api from '../reducers/api.js'
import notificationsThunks from './notifications_thunks'

const makeTimelineFetcher = ({ dispatch, getState, timelineName, type, queries }) => {
  const fetcher = window.setInterval(() => {
    const config = getState().api.config
    const fullUrl = (getState().api.timelines[timelineName].prev || {}).url
    dispatch(statusesThunks.fetchAndAddTimeline({
      config,
      timelineName,
      type,
      queries,
      fullUrl
    }))
  }, 5000)
  const stop = () => {
    window.clearInterval(fetcher)
  }
  return {
    stop: stop
  }
}

const makeNotificationsFetcher = ({ dispatch, getState, queries }) => {
  const fetch = () => {
    const { config, notifications } = getState().api
    const fullUrl = (notifications.prev || {}).url
    dispatch(notificationsThunks.fetchNotifications({ config, fullUrl, queries }))
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

  startFetchingNotifications: ({ queries }) => {
    return async (dispatch, getState) => {
      const notifications = getState().api.notifications || {}

      if (notifications.fetcher) {
        return getState()
      } else {
        const fetcher = makeNotificationsFetcher({ dispatch, getState, queries })
        dispatch(Api.actions.setFetcher({ notifications: true, fetcher }))
        return getState()
      }
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
  }
}

export default apiThunks
