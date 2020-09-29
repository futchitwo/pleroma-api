import reactionsApi from '../api/reactions'
import Statuses from '../reducers/statuses'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const reactionsThunks = {
  toggleReaction: ({ config, params, reacted }) => {
    return async (dispatch, getState) => {
      if (!params.statusId || !params.emoji) return getState()
      const computedConfig = getConfig(getState, config)
      const result = reacted
        ? await reactionsApi.delete({ config: computedConfig, params }).then(res => apiErrorCatcher(res))
        : await reactionsApi.react({ config: computedConfig, params }).then(res => apiErrorCatcher(res))
      await dispatch(Statuses.actions.addStatus({ status: result.data }))
      return getState()
    }
  },
  getReactions: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await reactionsApi.list({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      const oldStatus = getState().statuses.statusesByIds[params.statusId] || {}

      if (oldStatus.pleroma) {
        oldStatus.pleroma.emoji_reactions = result.data
      }
      await dispatch(Statuses.actions.addStatus({ status: { id: params.statusId, ...oldStatus } }))
      return getState()
    }
  }
}

export default reactionsThunks
