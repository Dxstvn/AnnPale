import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: 'fan' | 'creator' | 'admin'
  avatar?: string
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // UI state
  sidebarOpen: boolean
  modalOpen: string | null
  theme: 'light' | 'dark' | 'system'
  
  // Search state
  searchQuery: string
  searchFilters: Record<string, any>
  
  // Actions
  setUser: (user: User | null) => void
  logout: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setModal: (modalId: string | null) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setSearchQuery: (query: string) => void
  setSearchFilters: (filters: Record<string, any>) => void
  resetSearch: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        sidebarOpen: false,
        modalOpen: null,
        theme: 'system',
        searchQuery: '',
        searchFilters: {},
        
        // Actions
        setUser: (user) => 
          set({ 
            user, 
            isAuthenticated: !!user 
          }),
        
        logout: () => 
          set({ 
            user: null, 
            isAuthenticated: false 
          }),
        
        setSidebarOpen: (open) => 
          set({ sidebarOpen: open }),
        
        toggleSidebar: () => 
          set((state) => ({ 
            sidebarOpen: !state.sidebarOpen 
          })),
        
        setModal: (modalId) => 
          set({ modalOpen: modalId }),
        
        setTheme: (theme) => 
          set({ theme }),
        
        setSearchQuery: (query) => 
          set({ searchQuery: query }),
        
        setSearchFilters: (filters) => 
          set({ searchFilters: filters }),
        
        resetSearch: () => 
          set({ 
            searchQuery: '', 
            searchFilters: {} 
          }),
      }),
      {
        name: 'ann-pale-storage',
        partialize: (state) => ({
          user: state.user,
          theme: state.theme,
        }),
      }
    )
  )
)