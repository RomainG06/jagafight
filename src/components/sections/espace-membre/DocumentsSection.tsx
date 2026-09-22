import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Document } from '../../../lib/supabase'
import { DOC_ACCEPT, DOC_MAX_SIZE_MB, DOC_TYPES } from '../../../data/inscriptionConfig'

interface DocEntry {
    type: keyof typeof DOC_TYPES
    label: string
    required: boolean
    accept?: string
    showDateValidite?: boolean
    showCrop?: boolean
}

const DOC_CONFIG: DocEntry[] = [
    { type: 'CERTIFICAT_MEDICAL', label: 'Certificat médical', required: true, accept: DOC_ACCEPT, showDateValidite: true },
    { type: 'PHOTO_IDENTITE', label: "Photo d'identité", required: false, accept: 'image/jpeg,image/png', showCrop: true },
    { type: 'LICENCE', label: 'Licence fédérale', required: false, accept: DOC_ACCEPT },
    { type: 'PIECE_IDENTITE', label: "Pièce d'identité", required: false, accept: DOC_ACCEPT },
]

const FILE_EXTENSION_BY_MIME: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

interface Props {
    membreId: string
    documents: Document[]
    onSaved: () => void
}

interface FileState {
    file: File | null
    preview: string | null
    dateValidite: string
    error: string
    uploading: boolean
}

const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-3 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors'

export default function DocumentsSection({ membreId, documents, onSaved }: Props) {
    const [fileStates, setFileStates] = useState<Record<string, FileState>>(() =>
        Object.fromEntries(DOC_CONFIG.map(d => [d.type, { file: null, preview: null, dateValidite: '', error: '', uploading: false }]))
    )
    const objectUrlsRef = useRef(new Set<string>())

    const existingByType = Object.fromEntries(documents.map(d => [d.type, d]))

    function setField<K extends keyof FileState>(type: string, key: K, value: FileState[K]) {
        setFileStates(prev => ({ ...prev, [type]: { ...prev[type], [key]: value } }))
    }

    function handleFile(cfg: DocEntry, file: File | null) {
        if (!file) return
        const allowedTypes = (cfg.accept ?? DOC_ACCEPT).split(',')
        if (!allowedTypes.includes(file.type) || !FILE_EXTENSION_BY_MIME[file.type]) {
            setField(cfg.type, 'error', 'Format non autorisé. Utilisez un PDF, JPG ou PNG.')
            return
        }
        if (file.size > DOC_MAX_SIZE_MB * 1024 * 1024) {
            setField(cfg.type, 'error', `Taille max : ${DOC_MAX_SIZE_MB} Mo`)
            return
        }
        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        if (preview) objectUrlsRef.current.add(preview)
        setFileStates(prev => {
            const previousPreview = prev[cfg.type].preview
            if (previousPreview) {
                URL.revokeObjectURL(previousPreview)
                objectUrlsRef.current.delete(previousPreview)
            }
            return { ...prev, [cfg.type]: { ...prev[cfg.type], file, preview, error: '' } }
        })
    }

    // Revoke object URLs on unmount
    useEffect(() => {
        const objectUrls = objectUrlsRef.current
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url))
            objectUrls.clear()
        }
    }, [])

    async function uploadDoc(cfg: DocEntry) {
        const state = fileStates[cfg.type]
        if (!state.file) return
        setField(cfg.type, 'uploading', true)
        setField(cfg.type, 'error', '')

        const ext = FILE_EXTENSION_BY_MIME[state.file.type]
        if (!ext) {
            setField(cfg.type, 'error', 'Format de fichier non autorisé.')
            setField(cfg.type, 'uploading', false)
            return
        }
        const path = `membres/${membreId}/${DOC_TYPES[cfg.type]}.${ext}`

        const { error: storageError } = await supabase.storage
            .from('documents')
            .upload(path, state.file, { upsert: true })

        if (storageError) {
            setField(cfg.type, 'error', 'Erreur lors de l\'upload.')
            setField(cfg.type, 'uploading', false)
            return
        }

        const docType = DOC_TYPES[cfg.type] as Document['type']
        const existing = existingByType[docType]
        const payload = {
            membre_id: membreId,
            type: docType,
            storage_path: path,
            date_validite: state.dateValidite || undefined,
        }

        const { error: dbError } = existing?.id
            ? await supabase.from('documents').update(payload).eq('id', existing.id)
            : await supabase.from('documents').insert(payload)

        if (!dbError) {
            setField(cfg.type, 'uploading', false)
            onSaved()
        } else {
            setField(cfg.type, 'error', 'Erreur lors de l\'enregistrement.')
            setField(cfg.type, 'uploading', false)
        }
    }

    return (
        <div className="space-y-8">
            {DOC_CONFIG.map(cfg => {
                const state = fileStates[cfg.type]
                const existing = existingByType[DOC_TYPES[cfg.type] as Document['type']]
                const inputId = `document-${cfg.type.toLowerCase()}`
                const dateId = `${inputId}-date-validite`

                return (
                    <div key={cfg.type} className="border border-white/10 p-5 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-s text-[#F5F5F0] tracking-wide">
                                    {cfg.label}
                                    {cfg.required && <span className="text-[#eb0071] ml-1">*</span>}
                                </h3>
                                {existing && (
                                    <p className="text-xs text-green-400 mt-0.5">✓ Document enregistré</p>
                                )}
                            </div>
                            {existing?.date_validite && (
                                <span className={`text-xs px-2 py-0.5 border ${isExpiringSoon(existing.date_validite)
                                    ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                                    : 'border-green-500/30 text-green-400 bg-green-500/10'
                                    }`}>
                                    Valide jusqu'au {new Date(existing.date_validite).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                        </div>

                        {/* Preview */}
                        {state.preview && (
                            <img src={state.preview} alt={`Aperçu du fichier ${cfg.label.toLowerCase()}`} width="96" height="96" className="h-24 w-24 object-cover border border-white/10" />
                        )}
                        {state.file && !state.preview && (
                            <p className="text-xs text-[#F5F5F0]/40">
                                {state.file.name} ({(state.file.size / 1024 / 1024).toFixed(2)} Mo)
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3 items-end">
                            <div>
                                <input
                                    id={inputId}
                                    type="file"
                                    accept={cfg.accept ?? DOC_ACCEPT}
                                    className="peer sr-only"
                                    onChange={e => handleFile(cfg, e.target.files?.[0] ?? null)}
                                />
                                <label
                                    htmlFor={inputId}
                                    className="inline-block px-4 py-2 border border-white/20 text-[#F5F5F0]/60 text-xs tracking-widest uppercase hover:border-white/40 hover:text-[#F5F5F0] transition-colors cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#eb0071]"
                                >
                                    {existing ? 'Remplacer' : 'Choisir un fichier'}
                                </label>
                                <span className="text-xs text-[#F5F5F0]/30 ml-2">
                                    PDF, JPG ou PNG — max {DOC_MAX_SIZE_MB} Mo
                                </span>
                            </div>

                            {cfg.showDateValidite && (
                                <div>
                                    <label htmlFor={dateId} className={LABEL}>Date de validité du certificat</label>
                                    <input
                                        id={dateId}
                                        type="date"
                                        name={`${cfg.type.toLowerCase()}-date-validite`}
                                        value={state.dateValidite}
                                        onChange={e => setField(cfg.type, 'dateValidite', e.target.value)}
                                        className={INPUT}
                                    />
                                </div>
                            )}

                            {state.file && (
                                <button
                                    type="button"
                                    onClick={() => uploadDoc(cfg)}
                                    disabled={state.uploading}
                                    className="px-6 py-2 bg-[#eb0071] text-[#F5F5F0] text-xs font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {state.uploading ? 'Envoi…' : 'Envoyer'}
                                </button>
                            )}
                        </div>

                        {state.error && (
                            <p role="alert" className="text-xs text-red-400">{state.error}</p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function isExpiringSoon(dateStr: string): boolean {
    const d = new Date(dateStr)
    const daysLeft = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return daysLeft < 30
}
