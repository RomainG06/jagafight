import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../../lib/supabase'
import type { Membre } from '../../../lib/supabase'

const schema = z.object({
    civilite: z.enum(['M.', 'Mme']),
    prenom: z.string().min(1, 'Requis'),
    nom: z.string().min(1, 'Requis'),
    date_naissance: z.string().min(1, 'Requis'),
    lieu_naissance: z.string().optional(),
    nationalite: z.string().optional(),
    adresse: z.string().optional(),
    cp: z.string().optional(),
    ville: z.string().optional(),
    telephone: z.string().optional(),
    responsable_nom: z.string().optional(),
    responsable_prenom: z.string().optional(),
    responsable_lien: z.string().optional(),
    responsable_tel: z.string().optional(),
    responsable_email: z.string().email('Email invalide').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

interface Props {
    membre: Membre | null
    userId: string
    onSaved: () => void
}

const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors placeholder:text-white/20'

export default function ProfilSection({ membre, userId, onSaved }: Props) {
    const membreValues = useMemo<FormValues>(() => ({
        civilite: membre?.civilite ?? 'M.',
        prenom: membre?.prenom ?? '',
        nom: membre?.nom ?? '',
        date_naissance: membre?.date_naissance ?? '',
        lieu_naissance: membre?.lieu_naissance ?? '',
        nationalite: membre?.nationalite ?? '',
        adresse: membre?.adresse ?? '',
        cp: membre?.cp ?? '',
        ville: membre?.ville ?? '',
        telephone: membre?.telephone ?? '',
        responsable_nom: membre?.responsable_nom ?? '',
        responsable_prenom: membre?.responsable_prenom ?? '',
        responsable_lien: membre?.responsable_lien ?? '',
        responsable_tel: membre?.responsable_tel ?? '',
        responsable_email: membre?.responsable_email ?? '',
    }), [
        membre?.civilite,
        membre?.prenom,
        membre?.nom,
        membre?.date_naissance,
        membre?.lieu_naissance,
        membre?.nationalite,
        membre?.adresse,
        membre?.cp,
        membre?.ville,
        membre?.telephone,
        membre?.responsable_nom,
        membre?.responsable_prenom,
        membre?.responsable_lien,
        membre?.responsable_tel,
        membre?.responsable_email,
    ])

    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: membreValues,
    })

    const dateNaissance = watch('date_naissance')
    const isMineur = !!dateNaissance && (() => {
        const dob = new Date(dateNaissance)
        const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        return age < 18
    })()

    useEffect(() => {
        reset(membreValues)
    }, [membreValues, reset])

    async function onSubmit(values: FormValues) {
        console.log('Submitting form with values:', values)
        const { error } = await supabase.from('membres').upsert({
            user_id: userId,
            ...values,
            est_mineur: isMineur,
        }, { onConflict: 'user_id' })

        if (!error) onSaved()
    }

    function onInvalidSubmit(formErrors: typeof errors) {
        console.log('Formulaire invalide, soumission bloquée:', formErrors)
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6">
            <div>
                <span className={LABEL}>Civilité</span>
                <div className="flex gap-6">
                    {(['M.', 'Mme'] as const).map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={c} {...register('civilite')} className="accent-[#eb0071]" />
                            <span className="text-sm text-[#F5F5F0]/70">{c}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={LABEL}>Prénom *</label>
                    <input {...register('prenom')} className={INPUT} />
                    {errors.prenom && <p className="text-xs text-red-400 mt-1">{errors.prenom.message}</p>}
                </div>
                <div>
                    <label className={LABEL}>Nom *</label>
                    <input {...register('nom')} className={INPUT} />
                    {errors.nom && <p className="text-xs text-red-400 mt-1">{errors.nom.message}</p>}
                </div>
                <div>
                    <label className={LABEL}>Date de naissance *</label>
                    <input type="date" {...register('date_naissance')} className={INPUT} />
                    {errors.date_naissance && <p className="text-xs text-red-400 mt-1">{errors.date_naissance.message}</p>}
                    {isMineur && (
                        <p className="text-xs text-amber-400 mt-1">Mineur — les informations du responsable légal sont requises ci-dessous.</p>
                    )}
                </div>
                <div>
                    <label className={LABEL}>Lieu de naissance</label>
                    <input {...register('lieu_naissance')} className={INPUT} />
                </div>
                <div>
                    <label className={LABEL}>Nationalité</label>
                    <input {...register('nationalite')} className={INPUT} placeholder="Française" />
                </div>
                <div>
                    <label className={LABEL}>Téléphone</label>
                    <input type="tel" {...register('telephone')} className={INPUT} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/40 border-b border-white/10 pb-2">
                    Adresse postale
                </h3>
                <div>
                    <label className={LABEL}>Adresse</label>
                    <input {...register('adresse')} className={INPUT} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={LABEL}>Code postal</label>
                        <input {...register('cp')} className={INPUT} />
                    </div>
                    <div>
                        <label className={LABEL}>Ville</label>
                        <input {...register('ville')} className={INPUT} />
                    </div>
                </div>
            </div>

            {isMineur && (
                <div className="space-y-4 border border-amber-500/20 bg-amber-500/5 p-4">
                    <h3 className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                        Responsable légal
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Prénom</label>
                            <input {...register('responsable_prenom')} className={INPUT} />
                        </div>
                        <div>
                            <label className={LABEL}>Nom</label>
                            <input {...register('responsable_nom')} className={INPUT} />
                        </div>
                        <div>
                            <label className={LABEL}>Lien (père, mère, tuteur…)</label>
                            <input {...register('responsable_lien')} className={INPUT} />
                        </div>
                        <div>
                            <label className={LABEL}>Téléphone</label>
                            <input type="tel" {...register('responsable_tel')} className={INPUT} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={LABEL}>Email</label>
                            <input type="email" {...register('responsable_email')} className={INPUT} />
                            {errors.responsable_email && <p className="text-xs text-red-400 mt-1">{errors.responsable_email.message}</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="px-8 py-3 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                </button>

            </div>
        </form>
    )
}
