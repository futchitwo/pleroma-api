import utils from './utils.js'

const STATUSES_URL = '/api/v1/statuses'

const Statuses = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${STATUSES_URL}/${id}`
    })
  },
  async context ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${STATUSES_URL}/${id}/context`
    })
  },
  async favourite ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `${STATUSES_URL}/${id}/favourite`
    })
  },
  async unfavourite ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `${STATUSES_URL}/${id}/unfavourite`
    })
  },
  async reblog ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `${STATUSES_URL}/${id}/reblog`
    })
  },
  async unreblog ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `${STATUSES_URL}/${id}/unreblog`
    })
  },
  async mute ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `${STATUSES_URL}/${id}/mute`
    })
  },
  async unmute ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `${STATUSES_URL}/${id}/unmute`
    })
  },
  async post ({ config, params }) {
    return utils.request({
      config,
      url: STATUSES_URL,
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  async delete ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${STATUSES_URL}/${id}`,
      method: 'DELETE'
    })
  }
}

export default Statuses
