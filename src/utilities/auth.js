import Cookies from 'js-cookie'
// import store from '@/store'

const AuthMaxAttempt = 'vlpb_auth_max_attempt'
const AuthAttempt = 'vlpb_auth_attempt'
const AuthGrace = 'vlpb_auth_grace'
const TokenKey = 'vlpb_auth_token'
const AuthExpiresOn = 'vlpb_auth_expires_on'
const RefreshTokenKey = 'vlpb_auth_refresh_token'
const RefreshExpiresOn = 'vlpb_refresh_expires_on'
const AuthUserId = 'vlpb_auth_user_id'
const AuthName = 'vlpb_auth_name'
const AuthEmail = 'vlpb_auth_email'
const AuthRoles = 'vlpb_auth_roles'
const AuthPermissions = 'vlpb_auth_permissions'

// Setters
export function setAuthMaxAttempt (authMaxAttempt) {
  return Cookies.set(AuthMaxAttempt, authMaxAttempt, { expires: 1 })
}

export function setAuthAttempt (authAttempt) {
  return Cookies.set(AuthAttempt, authAttempt, { expires: 1 })
}

export function setAuthGrace (authGrace) {
  return Cookies.set(AuthGrace, authGrace)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function setAuthExpiresOn (authExpiresOn) {
  return Cookies.set(AuthExpiresOn, authExpiresOn)
}

export function setRefreshToken (refreshToken) {
  return Cookies.set(RefreshTokenKey, refreshToken)
}

export function setRefreshExpiresOn (refreshExpiresOn) {
  return Cookies.set(RefreshExpiresOn, refreshExpiresOn)
}

export function setAuthUserId (authUserId) {
  return Cookies.set(AuthUserId, authUserId)
}

export function setAuthName (authName) {
  return Cookies.set(AuthName, authName)
}

export function setAuthEmail (authEmail) {
  return Cookies.set(AuthEmail, authEmail)
}

export function setAuthRoles (authRoles) {
  return Cookies.set(AuthRoles, authRoles)
}

export function setAuthPermissions (authPermissions) {
  return Cookies.set(AuthPermissions, authPermissions)
}

// Getters
export function getAuthAttempt () {
  return Cookies.get(AuthAttempt)
}

export function getAuthMaxAttempt () {
  return Cookies.get(AuthMaxAttempt)
}

export function getAuthGrace () {
  return Cookies.get(AuthGrace)
}

export function getToken () {
  return Cookies.get(TokenKey)
}

export function getAuthExpiresOn () {
  return Cookies.get(AuthExpiresOn)
}

export function getRefreshToken () {
  return Cookies.get(RefreshTokenKey)
}

export function getRefreshExpiresOn () {
  return Cookies.get(RefreshExpiresOn)
}

export function getAuthRoles () {
  if(Cookies.get(AuthRoles)) {
    return Cookies.get(AuthRoles).split(',')
  } else {
    return null
  }
}

export function getAuthPermissions () {
  if(Cookies.get(AuthPermissions)) {
    return Cookies.get(AuthPermissions).split(',')
  } else {
    return null
  }
}

// Remover
export function removeAuthAttempt () {
  return Cookies.remove(AuthAttempt)
}

export function removeAuthMaxAttempt () {
  return Cookies.remove(AuthMaxAttempt)
}

export function removeAuthGrace () {
  return Cookies.remove(AuthGrace)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function removeAuthExpiresOn () {
  return Cookies.remove(AuthExpiresOn)
}

export function removeRefreshToken () {
  return Cookies.remove(RefreshTokenKey)
}

export function removeRefreshExpiresOn () {
  return Cookies.remove(RefreshExpiresOn)
}

export function removeAuthUserId () {
  return Cookies.remove(AuthUserId)
}

export function removeAuthName () {
  return Cookies.remove(AuthName)
}

export function removeAuthEmail () {
  return Cookies.remove(AuthEmail)
}

export function removeAuthRoles () {
  return Cookies.remove(AuthRoles)
}

export function removeAuthPermissions () {
  return Cookies.remove(AuthPermissions)
}
