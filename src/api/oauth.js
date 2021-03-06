import utils, { queryParams } from './utils.js'

const createApp = async ({ config, params = {} }) => {
  const defaults = {
    client_name: 'Pleroma API Library',
    redirect_uris: `${window.location.origin}/oauth-callback`,
    scopes: 'read write follow push'
  }

  params = {
    ...defaults,
    ...params
  }

  return utils.request({
    method: 'POST',
    config,
    url: '/api/v1/apps',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const getTokenWithCode = async ({ config, params }) => {
  const defaultRedirectUri = `${window.location.origin}/oauth-callback`
  params = {
    client_id: params.client_id,
    client_secret: params.client_secret,
    grant_type: params.grant_type || 'authorization_code',
    code: params.code,
    redirect_uri: params.redirect_uri || defaultRedirectUri
  }

  return utils.request({
    method: 'POST',
    config,
    url: '/oauth/token',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const getTokenWithPassword = async ({ config, params }) => {
  params = {
    client_id: params.client_id,
    client_secret: params.client_secret,
    grant_type: 'password',
    username: params.username,
    password: params.password
  }

  return utils.request({
    method: 'POST',
    config,
    url: '/oauth/token',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const resetPassword = async ({ config, queries }) => {
  return utils.request({
    method: 'POST',
    config,
    url: `/auth/password?${queryParams(queries)}`
  })
}

const changePassword = async ({ config, params }) => utils.request({
  method: 'POST',
  config,
  url: '/api/pleroma/change_password',
  body: JSON.stringify(params),
  headers: {
    'Content-Type': 'application/json'
  }
})

const changeEmail = async ({ config, params }) => utils.request({
  method: 'POST',
  config,
  url: '/api/pleroma/change_email',
  body: JSON.stringify(params),
  headers: {
    'Content-Type': 'application/json'
  }
})

const revokeToken = async ({ config, params }) => utils.request({
  url: '/oauth/revoke',
  method: 'POST',
  config,
  body: JSON.stringify(params),
  headers: {
    'Content-Type': 'application/json'
  }
})

const oauth = {
  createApp,
  getTokenWithCode,
  getTokenWithPassword,
  resetPassword,
  changePassword,
  changeEmail,
  revokeToken
}

export default oauth
