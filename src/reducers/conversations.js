import { map, reduce, uniq } from 'lodash'

const initialState = {
  list: [],
  conversationsByIds: {}
}

const addConversations = (state, { conversations }) => {
  const newConversations = reduce(conversations, (result, conversation) => {
    result[conversation.id] = { ...state.conversationsByIds[conversation.id], ...conversation }
    return result
  }, {})

  const newState = {
    ...state,
    conversationsByIds: {
      ...state.conversationsByIds,
      ...newConversations
    }
  }
  const conversationIds = map(conversations, 'id')

  return addConversationIds(newState, { conversationIds })
}

const addConversationIds = (state, { conversationIds }) => {
  return {
    ...state,
    list: uniq([...conversationIds, ...state.list])
  }
}

const addConversation = (state, { conversation }) => {
  return addConversations(state, { conversations: [conversation] })
}

const updateConversation = (state, { conversation }) => {
  return {
    ...state,
    conversationsByIds: {
      ...state.conversationsByIds,
      [conversation.id]: conversation
    }
  }
}

const clearConversations = (state) => {
  return {
    ...state,
    list: [],
    conversationsByIds: {}
  }
}

const reducers = {
  addConversations,
  addConversationIds,
  addConversation,
  updateConversation,
  clearConversations
}

const actions = {
  addConversations: ({ conversations }) => {
    return {
      type: 'addConversations',
      payload: { conversations }
    }
  },
  addConversationIds: ({ conversationIds }) => {
    return {
      type: 'addConversationIds',
      payload: { conversationIds }
    }
  },
  addConversation: ({ conversation }) => {
    return {
      type: 'addConversation',
      payload: { conversation }
    }
  },
  updateConversation: ({ conversation }) => {
    return {
      type: 'updateConversation',
      payload: { conversation }
    }
  },
  clearConversations: () => {
    return {
      type: 'clearConversations'
    }
  }
}

const reducer = (state = initialState, action) => {
  const fn = reducers[action.type] || ((state) => state)
  return fn(state, action.payload)
}

export default {
  reducer,
  actions
}
