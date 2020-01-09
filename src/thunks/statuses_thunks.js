import timelinesApi from '../api/timelines.js'
import utils from '../api/utils.js'
import statusesApi from '../api/statuses.js'
import Statuses from '../reducers/statuses.js'
import Users from '../reducers/users.js'
import Api from '../reducers/api.js'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

import map from 'lodash/map'
import last from 'lodash/last'
import has from 'lodash/has'

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
  if (!has(timeline, 'prev') && links.prev) {
    await dispatch(Api.actions.setPrev({ timelineName, prev: links.prev }))
  }
  if (!older && links.prev) {
    await dispatch(Api.actions.setPrev({ timelineName, prev: links.prev }))
  }
  if (older && links.next) {
    await dispatch(Api.actions.setNext({ timelineName, next: links.next }))
  }
}

const startLoading = (dispatch, timelineName, older) => {
  if (older) {
    dispatch(Api.actions.setLoadingOlder({ timelineName, loading: true }))
  }
}

const stopLoading = (dispatch, timelineName, older) => {
  if (older) {
    dispatch(Api.actions.setLoadingOlder({ timelineName, loading: false }))
  }
}

const statusesThunks = {
  fetchAndAddTimeline: ({ config, timelineName, type, older, queries, fullUrl }) =>
    async (dispatch, getState) => {
      // If there's no "next" url, use the oldest status as max_id in query
      if (older && !fullUrl && (!queries || !queries['max_id'])) {
        const timelineStatusIds = (getState().statuses.timelines[timelineName] || {}).statusIds || []
        queries = queries || {}
        queries['max_id'] = last(timelineStatusIds)
      }
      startLoading(dispatch, timelineName, older)
      const result = await fetchTimeline({ type, config, queries, fullUrl })
        .then(res => apiErrorCatcher(res))
      stopLoading(dispatch, timelineName, older)

      await dispatch(Statuses.actions.addStatusesToTimeline({ statuses: result.data, timelineName }))
      const users = map(result.data, 'account')
      await dispatch(Users.actions.addUsers({ users }))

      if (result.links) {
        const timeline = getState().api.timelines[timelineName] || {}
        await updateLinks(dispatch, timelineName, timeline, result.links, older)
      }
      return getState()
    },

  cropOlderStatusesFromTimeline: ({ timelineName, length }) =>
    async (dispatch, getState) => {
      await dispatch(Statuses.actions.cropOlderStatusesFromTimeline({ timelineName, length }))
      await dispatch(Api.actions.setNext({ timelineName, next: null }))
      return getState()
    },

  postStatus: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await statusesApi.post({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      await dispatch(Statuses.actions.addStatusesToTimeline({ statuses: [result.data], timelineName: 'local' }))

      if (params.in_reply_to_id) {
        const replyedStatus = await statusesApi.get({ config, params: { id: params.in_reply_to_id } })
        if (replyedStatus.state === 'ok') {
          await dispatch(Statuses.actions.addStatus({ status: replyedStatus.data }))
        } else {
          throw Error(replyedStatus.data.error || replyedStatus.state)
        }
      }
      return getState()
    }
  },

  toggleFavouritedStatus: ({ config, params, favourited }) => {
    return async (dispatch, getState) => {
      const result = favourited
        ? await statusesApi.unfavourite({ config: getConfig(getState, config), params }).then(res => apiErrorCatcher(res))
        : await statusesApi.favourite({ config: getConfig(getState, config), params }).then(res => apiErrorCatcher(res))
      await dispatch(Statuses.actions.addStatus({ status: result.data }))
      return getState()
    }
  },

  toggleRebloggedStatus: ({ config, params, reblogged }) => {
    return async (dispatch, getState) => {
      const result = reblogged
        ? await statusesApi.unreblog({ config: getConfig(getState, config), params }).then(res => apiErrorCatcher(res))
        : await statusesApi.reblog({ config: getConfig(getState, config), params }).then(res => apiErrorCatcher(res))
      await dispatch(Statuses.actions.addStatus({ status: result.data }))
      return getState()
    }
  },

  toggleMutedStatus: ({ config, params, muted }) => {
    return async (dispatch, getState) => {
      const result = muted
        ? await statusesApi.unmute({ config: getConfig(getState, config), params }).then(res => apiErrorCatcher(res))
        : await statusesApi.mute({ config: getConfig(getState, config), params }).then(res => apiErrorCatcher(res))
      await dispatch(Statuses.actions.addStatus({ status: result.data }))
      return getState()
    }
  },

  getStatusWithContext: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await Promise.all([
        statusesApi.get({ config, params }),
        statusesApi.context({ config, params })
      ]).then(res => apiErrorCatcher(res))
      const status = { ...result[0].data, context: { ...result[1].data } }

      await dispatch(Statuses.actions.addStatus({ status }))
      return getState()
    }
  },

  deleteStatus: ({ config, params }) => {
    return async (dispatch, getState) => {
      await statusesApi.delete({ config: getConfig(getState, config), params }).then(res => apiErrorCatcher(res))
      dispatch(Statuses.actions.deleteStatus({ statusId: params.id }))
      return getState()
    }
  }
}

export default statusesThunks
