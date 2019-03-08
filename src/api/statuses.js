import utils from './utils.js'

const Statuses = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `/api/v1/statuses/${id}`
    })
  },
  async context ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `/api/v1/statuses/${id}/context`
    })
  },
  async favourite ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `/api/v1/statuses/${id}/favourite`
    })
  },
  async unfavourite ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `/api/v1/statuses/${id}/unfavourite`
    })
  },
  async reblog ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `/api/v1/statuses/${id}/reblog`
    })
  },
  async unreblog ({ config, params: { id } }) {
    return utils.request({
      method: 'POST',
      config,
      url: `/api/v1/statuses/${id}/unreblog`
    })
  },
  async post ({ config, params }) {
    return utils.request({
      config,
      url: '/api/v1/statuses',
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export default Statuses
