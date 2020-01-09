import conversationsApi from '../api/conversations.js'
import Conversations from '../reducers/conversations.js'
import Api from '../reducers/api'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const conversationsThunks = {
  fetch: ({ config, fullUrl, queries }) => {
    return async (dispatch, getState) => {
      const result = await conversationsApi.list({ config: getConfig(getState, config), fullUrl, queries })
        .then(res => apiErrorCatcher(res))
      await dispatch(Conversations.actions.addConversations({ conversations: result.data }))
      if (result.links && result.links.prev) {
        await dispatch(Api.actions.setPrev({ entity: 'conversations', prev: result.links.prev }))
      }
      return getState()
    }
  },
  fetchConversationTimeline: ({ config, params }) => {
    return async (dispatch, getState) => {
      const computedConfig = getConfig(getState, config)
      const result = await Promise.all([
        conversationsApi.get({ config: computedConfig, params }),
        conversationsApi.getTimeline({ config: computedConfig, params })
      ]).then(res => apiErrorCatcher(res))
      const conversation = { ...result[0].data, timeline: result[1].data }

      await dispatch(Conversations.actions.updateConversation({ conversation }))
      return getState()
    }
  },
  changeConversationRecipients: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await conversationsApi.update({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))

      await dispatch(Conversations.actions.addConversation({ conversation: { id: params.id, pleroma: { recipients: params.recipients }, timeline: result.data } }))
      return getState()
    }
  },
  readConversations: ({ config }) => {
    return async (dispatch, getState) => {
      const result = await conversationsApi.read({ config: getConfig(getState, config) })
        .then(res => apiErrorCatcher(res))

      await dispatch(Conversations.actions.addConversations({ conversations: result.data }))
      return getState()
    }
  }
}

export default conversationsThunks
