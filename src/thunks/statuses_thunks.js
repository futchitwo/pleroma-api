import timelinesApi from '../api/timelines.js'
import utils from '../api/utils.js'
import statusesApi from '../api/statuses.js'
import Statuses from '../reducers/statuses.js'
import Users from '../reducers/users.js'
import Api from '../reducers/api.js'
import Conversations from '../thunks/conversations_thunks'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'
import last from 'lodash/last'
import has from 'lodash/has'
import { getUsersFromStatusesList } from '../utils/users_utils.js'

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
      await dispatch(Users.actions.addUsers({ users: getUsersFromStatusesList(result.data) }))

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

  postStatus: ({ config, params, conversationId }) => {
    return async (dispatch, getState) => {
      const result = await statusesApi.post({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      if (conversationId) {
        await Conversations.fetchConversationTimeline({ config, params: { id: conversationId } })(dispatch, getState)
      } else {
        await dispatch(Statuses.actions.addStatusesToTimeline({ statuses: [result.data], timelineName: 'local' }))
      }

      if (params.in_reply_to_id) {
        const replyedStatus = await statusesApi.get({ config: getConfig(getState, config), params: { id: params.in_reply_to_id } })
          .then(res => apiErrorCatcher(res))
        await dispatch(Statuses.actions.addStatus({ status: replyedStatus.data }))
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
        statusesApi.get({ config: getConfig(getState, config), params }),
        statusesApi.context({ config: getConfig(getState, config), params })
      ]).then(res => apiErrorCatcher(res))
      const status = { ...result[0].data, context: { ...result[1].data } }

      await dispatch(Statuses.actions.addStatus({ status }))
      return getState()
    }
  },

  getStatusLists: ({ config, params }) => {
    return async (dispatch, getState) => {
      const result = await Promise.all([
        statusesApi.favouritedBy({ config: getConfig(getState, config), params }),
        statusesApi.rebloggedBy({ config: getConfig(getState, config), params })
      ]).then(res => apiErrorCatcher(res))
      const status = {
        id: params.id,
        favourited_by: result[0].data,
        reblogged_by: result[1].data
      }
      if (result[0].data.length) {
        status.favourites_count = result[0].data.length
      }
      if (result[1].data.length) {
        status.reblogs_count = result[1].data.length
      }
      if (params.userId) {
        await dispatch(Users.actions.updateUserStatus({ status, userId: params.userId }))
      } else {
        await dispatch(Statuses.actions.addStatus({ status }))
      }

      return getState()
    }
  },

  deleteStatus: ({ config, params }) => {
    return async (dispatch, getState) => {
      const computedConfig = getConfig(getState, config)
      if (params.reblogId) {
        await statusesApi.unreblog({ config: computedConfig, params }).then(res => apiErrorCatcher(res))
      } else {
        await statusesApi.delete({ config: computedConfig, params }).then(res => apiErrorCatcher(res))
      }
      const status = getState().statuses.statusesByIds[params.reblogId || params.id]

      if (status.poll) {
        const poll = getState().api.polls[params.id] || {}

        poll.fetcher && poll.fetcher.stop()
      }
      dispatch(Statuses.actions.deleteStatus({ statusId: params.reblogId || params.id }))
      if (params.userId) {
        dispatch(Users.actions.deleteUserStatus({ statusId: params.id, userId: params.userId }))
      }
      return getState()
    }
  }
}

export default statusesThunks
