import utils from './utils.js'

const ACCOUNTS_URL = '/api/v1/accounts'

const Users = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${ACCOUNTS_URL}/${id}`
    })
  },
  async statuses ({ config, params, queries }) {
    return utils.request({
      config,
      url: `${ACCOUNTS_URL}/${params.id}/statuses`,
      queries
    })
  },
  async relationships ({ config, queries }) {
    return utils.request({
      config,
      url: `${ACCOUNTS_URL}/relationships`,
      queries
    })
  },
  async verifyCredentials ({ config }) {
    return utils.request({
      config,
      url: `${ACCOUNTS_URL}/verify_credentials`
    })
  }
}

export default Users
