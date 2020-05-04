import utils from './utils'
import { createFormData } from '../utils/api_utils.js'

const CHATS_URL = '/api/v1/pleroma/chats'

const Chats = {
  // List all chats
  async list ({ config, fullUrl, queries }) {
    if (fullUrl) {
      return utils.request({
        config,
        fullUrl
      })
    }
    return utils.request({
      config,
      url: CHATS_URL,
      queries
    })
  },
  // Get messages of a chat
  async getMessages ({ config, params, fullUrl, queries }) {
    if (fullUrl) {
      return utils.request({
        config,
        fullUrl
      })
    }
    return utils.request({
      config,
      method: 'GET',
      url: `${CHATS_URL}/${params.id}/messages`,
      params,
      queries
    })
  },
  // Create a new chat with someone
  async create ({ config, params: { id } }) {
    return utils.request({
      config,
      method: 'POST',
      url: `${CHATS_URL}/by-account-id/${id}`
    })
  },
  // Get a chat room
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      method: 'GET',
      url: `${CHATS_URL}/${id}`
    })
  },
  // Post a message to a chat
  async post ({ config, params, chatId }) {
    const body = createFormData(params)

    return utils.request({
      config,
      method: 'POST',
      url: `${CHATS_URL}/${chatId}/messages`,
      body
    })
  }
}

export default Chats
