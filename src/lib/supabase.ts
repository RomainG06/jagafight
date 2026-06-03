import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variables Supabase manquantes dans .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Preinscription = {
  id?: string
  nom: string
  prenom: string
  email: string
  tel?: string
  age?: string
  activites?: string[]
  message?: string
  rgpd: boolean
  created_at?: string
  status?: string
}
