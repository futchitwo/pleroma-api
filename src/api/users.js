import utils from './utils.js'

const ACCOUNTS_URL = '/api/v1/accounts'

const Users = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `${ACCOUNTS_URL}/${id}`
    })
  },
  async statuses ({ config, fullUrl, params, queries }) {
    if (fullUrl) {
      return utils.request({
        config,
        params,
        fullUrl
      })
    }
    return utils.request({
      config,
      url: `${ACCOUNTS_URL}/${params.id}/statuses`,
      queries
    })
  },
  async register ({ config, params }) {
    return utils.request({
      config,
      method: 'POST',
      url: ACCOUNTS_URL,
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
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
  },
  async updateCredentials ({ config, params }) {
    return utils.request({
      config,
      method: 'PATCH',
      url: `${ACCOUNTS_URL}/update_credentials`,
      body: params
    })
  },
  async toggleFollow ({ config, params }) {
    return utils.request({
      config,
      method: 'POST',
      url: `${ACCOUNTS_URL}/${params.id}/${params.following ? 'unfollow' : 'follow'}`
    })
  },
  async toggleMute ({ config, params }) {
    return utils.request({
      config,
      method: 'POST',
      url: `${ACCOUNTS_URL}/${params.id}/${params.muting ? 'unmute' : 'mute'}`
    })
  },
  async toggleBlock ({ config, params }) {
    return utils.request({
      config,
      method: 'POST',
      url: `${ACCOUNTS_URL}/${params.id}/${params.blocking ? 'unblock' : 'block'}`
    })
  }
}

export default Users
