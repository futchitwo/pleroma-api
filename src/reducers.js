import statuses from './reducers/statuses'
import users from './reducers/users'
import notifications from './reducers/notifications'
import api from './reducers/api.js'
import conversations from './reducers/conversations'
import config from './reducers/config'
import followRequests from './reducers/follow_requests'

const reducers = {
  statuses,
  users,
  notifications,
  api,
  conversations,
  config,
  followRequests
}

export default reducers
