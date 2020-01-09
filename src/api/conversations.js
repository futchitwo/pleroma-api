import utils from './utils'

const CONVERSATIONS_MASTO_URL = '/api/v1/conversations'
const CONVERSATIONS_URL = '/api/v1/pleroma/conversations'

const Conversations = {
  async list ({ config, fullUrl, queries }) {
    if (fullUrl) {
      return utils.request({
        config,
        fullUrl
      })
    }
    return utils.request({
      config,
      url: CONVERSATIONS_MASTO_URL,
      queries
    })
  },
  async getTimeline ({ config, params }) {
    return utils.request({
      config,
      method: 'GET',
      url: `${CONVERSATIONS_URL}/${params.id}/statuses`,
      params
    })
  },
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      method: 'GET',
      url: `${CONVERSATIONS_URL}/${id}`
    })
  },
  async update ({ config, params }) {
    return utils.request({
      config,
      method: 'PATCH',
      url: `${CONVERSATIONS_URL}/${params.id}`,
      body: JSON.stringify(params)
    })
  },
  async read ({ config }) {
    return utils.request({
      config,
      method: 'GET',
      url: `${CONVERSATIONS_URL}/read`
    })
  }
}

export default Conversations
