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
  }
}

export default Configs
