import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import fetch from 'cross-fetch'
import usersThunks from '../../src/thunks/users_thunks'

jest.mock('cross-fetch')

const reducer = combineReducers({
  users: reducers.users.reducer
})

describe('Users thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetch user by id', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const user = {
      id: '1',
      username: 'username'
    }
    const relationships = [{
      blocked_by: false,
      followed_by: true
    }]

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        user,
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/1' }
      ))
      .mockImplementationOnce(fetchMocker(
        relationships,
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/relationships?id=1' }
      ))
    const state = await usersThunks.fetchUser({ config, params: { id: '1' } })(dispatch, getState)

    const expectedResult = {
      id: '1',
      username: 'username',
      display_name: undefined,
      note: undefined,
      relationships: {
        blocked_by: false,
        followed_by: true
      }
    }
    expect(state.users.usersByIds)
      .toEqual({ 1: expectedResult })
  })

  it('fetch user\'s statuses', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const user = {
      id: '1',
      username: 'username'
    }
    const account2 = {
      id: '2',
      username: 'username1'
    }
    const statuses = [
      { id: 1, content: 'second status', spoiler_text: '', account: user, reblog: { account: account2 } },
      { id: 0, content: 'test status', spoiler_text: '', account: user }
    ]

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        statuses,
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/1/statuses' }
      ))
    const state = await usersThunks.fetchUserStatuses({ config, params: { id: '1' } })(dispatch, getState)

    const expectedResult = {
      1: {
        id: '1',
        username: 'username',
        display_name: '',
        note: undefined,
        statuses
      },
      2: {
        id: '2',
        username: 'username1',
        display_name: '',
        note: undefined
      }
    }
    expect(state.users.usersByIds)
      .toEqual(expectedResult)
  })

  it('fetch user\'s followers', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state
    const followers = [
      { id: 1, acct: 'user1' },
      { id: 0, acct: 'user2' }
    ]

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        followers,
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/2/followers' }
      ))
    const state = await usersThunks.fetchUserFollowers({ config, params: { id: '2' } })(dispatch, getState)

    const expectedResult = {
      0: { id: 0, acct: 'user2', display_name: undefined, note: undefined },
      1: { id: 1, acct: 'user1', display_name: undefined, note: undefined },
      2: { followers: [1, 0], display_name: undefined, note: undefined }
    }

    expect(state.users.usersByIds)
      .toEqual(expectedResult)
  })

  it('fetch user\'s following', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state
    const following = [
      { id: 1, acct: 'user1' },
      { id: 0, acct: 'user2' }
    ]

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        following,
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/2/following' }
      ))
    const state = await usersThunks.fetchUserFollowing({ config, params: { id: '2' } })(dispatch, getState)

    const expectedResult = {
      0: { id: 0, acct: 'user2', display_name: undefined, note: undefined },
      1: { id: 1, acct: 'user1', display_name: undefined, note: undefined },
      2: { following: [1, 0], display_name: undefined, note: undefined }
    }

    expect(state.users.usersByIds)
      .toEqual(expectedResult)
  })

  it('follow user', async () => {
    const store = {
      state: {
        users: {
          usersByIds: {
            1: {
              id: '1',
              relationships: { following: false }
            }
          }
        }
      }
    }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { following: true },
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/1/follow' }
      ))
    const { state } = await usersThunks.toggleFollowState({ config, params: { id: '1', following: false } })(dispatch, getState)

    const expectedResult = {
      id: '1',
      relationships: {
        following: true
      }
    }
    expect(state.users.usersByIds)
      .toEqual({ 1: expectedResult })
  })
  it('unmute user', async () => {
    const store = {
      state: {
        users: {
          usersByIds: {
            1: {
              id: '1',
              relationships: { muting: true }
            }
          }
        }
      }
    }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { muting: false },
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/1/unmute' }
      ))
    const { state } = await usersThunks.toggleMuteState({ config, params: { id: '1', muting: true } })(dispatch, getState)

    const expectedResult = {
      id: '1',
      relationships: {
        muting: false
      }
    }
    expect(state.users.usersByIds)
      .toEqual({ 1: expectedResult })
  })
  it('block user', async () => {
    const store = {
      state: {
        users: {
          usersByIds: {
            1: {
              id: '1',
              relationships: { blocking: false }
            }
          }
        }
      }
    }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { blocking: true },
        { expectedUrl: 'https://pleroma.soykaf.com/api/v1/accounts/1/block' }
      ))
    const { state } = await usersThunks.toggleBlockState({ config, params: { id: '1', blocking: false } })(dispatch, getState)

    const expectedResult = {
      id: '1',
      relationships: {
        blocking: true
      }
    }
    expect(state.users.usersByIds)
      .toEqual({ 1: expectedResult })
  })

  it('add permission group', async () => {
    const store = {
      state: {
        users: {
          usersByIds: {
            1: {
              id: '1',
              acct: 'nd',
              pleroma: { is_admin: false }
            }
          }
        }
      }
    }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { is_admin: true },
        { expectedUrl: 'https://pleroma.soykaf.com/api/pleroma/admin/users/nd/permission_group/admin' }
      ))
    const state = await usersThunks.togglePermissionGroup({ config, params: { user: { id: '1', acct: 'nd' }, permission_group: 'admin' } })(dispatch, getState)

    const expectedResult = {
      id: '1',
      acct: 'nd',
      pleroma: {
        is_admin: true
      }
    }
    expect(state.users.usersByIds)
      .toEqual({ 1: expectedResult })
  })
})
