import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Adhesion } from '../../../lib/supabase'
import {
    REGLEMENT_VERSION, REGLEMENT_DATE,
    CGV_VERSION, CGV_DATE,
} from '../../../data/inscriptionConfig'

interface Props {
    adhesion: Adhesion | null
    userId: string
    onSaved: () => void
}

export default function LegalSignatureSection({ adhesion, userId, onSaved }: Props) {
    const [consentDonnees, setConsentDonnees] = useState(false)
    const [droitsImage, setDroitsImage] = useState(false)
    const [reglement, setReglement] = useState(false)
    const [cgv, setCgv] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [SignatureCanvas, setSignatureCanvas] = useState<typeof import('react-signature-canvas').default | null>(null)

    useEffect(() => {
        let cancelled = false
        import('react-signature-canvas').then(module => {
            if (!cancelled) setSignatureCanvas(() => module.default)
        })
        return () => { cancelled = true }
    }, [])

    const sigCanvasRef = useRef<{ isEmpty(): boolean; clear(): void; toDataURL(type?: string): string } | null>(null)

    const isSigned = !!adhesion?.signature_base64

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (!consentDonnees || !reglement || !cgv) {
            setError('Veuillez cocher toutes les cases obligatoires.')
            return
        }
        if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
            setError('Veuillez apposer votre signature.')
            return
        }

        setSaving(true)
        const signatureBase64 = sigCanvasRef.current.toDataURL('image/png')
        const now = new Date().toISOString()

        if (adhesion?.id) {
            await supabase.from('adhesions').update({
                signature_base64: signatureBase64,
                signature_horodatee: now,
                droits_image: droitsImage,
                reglement_version: REGLEMENT_VERSION,
                cgv_version: CGV_VERSION,
            }).eq('id', adhesion.id)
        }

        await supabase.from('membres').upsert(
            { user_id: userId, profil_complet: true },
            { onConflict: 'user_id' }
        )

        setSaving(false)
        onSaved()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {isSigned && (
                <div className="bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400">
                    ✓ Dossier signé — Profil complet
                </div>
            )}

            {!adhesion?.id && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-400">
                    Complétez la section "Mon adhésion" avant de signer.
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/40 border-b border-white/10 pb-2">
                    Consentements
                </h3>

                <CheckRow
                    id="consent-donnees"
                    checked={consentDonnees}
                    onChange={setConsentDonnees}
                    required
                    label={<>
                        J'accepte le traitement de mes données personnelles conformément à la{' '}
                        <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer" className="text-[#eb0071] hover:underline">
                            politique de confidentialité
                        </a>.
                    </>}
                />

                <CheckRow
                    id="droits-image"
                    checked={droitsImage}
                    onChange={setDroitsImage}
                    label="J'autorise l'utilisation de mon image (photos / vidéos) sur les réseaux sociaux et communications du club. (Optionnel)"
                />

                <CheckRow
                    id="reglement"
                    checked={reglement}
                    onChange={setReglement}
                    required
                    label={<>
                        J'ai lu et j'accepte le{' '}
                        <span className="text-[#F5F5F0]">règlement intérieur</span>{' '}
                        (version {REGLEMENT_VERSION} du {REGLEMENT_DATE}).
                    </>}
                />

                <CheckRow
                    id="cgv"
                    checked={cgv}
                    onChange={setCgv}
                    required
                    label={<>
                        J'accepte les{' '}
                        <span className="text-[#F5F5F0]">conditions générales d'adhésion</span>{' '}
                        (version {CGV_VERSION} du {CGV_DATE}).
                    </>}
                />
            </div>

            <div className="text-xs text-[#F5F5F0]/30 border border-white/5 px-4 py-3">
                Vos données sont conservées 12 mois après votre adhésion. Pour exercer vos droits (accès, rectification, suppression), contactez{' '}
                <a href="mailto:contact@jagafight.fr" className="text-[#eb0071] hover:underline">contact@jagafight.fr</a>.
            </div>

            <div>
                <span className="block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-3">
                    Signature électronique *
                </span>
                {SignatureCanvas ? (
                    <div className="border border-white/20 bg-white rounded-sm overflow-hidden">
                        <SignatureCanvas
                            ref={sigCanvasRef as React.RefObject<InstanceType<typeof SignatureCanvas>>}
                            penColor="#0a0a0a"
                            canvasProps={{ width: 500, height: 150, className: 'w-full' }}
                        />
                    </div>
                ) : (
                    <div className="border border-white/10 bg-white/5 h-36 flex items-center justify-center">
                        <span className="text-xs text-[#F5F5F0]/20">Chargement…</span>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => sigCanvasRef.current?.clear()}
                    className="mt-2 text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors tracking-widest uppercase"
                >
                    Effacer
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-3">{error}</p>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving || !adhesion?.id}
                    className="px-8 py-3 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-default"
                >
                    {saving ? 'Signature en cours…' : 'Signer et finaliser mon dossier'}
                </button>
            </div>
        </form>
    )
}

function CheckRow({ id, checked, onChange, required, label }: {
    id: string
    checked: boolean
    onChange: (v: boolean) => void
    required?: boolean
    label: React.ReactNode
}) {
    return (
        <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="accent-[#eb0071] w-4 h-4 mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-[#F5F5F0]/60 group-hover:text-[#F5F5F0]/80 transition-colors leading-relaxed">
                {label}
                {required && <span className="text-[#eb0071] ml-1">*</span>}
            </span>
        </label>
    )
}
