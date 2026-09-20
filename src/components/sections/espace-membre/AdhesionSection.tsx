import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../../lib/supabase'
import type { Adhesion, Saison } from '../../../lib/supabase'
import { DISCIPLINES, FORMULES, REGLEMENT_VERSION, CGV_VERSION } from '../../../data/inscriptionConfig'
import { calculerTarif } from '../../../data/tarifsConfig'
import type { FormuleId } from '../../../data/inscriptionConfig'

const schema = z.object({
    disciplines: z.array(z.string()).min(1, 'Sélectionnez au moins une discipline'),
    statut_pratique: z.enum(['loisir', 'competiteur']),
    licence_numero: z.string().optional(),
    palmares: z.string().optional(),
    poids_categorie: z.string().optional(),
    formule_tarifaire: z.string().min(1, 'Choisissez une formule'),
    code_promo: z.string().optional(),
    date_debut_souhaitee: z.string().optional(),
    saison_id: z.string().min(1, 'Aucune saison active trouvée'),
})

type FormValues = z.infer<typeof schema>

interface Props {
    membreId: string
    adhesion: Adhesion | null
    saisons: Saison[]
    onSaved: () => void
}

const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors'
const SELECT = `${INPUT} appearance-none`

export default function AdhesionSection({ membreId, adhesion, saisons, onSaved }: Props) {
    console.log('adhesion:', adhesion)
    const saisonActive = saisons.find(s => s.active)
    console.log('saisonActive:', saisonActive)

    const { register, handleSubmit, watch, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            disciplines: adhesion?.disciplines ?? [],
            statut_pratique: adhesion?.statut_pratique ?? 'loisir',
            licence_numero: adhesion?.licence_numero ?? '',
            palmares: adhesion?.palmares ?? '',
            poids_categorie: adhesion?.poids_categorie ?? '',
            formule_tarifaire: adhesion?.formule_tarifaire ?? '',
            code_promo: adhesion?.code_promo ?? '',
            date_debut_souhaitee: adhesion?.date_debut_souhaitee ?? '',
            saison_id: adhesion?.saison_id ?? saisonActive?.id ?? '',
        },
    })

    const statut = watch('statut_pratique')
    const formule = watch('formule_tarifaire') as FormuleId
    const montant = formule ? calculerTarif(formule as FormuleId, watch('code_promo')) : null

    useEffect(() => {
        if (adhesion) reset({
            disciplines: adhesion.disciplines ?? [],
            statut_pratique: adhesion.statut_pratique ?? 'loisir',
            licence_numero: adhesion.licence_numero ?? '',
            palmares: adhesion.palmares ?? '',
            poids_categorie: adhesion.poids_categorie ?? '',
            formule_tarifaire: adhesion.formule_tarifaire ?? '',
            code_promo: adhesion.code_promo ?? '',
            date_debut_souhaitee: adhesion.date_debut_souhaitee ?? '',
            saison_id: adhesion.saison_id ?? saisonActive?.id ?? '',
        })
    }, [adhesion, saisonActive, reset])

    async function onSubmit(values: FormValues) {
        const payload = {
            membre_id: membreId,
            ...values,
            montant_calcule: montant ?? 0,
            reglement_version: REGLEMENT_VERSION,
            cgv_version: CGV_VERSION,
        }

        const { error } = adhesion?.id
            ? await supabase.from('adhesions').update(payload).eq('id', adhesion.id)
            : await supabase.from('adhesions').insert(payload)

        if (!error) onSaved()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Disciplines */}
            <div>
                <span className={LABEL}>Discipline(s) *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {DISCIPLINES.map(d => (
                        <label key={d.id} className="flex items-center gap-3 cursor-pointer group">
                            <Controller
                                name="disciplines"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="checkbox"
                                        value={d.id}
                                        checked={field.value.includes(d.id)}
                                        onChange={e => {
                                            const next = e.target.checked
                                                ? [...field.value, d.id]
                                                : field.value.filter((v: string) => v !== d.id)
                                            field.onChange(next)
                                        }}
                                        className="accent-[#eb0071] w-4 h-4 flex-shrink-0"
                                    />
                                )}
                            />
                            <span className="text-sm text-[#F5F5F0]/70 group-hover:text-[#F5F5F0] transition-colors">{d.label}</span>
                        </label>
                    ))}
                </div>
                {errors.disciplines && <p className="text-xs text-red-400 mt-2">{errors.disciplines.message}</p>}
            </div>

            {/* Statut */}
            <div>
                <span className={LABEL}>Statut</span>
                <div className="flex gap-6 mt-2">
                    {([['loisir', 'Loisir'], ['competiteur', 'Compétiteur']] as const).map(([val, lbl]) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={val} {...register('statut_pratique')} className="accent-[#eb0071]" />
                            <span className="text-sm text-[#F5F5F0]/70">{lbl}</span>
                        </label>
                    ))}
                </div>
            </div>

            {statut === 'competiteur' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-[#eb0071]/20 bg-[#eb0071]/5 p-4">
                    <div>
                        <label className={LABEL}>N° de licence</label>
                        <input {...register('licence_numero')} className={INPUT} />
                    </div>
                    <div>
                        <label className={LABEL}>Poids de catégorie</label>
                        <input {...register('poids_categorie')} className={INPUT} placeholder="ex: -67 kg" />
                    </div>
                    <div>
                        <label className={LABEL}>Palmarès</label>
                        <input {...register('palmares')} className={INPUT} />
                    </div>
                </div>
            )}

            {/* Formule */}
            <div>
                <label className={LABEL}>Formule tarifaire *</label>
                <select {...register('formule_tarifaire')} className={SELECT}>
                    <option value="">— Choisir —</option>
                    {FORMULES.map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                </select>
                {errors.formule_tarifaire && <p className="text-xs text-red-400 mt-1">{errors.formule_tarifaire.message}</p>}
                {montant !== null && (
                    <p className="text-sm text-[#F5F5F0]/60 mt-2">
                        Montant calculé : <span className="text-[#F5F5F0] font-semibold">
                            {montant === 0 ? 'à définir' : `${montant} €`}
                        </span>
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={LABEL}>Code promo / Coupon sport</label>
                    <input {...register('code_promo')} className={INPUT} placeholder="Optionnel" />
                </div>
                <div>
                    <label className={LABEL}>Date de début souhaitée</label>
                    <input type="date" {...register('date_debut_souhaitee')} className={INPUT} />
                </div>
            </div>

            {/* Saison */}
            <div>
                <label className={LABEL}>Saison</label>
                {saisonActive ? (
                    <p className="text-sm text-[#F5F5F0]/60 mt-1">
                        Saison active : <span className="text-[#F5F5F0]">{saisonActive.label}</span>
                    </p>
                ) : (
                    <p className="text-xs text-amber-400">Aucune saison active. Contactez le club.</p>
                )}
                {errors.saison_id && <p className="text-xs text-red-400 mt-1">{errors.saison_id.message}</p>}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="px-8 py-3 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-default"
                >
                    {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                </button>
            </div>
        </form>
    )
}
