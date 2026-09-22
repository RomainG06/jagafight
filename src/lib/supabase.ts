import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Configuration Supabase manquante : vérifiez les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.')
}

const parsedSupabaseUrl = new URL(supabaseUrl)
if (parsedSupabaseUrl.protocol !== 'https:' && parsedSupabaseUrl.hostname !== 'localhost') {
  throw new Error('VITE_SUPABASE_URL doit utiliser HTTPS.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Membre = {
  id?: string
  user_id: string
  civilite?: 'M.' | 'Mme'
  nom: string
  prenom: string
  date_naissance?: string
  lieu_naissance?: string
  nationalite?: string
  adresse?: string
  cp?: string
  ville?: string
  email: string
  telephone?: string
  est_mineur?: boolean
  responsable_nom?: string
  responsable_prenom?: string
  responsable_lien?: string
  responsable_tel?: string
  responsable_email?: string
  urgence_nom?: string
  urgence_lien?: string
  urgence_tel?: string
  sante_infos?: string
  profil_complet?: boolean
  created_at?: string
}

export type Saison = {
  id: string
  label: string
  date_debut?: string
  date_fin?: string
  active: boolean
}

export type Adhesion = {
  id?: string
  membre_id: string
  saison_id: string
  disciplines: string[]
  statut_pratique: 'loisir' | 'competiteur'
  licence_numero?: string
  palmares?: string
  poids_categorie?: string
  formule_tarifaire?: string
  montant_calcule?: number
  code_promo?: string
  date_debut_souhaitee?: string
  signature_base64?: string
  signature_horodatee?: string
  droits_image?: boolean
  reglement_version?: string
  cgv_version?: string
  created_at?: string
}

export type Document = {
  id?: string
  membre_id: string
  type: 'certificat_medical' | 'photo_identite' | 'licence' | 'piece_identite'
  storage_path: string
  date_validite?: string
  created_at?: string
}

export type Paiement = {
  id?: string
  membre_id: string
  adhesion_id?: string
  mode: 'especes' | 'cheque' | 'cb' | 'virement'
  montant: number
  statut: 'paye' | 'partiel' | 'en_attente' | 'echelonne'
  date_paiement?: string
  reference?: string
  notes?: string
  created_at?: string
}
