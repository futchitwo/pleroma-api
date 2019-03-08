const fetchMocker = (result, {expectedUrl, ok = true, expectedToken, headers = {}, expectedBody}) => {
  return async (url, options) => {
    if(expectedUrl && (expectedUrl != url)) {
      throw `fetchMocker: Unexpected url, expected '${expectedUrl}', got '${url}'`
    }

    const token = options.headers['Authorization']
    if(expectedToken && (expectedToken != token)) {
      throw `fetchMocker: Unexpected token, expected '${expectedToken}', got '${token}}'`
    }

    if(expectedBody && (expectedBody != options.body)) {
      throw `fetchMocker: Unexpected body, expected '${expectedBody}', got '${options.body}}'`
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
