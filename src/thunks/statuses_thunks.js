import timelinesApi from '../api/timelines.js'
import utils from '../api/utils.js'
import statusesApi from '../api/statuses.js'
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

const updateLinks = async (dispatch, timelineName, timeline, links, older) => {
  if (!timeline.prev && links.prev) {
    await dispatch(Api.actions.setPrev({ timelineName, prev: links.prev }))
  }
  if (!timeline.next && links.next) {
    await dispatch(Api.actions.setNext({ timelineName, next: links.next }))
  }
  if (!older && links.prev) {
    await dispatch(Api.actions.setPrev({ timelineName, prev: links.prev }))
  }
  if (older && links.next) {
    await dispatch(Api.actions.setNext({ timelineName, next: links.next }))
  }
}

const statusesThunks = {
  fetchAndAddTimeline: ({ config, timelineName, type, older, queries, fullUrl }) =>
    async (dispatch, getState) => {
      dispatch(Api.actions.setLoading({ timelineName, older, loading: true }))
      const result = await fetchTimeline({ type, config, queries, fullUrl })
      dispatch(Api.actions.setLoading({ timelineName, older, loading: false }))
      if (result.state === 'ok') {
        await dispatch(Statuses.actions.addStatusesToTimeline({ statuses: result.data, timelineName }))
        const users = map(result.data, 'account')
        await dispatch(Users.actions.addUsers({ users }))

        if (result.links) {
          const timeline = getState().api.timelines[timelineName] || {}
          await updateLinks(dispatch, timelineName, timeline, result.links, older)
        }
        return getState()
      } else {
        return getState()
      }
    },

  postStatus: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await statusesApi.post({ config, params })
      if (result.state === 'ok') {
        await dispatch(Statuses.actions.addStatusesToTimeline({ statuses: [result.data], timelineName: 'local' }))
      } else {
        throw Error(result.data.error || result.state)
      }
      return getState()
    }
  }
}

export default statusesThunks
