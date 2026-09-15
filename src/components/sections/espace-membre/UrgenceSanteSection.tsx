import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../../lib/supabase'
import type { Membre } from '../../../lib/supabase'

const schema = z.object({
    urgence_nom: z.string().min(1, 'Requis'),
    urgence_lien: z.string().min(1, 'Requis'),
    urgence_tel: z.string().min(1, 'Requis'),
    sante_infos: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
    membre: Membre | null
    userId: string
    onSaved: () => void
}

const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:outline-none focus:border-[#eb0071] transition-colors'

export default function UrgenceSanteSection({ membre, userId, onSaved }: Props) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            urgence_nom: membre?.urgence_nom ?? '',
            urgence_lien: membre?.urgence_lien ?? '',
            urgence_tel: membre?.urgence_tel ?? '',
            sante_infos: membre?.sante_infos ?? '',
        },
    })

    useEffect(() => {
        if (membre) reset({
            urgence_nom: membre.urgence_nom ?? '',
            urgence_lien: membre.urgence_lien ?? '',
            urgence_tel: membre.urgence_tel ?? '',
            sante_infos: membre.sante_infos ?? '',
        })
    }, [membre, reset])

    async function onSubmit(values: FormValues) {
        const { error } = await supabase.from('membres').upsert(
            { user_id: userId, ...values },
            { onConflict: 'user_id' }
        )
        if (!error) onSaved()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/40 border-b border-white/10 pb-2">
                    Contact en cas d'urgence
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className={LABEL}>Nom *</label>
                        <input {...register('urgence_nom')} className={INPUT} />
                        {errors.urgence_nom && <p className="text-xs text-red-400 mt-1">{errors.urgence_nom.message}</p>}
                    </div>
                    <div>
                        <label className={LABEL}>Lien (famille, ami…) *</label>
                        <input {...register('urgence_lien')} className={INPUT} />
                        {errors.urgence_lien && <p className="text-xs text-red-400 mt-1">{errors.urgence_lien.message}</p>}
                    </div>
                    <div>
                        <label className={LABEL}>Téléphone *</label>
                        <input type="tel" {...register('urgence_tel')} className={INPUT} />
                        {errors.urgence_tel && <p className="text-xs text-red-400 mt-1">{errors.urgence_tel.message}</p>}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/40 border-b border-white/10 pb-2">
                    Informations de santé
                </h3>
                <div className="bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-xs text-amber-400/80">
                    Ces informations sont facultatives et à caractère sensible. Elles sont accessibles uniquement par le responsable du club, conformément au RGPD.
                </div>
                <textarea
                    {...register('sante_infos')}
                    rows={4}
                    placeholder="Allergies, traitements en cours, antécédents médicaux à signaler…"
                    className={`${INPUT} resize-none placeholder:text-white/20`}
                />
            </div>

            <div className="flex justify-end">
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
