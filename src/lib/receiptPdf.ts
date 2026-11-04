// Reçu de paiement PDF aux couleurs du club (jsPDF, polices standard).
// Les polices standard de jsPDF ne gèrent que le jeu WinAnsi : on évite donc les espaces
// insécables fines de Intl (montants et dates sont formatés à la main).
import type { jsPDF as JsPdf } from 'jspdf'
import whiteLogo from '../assets/white_logo_jaga.png'
import type { Adhesion, Membre, Paiement } from './supabase'
import { CLUB_ADDRESS } from '../data/club'
import { PHONE_DISPLAY } from '../data/contact'

type Rgb = [number, number, number]
const BLACK: Rgb = [10, 10, 10]
const PINK: Rgb = [235, 0, 113]
const PINK_SOFT: Rgb = [253, 232, 242]
const BORDEAUX: Rgb = [141, 23, 62]
const TEXT: Rgb = [30, 30, 30]
const MUTED: Rgb = [110, 110, 110]
const LINE: Rgb = [225, 225, 225]

const CLUB_EMAIL = 'agentpro.athlete@gmail.com'
// Identité légale de l'association (voir la page Mentions légales).
const CLUB_LEGAL = 'Association loi 1901 · RNA W061018019 · SIRET 990 250 458 00017'

const MODE_LABELS: Record<Paiement['mode'], string> = { especes: 'Espèces', cheque: 'Chèque', cb: 'Carte bancaire', virement: 'Virement' }
const STATUT_LABELS: Record<Paiement['statut'], string> = { paye: 'Payé', partiel: 'Partiel', en_attente: 'En attente', echelonne: 'Échelonné' }

export type ReceiptInput = {
    membre: Membre & { id?: string }
    adhesion: Adhesion | null
    paiements: Paiement[]
    saisonLabel?: string | null
}

const pad = (n: number) => String(n).padStart(2, '0')

export function formatDateFr(value?: string | Date | null) {
    if (!value) return '—'
    const date = typeof value === 'string' ? new Date(value.length === 10 ? `${value}T12:00:00` : value) : value
    if (Number.isNaN(date.getTime())) return '—'
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export function formatEuros(value: number) {
    const [int, dec] = Math.abs(value).toFixed(2).split('.')
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return `${value < 0 ? '-' : ''}${grouped},${dec} €`
}

/**
 * Le logo est posé sur le bandeau noir : on l'aplatit sur fond noir en JPEG.
 * Un PNG transparent serait stocké non compressé par jsPDF (reçu de ~2,5 Mo au lieu de quelques dizaines de Ko).
 */
async function loadLogoAsJpeg(url: string, background: Rgb) {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('Logo introuvable'))
        img.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = Math.round((600 * image.naturalHeight) / image.naturalWidth)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas indisponible')
    context.fillStyle = `rgb(${background.join(',')})`
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.9)
}

export function receiptNumber(membre: { id?: string }, date = new Date()) {
    const suffix = (membre.id ?? '').replace(/-/g, '').slice(0, 6).toUpperCase() || 'XXXXXX'
    return `JF-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${suffix}`
}

/** Construit le reçu et renvoie le document jsPDF (à sauvegarder ou afficher). */
export async function buildReceipt({ membre, adhesion, paiements, saisonLabel }: ReceiptInput): Promise<JsPdf> {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()
    const M = 16
    const now = new Date()

    const fill = (c: Rgb) => doc.setFillColor(c[0], c[1], c[2])
    const color = (c: Rgb) => doc.setTextColor(c[0], c[1], c[2])
    const draw = (c: Rgb) => doc.setDrawColor(c[0], c[1], c[2])
    const font = (style: 'normal' | 'bold', size: number) => { doc.setFont('helvetica', style); doc.setFontSize(size) }

    // ─── En-tête noir + logo ───
    fill(BLACK)
    doc.rect(0, 0, W, 46, 'F')
    try {
        const logo = await loadLogoAsJpeg(whiteLogo, BLACK)
        doc.addImage(logo, 'JPEG', M, 9, 49, 27.7)
    } catch {
        color([245, 245, 240]); font('bold', 20); doc.text('JAGA FIGHT', M, 26)
    }
    color([245, 245, 240]); font('bold', 20)
    doc.text('REÇU DE PAIEMENT', W - M, 21, { align: 'right' })
    font('normal', 9); color([200, 200, 200])
    doc.text(`N° ${receiptNumber(membre, now)}`, W - M, 29, { align: 'right' })
    doc.text(`Émis le ${formatDateFr(now)}`, W - M, 34.5, { align: 'right' })
    fill(PINK)
    doc.rect(0, 46, W, 1.6, 'F')

    // ─── Blocs club / adhérent ───
    let y = 60
    const colW = (W - M * 2 - 8) / 2
    const block = (x: number, title: string, lines: string[]) => {
        font('bold', 8); color(PINK)
        doc.text(title.toUpperCase(), x, y, { charSpace: 0.6 })
        draw(PINK); doc.setLineWidth(0.5); doc.line(x, y + 2, x + 12, y + 2)
        let ly = y + 8
        lines.filter(Boolean).forEach((line, index) => {
            font(index === 0 ? 'bold' : 'normal', index === 0 ? 11 : 9.5)
            color(index === 0 ? TEXT : MUTED)
            const wrapped = doc.splitTextToSize(line, colW) as string[]
            doc.text(wrapped, x, ly)
            ly += wrapped.length * (index === 0 ? 5.5 : 4.6)
        })
        return ly
    }

    const clubEnd = block(M, 'Club', [
        'Jaga Fight',
        CLUB_ADDRESS.street,
        `${CLUB_ADDRESS.postalCode} ${CLUB_ADDRESS.city}`,
        `Tél. ${PHONE_DISPLAY}`,
        CLUB_EMAIL,
        'www.jagafight.fr',
        'RNA W061018019 · SIRET 990 250 458 00017',
    ])
    const memberEnd = block(M + colW + 8, 'Adhérent', [
        `${membre.civilite ? `${membre.civilite} ` : ''}${membre.prenom ?? ''} ${membre.nom ?? ''}`.trim(),
        membre.adresse ?? '',
        [membre.cp, membre.ville].filter(Boolean).join(' '),
        membre.telephone ? `Tél. ${membre.telephone}` : '',
        membre.email ?? '',
    ])
    y = Math.max(clubEnd, memberEnd) + 6

    // ─── Adhésion ───
    fill(PINK_SOFT)
    doc.roundedRect(M, y, W - M * 2, 20, 1.5, 1.5, 'F')
    fill(PINK); doc.rect(M, y, 1.4, 20, 'F')
    const infos: Array<[string, string]> = [
        ['Saison', saisonLabel || '—'],
        ['Formule', adhesion?.formule_tarifaire || '—'],
        ['Disciplines', adhesion?.disciplines?.length ? adhesion.disciplines.join(', ') : '—'],
    ]
    const infoW = (W - M * 2 - 8) / infos.length
    infos.forEach(([label, value], index) => {
        const x = M + 6 + index * infoW
        font('bold', 7.5); color(BORDEAUX)
        doc.text(label.toUpperCase(), x, y + 7.5, { charSpace: 0.4 })
        font('normal', 9.5); color(TEXT)
        doc.text(doc.splitTextToSize(value, infoW - 4)[0] as string, x, y + 14)
    })
    y += 30

    // ─── Tableau des paiements ───
    font('bold', 8); color(PINK)
    doc.text('DÉTAIL DES PAIEMENTS', M, y, { charSpace: 0.6 })
    y += 4
    const cols = [
        { label: 'Date', x: M + 3, align: 'left' as const },
        { label: 'Mode', x: M + 32, align: 'left' as const },
        { label: 'Référence', x: M + 72, align: 'left' as const },
        { label: 'Statut', x: M + 122, align: 'left' as const },
        { label: 'Montant', x: W - M - 3, align: 'right' as const },
    ]
    fill(BLACK)
    doc.rect(M, y, W - M * 2, 8, 'F')
    font('bold', 8.5); color([245, 245, 240])
    cols.forEach(col => doc.text(col.label.toUpperCase(), col.x, y + 5.4, { align: col.align }))
    y += 8

    const sorted = [...paiements].sort((a, b) => (a.date_paiement ?? '').localeCompare(b.date_paiement ?? ''))
    if (sorted.length === 0) {
        font('normal', 9.5); color(MUTED)
        doc.text('Aucun paiement enregistré.', M + 3, y + 7)
        y += 11
    }
    sorted.forEach((p, index) => {
        if (y > H - 70) { doc.addPage(); y = 20 }
        if (index % 2 === 1) { fill([248, 248, 248]); doc.rect(M, y, W - M * 2, 8, 'F') }
        font('normal', 9.5); color(TEXT)
        doc.text(formatDateFr(p.date_paiement ?? p.created_at), cols[0].x, y + 5.4)
        doc.text(MODE_LABELS[p.mode] ?? p.mode, cols[1].x, y + 5.4)
        doc.text((doc.splitTextToSize(p.reference || '—', 46) as string[])[0], cols[2].x, y + 5.4)
        const paid = p.statut === 'paye'
        color(paid ? [22, 128, 61] : p.statut === 'en_attente' ? [190, 30, 45] : [180, 110, 0])
        font('bold', 9)
        doc.text(STATUT_LABELS[p.statut] ?? p.statut, cols[3].x, y + 5.4)
        font('normal', 9.5); color(TEXT)
        doc.text(formatEuros(Number(p.montant) || 0), cols[4].x, y + 5.4, { align: 'right' })
        draw(LINE); doc.setLineWidth(0.2); doc.line(M, y + 8, W - M, y + 8)
        y += 8
    })

    // ─── Totaux ───
    const encaisse = sorted.filter(p => p.statut === 'paye' || p.statut === 'partiel').reduce((sum, p) => sum + (Number(p.montant) || 0), 0)
    const attendu = adhesion?.montant_calcule != null ? Number(adhesion.montant_calcule) : null
    const totals: Array<[string, string, boolean]> = []
    if (attendu != null && attendu > 0) totals.push(['Montant de l’adhésion', formatEuros(attendu), false])
    totals.push(['Total encaissé', formatEuros(encaisse), true])
    if (attendu != null && attendu > 0) totals.push(['Reste à régler', formatEuros(Math.max(attendu - encaisse, 0)), false])

    y += 6
    const boxW = 82
    const boxX = W - M - boxW
    totals.forEach(([label, value, strong]) => {
        if (strong) {
            fill(PINK); doc.rect(boxX, y, boxW, 10, 'F')
            font('bold', 10.5); color([255, 255, 255])
            doc.text(label.toUpperCase(), boxX + 4, y + 6.6)
            doc.text(value, W - M - 4, y + 6.6, { align: 'right' })
            y += 10
        } else {
            font('normal', 9.5); color(MUTED)
            doc.text(label, boxX + 4, y + 6)
            color(TEXT)
            doc.text(value, W - M - 4, y + 6, { align: 'right' })
            draw(LINE); doc.setLineWidth(0.2); doc.line(boxX, y + 8.5, W - M, y + 8.5)
            y += 9
        }
    })

    // ─── Mention et pied de page ───
    y += 14
    font('normal', 9); color(MUTED)
    doc.text(doc.splitTextToSize(
        `Jaga Fight certifie avoir reçu de ${membre.prenom ?? ''} ${membre.nom ?? ''} les sommes indiquées comme payées ci-dessus, au titre de son adhésion au club.`,
        W - M * 2,
    ), M, y)
    font('bold', 9); color(TEXT)
    doc.text('Merci pour votre confiance et bon entraînement !', M, y + 11)

    const pages = doc.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i)
        fill(BLACK); doc.rect(0, H - 14, W, 14, 'F')
        fill(PINK); doc.rect(0, H - 14, W, 0.8, 'F')
        font('normal', 7.5); color([200, 200, 200])
        doc.text(`Jaga Fight · ${CLUB_LEGAL} · ${PHONE_DISPLAY} · www.jagafight.fr`, M, H - 5.8)
        doc.text(`Page ${i}/${pages}`, W - M, H - 5.8, { align: 'right' })
    }

    return doc
}
