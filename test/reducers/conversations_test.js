import Conversations from '../../src/reducers/conversations.js'

describe('Conversations reducers', () => {
  it('adds a new conversation by id', () => {
    const conversation = { id: '123' }
    const resultState = Conversations.reducer(undefined, Conversations.actions.addConversation({ conversation }))

    expect(resultState.conversationsByIds).toEqual({ 123: conversation })
    expect(resultState.list).toEqual(['123'])
  })

  it('adds in the front, keeps it unique', async () => {
    const conversationIds = ['1', '2', '3']
    let resultState = Conversations.reducer(undefined, Conversations.actions.addConversationIds({ conversationIds }))
    const moreConversationIds = ['4', '2', '3']

    resultState = Conversations.reducer(resultState, Conversations.actions.addConversationIds({ conversationIds: moreConversationIds }))

    expect(resultState.list).toEqual(['4', '2', '3', '1'])
  })

  it('adds conversations', async () => {
    const conversations = [{ id: '1' }, { id: '2' }, { id: '3' }]
    const resultState = Conversations.reducer(undefined, Conversations.actions.addConversations({ conversations }))

    expect(resultState.list).toEqual(['1', '2', '3'])
    expect(resultState.conversationsByIds).toEqual({ 1: conversations[0], 2: conversations[1], 3: conversations[2] })
  })

  it('merges new conversations', () => {
    const conversation = { id: '123', type: 'follow' }
    let resultState = Conversations.reducer(undefined, Conversations.actions.addConversations({ conversation }))
    const updatedConversation = { id: '123', type: 'follow', pleroma: {} }

    resultState = Conversations.reducer(resultState, Conversations.actions.addConversation({ conversation: updatedConversation }))

    expect(resultState.conversationsByIds).toEqual({ 123: { id: '123', type: 'follow', pleroma: {} } })
  })

  it('adds conversation ids', async () => {
    const conversationIds = ['1', '2', '3']
    const resultState = Conversations.reducer(undefined, Conversations.actions.addConversationIds({ conversationIds }))

    expect(resultState.list).toEqual(conversationIds)
  })

  it('update conversation', async () => {
    const conversation = {
      id: 1,
      timeline: [{ id: 2 }]
    }
    const resultState = Conversations.reducer(undefined, Conversations.actions.updateConversation({ conversation }))

    expect(resultState.conversationsByIds).toEqual({ 1: { id: 1, timeline: [{ id: 2 }], last_status: { id: 2 } } })
  })

  it('clear conversations', async () => {
    const initState = {
      list: ['1', '2'],
      concersationsByIds: {
        1: { id: '1' },
        2: { id: '2' }
      }
    }
    const resultState = Conversations.reducer(initState, Conversations.actions.clearConversations())

    expect(resultState.list).toEqual([])
    expect(resultState.conversationsByIds).toEqual({})
  })
})
