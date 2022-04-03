export default async function guest ({ next, store }) {
  if(store.getters.token) {
    return await next({
      name: 'dashboard'
    })
  }
 
  return await next()
}
