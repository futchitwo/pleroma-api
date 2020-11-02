import utils from './utils'

// TODO: should be replaced with the latest endpoints in future
const ADMIN_URL = '/api/pleroma/admin/users'
const PERMISSION_GROUP_URL = (nickname, permissionGroup) => `${ADMIN_URL}/${nickname}/permission_group/${permissionGroup}`

const Admin = {
  async addPermissionGroup ({ config, params }) {
    if (!params.user || !params.permission_group) {
      throw Error('user and permission group should be provided')
    }
    return utils.request({
      config,
      method: 'POST',
      url: PERMISSION_GROUP_URL(params.user.acct, params.permission_group)
    })
  },
  async deletePermissionGroup ({ config, params }) {
    if (!params.user || !params.permission_group) {
      throw Error('user and permission group should be provided')
    }
    return utils.request({
      config,
      method: 'DELETE',
      url: PERMISSION_GROUP_URL(params.user.acct, params.permission_group)
    })
  }
}

export default Admin
