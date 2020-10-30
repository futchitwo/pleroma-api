import statuses from './thunks/statuses_thunks'
import notifications from './thunks/notifications_thunks'
import followRequests from './thunks/follow_requests_thunks'
import api from './thunks/api_thunks'
import users from './thunks/users_thunks'
import conversations from './thunks/conversations_thunks'
import chats from './thunks/chats_thunks'
import tags from './thunks/tags_thunks'
import polls from './thunks/polls_thunks'
import config from './thunks/config_thunks'
import reactions from './thunks/reactions_thunks'

export default {
  statuses,
  notifications,
  followRequests,
  api,
  users,
  conversations,
  chats,
  tags,
  polls,
  config,
  reactions
}
