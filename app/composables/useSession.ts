import type { Person, RoleKey } from '~/types'
import { person } from '~/data/people'

interface SessionState {
  user: string | null
  /** People who have seen the welcome screen on this device */
  onboarded: string[]
  /** Dismissed inline tips */
  tips: string[]
}

const useSessionState = createGlobalState(() =>
  useLocalStorage<SessionState>('vtyt:v3:session', { user: null, onboarded: [], tips: [] }, { mergeDefaults: true })
)

export function useSession() {
  const state = useSessionState()

  const user = computed<Person | null>(() => (state.value.user ? person(state.value.user) : null))
  const role = computed<RoleKey | null>(() => user.value?.role ?? null)
  const onboarded = computed(() => !!state.value.user && state.value.onboarded.includes(state.value.user))

  function signIn(key: string) {
    state.value.user = key
  }
  function signOut() {
    state.value.user = null
  }
  function finishOnboarding() {
    const k = state.value.user
    if (k && !state.value.onboarded.includes(k)) state.value.onboarded = [...state.value.onboarded, k]
  }
  function replayOnboarding() {
    state.value.onboarded = state.value.onboarded.filter(k => k !== state.value.user)
  }
  const tipSeen = (id: string) => state.value.tips.includes(id)
  function dismissTip(id: string) {
    if (!tipSeen(id)) state.value.tips = [...state.value.tips, id]
  }

  return { user, role, onboarded, signIn, signOut, finishOnboarding, replayOnboarding, tipSeen, dismissTip }
}
