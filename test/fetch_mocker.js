const fetchMocker = (result, {expectedUrl, ok = true}) => {
  return async (url, options) => {
    if(expectedUrl && (expectedUrl != url)) {
      throw `fetchMocker: Unexpected url, expected '${expectedUrl}', got '${url}'`
    }
    return {
      ok,
      json: () => result,
      headers: {
        get: () => ""
      }
    }
  }
}

export default fetchMocker
