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
  notifications: {},
  conversations: {},
  conversation: {},
  userStatuses: {}
}

const setProperty = ({ state, timelineName, entity, key, value }) => {
  if (timelineName) {
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
  } else if (entity) {
    return {
      ...state,
      [entity]: {
        ...state[entity],
        [key]: value
      }
    }
  } else {
    return state
  }
}

const reducers = {
  setFetcher: (state, { timelineName, entity, fetcher }) => {
    return setProperty({ state, timelineName, entity, key: 'fetcher', value: fetcher })
  },
  setNext: (state, { timelineName, entity, next }) => {
    return setProperty({ state, timelineName, entity, key: 'next', value: next })
  },
  setPrev: (state, { timelineName, entity, prev }) => {
    return setProperty({ state, timelineName, entity, key: 'prev', value: prev })
  },
  setLoadingOlder: (state, { timelineName, entity, loading }) => {
    return setProperty({ state, timelineName, entity, key: 'loadingOlder', value: loading })
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
  setFetcher: ({ timelineName, entity, fetcher }) => {
    return {
      type: 'setFetcher',
      payload: { timelineName, entity, fetcher }
    }
  },
  setPrev: ({ timelineName, entity, prev }) => {
    return {
      type: 'setPrev',
      payload: { timelineName, entity, prev }
    }
  },
  setNext: ({ timelineName, entity, next }) => {
    return {
      type: 'setNext',
      payload: { timelineName, entity, next }
    }
  },
  setLoadingOlder: ({ entity, timelineName, loading }) => {
    return {
      type: 'setLoadingOlder',
      payload: { entity, timelineName, loading }
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
