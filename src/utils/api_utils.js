import find from 'lodash/find'

export const getConfig = (getState, config) => {
  if (!config) {
    const { api } = getState()
    return api.config
  }
  return config
}

export const apiErrorCatcher = (result) => {
  if (Array.isArray(result)) {
    if (result.every(({ state }) => state === 'ok')) {
      return result
    } else {
      const errorRes = find(result, ({ state }) => state !== 'ok')

      throw new Error((errorRes.data && errorRes.data.error) || errorRes.state)
    }
  } else {
    if (result.state === 'ok') {
      return result
    } else {
      throw new Error((result.data && result.data.error) || result.state)
    }
  }
}
