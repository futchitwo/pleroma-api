import followRequestsApi from '../api/follow_requests.js'
import FollowRequests from '../reducers/follow_requests.js'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const followRequestsThunks = {
  fetch: ({ config }) => {
    return async (dispatch, getState) => {
      const result = await followRequestsApi.getPendingFollows({ config: getConfig(getState, config) })
        .then(res => apiErrorCatcher(res))
      await dispatch(FollowRequests.actions.addFollowRequests({ followRequests: result.data }))
      return getState()
    }
  },
  accept: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await followRequestsApi.acceptFollow({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      await dispatch(FollowRequests.actions.processFollowRequest({ id: params.id, relationship: result.data }))
      return getState()
    }
  },
  reject: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await followRequestsApi.rejectFollow({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      await dispatch(FollowRequests.actions.processFollowRequest({ id: params.id, relationship: result.data }))
      return getState()
    }
  }
}

export default followRequestsThunks
