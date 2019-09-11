import statusesThunks from './statuses_thunks.js'
import Api from '../reducers/api.js'

const makeFetcher = ({ dispatch, getState, timelineName, type, queries }) => {
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

const apiThunks = {
  startFetchingTimeline: ({ timelineName, type, queries }) => {
    return async (dispatch, getState) => {
      const timeline = getState().api.timelines[timelineName] || {}

      // Don't start two fetchers at once
      if (timeline.fetcher) {
        return getState()
      } else {
        const fetcher = makeFetcher({ dispatch, getState, timelineName, type, queries })
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
      }
      return getState()
    }
  }
}

export default apiThunks
