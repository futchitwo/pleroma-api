import configsApi from '../api/configs'
import Config from '../reducers/config'
import { apiErrorCatcher, getConfig } from '../utils/api_utils'

const configThunks = {
  fetchConfig: ({ config, appId }) => {
    return async (dispatch, getState) => {
      const computedConfig = getConfig(getState, config)
      const result = await Promise.all([
        configsApi.getConfig({ config: computedConfig }),
        configsApi.getStatusnetConfig({ config: computedConfig })
      ])
        .then(res => apiErrorCatcher(res))
      await dispatch(Config.actions.addConfig({ config: { [appId]: Object.assign(result[0].data, result[1].data) } }))
      return getState()
    }
  }
}

export default configThunks
