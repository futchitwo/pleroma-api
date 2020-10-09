import notificationsApi from '../api/notifications.js'
import Notifications from '../reducers/notifications.js'
import Statuses from '../reducers/statuses.js'
import Users from '../reducers/users.js'
import Api from '../reducers/api'
import Reactions from '../thunks/reactions_thunks'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const notificationsThunks = {
  fetch: ({ config, fullUrl, queries }) => {
    return async (dispatch, getState) => {
      const result = await notificationsApi.list({ config: getConfig(getState, config), fullUrl, queries })
        .then(res => apiErrorCatcher(res))
      const reactionsToUpdate = []
      const statuses = result.data.reduce((prev, curr) => {
        if (curr.status) {
          prev.push(curr.status)
        }
        if (curr.type === 'pleroma:emoji_reaction') {
          const params = {
            statusId: curr.status.id,
            reblogStatusId: curr.status.reblog ? curr.status.reblog.id : null
          }
          reactionsToUpdate.push(dispatch(Reactions.getReactions({ params })))
        }
        return prev
      }, [])
      await Promise.allSettled([
        dispatch(Notifications.actions.addNotifications({ notifications: result.data })),
        dispatch(Statuses.actions.addStatuses({ statuses }))
      ])
      await Promise.all(reactionsToUpdate)
      if (result.links && result.links.prev) {
        await dispatch(Api.actions.setPrev({ entity: 'notifications', prev: result.links.prev }))
      }
      return getState()
    }
  },
  dismiss: ({ config, params }) => {
    return async (dispatch, getState) => {
      await notificationsApi.dismiss({ config: getConfig(getState, config), params })
        .then(res => apiErrorCatcher(res))
      await dispatch(Notifications.actions.read({ notificationId: params.id }))
      return getState()
    }
  },
  dismissAll: ({ config }) => {
    return async (dispatch, getState) => {
      await notificationsApi.clear({ config: getConfig(getState, config) })
        .then(res => apiErrorCatcher(res))
      await dispatch(Notifications.actions.readAll())
      return getState()
    }
  },
  read: ({ config, params }) => {
    return async (dispatch, getState) => {
      const passedParams = {}

      if (params && params.id) {
        passedParams.id = params.id
      } else if (params && params.max_id) {
        passedParams.max_id = params.max_id
      } else {
        const lastNotification = getState().api.notifications.prev
        if (lastNotification) {
          passedParams.max_id = lastNotification.min_id
        }
      }
      if (!passedParams.id && !passedParams.max_id) return getState()
      await notificationsApi.read({ config: getConfig(getState, config), params: passedParams })
        .then(res => apiErrorCatcher(res))
      if (passedParams.id) {
        await dispatch(Notifications.actions.read({ notificationId: passedParams.id }))
      } else {
        await dispatch(Notifications.actions.readAll())
      }
      const state = await getState()

      if (state.users && state.users.currentUser) {
        const oldUnreadNotificationsCount = state.users.currentUser.pleroma.unread_notifications_count
        const unreadNotificationsCount = passedParams.id && oldUnreadNotificationsCount > 1 ? oldUnreadNotificationsCount - 1 : 0
        await dispatch(Users.actions.updateUnreadNotificationsCount({ unreadNotificationsCount }))
      }
      return getState()
    }
  }
}

export default notificationsThunks
