import utils from './utils.js'

const TIMELINES_URL = '/api/v1/timelines'

const Timelines = {
  async public ({ config, queries }) {
    return utils.request({
      config,
      url: `${TIMELINES_URL}/public`,
      queries
    })
  },
  async home ({ config, queries }) {
    return utils.request({
      config,
      url: `${TIMELINES_URL}/home`,
      queries
    })
  },
  async tag ({ config, queries, params, fullUrl }) {
    if (fullUrl) {
      return utils.request({
        config,
        queries,
        fullUrl
      })
    }
    return utils.request({
      config,
      url: `${TIMELINES_URL}/tag/${params.tag}`,
      queries
    })
  }
}

export default Timelines
