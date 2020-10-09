import utils from './utils'

const NOTIFICATIONS_URL = '/api/v1/notifications'
const PLEROMA_NOTIFICATIONS_URL = '/api/v1/pleroma/notifications'

const Notifications = {
  async list ({ config, fullUrl, queries }) {
    if (fullUrl) {
      return utils.request({
        config,
        fullUrl
      })
    }
    return utils.request({
      config,
      url: NOTIFICATIONS_URL,
      queries
    })
  },

  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${NOTIFICATIONS_URL}/${id}`
    })
  },

  async clear ({ config }) {
    return utils.request({
      config,
      url: `${NOTIFICATIONS_URL}/clear`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },

  async dismiss ({ config, params }) {
    return utils.request({
      config,
      url: `${NOTIFICATIONS_URL}/dismiss`,
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },

  async read ({ config, params }) {
    return utils.request({
      config,
      url: `${PLEROMA_NOTIFICATIONS_URL}/read`,
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export default Notifications
