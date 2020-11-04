import api from '../../src/api.js'
import fetch from 'cross-fetch'
import fetchMocker from './fetch_mocker.js'

jest.mock('cross-fetch')

describe('Admin api', () => {
  const config = {
    instance: 'https://pleroma.soykaf.com'
  }

  describe('/api/pleroma/admin/users/permission_group/:permission_group', () => {
    it('returns user with added permission group', async () => {
      fetch.mockImplementationOnce(fetchMocker({ is_admin: true }, {
        expectedUrl: 'https://pleroma.soykaf.com/api/pleroma/admin/users/nd/permission_group/admin'
      }))
      const res = await api.admin.addPermissionGroup({ config, params: { user: { acct: 'nd' }, permission_group: 'admin' } })

      expect(res.data).toEqual({ is_admin: true })
    })
  })
})
