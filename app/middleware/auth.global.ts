import { DEMO_PEOPLE } from '~/data/people'

/**
 * Sign-in first, then the one-time welcome, then the app.
 * Demo deep link: /dang-nhap?nguoi=hung&chao=0&den=/phieu&giao-dien=toi signs in as a sample
 * person, optionally skips the welcome, sets the appearance and opens a page.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { user, onboarded, signIn, finishOnboarding } = useSession()
  const q = to.query

  if (to.path === '/dang-nhap' && typeof q.nguoi === 'string' && DEMO_PEOPLE.some(p => p.key === q.nguoi)) {
    signIn(q.nguoi)
    if (q.chao === '0') finishOnboarding()
    const mode = { 'toi': 'dark', 'sang': 'light', 'he-thong': 'system' }[String(q['giao-dien'])]
    if (mode) useColorMode().preference = mode
    const dest = typeof q.den === 'string' && q.den.startsWith('/') ? q.den : '/'
    return navigateTo(onboarded.value ? dest : '/chao-mung', { replace: true })
  }

  if (!user.value) return to.path === '/dang-nhap' ? undefined : navigateTo('/dang-nhap')
  if (to.path === '/dang-nhap') return navigateTo(onboarded.value ? '/' : '/chao-mung')
  if (!onboarded.value && to.path !== '/chao-mung') return navigateTo('/chao-mung')
})
