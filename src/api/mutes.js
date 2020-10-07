import utils from './utils'

const MUTES_URL = '/api/v1/mutes'

const Mutes = {
  async list ({ config, queries }) {
    return utils.request({
      config,
      queries,
      method: 'GET',
      url: MUTES_URL
    })
  }
}

export default Mutes
