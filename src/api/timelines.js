import utils from './utils.js'

const Timelines = {
  async public ({ config, queries }) {
    return utils.request({
      config,
      url: '/api/v1/timelines/public',
      queries
    })
  },
  async home ({ config, queries }) {
    return utils.request({
      config,
      url: '/api/v1/timelines/home',
      queries
    })
  }
}

export default Timelines
