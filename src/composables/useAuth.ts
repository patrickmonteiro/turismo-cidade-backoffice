import { ref, computed } from 'vue'
import { Cookies } from 'quasar'

const TOKEN_KEY = 'auth_token'
const WORKSPACE_ID_KEY = 'workspace_id'

// Configuração dos cookies com as melhores práticas
const cookieOptions = {
  path: '/',
  expires: 7, // 7 dias
  sameSite: 'Strict' as const,
  // secure: true quando em produção OU quando usando HTTPS em dev
  secure: process.env.NODE_ENV === 'production' || window.location.protocol === 'https:',
}

export function useAuth() {
  const token = ref<string | null>(Cookies.get(TOKEN_KEY))
  const workspaceId = ref<string | null>(Cookies.get(WORKSPACE_ID_KEY))

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    Cookies.set(TOKEN_KEY, newToken, cookieOptions)
  }

  function setWorkspaceId(id: string) {
    workspaceId.value = id
    Cookies.set(WORKSPACE_ID_KEY, id, cookieOptions)
  }

  function getToken(): string | null {
    return token.value || Cookies.get(TOKEN_KEY)
  }

  function getWorkspaceId(): string | null {
    return workspaceId.value || Cookies.get(WORKSPACE_ID_KEY)
  }

  function clearAuth() {
    token.value = null
    workspaceId.value = null
    Cookies.remove(TOKEN_KEY, { path: '/' })
    Cookies.remove(WORKSPACE_ID_KEY, { path: '/' })
  }

  return {
    token,
    workspaceId,
    isAuthenticated,
    setToken,
    setWorkspaceId,
    getToken,
    getWorkspaceId,
    clearAuth,
  }
}
