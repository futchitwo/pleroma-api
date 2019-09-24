import usersApi from '../api/users'
import Users from '../reducers/users'

const usersThunks = {
  fetchUser: ({ config, params }) => {
    return async (dispatch, getState) => {
      const userRes = await usersApi.get({ config, params })
      if (userRes.state === 'ok') {
        const result = await usersApi.relationships({ config, queries: { ...params, id: userRes.data.id } })
        if (result.state === 'ok') {
          const user = {
            ...userRes.data,
            relationships: { ...result.data[0] }
          }
          await dispatch(Users.actions.addUser({ user }))
        } else {
          throw Error((result.data ? result.data.error : result.state) || result.state)
        }
      } else {
        throw Error((userRes.data ? userRes.data.error : userRes.state) || userRes.state)
      }
      return getState()
    }
  },

  fetchUserStatuses: ({ config, params, queries }) => {
    return async (dispatch, getState) => {
      const result = await usersApi.statuses({ config, params, queries })
      if (result.state === 'ok') {
        const user = { id: params.id, statuses: result.data }
        await dispatch(Users.actions.addUser({ user }))
      } else {
        throw Error((result.data ? result.data.error : result.state) || result.state)
      }
      return getState()
    }
  }
}

export default usersThunks
