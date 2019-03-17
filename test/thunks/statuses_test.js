import { combineReducers } from 'redux'
import reducers from '../../src/reducers.js'
import statusesThunks from '../../src/thunks/statuses_thunks.js'
import fetchMocker from '../api/fetch_mocker.js'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  statuses: reducers.statuses.reducer,
  users: reducers.users.reducer
})

describe('Status thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetches the public timeline and adds it to the', async () => {
    const store = { state: undefined }
    const timelineName = 'public'
    const type = 'public'

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
      return store.state
    }

    const getState = () => store.state

    const user = {
      id: '1'
    }

    const statuses = [
      { id: '1', account: user },
      { id: '2', account: user }
    ]

    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/timelines/public`,
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))

    let state = await statusesThunks.fetchAndAddTimeline({ config, timelineName, type })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: statuses[0], 2: statuses[1] })

    expect(state.statuses.timelines.public.statusIds)
      .toEqual(['1', '2'])

    expect(state.users.usersByIds)
      .toEqual({
        [user.id]: user
      })
  })
})
