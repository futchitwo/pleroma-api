import utils from './utils'

const createEmojiReactionsUrl = (statusId) => `/api/v1/pleroma/statuses/${statusId}/reactions`

const Reactions = {
  async react ({ config, params }) {
    return utils.request({
      method: 'PUT',
      config,
      url: `${createEmojiReactionsUrl(params.statusId)}/${params.emoji}`
    })
  },
  async delete ({ config, params }) {
    return utils.request({
      method: 'DELETE',
      config,
      url: `${createEmojiReactionsUrl(params.statusId)}/${params.emoji}`
    })
  },
  async list ({ config, params }) {
    return utils.request({
      url: createEmojiReactionsUrl(params.statusId),
      config
    })
  },
  async get ({ config, params }) {
    return utils.request({
      url: `${createEmojiReactionsUrl(params.statusId)}/${params.emoji}`,
      config
    })
  }
}

export default Reactions
