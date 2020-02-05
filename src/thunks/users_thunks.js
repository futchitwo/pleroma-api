import usersApi from '../api/users'
import Api from '../reducers/api'
import Users from '../reducers/users'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'
import { updateLinks } from './api_thunks'

const startLoading = ({ dispatch, entity, older }) => {
  if (older) {
    dispatch(Api.actions.setLoadingOlder({ entity, loading: true }))
  }
}

const stopLoading = ({ dispatch, entity, older }) => {
  if (older) {
    dispatch(Api.actions.setLoadingOlder({ entity, loading: false }))
  }
}

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
      if (result.links) {
        const statuses = getState().api.userStatuses
        await updateLinks({ dispatch, statuses, entity: 'userStatuses', links: result.links, older })
      }
      return getState()
    }
  }
}

export default usersThunks
