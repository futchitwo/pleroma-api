import utils from './utils'

const baseUrl = '/api/v1/notifications'

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
      url: baseUrl,
      queries
    })
  },

  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${baseUrl}/${id}`
    })
  },

  async clear ({ config }) {
    return utils.request({
      config,
      url: `${baseUrl}/clear`,
      method: 'POST'
    })
  },

  async dismiss ({ config, params }) {
    return utils.request({
      config,
      url: `${baseUrl}/dismiss`,
      method: 'POST',
      body: JSON.stringify(params)
    })
  }
}

export default Notifications
