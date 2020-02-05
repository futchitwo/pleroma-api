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
})
