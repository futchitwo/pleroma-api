import fetch from 'cross-fetch'
import parseLinkHeader from 'parse-link-header'

export const queryParams = (params) => {
  return Object.keys(params)
    .map(k => {
      const field = params[k]

      if (Array.isArray(field)) {
        return field
          .reduce((acc, cur) => acc.concat(encodeURIComponent(k) + '[]=' + encodeURIComponent(cur)), [])
          .join('&')
      } else {
        return encodeURIComponent(k) + '=' + encodeURIComponent(field)
      }
    })
    .join('&')
}

const authHeaders = ({ accessToken }) => {
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` }
  } else {
    return {}
  }
}

const request = async ({ method = 'GET', url, queries, config, fullUrl = undefined, body = undefined, headers = {} }) => {
  const instance = config.instance
  fullUrl = fullUrl || `${instance}${url}`

  if (method === 'GET' && queries) {
    fullUrl = fullUrl + `?${queryParams(queries)}`
  }

  try {
    const result = await fetch(fullUrl, {
      method,
      headers: { ...headers, ...authHeaders(config) },
      mode: 'cors',
      credentials: 'omit',
      body
    })

    let parsedResult = null
    try {
      parsedResult = await result.json()
    } catch (e) {
      parsedResult = result
    }

    if (result.ok) {
      return {
        state: 'ok',
        data: parsedResult,
        links: parseLinkHeader(result.headers.get('link'))
      }
    } else {
      return {
        state: 'error',
        data: parsedResult,
        status: result.status
      }
    }
  } catch (e) {
    return {
      state: 'error',
      error: e
    }
  }
}

const utils = {
  queryParams,
  request
}

export default utils
