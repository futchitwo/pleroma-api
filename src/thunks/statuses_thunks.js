import timelinesApi from '../api/timelines.js'
import utils from '../api/utils.js'
import Statuses from '../reducers/statuses.js'
import Users from '../reducers/users.js'
import Api from '../reducers/api.js'

import map from 'lodash/map'

const fetchTimeline = async ({ type, config, queries, fullUrl }) => {
  if (fullUrl) {
    return utils.request({
      config,
      fullUrl
    })
  }

  switch (type) {
    case 'public':
      return timelinesApi.public({ config, queries })
    case 'home':
      return timelinesApi.home({ config, queries })
    default:
      throw new Error({
        type,
        message: 'Tried to use non-supported timeline type'
      })
  }
}

const statusesThunks = {
  fetchAndAddTimeline: ({ config, timelineName, type, queries, fullUrl }) => {
    return async (dispatch, getState) => {
      const result = await fetchTimeline({ type, config, queries, fullUrl })
      if (result.state === 'ok') {
        await dispatch(Statuses.actions.addStatusesToTimeline({ statuses: result.data, timelineName }))
        const users = map(result.data, 'account')
        await dispatch(Users.actions.addUsers({ users }))

        if (result.links.prev) {
          await dispatch(Api.actions.setPrev({ timelineName, prev: result.links.prev }))
        }
        return getState()
      } else {
        return getState()
      }
    }
  }
}

export default statusesThunks
