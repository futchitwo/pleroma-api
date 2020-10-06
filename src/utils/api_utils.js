import find from 'lodash/find'

function NotFoundError (message) {
  this.name = 'NotFoundError'
  this.message = message || 'Not found'
  this.stack = (new Error()).stack
}
NotFoundError.prototype = Object.create(Error.prototype)
NotFoundError.prototype.constructor = NotFoundError

function ForbiddenError (message) {
  this.name = 'ForbiddenError'
  this.message = message || 'Not allowed'
  this.stack = (new Error()).stack
}
ForbiddenError.prototype = Object.create(Error.prototype)
ForbiddenError.prototype.constructor = ForbiddenError

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
      const error = (errorRes.data && errorRes.data.error) || errorRes.state
      if (errorRes.status === 404) {
        throw new NotFoundError(error)
      } else if (errorRes.status === 403) {
        throw new ForbiddenError(error)
      }
      throw new Error(error)
    }
  } else {
    if (result.state === 'ok') {
      return result
    } else {
      const error = (result.data && result.data.error) || result.state
      if (result.status === 404) {
        throw new NotFoundError(error)
      } else if (result.status === 403) {
        throw new ForbiddenError(error)
      }
      throw new Error(error)
    }
  }
}

const buildFormData = (formData, data, parentKey) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    // prevent adding array [indexes] in nested object
    if (Array.isArray(data) && !data.filter(item => typeof item === 'object').length) {
      data.forEach(item => {
        formData.append(`${parentKey}[]`, item)
      })
    } else {
      Object.entries(data).forEach(([key, value]) => {
        buildFormData(formData, value, parentKey ? `${parentKey}[${key}]` : key)
      })
    }
  } else {
    const value = data == null ? '' : data

    formData.append(parentKey, value)
  }
}

export const createFormData = (params) => {
  const formData = new FormData()

  buildFormData(formData, params)

  return formData
}
