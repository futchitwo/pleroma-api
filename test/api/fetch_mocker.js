import isEqual from 'lodash/isEqual'

const fetchMocker = (result, { expectedUrl, ok = true, expectedToken, headers = {}, expectedBody, expectedJSON }) => {
  return async (url, options) => {
    if (expectedUrl && (expectedUrl !== url)) {
      throw new Error(`fetchMocker: Unexpected url, expected '${expectedUrl}', got '${url}'`)
    }

    const token = options.headers.Authorization
    if (expectedToken && (expectedToken !== token)) {
      throw new Error(`fetchMocker: Unexpected token, expected '${expectedToken}', got '${token}}'`)
    }

    if (expectedBody && !isEqual(expectedBody, options.body)) {
      throw new Error(`fetchMocker: Unexpected body, expected '${JSON.stringify(expectedBody)}', got '${JSON.parse(options.body)}}'`)
    }

    if (expectedJSON && !isEqual(expectedJSON, JSON.parse(options.body))) {
      throw new Error(`fetchMocker: Unexpected json, expected '${JSON.stringify(expectedJSON)}', got '${options.body}}'`)
    }

    return {
      ok,
      json: () => result,
      headers: {
        get: (header) => headers[header]
      }
    }
  }
}

export default fetchMocker
