import chatsApi from '../api/chats.js'
import Chats from '../reducers/chats.js'
// import Api from '../reducers/api'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'
// import { updateLinks } from './api_thunks'

const chatsThunks = {
  fetch: ({ config, fullUrl, queries }) => {
    return async (dispatch, getState) => {
      const result = await chatsApi.list({ config: getConfig(getState, config), fullUrl, queries })
        .then(res => apiErrorCatcher(res))
      await dispatch(Chats.actions.addChats({ chats: result.data }))
      /*
      if (result.links && result.links.prev) {
        await dispatch(Api.actions.setPrev({ entity: 'chats', prev: result.links.prev }))
      }
      */
      return getState()
    }
  },
  postChatMessage: ({ config, params, chatId }) => {
    return async (dispatch, getState) => {
      const result = await chatsApi.post({ config: getConfig(getState, config), params, chatId })
        .then(res => apiErrorCatcher(res))

      await dispatch(Chats.actions.updateChat({
        older: false,
        chat: {
          id: params.id,
          messages: [result.data]
        }
      }))
    }
  },
  fetchChat: ({ config, params }) => {
    return async (dispatch, getState) => {
      const computedConfig = getConfig(getState, config)
      const result = await chatsApi.get({ config: computedConfig, params })
        .then(res => apiErrorCatcher(res))

      await dispatch(Chats.actions.updateChat({ chat: result.data }))
      return getState()
    }
  },
  fetchChatMessages: ({ config, params, fullUrl, queries, older }) => {
    return async (dispatch, getState) => {
      const result = await chatsApi.getMessages({ config: getConfig(getState, config), params, fullUrl, queries })
        .then(res => apiErrorCatcher(res))

      await dispatch(Chats.actions.updateChat({
        older,
        chat: {
          id: params.id,
          messages: result.data
        }
      }))
      /*
      if (result.links) {
        const statuses = getState().api.chat
        await updateLinks({ dispatch, statuses, entity: 'chat', links: result.links, older })
      }
      */
      return getState()
    }
  }
}

export default chatsThunks
