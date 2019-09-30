import utils from './utils'

const baseUrl = '/api/v1/media'

const Media = {
  async upload ({ config, body }) {
    return utils.request({
      config,
      method: 'POST',
      url: baseUrl,
      body
    })
  }
}

export default Media
