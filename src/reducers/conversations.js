import { map, reduce, uniq, uniqBy } from 'lodash'

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

const updateConversation = (state, { conversation, older }) => {
  const currentConversationState = state.conversationsByIds[conversation.id] || {}

  const timeline = conversation.timeline ? conversation.timeline : []
  const currentTimeline = currentConversationState.timeline ? currentConversationState.timeline : []
  const newTimeline = older ? timeline.concat(currentConversationState.timeline) : currentTimeline.concat(timeline)

  const newConversationState = {
    ...currentConversationState,
    ...conversation,
    last_status: newTimeline.length ? newTimeline[newTimeline.length - 1] : {},
    timeline: uniqBy(newTimeline, (e) => e.id)
  }
  return {
    ...state,
    conversationsByIds: {
      ...state.conversationsByIds,
      [conversation.id]: newConversationState
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
  updateConversation: ({ conversation, older }) => {
    return {
      type: 'updateConversation',
      payload: { conversation, older }
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
