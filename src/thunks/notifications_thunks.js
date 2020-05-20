import notificationsApi from '../api/notifications.js'
import Notifications from '../reducers/notifications.js'
import Api from '../reducers/api'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const notificationsThunks = {
  fetch: ({ config, fullUrl, queries }) => {
    return async (dispatch, getState) => {
      const result = await notificationsApi.list({ config: getConfig(getState, config), fullUrl, queries })
        .then(res => apiErrorCatcher(res))
      await dispatch(Notifications.actions.addNotifications({ notifications: result.data }))
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
      return getState()
    }
  }
}

export default notificationsThunks
