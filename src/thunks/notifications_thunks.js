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
  }
}

export default notificationsThunks
