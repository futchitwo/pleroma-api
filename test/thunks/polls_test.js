import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import pollsThunks from '../../src/thunks/polls_thunks'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')
 
const reducer = combineReducers({
  statuses: reducers.statuses.reducer
})

describe('Polls thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('vote poll', async () => {
    const store = { state: {
      statuses: {
        statusesByIds: {
          1: {
            id: 1,
            content: undefined,
            spoiler_text: undefined,
            poll: {
              voted: false
            }
          }
        }
      }
    } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      { voted: true },
      {
        expectedUrl: `https://pleroma.soykaf.com/api/v1/polls/2/votes`,
      }
    ))

    let state = await pollsThunks.vote({ config, params: { statusId: 1, id: '2' } })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { id: 1, spoiler_text: undefined, content: undefined, poll: { voted: true }} })
  })

  it('get poll', async () => {
    const store = { state: {
      statuses: {
        statusesByIds: {
          1: {
            id: 1,
            content: undefined,
            spoiler_text: undefined,
            poll: { votes_count: 1 }
          }
        }
      }
    } }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      { votes_count: 2 },
      { expectedUrl: `https://pleroma.soykaf.com/api/v1/polls/2` }
    ))
    let state = await pollsThunks.getPoll({ config, params: { statusId: 1, id: '2' } })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 1: { id: 1, spoiler_text: undefined, content: undefined, poll: { votes_count: 2 }} })
  })
})
