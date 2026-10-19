import { useState } from 'react'
import type { Membre } from '../../lib/supabase'
import { isUnder18 } from '../../lib/memberProfile'

export type MemberProfileValues = {
    civilite: 'M.' | 'Mme'
    prenom: string
    nom: string
    date_naissance: string
    lieu_naissance: string
    nationalite: string
    adresse: string
    cp: string
    ville: string
    email: string
    telephone: string
    responsable_nom: string
    responsable_prenom: string
    responsable_lien: string
    responsable_tel: string
    responsable_email: string
}

interface Props {
    membre?: Membre | null
    submitLabel: string
    submitting?: boolean
    onSubmit: (values: MemberProfileValues) => Promise<void>
    onCancel: () => void
}

const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-2 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors'

function valuesFromMembre(membre?: Membre | null): MemberProfileValues {
    return {
        civilite: membre?.civilite ?? 'M.',
        prenom: membre?.prenom ?? '',
        nom: membre?.nom ?? '',
        date_naissance: membre?.date_naissance ?? '',
        lieu_naissance: membre?.lieu_naissance ?? '',
        nationalite: membre?.nationalite ?? '',
        adresse: membre?.adresse ?? '',
        cp: membre?.cp ?? '',
        ville: membre?.ville ?? '',
        email: membre?.email ?? '',
        telephone: membre?.telephone ?? '',
        responsable_nom: membre?.responsable_nom ?? '',
        responsable_prenom: membre?.responsable_prenom ?? '',
        responsable_lien: membre?.responsable_lien ?? '',
        responsable_tel: membre?.responsable_tel ?? '',
        responsable_email: membre?.responsable_email ?? '',
    }
}

export default function MemberProfileForm({ membre, submitLabel, submitting = false, onSubmit, onCancel }: Props) {
    const [values, setValues] = useState<MemberProfileValues>(() => valuesFromMembre(membre))
    const [formError, setFormError] = useState('')
    const isMineur = Boolean(values.date_naissance) && isUnder18(values.date_naissance)

    function update<K extends keyof MemberProfileValues>(key: K, value: MemberProfileValues[K]) {
        setValues(current => ({ ...current, [key]: value }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setFormError('')

        if (isMineur && [
            values.responsable_nom,
            values.responsable_prenom,
            values.responsable_lien,
            values.responsable_tel,
            values.responsable_email,
        ].some(value => !value.trim())) {
            setFormError('Les coordonnées du responsable légal sont obligatoires pour un mineur.')
            return
        }

        await onSubmit(Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]),
        ) as MemberProfileValues)
    }

    return (
        <form onSubmit={handleSubmit} className="border border-white/10 p-4 sm:p-5">
            <p className="mb-4 text-xs text-[#F5F5F0]/45">Les champs marqués d’un astérisque sont obligatoires.</p>
            {formError && <p role="alert" className="mb-4 border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">{formError}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Civilité *" htmlFor="membre-civilite">
                    <select id="membre-civilite" value={values.civilite} onChange={event => update('civilite', event.target.value as MemberProfileValues['civilite'])} className={INPUT}>
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                    </select>
                </Field>
                <TextField label="Prénom *" name="prenom" value={values.prenom} onChange={value => update('prenom', value)} />
                <TextField label="Nom *" name="nom" value={values.nom} onChange={value => update('nom', value)} />
                <TextField label="Date de naissance *" name="date-naissance" type="date" value={values.date_naissance} onChange={value => update('date_naissance', value)} />
                <TextField label="Lieu de naissance *" name="lieu-naissance" value={values.lieu_naissance} onChange={value => update('lieu_naissance', value)} />
                <TextField label="Nationalité *" name="nationalite" value={values.nationalite} onChange={value => update('nationalite', value)} />
                <TextField label="Adresse *" name="adresse" value={values.adresse} onChange={value => update('adresse', value)} />
                <TextField label="Code postal *" name="cp" value={values.cp} onChange={value => update('cp', value)} />
                <TextField label="Ville *" name="ville" value={values.ville} onChange={value => update('ville', value)} />
                <TextField label="Email *" name="email" type="email" value={values.email} onChange={value => update('email', value)} />
                <TextField label="Téléphone *" name="telephone" type="tel" value={values.telephone} onChange={value => update('telephone', value)} />
            </div>

            {isMineur && (
                <div className="mt-6 border-t border-white/10 pt-5">
                    <h3 className="mb-4 text-sm tracking-widest uppercase text-[#F5F5F0]">Responsable légal</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <TextField label="Prénom *" name="responsable-prenom" value={values.responsable_prenom} onChange={value => update('responsable_prenom', value)} />
                        <TextField label="Nom *" name="responsable-nom" value={values.responsable_nom} onChange={value => update('responsable_nom', value)} />
                        <TextField label="Lien *" name="responsable-lien" value={values.responsable_lien} onChange={value => update('responsable_lien', value)} />
                        <TextField label="Téléphone *" name="responsable-tel" type="tel" value={values.responsable_tel} onChange={value => update('responsable_tel', value)} />
                        <TextField label="Email *" name="responsable-email" type="email" value={values.responsable_email} onChange={value => update('responsable_email', value)} />
                    </div>
                </div>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button type="submit" disabled={submitting} className="px-6 py-2 text-xs font-semibold uppercase tracking-widest bg-[#eb0071] text-[#F5F5F0] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                    {submitting ? 'Enregistrement…' : submitLabel}
                </button>
                <button type="button" onClick={onCancel} disabled={submitting} className="px-4 py-2 text-xs text-[#F5F5F0]/50 hover:text-[#F5F5F0] disabled:opacity-50">
                    Annuler
                </button>
            </div>
        </form>
    )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
    return <div><label htmlFor={htmlFor} className={LABEL}>{label}</label>{children}</div>
}

function TextField({ label, name, type = 'text', value, onChange }: { label: string; name: string; type?: string; value: string; onChange: (value: string) => void }) {
    const id = `membre-${name}`
    return (
        <Field label={label} htmlFor={id}>
            <input id={id} name={name} type={type} value={value} onChange={event => onChange(event.target.value)} required className={INPUT} />
        </Field>
    )
}
