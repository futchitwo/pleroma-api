import FollowRequests from '../../src/reducers/follow_requests.js'

const defaultRelationship = { pleroma: { relationship: { requested: true } } }

describe('Follow requests reducers', () => {
  it('adds follow requests', async () => {
    const followRequests = [
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ]
    const resultState = FollowRequests.reducer(undefined, FollowRequests.actions.addFollowRequests({ followRequests }))

    expect(resultState.list).toEqual(['1', '2', '3'])
    expect(resultState.followRequestsByIds).toEqual({
      1: { ...followRequests[0], ...defaultRelationship },
      2: { ...followRequests[1], ...defaultRelationship },
      3: { ...followRequests[2], ...defaultRelationship }
    })
    expect(resultState.unprocessedRequestsCount).toEqual(3)
  })

  it('add follow requests to existing list', () => {
    const initialState = {
      list: ['1', '2'],
      followRequestsByIds: {
        1: { id: '1', ...defaultRelationship },
        2: { id: '2', ...defaultRelationship }
      }
    }
    const followRequest = { id: '123', acct: 'test_name' }
    const resultState = FollowRequests.reducer(initialState, FollowRequests.actions.addFollowRequests({ followRequests: [followRequest] }))

    expect(resultState.list).toEqual(['123', '1', '2'])
    expect(resultState.followRequestsByIds).toEqual({
      1: { id: '1', ...defaultRelationship },
      2: { id: '2', ...defaultRelationship },
      123: { id: '123', acct: 'test_name', ...defaultRelationship }
    })
    expect(resultState.unprocessedRequestsCount).toEqual(3)
  })

  it('clear followRequests', async () => {
    const initState = {
      list: ['1', '2'],
      followRequestsByIds: {
        1: { id: '1' },
        2: { id: '2' }
      },
      unprocessedRequestsCount: 2
    }
    const resultState = FollowRequests.reducer(initState, FollowRequests.actions.clearFollowRequests())

    expect(resultState.list).toEqual([])
    expect(resultState.followRequestsByIds).toEqual({})
    expect(resultState.unprocessedRequestsCount).toEqual(0)
  })

  it('process followRequest', async () => {
    const initState = {
      list: ['1', '2'],
      followRequestsByIds: {
        1: { id: '1' },
        2: { id: '2' }
      },
      unprocessedRequestsCount: 2
    }
    const resultState = FollowRequests.reducer(initState, FollowRequests.actions.processFollowRequest({ id: '1', relationship: { requested: true } }))

    expect(resultState.list).toEqual(['1', '2'])
    expect(resultState.followRequestsByIds).toEqual({
      1: { id: '1', pleroma: { relationship: { requested: true } } },
      2: { id: '2' }
    })
    expect(resultState.unprocessedRequestsCount).toEqual(1)
  })
})
