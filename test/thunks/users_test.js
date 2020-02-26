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
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1` }
      ))
      .mockImplementationOnce(fetchMocker(
        relationships,
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/relationships?id=1` }
      ))
    let state = await usersThunks.fetchUser({ config, params: { id: '1' } })(dispatch, getState)

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

  it('follow user', async () => {
    const store = { state: {
      users: {
        usersByIds: {
          '1': {
            id: '1',
            relationships: { following: false }
          }
        }
      }
    } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { following: true },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/follow` }
      ))
    let state = await usersThunks.toggleFollowState({ config, params: { id: '1', following: false } })(dispatch, getState)

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
    const store = { state: {
      users: {
        usersByIds: {
          '1': {
            id: '1',
            relationships: { muting: true }
          }
        }
      }
    } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { muting: false },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/unmute` }
      ))
    let state = await usersThunks.toggleMuteState({ config, params: { id: '1', muting: true } })(dispatch, getState)

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
    const store = { state: {
      users: {
        usersByIds: {
          '1': {
            id: '1',
            relationships: { blocking: false }
          }
        }
      }
    } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch
      .mockImplementationOnce(fetchMocker(
        { blocking: true },
        { expectedUrl: `https://pleroma.soykaf.com/api/v1/accounts/1/block` }
      ))
    let state = await usersThunks.toggleBlockState({ config, params: { id: '1', blocking: false } })(dispatch, getState)

    const expectedResult = {
      id: '1',
      relationships: {
        blocking: true
      }
    }
    expect(state.users.usersByIds)
      .toEqual({ 1: expectedResult })
  })
})
