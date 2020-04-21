import configsApi from '../api/configs'
import Config from '../reducers/config'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const configThunks = {
  fetchConfig: ({ config }) => {
    return async (dispatch, getState) => {
      const result = await configsApi.getConfig({ config: getConfig(getState, config) })
        .then(res => apiErrorCatcher(res))
      await dispatch(Config.actions.addConfig({ config: result.data }))
      return getState()
    }
  }
}

export default configThunks
