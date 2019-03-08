import utils from './utils.js'

const Users = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `/api/v1/accounts/${id}`
    })
  },
  async statuses ({ config, params, queries }) {
    return utils.request({
      config,
      url: `/api/v1/accounts/${params.id}/statuses`,
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
