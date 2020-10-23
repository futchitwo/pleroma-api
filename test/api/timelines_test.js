import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Timelines api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  it('/api/v1/timelines/home', async () => {
    fetch.mockImplementationOnce(fetchMocker(
      [{ id: 1 }, { id: 2 }],
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/home?since_id=1',
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/home?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))
    const res = await api.timelines.home({ config, queries: { since_id: 1 } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
    expect(res.links).not.toBe(null)
  })

  it('/api/v1/timelines/public', async () => {
    const accessToken = 'qNhQPCb-_lRjt_K6mXkwcrle_AoHWBkOmWjWhn9H6EQ='

    fetch.mockImplementationOnce(fetchMocker(
      [{ id: 1 }, { id: 2 }],
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/public',
        expectedToken: `Bearer ${accessToken}`,
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/public?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/home?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))
    const res = await api.timelines.public({ config: { ...config, accessToken } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
    expect(res.links).not.toBe(null)
  })

  it('/api/v1/timelines/tag/tagname', async () => {
    const accessToken = 'qNhQPCb-_lRjt_K6mXkwcrle_AoHWBkOmWjWhn9H6EQ='

    fetch.mockImplementationOnce(fetchMocker(
      [{ id: 1 }, { id: 2 }],
      {
        expectedUrl: 'https://pleroma.soykaf.com/api/v1/timelines/tag/tagname',
        expectedToken: `Bearer ${accessToken}`,
        headers: {
          link: '<https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?max_id=9gZ5VYhDG8GeCL8Vay>; rel="next", <https://pleroma.soykaf.com/api/v1/timelines/tag/tagname?since_id=9gZ5g5Q6RlaAaN9Z5M>; rel="prev"'
        }
      }))
    const res = await api.timelines.tag({ config: { ...config, accessToken }, params: { tag: 'tagname' } })

    expect(res.state).toBe('ok')
    expect(res.data).toEqual([{ id: 1 }, { id: 2 }])
    expect(res.links).not.toBe(null)
  })
})
