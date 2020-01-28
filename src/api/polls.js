import utils from './utils'

const POLLS_URL = '/api/v1/polls'

const Polls = {
  async get ({ config, params: { id } }) {
    return utils.request({
      config,
      method: 'GET',
      url: `${POLLS_URL}/${id}`
    })
  },
  async vote ({ config, params: { id } }) {
    return utils.request({
      config,
      method: 'GET',
      url: `${POLLS_URL}/${id}/votes`
    })
  }
}

export default Polls
