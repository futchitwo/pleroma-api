import timelineApi from '../api/timelines'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'
import Statuses from '../reducers/statuses.js'
import { startLoading, stopLoading, updateLinks } from './api_thunks'

const tagsThunks = {
  fetch: ({ config, fullUrl, queries, params, older }) => {
    return async (dispatch, getState) => {
      if (older && !fullUrl && (!queries || !queries.max_id)) {
        const tagTimeline = getState().statuses.tag || []

        queries = queries || {}
        queries.max_id = tagTimeline[tagTimeline.length - 1]
      }
      startLoading({ dispatch, entity: 'tags', older })
      const result = await timelineApi.tag({ config: getConfig(getState, config), fullUrl, queries, params })
        .then(res => apiErrorCatcher(res))
      stopLoading({ dispatch, entity: 'tags', older })
      await dispatch(Statuses.actions.addTagTimeline({ statuses: result.data }))
      if (result.links) {
        await updateLinks({ dispatch, entity: 'tagTimeline', links: result.links, older })
      }
      return getState()
    }
  },
  clear: () => {
    return async (dispatch, getState) => {
      await dispatch(Statuses.actions.clearTagTimeline())
      return getState()
    }
  }
}

export default tagsThunks
