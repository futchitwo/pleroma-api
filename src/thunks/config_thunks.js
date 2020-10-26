import configsApi from '../api/configs'
import Config from '../reducers/config'
import { getConfig, apiErrorCatcher } from '../utils/api_utils'

const configThunks = {
  fetchConfig: ({ config, appId }) => {
    return async (dispatch, getState) => {
      const computedConfig = getConfig(getState, config)
      const result = await Promise.all([
        configsApi.getConfig({ config: computedConfig }),
        configsApi.getStatusnetConfig({ config: computedConfig })
      ])
      await dispatch(Config.actions.addConfig({
        config: {
          [appId]: result.reduce((acc, curr) => curr.state === 'ok' ? Object.assign(acc, curr.data) : acc, {})
        }
      }))
      return getState()
    }
  },
  fetchCustomEmoji: ({ config }) => {
    return async (dispatch, getState) => {
      const result = await configsApi.getCustomEmojis({ config: getConfig(getState, config) })
        .then(res => apiErrorCatcher(res))
      await dispatch(Config.actions.addEmojis({ emojis: result.data }))
      return getState()
    }
  }
}

export default configThunks
