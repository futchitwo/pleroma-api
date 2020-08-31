import utils from './utils.js'
import { createFormData } from '../utils/api_utils.js'

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
  async favouritedBy ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${STATUSES_URL}/${id}/favourited_by`
    })
  },
  async rebloggedBy ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${STATUSES_URL}/${id}/reblogged_by`
    })
  },
  async post ({ config, params }) {
    const body = createFormData(params)

    return utils.request({
      config,
      url: STATUSES_URL,
      method: 'POST',
      body
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
