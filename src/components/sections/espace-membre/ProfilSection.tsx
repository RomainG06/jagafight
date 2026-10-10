import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../../lib/supabase'
import type { Document, Membre } from '../../../lib/supabase'

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
    documents: Document[]
    onSaved: () => void
}

const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors placeholder:text-white/20'
const TODAY = new Date()
const PHOTO_MAX_SIZE_BYTES = 5 * 1024 * 1024
const PHOTO_EXTENSION_BY_MIME: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

function isUnder18(dateString: string) {
    const birthDate = new Date(`${dateString}T00:00:00`)
    let age = TODAY.getFullYear() - birthDate.getFullYear()
    const birthdayHasPassed =
        TODAY.getMonth() > birthDate.getMonth()
        || (TODAY.getMonth() === birthDate.getMonth() && TODAY.getDate() >= birthDate.getDate())
    if (!birthdayHasPassed) age -= 1
    return age < 18
}

export default function ProfilSection({ membre, userId, documents, onSaved }: Props) {
    const existingPhoto = documents.find(document => document.type === 'photo_identite')
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null)
    const [existingPhotoLoading, setExistingPhotoLoading] = useState(false)
    const [photoError, setPhotoError] = useState('')
    const [photoUploading, setPhotoUploading] = useState(false)
    const previewUrlRef = useRef<string | null>(null)

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

    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: membreValues,
    })

    const dateNaissance = useWatch({ control, name: 'date_naissance' })
    const isMineur = !!dateNaissance && isUnder18(dateNaissance)

    useEffect(() => {
        reset(membreValues)
    }, [membreValues, reset])

    useEffect(() => () => {
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }, [])

    useEffect(() => {
        let active = true

        async function loadExistingPhoto() {
            if (!existingPhoto?.storage_path) {
                setExistingPhotoUrl(null)
                setExistingPhotoLoading(false)
                return
            }

            setExistingPhotoLoading(true)
            const { data, error } = await supabase.storage
                .from('documents')
                .createSignedUrl(existingPhoto.storage_path, 60 * 60)

            if (!active) return

            setExistingPhotoLoading(false)
            if (error || !data?.signedUrl) {
                setExistingPhotoUrl(null)
                setPhotoError("La photo enregistrée n'a pas pu être affichée.")
                return
            }

            setExistingPhotoUrl(data.signedUrl)
        }

        void loadExistingPhoto()
        return () => {
            active = false
        }
    }, [existingPhoto?.storage_path])

    function handlePhotoFile(file: File | null) {
        if (!file) return

        if (!PHOTO_EXTENSION_BY_MIME[file.type]) {
            setPhotoError('Format non autorisé. Utilisez une image JPG ou PNG.')
            return
        }

        if (file.size > PHOTO_MAX_SIZE_BYTES) {
            setPhotoError('La photo ne doit pas dépasser 5 Mo.')
            return
        }

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
        const previewUrl = URL.createObjectURL(file)
        previewUrlRef.current = previewUrl
        setPhotoFile(file)
        setPhotoPreview(previewUrl)
        setPhotoError('')
    }

    async function uploadPhoto() {
        if (!photoFile) return
        if (!membre?.id) {
            setPhotoError("Enregistrez d'abord votre profil avant d'ajouter une photo.")
            return
        }

        const extension = PHOTO_EXTENSION_BY_MIME[photoFile.type]
        const storagePath = `membres/${membre.id}/photo_identite.${extension}`
        setPhotoUploading(true)
        setPhotoError('')

        const { error: storageError } = await supabase.storage
            .from('documents')
            .upload(storagePath, photoFile, { upsert: true })

        if (storageError) {
            setPhotoError("La photo n'a pas pu être envoyée.")
            setPhotoUploading(false)
            return
        }

        const payload = {
            membre_id: membre.id,
            type: 'photo_identite' as const,
            storage_path: storagePath,
        }
        const { error: documentError } = existingPhoto?.id
            ? await supabase.from('documents').update(payload).eq('id', existingPhoto.id)
            : await supabase.from('documents').insert(payload)

        if (documentError) {
            setPhotoError("La photo a été envoyée, mais son enregistrement a échoué.")
            setPhotoUploading(false)
            return
        }

        if (existingPhoto?.storage_path && existingPhoto.storage_path !== storagePath) {
            await supabase.storage.from('documents').remove([existingPhoto.storage_path])
        }

        setPhotoFile(null)
        setPhotoUploading(false)
        onSaved()
    }

    async function onSubmit(values: FormValues) {
        const { error } = await supabase.from('membres').upsert({
            user_id: userId,
            ...values,
            est_mineur: isMineur,
        }, { onConflict: 'user_id' })

        if (!error) onSaved()
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <fieldset>
                <legend className={LABEL}>Civilité</legend>
                <div className="flex gap-6">
                    {(['M.', 'Mme'] as const).map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value={c} {...register('civilite')} className="accent-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071]" />
                            <span className="text-sm text-[#F5F5F0]/70">{c}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="profil-prenom" className={LABEL}>Prénom *</label>
                    <input id="profil-prenom" autoComplete="given-name" {...register('prenom')} className={INPUT} />
                    {errors.prenom && <p className="text-xs text-red-400 mt-1">{errors.prenom.message}</p>}
                </div>
                <div>
                    <label htmlFor="profil-nom" className={LABEL}>Nom *</label>
                    <input id="profil-nom" autoComplete="family-name" {...register('nom')} className={INPUT} />
                    {errors.nom && <p className="text-xs text-red-400 mt-1">{errors.nom.message}</p>}
                </div>
                <div>
                    <label htmlFor="profil-date-naissance" className={LABEL}>Date de naissance *</label>
                    <input id="profil-date-naissance" type="date" autoComplete="bday" {...register('date_naissance')} className={INPUT} />
                    {errors.date_naissance && <p className="text-xs text-red-400 mt-1">{errors.date_naissance.message}</p>}
                    {isMineur && (
                        <p className="text-xs text-amber-400 mt-1">Mineur — les informations du responsable légal sont requises ci-dessous.</p>
                    )}
                </div>
                <div>
                    <label htmlFor="profil-lieu-naissance" className={LABEL}>Lieu de naissance</label>
                    <input id="profil-lieu-naissance" {...register('lieu_naissance')} className={INPUT} />
                </div>
                <div>
                    <label htmlFor="profil-nationalite" className={LABEL}>Nationalité</label>
                    <input id="profil-nationalite" {...register('nationalite')} className={INPUT} placeholder="Française" />
                </div>
                <div>
                    <label htmlFor="profil-telephone" className={LABEL}>Téléphone</label>
                    <input id="profil-telephone" type="tel" autoComplete="tel" {...register('telephone')} className={INPUT} />
                </div>
            </div>

            <div className="space-y-4">

                <div>
                    <label htmlFor="profil-adresse" className={LABEL}>Adresse</label>
                    <input id="profil-adresse" autoComplete="street-address" {...register('adresse')} className={INPUT} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="profil-code-postal" className={LABEL}>Code postal</label>
                        <input id="profil-code-postal" inputMode="numeric" autoComplete="postal-code" {...register('cp')} className={INPUT} />
                    </div>
                    <div>
                        <label htmlFor="profil-ville" className={LABEL}>Ville</label>
                        <input id="profil-ville" autoComplete="address-level2" {...register('ville')} className={INPUT} />
                    </div>
                </div>
            </div>

            <section className="border border-white/10 bg-white/[0.02] p-5" aria-labelledby="photo-adherent-title">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5">
                        {photoPreview || existingPhotoUrl ? (
                            <img
                                src={photoPreview ?? existingPhotoUrl ?? undefined}
                                alt={`Photo de ${membre?.prenom ?? "l'adhérent"} ${membre?.nom ?? ''}`.trim()}
                                width="112"
                                height="112"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="px-3 text-center text-xs text-[#F5F5F0]/35">
                                {existingPhotoLoading ? 'Chargement…' : 'Aucune photo'}
                            </span>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 id="photo-adherent-title" className="text-sm text-[#F5F5F0]">Photo de l'adhérent</h3>
                        <p className="mt-1 text-xs leading-relaxed text-[#F5F5F0]/50">
                            Portrait récent utilisé par le club pour identifier l'adhérent. Ce fichier n'est pas un document officiel d'identité.
                        </p>
                        {existingPhoto && !photoFile && <p className="mt-2 text-xs text-green-400">✓ Photo enregistrée</p>}

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <input
                                id="photo-adherent"
                                type="file"
                                accept="image/jpeg,image/png"
                                capture="user"
                                className="peer sr-only"
                                onChange={event => handlePhotoFile(event.target.files?.[0] ?? null)}
                            />
                            <label htmlFor="photo-adherent" className="cursor-pointer border border-white/20 px-4 py-2 text-xs uppercase tracking-widest text-[#F5F5F0]/70 transition-colors hover:border-white/40 hover:text-[#F5F5F0] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#eb0071]">
                                {existingPhoto ? 'Remplacer la photo' : 'Choisir une photo'}
                            </label>
                            {photoFile && (
                                <button type="button" onClick={uploadPhoto} disabled={photoUploading} className="bg-[#eb0071] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#F5F5F0] transition-opacity hover:opacity-90 disabled:opacity-50">
                                    {photoUploading ? 'Envoi…' : 'Envoyer la photo'}
                                </button>
                            )}
                            <span className="text-xs text-[#F5F5F0]/30">JPG ou PNG — 5 Mo max.</span>
                        </div>

                        {photoError && <p role="alert" className="mt-3 text-xs text-red-400">{photoError}</p>}
                    </div>
                </div>
            </section>

            {isMineur && (
                <div className="space-y-4 border border-amber-500/20 bg-amber-500/5 p-4">
                    <h3 className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                        Responsable légal
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="responsable-prenom" className={LABEL}>Prénom</label>
                            <input id="responsable-prenom" autoComplete="given-name" {...register('responsable_prenom')} className={INPUT} />
                        </div>
                        <div>
                            <label htmlFor="responsable-nom" className={LABEL}>Nom</label>
                            <input id="responsable-nom" autoComplete="family-name" {...register('responsable_nom')} className={INPUT} />
                        </div>
                        <div>
                            <label htmlFor="responsable-lien" className={LABEL}>Lien (père, mère, tuteur…)</label>
                            <input id="responsable-lien" {...register('responsable_lien')} className={INPUT} />
                        </div>
                        <div>
                            <label htmlFor="responsable-telephone" className={LABEL}>Téléphone</label>
                            <input id="responsable-telephone" type="tel" autoComplete="tel" {...register('responsable_tel')} className={INPUT} />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="responsable-email" className={LABEL}>Email</label>
                            <input id="responsable-email" type="email" autoComplete="email" spellCheck={false} {...register('responsable_email')} className={INPUT} />
                            {errors.responsable_email && <p className="text-xs text-red-400 mt-1">{errors.responsable_email.message}</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="px-8 py-3 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                </button>

            </div>
        </form>
    )
}
