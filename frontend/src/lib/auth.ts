import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  full_name?: string
  is_superuser: boolean
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
