// import moment from "moment"

export default async function auth ({ next, store, permissions }) {
  if(!store.getters.token) {
    process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] No auth token found')

    return await next({
      name: 'login'
    })
  }

  // Get options service
  if(!store.getters.options) {
    process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Fetching options service")

    await store
      .dispatch("GetUserInfo")
      .then(async () => {
        process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] User's info fetched successfully")

        await store
          .dispatch("GetOptionsService")
          .then(() => { process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Options service fetched successfully") })
          .catch(async () => {
            await console.error("Failed to fetch options service")
            
            return await next({ name: 'dashboard' })
          })
      })
      .catch(async () => {
        await console.error("Failed to fetch user's info")
        
        return await next({ name: 'login' })
        
      })
  } else {
    process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Options service exists")
  }

  if (permissions) {
    // Permission checks
    process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] User permissions: ")
    process.env.NODE_ENV === 'production' ? null : console.log(store.getters.authPermissions)
    process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] This route permissions: ")
    process.env.NODE_ENV === 'production' ? null : console.log(permissions)

    var kickFlag = true
    permissions.forEach(permission => { if(store.getters.authPermissions.includes(permission)) { kickFlag = false } })
    if(kickFlag) { return next({ name: 'error.403' }) }

    process.env.NODE_ENV === 'production' ? null : console.log("[DEBUG] Permission exist and checking completed")
  } else {
    process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] No permission defined')
  }

  return await next()
}
