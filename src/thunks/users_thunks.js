import usersApi from '../api/users'
import adminApi from '../api/admin'
import Users from '../reducers/users'
import Statuses from '../reducers/statuses'
import ApiReducer from '../reducers/api'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'
import { updateLinks, startLoading, stopLoading } from './api_thunks'
import { getUsersFromStatusesList } from '../utils/users_utils'

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
      if (older && !fullUrl && (!queries || !queries.max_id)) {
        const userStatuses = (getState().users.usersByIds[params.id] || {}).statuses || []
        queries = queries || {}
        queries.max_id = userStatuses.length ? userStatuses[userStatuses.length - 1].id : null
      }
      startLoading({ dispatch, entity: 'userStatuses', older })
      const result = await usersApi.statuses({ config: getConfig(getState, config), fullUrl, params, queries })
        .then(res => apiErrorCatcher(res))
      stopLoading({ dispatch, entity: 'userStatuses', older })
      await dispatch(Users.actions.addUserStatuses({ userId: params.id, statuses: result.data }))
      await dispatch(Statuses.actions.addStatuses({ statuses: result.data }))
      await dispatch(Users.actions.addUsers({ users: getUsersFromStatusesList(result.data) }))

      if (result.links) {
        const statuses = getState().api.userStatuses
        await updateLinks({ dispatch, statuses, entity: 'userStatuses', links: result.links, older })
      }
      return getState()
    }
  },

  fetchUserFollowers: ({ config, fullUrl, params, queries, older }) => {
    return async (dispatch, getState) => {
      if (older && !fullUrl && (!queries || !queries.max_id)) {
        const userFollowers = (getState().users.usersByIds[params.id] || {}).followers || []
        queries = queries || {}
        queries.max_id = userFollowers.length ? userFollowers[userFollowers.length - 1].id : null
      }
      startLoading({ dispatch, entity: 'userFollowers', older })
      const result = await usersApi.followers({ config: getConfig(getState, config), fullUrl, params, queries })
        .then(res => apiErrorCatcher(res))

      stopLoading({ dispatch, entity: 'userFollowers', older })
      await Promise.all([
        dispatch(Users.actions.addUsers({ users: result.data })),
        dispatch(Users.actions.addUserFollowers({ userId: params.id, followers: result.data }))
      ])

      if (result.links) {
        await updateLinks({ dispatch, entity: 'userFollowers', links: result.links, older })

        if (result.links.next) {
          await dispatch(ApiReducer.actions.setNext({ entity: 'userFollowers', next: result.links.next }))
        }
      }
      return getState()
    }
  },

  fetchUserFollowing: ({ config, fullUrl, params, queries, older }) => {
    return async (dispatch, getState) => {
      if (older && !fullUrl && (!queries || !queries.max_id)) {
        const userFollowing = (getState().users.usersByIds[params.id] || {}).following || []
        queries = queries || {}
        queries.max_id = userFollowing.length ? userFollowing[userFollowing.length - 1].id : null
      }
      startLoading({ dispatch, entity: 'userFollowing', older })
      const result = await usersApi.following({ config: getConfig(getState, config), fullUrl, params, queries })
        .then(res => apiErrorCatcher(res))
      stopLoading({ dispatch, entity: 'userStatuses', older })
      await Promise.all([
        dispatch(Users.actions.addUsers({ users: result.data })),
        dispatch(Users.actions.addUserFollowing({ userId: params.id, following: result.data }))
      ])

      if (result.links) {
        await updateLinks({ dispatch, entity: 'userFollowing', links: result.links, older })
        if (result.links.next) {
          await dispatch(ApiReducer.actions.setNext({ entity: 'userFollowing', next: result.links.next }))
        }
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
      return { state: getState(), result }
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
      return { state: getState(), result }
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
      return { state: getState(), result }
    }
  },

  togglePermissionGroup: ({ config, params, isPermissionGroupOn }) => {
    return async (dispatch, getState) => {
      const computedConfig = getConfig(getState, config)
      let result = isPermissionGroupOn
        ? await adminApi.deletePermissionGroup({ config: computedConfig, params })
        : await adminApi.addPermissionGroup({ config: computedConfig, params })
      result = apiErrorCatcher(result)
      const user = { ...getState().users.usersByIds[params.user.id] }
      user.pleroma = { ...user.pleroma, ...result.data }

      await dispatch(Users.actions.addUser({ user }))
      return getState()
    }
  }
}

export default usersThunks
