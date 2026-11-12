// Planning hebdomadaire des cours — utilisé par /planning et /essai-gratuit.

export type Day = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi'

export type Category = 'muay' | 'fitness' | 'jeunes' | 'self'

export type Course = {
    id: string
    name: string
    audience: string
    category: Category
    days: Day[]
    start: string // HH:MM
    end?: string // HH:MM
    /** Cours d'essai offert pour ce cours. */
    trial: boolean
}

export const DAYS: Day[] = ['Lundi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export const courses: Course[] = [
    { id: 'kids', name: 'Muay Thaï Kids', audience: 'Enfants', category: 'jeunes', days: ['Mercredi', 'Samedi'], start: '14:15', trial: true },
    { id: 'ados', name: 'Muay Thaï Ados', audience: 'Adolescents', category: 'jeunes', days: ['Mercredi', 'Samedi'], start: '15:15', trial: true },
    { id: 'feminin', name: 'Muay Thaï féminin', audience: 'Femmes', category: 'muay', days: ['Vendredi'], start: '18:30', end: '19:30', trial: true },
    { id: 'footing', name: 'Footing', audience: 'Tous niveaux', category: 'fitness', days: ['Lundi', 'Mercredi', 'Vendredi'], start: '19:00', trial: false },
    { id: 'stretching', name: 'Stretching', audience: 'Tous niveaux', category: 'fitness', days: ['Samedi'], start: '10:00', end: '11:00', trial: false },
    { id: 'self-defense', name: 'Self défense', audience: 'Adultes', category: 'self', days: ['Jeudi'], start: '19:00', end: '20:30', trial: true },
    { id: 'muay-thai', name: 'Muay Thaï', audience: 'Adultes', category: 'muay', days: ['Lundi', 'Mercredi', 'Vendredi'], start: '19:30', trial: true },
]

export const formatTime = (time: string) => time.replace(':', 'h')

export const formatSlot = (course: Course) =>
    course.end ? `${formatTime(course.start)} – ${formatTime(course.end)}` : formatTime(course.start)
