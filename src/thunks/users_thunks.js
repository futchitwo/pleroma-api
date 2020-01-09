import usersApi from '../api/users'
import Users from '../reducers/users'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

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

  fetchUserStatuses: ({ config, params, queries }) => {
    return async (dispatch, getState) => {
      const result = await usersApi.statuses({ config: getConfig(getState, config), params, queries })
      const user = { id: params.id, statuses: result.data }
      await dispatch(Users.actions.addUser({ user }))
      return getState()
    }
  }
}

export default usersThunks
