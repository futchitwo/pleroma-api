import utils from './utils'

const baseUrl = '/api/pleroma'

const Configs = {
  async getCaptcha ({ config }) {
    return utils.request({
      config,
      method: 'GET',
      url: `${baseUrl}/captcha`
    })
  },
  async getFrontendConfigurations ({ config }) {
    return utils.request({
      config,
      url: `${baseUrl}/frontend_configurations`
    })
  },
  async getInstanceConfigurations ({ config }) {
    return utils.request({
      config,
      url: `/nodeinfo/2.1.json`
    })
  },
  async getConfig ({ config }) {
    return utils.request({
      config,
      url: `/static/config.json`
    })
  },
  async getStatusnetConfig ({ config }) {
    return utils.request({
      config,
      url: '/api/statusnet/config.json'
    })
  },
  async getCustomEmojis ({ config }) {
    return utils.request({
      config,
      url: `/api/v1/custom_emojis`
    })
  }
}

export default Configs
