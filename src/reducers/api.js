const emptyTimeline = () => ({
  loadingOlder: false
})

const initialState = {
  config: {},
  timelines: {
    public: emptyTimeline(),
    local: emptyTimeline(),
    home: emptyTimeline()
  },
  notifications: {}
}

const setProperty = ({ state, timelineName, notifications, key, value }) => {
  if (timelineName) {
    return setTimelineProperty({ state, timelineName, key, value })
  } else if (notifications) {
    return setNotificationsProperty({ state, key, value })
  } else {
    return state
  }
}

const setTimelineProperty = ({ state, timelineName, key, value }) => {
  const timeline = state.timelines[timelineName] || {}
  return {
    ...state,
    timelines: {
      ...state.timelines,
      [timelineName]: {
        ...timeline,
        [key]: value
      }
    }
  }
}

const setNotificationsProperty = ({ state, key, value }) => {
  return {
    ...state,
    notifications: {
      ...state.notifications,
      [key]: value
    }
  }
}

const reducers = {
  setFetcher: (state, { timelineName, notifications, fetcher }) => {
    return setProperty({ state, timelineName, notifications, key: 'fetcher', value: fetcher })
  },
  setNext: (state, { timelineName, notifications, next }) => {
    return setProperty({ state, timelineName, notifications, key: 'next', value: next })
  },
  setPrev: (state, { timelineName, notifications, prev }) => {
    return setProperty({ state, timelineName, notifications, key: 'prev', value: prev })
  },
  setLoadingOlder: (state, { timelineName, notifications, loading }) => {
    return setProperty({ state, timelineName, notifications, key: 'loadingOlder', value: loading })
  },
  addConfig: (state, { config }) => {
    return {
      ...state,
      config: {
        ...state.config,
        ...config
      }
    }
  }
}

const actions = {
  addConfig: ({ config }) => {
    return {
      type: 'addConfig',
      payload: { config }
    }
  },
  setFetcher: ({ timelineName, notifications, fetcher }) => {
    return {
      type: 'setFetcher',
      payload: { timelineName, notifications, fetcher }
    }
  },
  setPrev: ({ timelineName, notifications, prev }) => {
    return {
      type: 'setPrev',
      payload: { timelineName, notifications, prev }
    }
  },
  setNext: ({ timelineName, notifications, next }) => {
    return {
      type: 'setNext',
      payload: { timelineName, notifications, next }
    }
  },
  setLoadingOlder: ({ timelineName, loading }) => {
    return {
      type: 'setLoadingOlder',
      payload: { timelineName, loading }
    }
  }
}

const reducer = (state = initialState, action) => {
  const fn = reducers[action.type] || ((state) => state)
  return fn(state, action.payload)
}

export default {
  reducer,
  actions
}
