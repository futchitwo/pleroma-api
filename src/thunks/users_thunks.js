import usersApi from '../api/users'
import searchApi from '../api/search'
import Users from '../reducers/users'
import Statuses from '../reducers/statuses'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'
import { updateLinks, startLoading, stopLoading } from './api_thunks'

const usersThunks = {
  fetchUser: ({ config, params }) => {
    return async (dispatch, getState) => {
      const computedConfig = getConfig(getState, config)
      const userRes = await usersApi.get({ config: computedConfig, params })
        .then(res => apiErrorCatcher(res))
      const result = await usersApi.relationships({ config: computedConfig, queries: { ...params, id: userRes.data.id } })
        .then(res => apiErrorCatcher(res))
      const user = {
        ...userRes.data,
        relationships: { ...result.data[0] }
      }
      await dispatch(Users.actions.addUser({ user }))
      return getState()
    }
  },

  fetchUserStatuses: ({ config, fullUrl, params, queries, older }) => {
    return async (dispatch, getState) => {
      if (older && !fullUrl && (!queries || !queries['max_id'])) {
        const userStatuses = (getState().users.usersByIds[params.id] || {}).statuses || []
        queries = queries || {}
        queries['max_id'] = userStatuses[userStatuses.length - 1].id
      }
      startLoading({ dispatch, entity: 'userStatuses', older })
      const result = await usersApi.statuses({ config: getConfig(getState, config), fullUrl, params, queries })
        .then(res => apiErrorCatcher(res))
      stopLoading({ dispatch, entity: 'userStatuses', older })
      await dispatch(Users.actions.addUserStatuses({ userId: params.id, statuses: result.data }))
      await dispatch(Statuses.actions.addStatuses({ statuses: result.data }))
      if (result.links) {
        const statuses = getState().api.userStatuses
        await updateLinks({ dispatch, statuses, entity: 'userStatuses', links: result.links, older })
      }
      return getState()
    }
  },

  toggleFollowState: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await usersApi.toggleFollow({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      const user = {
        id: params.id,
        relationships: { ...result.data }
      }

      await dispatch(Users.actions.addUser({ user }))
      return getState()
    }
  },

  toggleBlockState: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await usersApi.toggleBlock({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      const user = {
        id: params.id,
        relationships: { ...result.data }
      }

      await dispatch(Users.actions.addUser({ user }))
      return getState()
    }
  },

  toggleMuteState: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await usersApi.toggleMute({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      const user = {
        id: params.id,
        relationships: { ...result.data }
      }

      await dispatch(Users.actions.addUser({ user }))
      return getState()
    }
  },

  searchUsers: ({ config, queries }) => {
    return async (dispatch, getState) => {
      const searchCache = getState().users.searchCache
      if (searchCache.includes(queries.q)) {
        dispatch(Users.actions.addSearchResult({ users: [], request: queries.q }))
      } else {
        const res = await searchApi({ config: getConfig(getState, config), queries })
          .then(res => apiErrorCatcher(res))

        dispatch(Users.actions.addSearchResult({ users: res.data.accounts, request: queries.q }))
      }
      return { q: queries.q, state: getState() }
    }
  }
}

export default usersThunks
