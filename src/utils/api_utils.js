export const getConfig = (getState, config) => {
  if (!config) {
    const { api } = getState()
    return api.config
  }
  return config
}
