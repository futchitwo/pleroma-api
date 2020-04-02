export const ENTITIES = {
  conversations: {
    name: 'conversations',
    thunk: 'fetch'
  },
  notifications: {
    name: 'notifications',
    thunk: 'fetch'
  },
  userStatuses: {
    name: 'users',
    thunk: 'fetchUserStatuses',
    clearLinksOnStop: true
  },
  conversation: {
    name: 'conversation',
    module: 'conversations',
    thunk: 'fetchConversationTimeline',
    clearLinksOnStop: true
  },
  tagTimeline: {
    name: 'tagTimeline',
    module: 'tags',
    thunk: 'fetch',
    clearLinksOnStop: true,
    clearThunk: 'clear'
  }
}
