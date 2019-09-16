import notificationsApi from '../api/notifications.js'
import Notifications from '../reducers/notifications.js'
import Api from '../reducers/api'

const notificationsThunks = {
  fetchNotifications: ({ config, fullUrl, queries }) => {
    return async (dispatch, getState) => {
      const result = await notificationsApi.list({ config, fullUrl, queries })
      if (result.state === 'ok') {
        await dispatch(Notifications.actions.addNotifications({ notifications: result.data }))
        if (result.links && result.links.prev) {
          await dispatch(Api.actions.setPrev({ notifications: true, prev: result.links.prev }))
        }
        return getState()
      }
      return getState()
    }
  }
}

export default notificationsThunks
