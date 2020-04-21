import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import configThunks from '../../src/thunks/config_thunks'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')

const reducer = combineReducers({
  config: reducers.config.reducer,
})

describe('Config thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetch config', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      { theme: 'pleroma-dark' },
      { expectedUrl: `https://pleroma.soykaf.com/static/config.json` }
    ))

    let state = await configThunks.fetchConfig({ config })(dispatch, getState)

    expect(state.config.settings)
      .toEqual({ theme: 'pleroma-dark' })
  })
})
