import {
  Brain, Waves, Flame, HeartCrack, ShieldAlert, CloudRain,
  Users, Sparkles, HeartHandshake, ShieldCheck, Lock,
  MessageCircleHeart, Briefcase, Route, LifeBuoy,
} from 'lucide-react'

export const CONTACT = {
  name: 'Dott.ssa Giulia Flori',
  role: 'Psicologa — iscritta all’Albo',
  email: 'giuliaflori@hotmail.it',
  // Numero WhatsApp reale di Giulia Flori
  phoneDisplay: '+39 379 353 9560',
  whatsapp: '393793539560',
  instagram: 'https://www.instagram.com/psicologa.giuliaflori/',
  linkedin: 'https://linkedin.com/in/giulia-f-8189bb189',
  albo: 'https://ordinepsicologilazio.it/albo/iscrizione-31876',
  // Indirizzo studio: placeholder facilmente modificabile
  addressPlaceholder: 'Studio in via di definizione — Roma / Online',
}

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1609469095578-9c017c9007e2?auto=format&fit=crop&w=1920&q=80',
  about: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
  studio1: 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=1200&q=80',
  studio2: 'https://images.unsplash.com/photo-1617214922084-5db8d3c3df5a?auto=format&fit=crop&w=1200&q=80',
  calm: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
}

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Chi sono', href: '#chi-sono' },
  { label: 'Come aiuto', href: '#aiuto' },
  { label: 'Servizi', href: '#servizi' },
  { label: 'Blog', href: '#blog' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contatti', href: '#contatti' },
]

export const VALUES = [
  {
    icon: HeartHandshake,
    title: 'Empatia',
    text: 'Uno spazio di ascolto autentico, dove ti senti accolto senza giudizio, con calore e presenza.',
  },
  {
    icon: ShieldCheck,
    title: 'Professionalità',
    text: 'Un percorso fondato su competenza clinica, formazione continua e metodo, sempre su misura per te.',
  },
  {
    icon: Lock,
    title: 'Riservatezza',
    text: 'Tutto ciò che condividi resta protetto. La tua privacy è tutelata dal segreto professionale.',
  },
]

export const HELP_TOPICS = [
  { icon: Waves, title: 'Ansia', text: 'Ritrovare calma quando la mente corre troppo.' },
  { icon: Flame, title: 'Stress', text: 'Alleggerire il peso quotidiano e recuperare energia.' },
  { icon: Briefcase, title: 'Burnout', text: 'Ricostruire un rapporto sano con il lavoro.' },
  { icon: HeartCrack, title: 'Trauma', text: 'Rielaborare in sicurezza ciò che ha lasciato un segno.' },
  { icon: ShieldAlert, title: 'PTSD', text: 'Attenuare l’eco del passato e ritrovare controllo.' },
  { icon: CloudRain, title: 'Depressione', text: 'Uscire dal vuoto, un passo alla volta.' },
  { icon: Users, title: 'Relazioni', text: 'Legami più sereni, tra vicinanza e confini.' },
  { icon: Sparkles, title: 'Autostima', text: 'Riconoscere il proprio valore, anche nell’imperfezione.' },
]

export const SERVICES = [
  {
    icon: MessageCircleHeart,
    title: 'Colloquio psicologico',
    description: 'Un primo spazio di ascolto per esplorare insieme ciò che stai vivendo e capire come procedere.',
    benefits: ['Ascolto senza giudizio', 'Analisi della domanda', 'Prime strategie'],
    duration: '50 minuti',
  },
  {
    icon: HeartHandshake,
    title: 'Supporto emotivo',
    description: 'Un accompagnamento nei momenti di difficoltà, per ritrovare stabilità e chiarezza interiore.',
    benefits: ['Gestione delle emozioni', 'Sostegno costante', 'Maggiore consapevolezza'],
    duration: '50 minuti',
  },
  {
    icon: Briefcase,
    title: 'Stress lavoro-correlato',
    description: 'Strumenti concreti per gestire pressione, carichi e confini nella vita professionale.',
    benefits: ['Riduzione della tensione', 'Confini sani', 'Equilibrio vita-lavoro'],
    duration: '50 minuti',
  },
  {
    icon: Flame,
    title: 'Burnout',
    description: 'Un percorso per uscire dall’esaurimento e ricostruire energia, senso e motivazione.',
    benefits: ['Recupero delle energie', 'Nuova direzione', 'Prevenzione ricadute'],
    duration: 'Percorso',
  },
  {
    icon: HeartCrack,
    title: 'Trauma',
    description: 'Rielaborazione in sicurezza delle esperienze traumatiche, nel rispetto dei tuoi tempi.',
    benefits: ['Elaborazione sicura', 'Riduzione dei sintomi', 'Senso di controllo'],
    duration: 'Percorso',
  },
  {
    icon: ShieldAlert,
    title: 'PTSD',
    description: 'Supporto specifico per il disturbo post-traumatico da stress e le sue conseguenze.',
    benefits: ['Gestione dei sintomi', 'Regolazione emotiva', 'Ritorno alla quotidianità'],
    duration: 'Percorso',
  },
  {
    icon: Waves,
    title: 'Ansia e attacchi di panico',
    description: 'Comprendere e gestire ansia e panico, ritrovando serenità nel quotidiano.',
    benefits: ['Tecniche di gestione', 'Meno evitamento', 'Più libertà'],
    duration: 'Percorso',
  },
  {
    icon: CloudRain,
    title: 'Depressione',
    description: 'Un accompagnamento delicato per ritrovare energia, significato e speranza.',
    benefits: ['Ascolto profondo', 'Riattivazione graduale', 'Nuove risorse'],
    duration: 'Percorso',
  },
  {
    icon: Route,
    title: 'Percorsi individuali',
    description: 'Un cammino di crescita personale costruito su misura per i tuoi obiettivi.',
    benefits: ['Obiettivi personalizzati', 'Crescita personale', 'Autonomia'],
    duration: 'Percorso',
  },
]

export const STATS = [
  { value: '10+', label: 'Anni di formazione e clinica' },
  { value: '8', label: 'Aree di intervento' },
  { value: '100%', label: 'Riservatezza garantita' },
  { value: 'CRI', label: 'Volontaria · Albo Psicologi CRI' },
]

export const FAQS = [
  { q: 'Quanto dura una seduta?', a: 'Ogni seduta dura circa 50 minuti. La frequenza viene concordata insieme in base ai tuoi bisogni e agli obiettivi del percorso.' },
  { q: 'Come posso prenotare?', a: 'Puoi prenotare direttamente dal sito scegliendo giorno e orario nella sezione “Prenota”, oppure scrivermi via email o WhatsApp. Riceverai una conferma.' },
  { q: 'Quanto costa un colloquio?', a: 'Il costo viene condiviso con trasparenza durante il primo contatto. Il primo colloquio serve a conoscerci e a valutare insieme il percorso più adatto.' },
  { q: 'Si può fare online?', a: 'Sì. Offro colloqui online in videochiamata, con la stessa cura e riservatezza degli incontri in studio. È una soluzione comoda e flessibile.' },
  { q: 'E in presenza?', a: 'Certamente. Gli incontri in studio si svolgono in un ambiente accogliente e riservato, pensato per farti sentire a tuo agio.' },
  { q: 'Come viene tutelata la mia privacy?', a: 'Tutto ciò che condividi è protetto dal segreto professionale e trattato nel pieno rispetto del GDPR. La tua riservatezza è una priorità assoluta.' },
]

// NOTA: recensioni simulate a scopo puramente dimostrativo.
export const TESTIMONIALS = [
  { name: 'Martina R.', text: 'Mi sono sentita accolta fin dal primo colloquio. Ho ritrovato calma e una nuova consapevolezza di me stessa.', topic: 'Percorso per l’ansia' },
  { name: 'Luca B.', text: 'Un ascolto autentico e mai giudicante. Il burnout mi sembrava senza uscita, oggi ho ritrovato energia.', topic: 'Burnout' },
  { name: 'Sara P.', text: 'Professionalità ed empatia in equilibrio perfetto. Gli incontri online sono stati comodi e preziosi.', topic: 'Supporto emotivo' },
  { name: 'Davide M.', text: 'Ho imparato a gestire lo stress e a mettere confini sani. Un percorso che ha cambiato la mia quotidianità.', topic: 'Stress lavoro-correlato' },
  { name: 'Elisa F.', text: 'Uno spazio sicuro dove finalmente sentirmi capita. Grazie per la delicatezza e la competenza.', topic: 'Percorso individuale' },
]
