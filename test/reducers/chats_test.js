import Chats from '../../src/reducers/chats'

const createMessage = (chatId, id) => ({
  id: `${id}`,
  chat_id: `${chatId}`,
  account_id: '123',
  content: 'hey you',
  created_at: '2020-04-21T15:11:46.000Z',
  emojis: [
    {
      shortcode: 'firefox',
      static_url: 'https://dontbulling.me/emoji/Firefox.gif',
      url: 'https://dontbulling.me/emoji/Firefox.gif',
      visible_in_picker: true
    }
  ]
})

const createChat = (chatId) => ({
  id: `${chatId}`,
  account: {
    id: '123',
    username: 'cofe',
    acct: 'cofe@cofe.club'
  },
  unread: 2
})

describe('Chats reducers', () => {
  it('adds a new chat by id', () => {
    const chat = createChat(1)
    const resultState = Chats.reducer(undefined, Chats.actions.addChat({ chat }))

    expect(resultState.chatsByIds).toEqual({ 1: chat })
    expect(resultState.list).toEqual(['1'])
  })

  it('adds in the front, keeps it unique', async () => {
    const chatIds = ['1', '2', '3']
    let resultState = Chats.reducer(undefined, Chats.actions.addChatIds({ chatIds }))
    const moreChatIds = ['4', '2', '3']

    resultState = Chats.reducer(resultState, Chats.actions.addChatIds({ chatIds: moreChatIds }))

    expect(resultState.list).toEqual(['4', '2', '3', '1'])
  })

  it('adds chats', async () => {
    const chats = [createChat(1), createChat(2), createChat(3)]
    const resultState = Chats.reducer(undefined, Chats.actions.addChats({ chats }))

    expect(resultState.list).toEqual(['1', '2', '3'])
    expect(resultState.chatsByIds).toEqual({ 1: chats[0], 2: chats[1], 3: chats[2] })
  })

  it('merges new chats', () => {
    const chat = createChat(1)
    let resultState = Chats.reducer(undefined, Chats.actions.addChats({ chat }))
    const updatedChat = { ...chat, unread: 5 }

    resultState = Chats.reducer(resultState, Chats.actions.addChat({ chat: updatedChat }))

    expect(resultState.chatsByIds).toEqual({ 1: updatedChat })
  })

  it('adds chat ids', async () => {
    const chatIds = ['1', '2', '3']
    const resultState = Chats.reducer(undefined, Chats.actions.addChatIds({ chatIds }))

    expect(resultState.list).toEqual(chatIds)
  })

  it('update chat', async () => {
    const chat = createChat(1)
    chat.messages = [
      createMessage(1, 10),
      createMessage(1, 20)
    ]

    const resultState = Chats.reducer(undefined, Chats.actions.updateChat({ chat }))

    const expected = {
      1: {
        ...chat,
        last_message: createMessage(1, 20)
      }
    }

    expect(resultState.chatsByIds).toEqual(expected)
  })

  it('clear chats', async () => {
    const initState = {
      list: ['1', '2'],
      concersationsByIds: {
        1: { id: '1' },
        2: { id: '2' }
      }
    }
    const resultState = Chats.reducer(initState, Chats.actions.clearChats())

    expect(resultState.list).toEqual([])
    expect(resultState.chatsByIds).toEqual({})
  })
})
