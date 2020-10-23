import { apiErrorCatcher, createFormData } from '../../src/utils/api_utils'

describe('apiErrorCatcher', () => {
  it('check result without error', () => {
    const result = { state: 'ok', data: { a: 1 } }
    expect(apiErrorCatcher(result)).toEqual(result)
  })

  it('should return array result', () => {
    const result = apiErrorCatcher([
      { state: 'ok', data: { a: 1 } },
      { state: 'ok', data: { a: 1 } }
    ])
    expect(result).toEqual([{ state: 'ok', data: { a: 1 } }, { state: 'ok', data: { a: 1 } }])
  })

  it('should return error', () => {
    expect(() => apiErrorCatcher({ state: 'error', data: { error: 'server error' } })).toThrowError('server error')
  })

  it('should return error for array result', () => {
    const result = [ { state: 'ok', data: {} }, { state: 'error', data: { error: 'server error' } } ]
    expect(() => apiErrorCatcher(result)).toThrowError('server error')
  })
})

describe('createFormData', () => {
  it('create FormData from object', () => {
    const params = {
      multiple: true,
      expires_in: 10000
    }
    const result = new FormData()

    result.append('multiple', true)
    result.append('expires_in', 10000)

    expect(createFormData(params)).toEqual(result)
  })

  it('create FormData from nested object', () => {
    const params = {
      poll: {
        multiple: true,
        expires_in: 10000,
        options: ['1', '2']
      }
    }
    const result = new FormData()

    result.append('poll[multiple]', true)
    result.append('poll[expires_in]', 10000)
    result.append('poll[options][]', '1')
    result.append('poll[options][]', '2')
    expect(createFormData(params)).toEqual(result)
  })
})
