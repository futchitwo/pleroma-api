import { combineReducers } from 'redux'
import reducers from '../../src/reducers'
import fetchMocker from '../api/fetch_mocker'
import fetch from 'cross-fetch'
import tagsThunks from '../../src/thunks/tags_thunks'

jest.mock('cross-fetch')

const reducer = combineReducers({
  api: reducers.api.reducer,
  statuses: reducers.statuses.reducer
})

describe('Tags thunks', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('fetch tagTimeline', async () => {
    const store = { state: undefined }
    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const statuses = [
      {
        id: 21,
        content: '',
        spoiler_text: ''
      },
      {
        id: 23,
        content: '',
        spoiler_text: ''
      }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/tag/tagname',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?min_id=16>; rel="prev"'
        }
      }
    ))

    const state = await tagsThunks.fetch({ config, params: { tag: 'tagname' } })(dispatch, getState)

    expect(state.statuses.statusesByIds)
      .toEqual({ 21: statuses[0], 23: statuses[1] })

    expect(state.statuses.tag)
      .toEqual([23, 21])

    expect(state.api.tagTimeline.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?min_id=16'
      })
  })

  it('fetcher a tagTimeline by a full url', async () => {
    const store = { state: undefined }

    const dispatch = (action) => {
      store.state = reducer(store.state, action)
    }
    const getState = () => store.state

    const statuses = [
      {
        id: 21,
        content: '',
        spoiler_text: ''
      },
      {
        id: 23,
        content: '',
        spoiler_text: ''
      }
    ]

    fetch.mockReset()
    fetch.mockImplementationOnce(fetchMocker(
      statuses,
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/tag/tagname',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?max_id=15>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?min_id=16>; rel="prev"'
        }
      }
    ))

    const fullUrl = 'https://pleroma.soykaf.com/api/v1/timelines/tag/tagname'

    const state = await tagsThunks.fetch({ config, fullUrl })(dispatch, getState)
    expect(state.statuses.statusesByIds)
      .toEqual({ 21: statuses[0], 23: statuses[1] })

    expect(state.statuses.tag)
      .toEqual([23, 21])

    expect(state.api.tagTimeline.prev)
      .toEqual({
        rel: 'prev',
        min_id: '16',
        url: 'https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?min_id=16'
      })
  })
})
