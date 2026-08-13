import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  setProfile: (profile) => set({ profile }),

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signUp: async (email, password, name) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: `${siteUrl}/login` },
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },

  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) {
      console.error('Error fetching profile:', error)
      return
    }
    if (data) {
      set({ profile: data })
      return
    }
    const user = get().user
    const { data: created } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: user?.user_metadata?.name || '',
        email: user?.email || '',
      })
      .select()
      .maybeSingle()
    if (created) set({ profile: created })
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates })
      .select()
      .maybeSingle()
    if (error) throw error
    set({ profile: data })
    return data
  },
}))
