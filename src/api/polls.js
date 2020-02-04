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
  async vote ({ config, params: { id, choices } }) {
    return utils.request({
      config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: `${POLLS_URL}/${id}/votes`,
      body: JSON.stringify({ choices })
    })
  }
}

export default Polls
