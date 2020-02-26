import statusesThunks from './statuses_thunks.js'
import Api from '../reducers/api.js'
import thunks from '../thunks.js'
import usersThunks from './users_thunks.js'
import has from 'lodash/has'
import conversationsThunks from './conversations_thunks.js'

const ENTITIES = {
  conversations: { name: 'conversations', thunk: 'fetch' },
  notifications: { name: 'notifications', thunk: 'fetch' },
  userStatuses: { name: 'users', thunk: 'fetchUserStatuses', clearLinksOnStop: true },
  conversation: { name: 'conversation', module: 'conversations', thunk: 'fetchConversationTimeline', clearLinksOnStop: true }
}

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
  const stop = () => window.clearInterval(fetcher)
  return { stop }
}

const makeFetcher = ({ entity, dispatch, getState, params, queries, clearLinksOnStop }) => {
  const fetch = () => {
    const state = getState().api
    const fullUrl = ((state[entity] && state[entity].prev) || {}).url
    const { name, thunk, module } = ENTITIES[entity]

    dispatch(thunks[module || name][thunk]({ config: state.config, fullUrl, params, queries }))
  }

  fetch()
  const fetcher = window.setInterval(fetch, 5000)
  const stop = () => {
    window.clearInterval(fetcher)
    if (clearLinksOnStop) {
      clearLinks({ dispatch, entity })
    }
  }
  return { stop }
}

export const updateLinks = async ({ dispatch, entity, statuses, links, older }) => {
  if (!has(statuses, 'prev') && links.prev) {
    await dispatch(Api.actions.setPrev({ entity, prev: links.prev }))
  }
  if (!older && links.prev) {
    await dispatch(Api.actions.setPrev({ entity, prev: links.prev }))
  }
  if (older && links.next) {
    await dispatch(Api.actions.setNext({ entity, next: links.next }))
  }
}

export const clearLinks = async ({ dispatch, entity }) => {
  await dispatch(Api.actions.setFetcher({ entity, fetcher: null }))
  await dispatch(Api.actions.setPrev({ entity, prev: null }))
  await dispatch(Api.actions.setNext({ entity, next: null }))
}

const generateApiThunks = () => {
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
    loadOlderUserStatuses: ({ params, queries }) => {
      return async (dispatch, getState) => {
        const userStatuses = getState().api.userStatuses || {}
        const config = getState().api.config
        const fullUrl = (userStatuses.next || {}).url

        return dispatch(usersThunks.fetchUserStatuses({
          older: true,
          config,
          fullUrl,
          queries,
          params
        }))
      }
    },
    loadOlderConversation: ({ params, queries }) => {
      return async (dispatch, getState) => {
        const conversation = getState().api.conversation || {}
        const config = getState().api.config
        const fullUrl = (conversation.next || {}).url

        return dispatch(conversationsThunks.fetchConversationTimeline({
          older: true,
          config,
          fullUrl,
          queries,
          params
        }))
      }
    }
  }

  Object.keys(ENTITIES).forEach(entity => {
    apiThunks[`startFetching${entity[0].toUpperCase()}${entity.slice(1)}`] = ({ queries, params }) => {
      return async (dispatch, getState) => {
        const state = getState().api[entity] || {}

        if (!state.fetcher) {
          const fetcher = makeFetcher({
            entity,
            dispatch,
            getState,
            params,
            queries,
            clearLinksOnStop: ENTITIES[entity].clearLinksOnStop
          })

          dispatch(Api.actions.setFetcher({ entity, fetcher }))
        }
        return getState()
      }
    }
    apiThunks[`stopFetching${entity[0].toUpperCase()}${entity.slice(1)}`] = () => {
      return async (dispatch, getState) => {
        const state = getState().api[entity] || {}
        if (state.fetcher) {
          state.fetcher.stop()
          state.fetcher = null
        }
        return getState()
      }
    }
  })
  return apiThunks
}
export default generateApiThunks()
