import pollsApi from '../api/polls'
import Statuses from '../reducers/statuses'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const pollsThunks = {
  vote: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await pollsApi.vote({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))

      await dispatch(Statuses.actions.addStatus({ status: { id: params.statusId, poll: result.data } }))
      return getState()
    }
  }
}

export default pollsThunks
