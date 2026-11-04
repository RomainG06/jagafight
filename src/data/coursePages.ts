// Contenu des pages « par public » (/cours/...).
// Les horaires viennent de src/data/planning.ts ; les prix reprennent la page /tarifs (à garder alignés).

export type PriceRow = { name: string; detail: string; sixMonths: string; oneYear: string }
export type Faq = { question: string; answer: string }

export type CoursePageContent = {
    slug: string
    /** Ids des cours concernés dans src/data/planning.ts */
    courseIds: string[]
    /** Cours présélectionné sur /essai-gratuit */
    trialId: string
    menuLabel: string
    title: string
    description: string
    eyebrow: string
    h1: string
    intro: string
    fromPrice: string
    benefitsTitle: string
    benefits: Array<{ title: string; text: string }>
    prices: PriceRow[]
    priceNote?: string
    faq: Faq[]
}

const FREE_TRIAL_FAQ: Faq = {
    question: 'Le premier cours est-il vraiment gratuit ?',
    answer: 'Oui. Le premier cours est offert et sans engagement. Réservez-le en ligne en choisissant votre créneau, par WhatsApp ou par téléphone.',
}

const FAMILY_NOTE = 'Packs famille : -10 % pour le 2e membre, -20 % à partir du 3e membre.'

export const coursePages: CoursePageContent[] = [
    {
        slug: 'muay-thai-adultes',
        courseIds: ['muay-thai'],
        trialId: 'muay-thai',
        menuLabel: 'Muay Thaï adultes',
        title: 'Cours de Muay Thaï adultes à Saint-Laurent-du-Var | Jaga Fight',
        description: 'Muay Thaï adultes le lundi, mercredi et vendredi à 19h30 à Saint-Laurent-du-Var, près de Cagnes-sur-Mer et Nice. Débutants à confirmés, 1er cours offert.',
        eyebrow: 'Adultes · Tous niveaux',
        h1: 'Cours de Muay Thaï adultes à Saint-Laurent-du-Var',
        intro: 'Trois soirs par semaine, apprenez la boxe thaï avec un encadrement diplômé : poings, pieds, genoux, coudes, travail technique et condition physique. Que vous débutiez ou que vous ayez déjà pratiqué, chaque séance vous fait progresser.',
        fromPrice: '270 € / 6 mois',
        benefitsTitle: 'Pourquoi pratiquer le Muay Thaï ?',
        benefits: [
            { title: 'Une technique complète', text: 'L’art des huit membres : poings, pieds, genoux et coudes. Une progression structurée, des bases jusqu’aux enchaînements.' },
            { title: 'Une vraie condition physique', text: 'Cardio, renforcement, souplesse et coordination : un entraînement complet qui transforme le corps séance après séance.' },
            { title: 'Un mental renforcé', text: 'Discipline, gestion de l’effort et du stress, confiance en soi : le Muay Thaï forme l’esprit autant que le corps.' },
        ],
        prices: [
            { name: 'Muay Thaï adultes', detail: '3 cours / semaine', sixMonths: '270 €', oneYear: '470 €' },
            { name: 'Pass 6 cours / semaine', detail: 'Muay Thaï + Cross training', sixMonths: '420 €', oneYear: '69 € / mois' },
            { name: 'Pack illimité', detail: 'Tout inclus', sixMonths: '650 €', oneYear: '79 € / mois' },
        ],
        priceNote: FAMILY_NOTE,
        faq: [
            { question: 'Je n’ai jamais fait de sport de combat, puis-je venir ?', answer: 'Oui. Vous n’avez pas besoin de connaître les codes ni d’être déjà en forme : l’encadrement est là pour vous donner des repères et adapter la pratique à votre niveau.' },
            FREE_TRIAL_FAQ,
            { question: 'Quels sont les horaires des cours adultes ?', answer: 'Le Muay Thaï adultes a lieu le lundi, le mercredi et le vendredi à 19h30. Un footing est aussi proposé à 19h ces mêmes jours.' },
            { question: 'Où se déroulent les cours ?', answer: 'Au 864 Av. Pierre et Marie Curie, 06700 Saint-Laurent-du-Var, à quelques minutes de Cagnes-sur-Mer, Nice et Villeneuve-Loubet.' },
        ],
    },
    {
        slug: 'muay-thai-feminin',
        courseIds: ['feminin'],
        trialId: 'feminin',
        menuLabel: 'Muay Thaï féminin',
        title: 'Muay Thaï féminin à Saint-Laurent-du-Var | Jaga Fight',
        description: 'Cours de Muay Thaï féminin le vendredi de 18h30 à 19h30 à Saint-Laurent-du-Var, près de Nice et Cagnes-sur-Mer. Tous niveaux, 1er cours offert.',
        eyebrow: 'Femmes · Tous niveaux',
        h1: 'Muay Thaï féminin à Saint-Laurent-du-Var',
        intro: 'Chaque vendredi soir, un cours de Muay Thaï pensé pour les femmes : technique, cardio et renforcement, dans une ambiance bienveillante où chacune avance à son rythme.',
        fromPrice: '170 € / 6 mois',
        benefitsTitle: 'Un cours fait pour vous',
        benefits: [
            { title: 'Entre femmes, en confiance', text: 'Un cours féminin pour découvrir la boxe thaï sereinement, sans pression, quel que soit votre niveau de départ.' },
            { title: 'Se défouler et se renforcer', text: 'Technique de frappe, cardio, gainage : une heure intense qui libère le stress de la semaine.' },
            { title: 'Gagner en assurance', text: 'Apprendre à frapper juste et à se placer donne une confiance en soi qui se ressent bien au-delà de la salle.' },
        ],
        prices: [
            { name: 'Muay Thaï féminin', detail: '1 cours / semaine', sixMonths: '170 €', oneYear: '270 €' },
            { name: 'Pack féminin', detail: 'Muay Thaï féminin + Self défense', sixMonths: '270 €', oneYear: '470 €' },
        ],
        priceNote: FAMILY_NOTE,
        faq: [
            { question: 'Je débute complètement, est-ce adapté ?', answer: 'Oui. Le cours accueille tous les niveaux : le coach adapte les exercices pour que chacune progresse à son rythme.' },
            FREE_TRIAL_FAQ,
            { question: 'Quel est l’horaire du cours féminin ?', answer: 'Le Muay Thaï féminin a lieu le vendredi de 18h30 à 19h30.' },
            { question: 'Peut-on le combiner avec la self-défense ?', answer: 'Oui, avec le Pack féminin : Muay Thaï féminin le vendredi et self-défense le jeudi de 19h à 20h30, à partir de 270 € les 6 mois.' },
        ],
    },
    {
        slug: 'muay-thai-enfants-ados',
        courseIds: ['kids', 'ados'],
        trialId: 'kids',
        menuLabel: 'Enfants & ados',
        title: 'Muay Thaï enfants et ados à Saint-Laurent-du-Var | Jaga Fight',
        description: 'Muay Thaï pour enfants et ados le mercredi et le samedi à Saint-Laurent-du-Var, près de Cagnes-sur-Mer et Nice. Encadrement diplômé, 1er cours offert.',
        eyebrow: 'Enfants · Ados',
        h1: 'Muay Thaï enfants et ados à Saint-Laurent-du-Var',
        intro: 'Le mercredi et le samedi après-midi, les jeunes apprennent le Muay Thaï dans un cadre exigeant et bienveillant : technique, condition physique, respect des autres et confiance en soi.',
        fromPrice: '180 € / 6 mois',
        benefitsTitle: 'Ce que votre enfant y gagne',
        benefits: [
            { title: 'Discipline et respect', text: 'Le salut, l’écoute du coach et le respect du partenaire font partie de chaque séance.' },
            { title: 'Confiance en soi', text: 'Progresser technique après technique aide à s’affirmer, à l’école comme ailleurs.' },
            { title: 'Se dépenser utilement', text: 'Cardio, coordination, souplesse : un sport complet pour canaliser son énergie.' },
        ],
        prices: [
            { name: 'Enfants', detail: '2 cours / semaine', sixMonths: '180 €', oneYear: '300 €' },
            { name: 'Ados', detail: '2 cours / semaine', sixMonths: '220 €', oneYear: '350 €' },
        ],
        priceNote: FAMILY_NOTE,
        faq: [
            { question: 'Mon enfant n’a jamais pratiqué, est-ce un problème ?', answer: 'Non. Les cours sont adaptés aux débutants : le coach construit la progression étape par étape.' },
            FREE_TRIAL_FAQ,
            { question: 'Quels sont les horaires ?', answer: 'Enfants : mercredi et samedi à 14h15. Ados : mercredi et samedi à 15h15.' },
            { question: 'Y a-t-il une réduction pour les frères et sœurs ?', answer: 'Oui, avec les packs famille : -10 % pour le 2e membre inscrit et -20 % à partir du 3e.' },
        ],
    },
    {
        slug: 'self-defense',
        courseIds: ['self-defense'],
        trialId: 'self-defense',
        menuLabel: 'Self défense',
        title: 'Cours de self-défense à Saint-Laurent-du-Var | Jaga Fight',
        description: 'Self-défense adultes le jeudi de 19h à 20h30 à Saint-Laurent-du-Var, près de Nice : se protéger, gérer le stress. Débutants bienvenus, 1er cours offert.',
        eyebrow: 'Adultes · Tous niveaux',
        h1: 'Cours de self-défense à Saint-Laurent-du-Var',
        intro: 'Le jeudi soir, apprenez des techniques simples et efficaces pour vous protéger, gérer le stress et réagir face à une agression. Un cours accessible à tous les adultes, dans un cadre bienveillant.',
        fromPrice: '180 € / 6 mois',
        benefitsTitle: 'Ce que vous allez apprendre',
        benefits: [
            { title: 'Des techniques efficaces', text: 'Des gestes simples, issus des sports de combat, pour se dégager et se protéger, sans avoir besoin d’être sportif.' },
            { title: 'Gérer le stress', text: 'Apprendre à garder ses moyens et à prendre la bonne décision quand la pression monte.' },
            { title: 'Plus d’assurance au quotidien', text: 'Savoir que l’on peut réagir change la façon de se déplacer et de se sentir dans la rue.' },
        ],
        prices: [
            { name: 'Self défense', detail: '1 cours / semaine', sixMonths: '180 €', oneYear: '280 €' },
            { name: 'Pack féminin', detail: 'Muay Thaï féminin + Self défense', sixMonths: '270 €', oneYear: '470 €' },
        ],
        priceNote: FAMILY_NOTE,
        faq: [
            { question: 'Faut-il être sportif pour suivre le cours ?', answer: 'Non. Les techniques sont choisies pour être accessibles à tous les adultes, quelle que soit la condition physique de départ.' },
            FREE_TRIAL_FAQ,
            { question: 'Le cours est-il réservé aux femmes ?', answer: 'Non, il est ouvert à tous les adultes. Les femmes qui le souhaitent peuvent le combiner avec le Muay Thaï féminin grâce au Pack féminin.' },
            { question: 'Quel est l’horaire ?', answer: 'Le cours de self-défense a lieu le jeudi de 19h à 20h30.' },
        ],
    },
]

export const findCoursePage = (slug: string) => {
    const page = coursePages.find(item => item.slug === slug)
    if (!page) throw new Error(`Page cours inconnue : ${slug}`)
    return page
}

/** Page « par public » qui présente un cours du planning (ex. 'kids' → muay-thai-enfants-ados). */
export const coursePageFor = (courseId: string) => coursePages.find(page => page.courseIds.includes(courseId))
