import timelinesApi from '../api/timelines.js'
import Statuses from '../reducers/statuses.js'
import Users from '../reducers/users.js'

import map from 'lodash/map'

const statusesThunks = {
  fetchAndAddTimeline: ({ config, timelineName, type, queries }) => {
    return async (dispatch, getState) => {
      const result = await timelinesApi.public({ config, queries })
      if (result.state === 'ok') {
        await dispatch(Statuses.actions.addStatusesToTimeline({ statuses: result.data, timelineName }))
        const users = map(result.data, 'account')
        await dispatch(Users.actions.addUsers({ users }))
        return getState()
      } else {
        return getState()
      }
    }
  }
}

export default statusesThunks
