export default function auth (/* { to, from, next, store } */ { next, store }) {
  if(!localStorage.getItem('token')) {
    return next({ name: 'login' })
  }   
  return next()
}