import utils from './utils'

const BLOCKS_URL = '/api/v1/blocks'
const DOMAIN_BLOCKS_URL = '/api/v1/domain_blocks'

const Blocks = {
  async list ({ config, queries }) {
    return utils.request({
      config,
      queries,
      method: 'GET',
      url: BLOCKS_URL
    })
  },
  async listDomainBlocks ({ config, queries }) {
    return utils.request({
      config,
      queries,
      method: 'GET',
      url: DOMAIN_BLOCKS_URL
    })
  },
  async blockDomain ({ config, params }) {
    return utils.request({
      config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: DOMAIN_BLOCKS_URL,
      body: JSON.stringify(params)
    })
  },
  async unblockDomain ({ config, params }) {
    return utils.request({
      config,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: DOMAIN_BLOCKS_URL,
      body: JSON.stringify(params)
    })
  }
}

export default Blocks
