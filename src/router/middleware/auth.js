// import moment from "moment"

export default async function auth ({ next, store, permissions }) {
  if(!store.getters.token) {
    import.meta.env.PROD ? null : console.log('[DEBUG] No auth token found')

    return await next({
      name: 'login'
    })
  }

  // Get options service
  if(!store.getters.options) {
    import.meta.env.PROD ? null : console.log("[DEBUG] Fetching options service")

    await store
      .dispatch("GetUserInfo")
      .then(async () => {
        import.meta.env.PROD ? null : console.log("[DEBUG] User's info fetched successfully")

        await store
          .dispatch("GetOptionsService")
          .then(() => { import.meta.env.PROD ? null : console.log("[DEBUG] Options service fetched successfully") })
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
    import.meta.env.PROD ? null : console.log("[DEBUG] Options service exists")
  }

  if (permissions) {
    // Permission checks
    import.meta.env.PROD ? null : console.log("[DEBUG] User permissions: ")
    import.meta.env.PROD ? null : console.log(store.getters.authPermissions)
    import.meta.env.PROD ? null : console.log("[DEBUG] This route permissions: ")
    import.meta.env.PROD ? null : console.log(permissions)

    var kickFlag = true
    permissions.forEach(permission => { if(store.getters.authPermissions.includes(permission)) { kickFlag = false } })
    if(kickFlag) { return next({ name: 'error.403' }) }

    import.meta.env.PROD ? null : console.log("[DEBUG] Permission exist and checking completed")
  } else {
    import.meta.env.PROD ? null : console.log('[DEBUG] No permission defined')
  }

  return await next()
}
