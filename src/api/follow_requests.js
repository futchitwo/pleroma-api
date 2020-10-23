import utils from './utils'

const baseUrl = '/api/v1/follow_requests'

const FollowRequests = {
  async getPendingFollows ({ config }) {
    return utils.request({
      config,
      method: 'GET',
      url: baseUrl
    })
  },
  async acceptFollow ({ config, params }) {
    return utils.request({
      config,
      method: 'POST',
      url: `${baseUrl}/${params.id}/authorize`
    })
  },
  async rejectFollow ({ config, params }) {
    return utils.request({
      config,
      method: 'POST',
      url: `${baseUrl}/${params.id}/reject`
    })
  }
}

export default FollowRequests
