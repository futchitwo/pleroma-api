import utils from './utils.js'

const baseUrl = '/api/v1/accounts'
const Users = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${baseUrl}/${id}`
    })
  },
  async statuses ({ config, params, queries }) {
    return utils.request({
      config,
      url: `${baseUrl}/${params.id}/statuses`,
      queries
    })
  },
  async relationships ({ config, queries }) {
    return utils.request({
      config,
      url: `${baseUrl}/relationships`,
      queries
    })
  },
  async verifyCredentials ({ config }) {
    return utils.request({
      config,
      url: '/api/v1/accounts/verify_credentials'
    })
  }
}

export default Users
