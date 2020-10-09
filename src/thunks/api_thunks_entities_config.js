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
  chats: {
    name: 'chats',
    module: 'chats',
    thunk: 'fetch'
  },
  chat: {
    name: 'chat',
    module: 'chats',
    thunk: 'fetchChatMessages'
  },
  tagTimeline: {
    name: 'tagTimeline',
    module: 'tags',
    thunk: 'fetch',
    clearLinksOnStop: true,
    clearThunk: 'clear'
  }
}

export const LOAD_OLDER_USER_FIELDS_CONFIG = {
  followers: {
    reducerField: 'userFollowers',
    thunk: 'fetchUserFollowers'
  },
  following: {
    reducerField: 'userFollowing',
    thunk: 'fetchUserFollowing'
  }
}
