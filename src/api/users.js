import utils from './utils.js'

const Users = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      url: `/api/v1/accounts/${id}`
    })
  },
  async statuses ({ config, params }) {
    const data = await utils.request({
      config,
      url: `/api/v1/accounts/${params.id}/statuses`,
      params
    })

    const statuses = await data.json()
    const links = parseLinkHeader(data.headers.get('link'))

    return { statuses, links }
  },
  async verifyCredentials ({ config, params: { accessToken } }) {
    const data = await utils.request({
      config,
      url: '/api/v1/accounts/verify_credentials'
    })
    return data.json()
  }
}

export default Users
