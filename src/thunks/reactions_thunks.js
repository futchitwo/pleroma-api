import reactionsApi from '../api/reactions'
import Statuses from '../reducers/statuses'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const reactionsThunks = {
  toggleReaction: ({ config, params, reacted }) => {
    if (!params.statusId || !params.emoji) return getState()
    return async (dispatch, getState) => {
      const computedConfig =  getConfig(getState, config)
      const result = reacted
        ? await reactionsApi.delete({ config: computedConfig, prams }).then(res => apiErrorCatcher(res))
        : await reactionsApi.react({ config: computedConfig, params }).then(res => apiErrorCatcher(res))

      await dispatch(Statuses.actions.addStatus({ status: { id: params.statusId, poll: result.data } }))
      return getState()
    }
  }
}

export default reactionsThunks
