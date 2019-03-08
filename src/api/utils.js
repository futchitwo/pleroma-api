import fetch from 'cross-fetch'
import parseLinkHeader from 'parse-link-header'

const queryParams = (params) => {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

const authHeaders = ({accessToken}) => {
  if (accessToken) {
    return { 'Authorization': `Bearer ${accessToken}` }
  } else {
    return {}
  }
}

const request = async ({ method = 'GET', url, params, config, fullUrl = undefined, body = undefined, headers = {} }) => {
  const instance = config.instance
  fullUrl = fullUrl || `${instance}${url}`

  if (method === 'GET' && params) {
    fullUrl = fullUrl + `?${queryParams(params)}`
  }

  try {
    const result = await fetch(fullUrl, {
      method,
      headers: {...headers, ...authHeaders(config)},
      credentials: 'same-origin',
      body
    })

    if(result.ok){
      return {
        state: 'ok',
        data: await result.json(),
        links: parseLinkHeader(result.headers.get('link'))
      }
    } else {
      return {
        state: 'error',
        data: await result.json()
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
