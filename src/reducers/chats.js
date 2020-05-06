import { map, reduce, uniq, uniqBy } from 'lodash'

export const initialState = {
  list: [],
  chatsByIds: {}
}

const addChatIds = (state, { chatIds }) => {
  return {
    ...state,
    list: uniq([...chatIds, ...state.list])
  }
}

const addChats = (state, { chats }) => {
  const newChats = reduce(chats, (result, chat) => {
    result[chat.id] = { ...state.chatsByIds[chat.id], ...chat }
    return result
  }, {})

  const newState = {
    ...state,
    chatsByIds: {
      ...state.chatsByIds,
      ...newChats
    }
  }
  const chatIds = map(chats, 'id')

  return addChatIds(newState, { chatIds })
}

const addChat = (state, { chat }) => {
  return addChats(state, { chats: [chat] })
}

const updateChat = (state, { chat, older }) => {
  const currentChatState = state.chatsByIds[chat.id] || {}

  const messages = chat.messages || []
  const currentMessages = currentChatState.messages || []
  const newMessages = older ? currentChatState.messages.concat(messages) : messages.concat(currentMessages)

  const newChatState = {
    ...currentChatState,
    ...chat,
    last_message: newMessages.length ? newMessages[newMessages.length - 1] : {},
    messages: uniqBy(newMessages, (msg) => msg.id)
  }

  return {
    ...state,
    chatsByIds: {
      ...state.chatsByIds,
      [chat.id]: newChatState
    }
  }
}

const clearChats = (state) => {
  return {
    ...state,
    list: [],
    chatsByIds: {}
  }
}

const reducers = {
  addChatIds,
  addChats,
  addChat,
  clearChats,
  updateChat
}

const actions = {
  addChatIds: ({ chatIds }) => {
    return {
      type: 'addChatIds',
      payload: { chatIds }
    }
  },
  addChats: ({ chats }) => {
    return {
      type: 'addChats',
      payload: { chats }
    }
  },
  addChat: ({ chat }) => {
    return {
      type: 'addChat',
      payload: { chat }
    }
  },
  clearChats: () => {
    return {
      type: 'clearChats'
    }
  },
  updateChat: ({ chat }) => {
    return {
      type: 'updateChat',
      payload: { chat }
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
