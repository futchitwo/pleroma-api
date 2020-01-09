import { apiErrorCatcher } from '../../src/utils/api_utils'

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
