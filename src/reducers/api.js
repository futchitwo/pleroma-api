import { uniq, remove } from 'lodash'

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
  userStatuses: {},
  conversation: {},
  tagTimeline: {},
  polls: {},
  searchCache: []
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
  setPollFetcher: (state, { params, fetcher }) => {
    return {
      ...state,
      polls: {
        ...state.polls,
        [params.statusId]: { fetcher }
      }
    }
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
  },
  addSearchCache: (state, { request }) => {
    const searchCache = uniq([request, ...state.searchCache]).filter(i => i.length)

    return {
      ...state,
      searchCache: searchCache.splice(0, 10)
    }
  },
  removeItemFromSearchCache: (state, { request }) => {
    const searchCache = [...state.searchCache]

    remove(searchCache, (item) => item === request)
    return {
      ...state,
      searchCache
    }
  }
}

const actions = {
  addConfig: ({ config }) => ({
    type: 'addConfig',
    payload: { config }
  }),
  setFetcher: ({ timelineName, entity, fetcher }) => ({
    type: 'setFetcher',
    payload: { timelineName, entity, fetcher }
  }),
  setPollFetcher: ({ params, fetcher }) => ({
    type: 'setPollFetcher',
    payload: { fetcher, params }
  }),
  setPrev: ({ timelineName, entity, prev }) => ({
    type: 'setPrev',
    payload: { timelineName, entity, prev }
  }),
  setNext: ({ timelineName, entity, next }) => ({
    type: 'setNext',
    payload: { timelineName, entity, next }
  }),
  setLoadingOlder: ({ entity, timelineName, loading }) => ({
    type: 'setLoadingOlder',
    payload: { entity, timelineName, loading }
  }),
  addSearchCache: ({ request }) => ({
    type: 'addSearchCache',
    payload: { request }
  }),
  removeItemFromSearchCache: ({ request }) => ({
    type: 'removeItemFromSearchCache',
    payload: { request }
  })
}

const reducer = (state = initialState, action) => {
  const fn = reducers[action.type] || ((state) => state)
  return fn(state, action.payload)
}

export default {
  reducer,
  actions
}
