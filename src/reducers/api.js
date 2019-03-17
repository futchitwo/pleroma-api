const initialState = {
  config: {},
  timelines: {}
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

const reducers = {
  setFetcher: (state, { timelineName, fetcher }) => {
    return setTimelineProperty({ state, timelineName, key: 'fetcher', value: fetcher })
  },
  setNext: (state, { timelineName, next }) => {
    return setTimelineProperty({ state, timelineName, key: 'next', value: next })
  },
  setPrev: (state, { timelineName, prev }) => {
    return setTimelineProperty({ state, timelineName, key: 'prev', value: prev })
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
  setFetcher: ({ timelineName, fetcher }) => {
    return {
      type: 'setFetcher',
      payload: { timelineName, fetcher }
    }
  },
  setPrev: ({ timelineName, prev }) => {
    return {
      type: 'setPrev',
      payload: { timelineName, prev }
    }
  },
  setNext: ({ timelineName, next }) => {
    return {
      type: 'setNext',
      payload: { timelineName, next }
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
