import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import fetch from 'cross-fetch'
import reactionsThunks from '../../src/thunks/reactions_thunks'

jest.mock('cross-fetch')

const reducer = combineReducers({
  statuses: reducers.statuses.reducer,
  users: reducers.users.reducer
})

describe('Reactions thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('react to a status', async () => {
    const store = { state: { statuses: { statusesByIds: {
      '21': {
        id: '21',
        content: '',
        spoiler_text: '',
      }
    } } } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      {
        id: '21',
        content: '',
        spoiler_text: '',
        pleroma: {
          emoji_reactions: [{count: 1, me: true, name: "😃"}]
        }
      },
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/statuses/21/reactions/%F0%9F%98%83`,
      }
    ))

    let state = await reactionsThunks.toggleReaction({ config, params: { statusId: '21', emoji: '%F0%9F%98%83' }, reacted: false })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ '21': {
        id: '21',
        content: '',
        spoiler_text: '',
        pleroma: {
          emoji_reactions: [{ count: 1, me: true, name: "😃", accounts: null }]
        }
      }})
  })
  it('remove reaction from status', async () => {
    const store = { state: { statuses: { statusesByIds: {
      '21': {
        id: '21',
        content: '',
        spoiler_text: '',
        pleroma: {
          emoji_reactions: [{count: 1, me: true, name: "😃"}]
        }
      }
    } } } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      {
        id: '21',
        content: '',
        spoiler_text: '',
        pleroma: {
          emoji_reactions: []
        }
      },
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/statuses/21/reactions/%F0%9F%98%83`,
      }
    ))

    let state = await reactionsThunks.toggleReaction({ config, params: { statusId: '21', emoji: '%F0%9F%98%83' }, reacted: true })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ '21': {
        id: '21',
        content: '',
        spoiler_text: '',
        pleroma: {
          emoji_reactions: []
        }
      }})
  })
  it('get reactions of status', async () => {
    const store = { state: { statuses: { statusesByIds: {
      '21': {
        id: '21',
        content: '',
        spoiler_text: '',
        pleroma: {
          emoji_reactions: [{count: 1, me: true, name: "😃"}]
        }
      }
    } } } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      [{count: 1, me: true, name: "😃", accounts: [{ id: 'id1', acct: 'name1' }, { id: 'id2', acct: 'name2' }] }],
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/statuses/21/reactions`,
      }
    ))

    let state = await reactionsThunks.getReactions({ config, params: { statusId: '21' } })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ '21': {
        id: '21',
        content: '',
        spoiler_text: '',
        pleroma: {
          emoji_reactions: [{count: 1, me: true, name: "😃", accounts: [{ id: 'id1', acct: 'name1' }, { id: 'id2', acct: 'name2' }] }]
        }
      }})
  })
  it(`get reactions of user's status`, async () => {
    const store = { state: { users: { usersByIds: {
      '1': {
        id: '1',
        acct: 'user',
        display_name: 'user',
        statuses: [
          {
            id: '21',
            content: '',
            spoiler_text: '',
            pleroma: {
              emoji_reactions: [{count: 1, me: true, name: "😃"}]
            }
          }
        ]
      } } } } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const accounts = [{ id: 'id1', acct: 'name1' }, { id: 'id2', acct: 'name2' }] 
    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      [{count: 1, me: true, name: "😃", accounts }],
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/pleroma/statuses/21/reactions`,
      }
    ))

    let state = await reactionsThunks.getReactions({ config, params: { statusId: '21', userId: '1' } })(dispatch, getState)

    expect(state.users.usersByIds['1'])
      .toEqual({
        id: '1',
        acct: 'user',
        display_name: 'user',
        statuses: [
          {
            id: '21',
            content: '',
            spoiler_text: '',
            pleroma: {
              emoji_reactions: [{count: 1, me: true, name: "😃", accounts }]
            }
          }
        ]
      })
  })
})
