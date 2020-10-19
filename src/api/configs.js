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
  async getNodeinfoSchemes ({ config }) {
    return utils.request({
      config,
      url: `/.well-known/nodeinfo`
    })
  },
  async getInstanceNodeinfo ({ config, params, fullUrl }) {
    if (fullUrl) {
      return utils.request({
        config,
        fullUrl
      })
    }
    return utils.request({
      config,
      url: `/nodeinfo/${params.version}.json`
    })
  },
  async getInstanceConfigurations ({ config }) {
    return this.getNodeinfoSchemes({ config })
      .then(({ data }) => {
        if (data.links) {
          return Promise.allSettled(data.links.map(link => this.getInstanceNodeinfo({ config, fullUrl: link.href })))
        } else {
          return {}
        }
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
  },
  async getRemoteInstances ({ config }) {
    return utils.request({
      config,
      url: '/api/v1/instance/peers'
    })
  }
}

export default Configs
