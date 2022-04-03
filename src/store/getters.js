const getters = {
  authMaxAttempt: state => state.user.authMaxAttempt,
  authAttempt: state => state.user.authAttempt,
  authGrace: state => state.user.authGrace,
  token: state => state.user.token,
  authExpiresOn: state => state.user.authExpiresOn,
  refreshToken: state => state.user.refreshToken,
  refreshExpiresOn: state => state.user.refreshExpiresOn,
  authUserId: state => state.user.authUserId,
  authName: state => state.user.authName,
  authEmail: state => state.user.authEmail,
  authRoles: state => state.user.authRoles,
  authPermissions: state => state.user.authPermissions,
  options: state => state.system.options,
}

export default getters
