import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

let client
let db
let connecting

async function connectToMongo() {
  if (db) return db
  if (!connecting) {
    connecting = (async () => {
      const c = new MongoClient(process.env.MONGO_URL)
      await c.connect()
      client = c
      db = c.db(process.env.DB_NAME)
      return db
    })().catch((e) => {
      connecting = null // allow retry on next request
      throw e
    })
  }
  return connecting
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'giulia2025'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'salvia-admin-secret-2025'

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

function json(data, status = 200) {
  return handleCORS(NextResponse.json(data, { status }))
}

function isAdmin(request) {
  const token = request.headers.get('x-admin-token')
  return !!(token && token === ADMIN_TOKEN)
}

const WEEKDAY_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
const SATURDAY_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
const DEFAULT_AVAILABILITY = {
  id: 'availability',
  // 0 = Domenica ... 6 = Sabato
  days: {
    '1': { enabled: true, slots: WEEKDAY_SLOTS },
    '2': { enabled: true, slots: WEEKDAY_SLOTS },
    '3': { enabled: true, slots: WEEKDAY_SLOTS },
    '4': { enabled: true, slots: WEEKDAY_SLOTS },
    '5': { enabled: true, slots: WEEKDAY_SLOTS },
    '6': { enabled: true, slots: SATURDAY_SLOTS },
    '0': { enabled: false, slots: [] },
  },
}

function img(url) {
  return `${url}?auto=format&fit=crop&w=1200&q=80`
}

const SEED_POSTS = [
  {
    slug: 'capire-e-gestire-lansia',
    category: 'Ansia',
    title: 'Capire e gestire l’ansia: quando la mente corre troppo',
    excerpt: 'L’ansia non è un nemico da eliminare, ma un segnale da ascoltare. Impariamo a riconoscerla e a ritrovare calma.',
    cover: img('https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb'),
    readingTime: 5,
    content: 'L’ansia è una delle esperienze più comuni e, allo stesso tempo, più fraintese. La percepiamo come qualcosa da eliminare, eppure nasce come un meccanismo di protezione: il corpo si prepara ad affrontare ciò che riconosce come una minaccia. Il problema sorge quando questo allarme resta acceso anche in assenza di un pericolo reale.\n\nChi vive l’ansia spesso descrive una mente che “corre troppo”: pensieri che si rincorrono, previsioni catastrofiche, la sensazione costante che qualcosa possa andare storto. A questo si accompagnano segnali fisici come tensione muscolare, respiro corto, battito accelerato o difficoltà a dormire.\n\nIl primo passo non è combattere l’ansia, ma imparare a riconoscerla. Dare un nome a ciò che proviamo riduce già la sua intensità. Tecniche di respirazione lenta, la pratica della presenza nel momento e piccoli gesti di cura quotidiana aiutano il sistema nervoso a ritrovare equilibrio.\n\nQuando l’ansia limita la vita di tutti i giorni, un percorso psicologico offre uno spazio sicuro per comprenderne le radici e sviluppare strumenti concreti. Non sei sbagliato perché provi ansia: stai semplicemente chiedendo, a modo tuo, di essere ascoltato.',
  },
  {
    slug: 'attacchi-di-panico-cosa-fare',
    category: 'Ansia',
    title: 'Attacchi di panico: cosa succede e come affrontarli',
    excerpt: 'Un attacco di panico può spaventare come poche altre esperienze. Capire cosa accade è il primo passo per non averne paura.',
    cover: img('https://images.unsplash.com/photo-1506126613408-eca07ce68773'),
    readingTime: 6,
    content: 'Un attacco di panico arriva spesso all’improvviso: cuore che batte forte, senso di soffocamento, vertigini, la paura di perdere il controllo o addirittura di morire. È un’esperienza intensa e reale, anche se non pericolosa per la vita.\n\nCiò che accade è una reazione di allarme molto potente: il corpo attiva la risposta di “attacco o fuga” in un momento in cui non serve. Questo spiega i sintomi fisici così forti. La paura di provare di nuovo il panico può diventare, col tempo, un problema più grande del panico stesso.\n\nDurante un attacco può aiutare rallentare il respiro, allungando l’espirazione, e ancorarsi al presente osservando ciò che ci circonda. Ricordare a sé stessi che l’ondata raggiungerà un picco e poi si placherà riduce la sensazione di pericolo.\n\nIn un percorso psicologico si lavora sia sulla gestione immediata sia sulle cause profonde, imparando gradualmente a non temere le proprie sensazioni. Affrontare il panico è possibile, e non devi farlo da solo.',
  },
  {
    slug: 'burnout-quando-il-lavoro-consuma',
    category: 'Burnout',
    title: 'Burnout: quando il lavoro consuma le energie',
    excerpt: 'Stanchezza cronica, cinismo, senso di inefficacia. Il burnout è un segnale che qualcosa va ascoltato.',
    cover: img('https://images.unsplash.com/photo-1585128792020-803d29415281'),
    readingTime: 5,
    content: 'Il burnout è uno stato di esaurimento fisico ed emotivo legato a uno stress lavorativo prolungato. Non è semplice stanchezza: è la sensazione di essere “svuotati”, di aver dato tutto senza più riuscire a ricaricarsi.\n\nSi manifesta con tre segnali principali: un profondo esaurimento delle energie, un progressivo distacco o cinismo verso il proprio lavoro e un senso di ridotta efficacia personale. Spesso chi ne soffre è una persona motivata e responsabile, che ha continuato a resistere ben oltre i propri limiti.\n\nRiconoscere il burnout significa smettere di considerarlo una debolezza personale. È il risultato di un carico eccessivo e prolungato, non di una mancanza di volontà. Rallentare, ridefinire i confini tra lavoro e vita privata e recuperare spazi di senso sono passaggi fondamentali.\n\nUn supporto psicologico aiuta a comprendere cosa ha portato all’esaurimento e a costruire un rapporto più sostenibile con il lavoro, restituendo energia e direzione.',
  },
  {
    slug: 'stress-lavoro-correlato',
    category: 'Stress',
    title: 'Stress lavoro-correlato: riconoscerlo prima che sia troppo',
    excerpt: 'Lo stress fa parte della vita, ma quando diventa cronico incide su corpo, mente e relazioni.',
    cover: img('https://images.unsplash.com/photo-1617214922084-5db8d3c3df5a'),
    readingTime: 4,
    content: 'Lo stress è la risposta naturale dell’organismo alle richieste dell’ambiente. In dosi moderate ci aiuta a essere concentrati e reattivi. Diventa un problema quando è troppo intenso o dura troppo a lungo, senza momenti di recupero.\n\nLo stress lavoro-correlato nasce da uno squilibrio tra le richieste del lavoro e le risorse a disposizione: scadenze pressanti, poca autonomia, conflitti, mancanza di riconoscimento. I segnali possono essere fisici (mal di testa, tensioni, insonnia), emotivi (irritabilità, ansia) e cognitivi (difficoltà di concentrazione).\n\nImparare a riconoscere i primi segnali permette di intervenire prima che lo stress si trasformi in burnout. Piccole strategie quotidiane — pause reali, movimento, confini chiari, momenti di respiro — fanno una grande differenza.\n\nQuando lo stress diventa costante, parlarne in uno spazio protetto aiuta a ritrovare lucidità e a costruire strategie personalizzate.',
  },
  {
    slug: 'trauma-e-ptsd',
    category: 'Trauma',
    title: 'Trauma e PTSD: quando il passato continua a bussare',
    excerpt: 'Il trauma non è ciò che ci accade, ma ciò che accade dentro di noi. Guarire è possibile.',
    cover: img('https://images.pexels.com/photos/18300493/pexels-photo-18300493.jpeg'),
    readingTime: 6,
    content: 'Un evento traumatico è un’esperienza che travolge le nostre normali capacità di far fronte, lasciando un segno profondo. Non tutti reagiscono allo stesso modo: ciò che è traumatico per una persona può non esserlo per un’altra.\n\nNel Disturbo Post-Traumatico da Stress (PTSD) il passato continua a “bussare” attraverso ricordi intrusivi, incubi, ipervigilanza e un forte bisogno di evitare tutto ciò che ricorda l’evento. Il corpo resta in allerta, come se il pericolo fosse ancora presente.\n\nComprendere che queste reazioni sono normali risposte a esperienze anormali è già un sollievo. Il trauma non definisce chi siamo: è qualcosa che ci è accaduto, non ciò che siamo.\n\nUn percorso psicologico mirato aiuta a rielaborare l’esperienza in sicurezza, restituendo un senso di controllo e permettendo di guardare al futuro con maggiore serenità.',
  },
  {
    slug: 'depressione-oltre-la-tristezza',
    category: 'Psicologia',
    title: 'Depressione: molto più di una semplice tristezza',
    excerpt: 'La depressione non è pigrizia né mancanza di volontà. È una condizione che merita ascolto e cura.',
    cover: img('https://images.unsplash.com/photo-1566739594624-b9ff5d8ee671'),
    readingTime: 5,
    content: 'La depressione è spesso confusa con la tristezza, ma è qualcosa di più profondo e pervasivo. Coinvolge l’umore, ma anche l’energia, il sonno, l’appetito, la concentrazione e la capacità di provare piacere.\n\nChi vive una depressione descrive spesso un senso di vuoto, la perdita di interesse per ciò che prima dava gioia, una stanchezza che non passa e pensieri autosvalutanti. Non è una scelta né un segno di debolezza: è una condizione reale che merita attenzione.\n\nUno degli aspetti più dolorosi è il senso di solitudine e l’idea di “non farcela”. Eppure, chiedere aiuto è un atto di forza, non di resa.\n\nUn percorso psicologico offre uno spazio di ascolto senza giudizio, aiuta a comprendere il significato di questa sofferenza e a ritrovare, gradualmente, energia e direzione. Dalla depressione si può uscire, un passo alla volta.',
  },
  {
    slug: 'coltivare-lautostima',
    category: 'Benessere',
    title: 'Coltivare l’autostima: il valore che diamo a noi stessi',
    excerpt: 'L’autostima non è arroganza, ma la capacità di riconoscere il proprio valore anche nell’imperfezione.',
    cover: img('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'),
    readingTime: 4,
    content: 'L’autostima è il modo in cui valutiamo noi stessi: quanto ci sentiamo degni di rispetto, amore e considerazione. Non ha a che fare con la perfezione, ma con la capacità di accoglierci anche quando sbagliamo.\n\nUn’autostima fragile può nascere da esperienze in cui ci siamo sentiti giudicati o non abbastanza. Da adulti, tende a manifestarsi con autocritica costante, paura del giudizio e difficoltà a riconoscere i propri successi.\n\nColtivare l’autostima significa imparare a parlarci con la stessa gentilezza che riserveremmo a un amico. Significa riconoscere i nostri bisogni, porre confini sani e smettere di misurare il nostro valore solo attraverso i risultati.\n\nIn un percorso psicologico si esplorano le radici di questa fragilità e si costruisce, gradualmente, un rapporto più autentico e benevolo con se stessi.',
  },
  {
    slug: 'relazioni-sane',
    category: 'Benessere',
    title: 'Relazioni sane: tra vicinanza e confini',
    excerpt: 'Le relazioni possono essere fonte di crescita o di sofferenza. Imparare a starci bene è un percorso.',
    cover: img('https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb'),
    readingTime: 5,
    content: 'Le relazioni sono uno degli aspetti più importanti della nostra vita e, spesso, anche la fonte principale delle nostre sofferenze. Amore, amicizia, famiglia e lavoro ci mettono continuamente alla prova.\n\nUna relazione sana si fonda sul rispetto reciproco, sulla capacità di comunicare in modo autentico e sull’equilibrio tra vicinanza e autonomia. I confini non allontanano: al contrario, permettono di stare insieme in modo più sereno.\n\nMolte difficoltà nascono da schemi relazionali appresi nel tempo, che tendiamo a ripetere senza rendercene conto. Riconoscerli è il primo passo per poter scegliere in modo diverso.\n\nLavorare sulle relazioni, in un percorso psicologico, significa comprendere questi schemi, imparare a comunicare i propri bisogni e costruire legami più appaganti e rispettosi.',
  },
  {
    slug: 'tecniche-gestione-stress',
    category: 'Stress',
    title: 'Cinque tecniche semplici per gestire lo stress quotidiano',
    excerpt: 'Piccoli gesti quotidiani possono aiutare il sistema nervoso a ritrovare equilibrio. Ecco da dove iniziare.',
    cover: img('https://images.unsplash.com/photo-1506126613408-eca07ce68773'),
    readingTime: 4,
    content: 'Non sempre possiamo eliminare le fonti di stress, ma possiamo imparare a gestirlo in modo più efficace. Ecco alcune strategie semplici e concrete.\n\n1. Respirazione lenta: dedicare qualche minuto a respiri profondi, allungando l’espirazione, aiuta a calmare il sistema nervoso.\n\n2. Movimento: camminare, fare stretching o attività fisica leggera scarica la tensione accumulata nel corpo.\n\n3. Pause reali: piccole interruzioni durante la giornata, lontano dagli schermi, permettono alla mente di ricaricarsi.\n\n4. Scrittura: annotare pensieri e preoccupazioni aiuta a mettere ordine e a ridurne il peso.\n\n5. Confini: imparare a dire di no e a proteggere il proprio tempo è una forma essenziale di cura di sé.\n\nQueste tecniche non sostituiscono un percorso di cura, ma sono un buon punto di partenza. Quando lo stress diventa cronico, chiedere supporto è la scelta più sana.',
  },
  {
    slug: 'benessere-psicologico-cura-di-se',
    category: 'Benessere',
    title: 'Benessere psicologico: prendersi cura di sé ogni giorno',
    excerpt: 'Il benessere non è assenza di difficoltà, ma la capacità di attraversarle con maggiore consapevolezza.',
    cover: img('https://images.pexels.com/photos/18300493/pexels-photo-18300493.jpeg'),
    readingTime: 4,
    content: 'Il benessere psicologico non significa sentirsi sempre felici o non avere problemi. Significa poter attraversare le difficoltà della vita con risorse, flessibilità e un senso di significato.\n\nPrendersi cura di sé è un gesto quotidiano fatto di piccole scelte: dormire a sufficienza, coltivare relazioni nutrienti, dedicare tempo a ciò che ci fa stare bene, permettersi di rallentare.\n\nSpesso mettiamo il nostro benessere all’ultimo posto, convinti che occuparsene sia un lusso. In realtà è la base su cui si costruisce tutto il resto: senza equilibrio interiore, anche le cose belle diventano faticose.\n\nChiedere aiuto a uno psicologo non significa essere “malati”, ma scegliere di prendersi cura di sé con la stessa attenzione che dedicheremmo alla salute del corpo. È un investimento sulla qualità della propria vita.',
  },
]

async function ensureSeed(db) {
  const settingsCol = db.collection('settings')
  const existing = await settingsCol.findOne({ id: 'availability' })
  if (!existing) await settingsCol.insertOne(DEFAULT_AVAILABILITY)

  // One-time cleanup: remove previously auto-seeded demo blog posts.
  // Articles are now managed manually from the admin dashboard.
  const mig = await settingsCol.findOne({ id: 'migrations' })
  if (!mig || !mig.removedDemoBlog) {
    const demoSlugs = SEED_POSTS.map((p) => p.slug)
    await db.collection('blog_posts').deleteMany({ slug: { $in: demoSlugs } })
    await settingsCol.updateOne(
      { id: 'migrations' },
      { $set: { id: 'migrations', removedDemoBlog: true } },
      { upsert: true }
    )
  }
  // One-time: align availability with the studio opening hours.
  if (!mig || !mig.availabilityV2) {
    await settingsCol.updateOne(
      { id: 'availability' },
      { $set: { id: 'availability', days: DEFAULT_AVAILABILITY.days } },
      { upsert: true }
    )
    await settingsCol.updateOne(
      { id: 'migrations' },
      { $set: { id: 'migrations', availabilityV2: true } },
      { upsert: true }
    )
  }
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()
    await ensureSeed(db)

    // Health
    if ((route === '/' || route === '/root') && method === 'GET') {
      return json({ message: 'Salvia API online', service: 'Dott.ssa Giulia Flori' })
    }

    // ---------- AVAILABILITY ----------
    if (route === '/availability' && method === 'GET') {
      const doc = await db.collection('settings').findOne({ id: 'availability' })
      const { _id, ...rest } = doc || DEFAULT_AVAILABILITY
      return json(rest)
    }
    if (route === '/availability' && method === 'PUT') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      const body = await request.json()
      await db.collection('settings').updateOne(
        { id: 'availability' },
        { $set: { days: body.days, id: 'availability' } },
        { upsert: true }
      )
      const doc = await db.collection('settings').findOne({ id: 'availability' })
      const { _id, ...rest } = doc
      return json(rest)
    }

    // ---------- APPOINTMENTS ----------
    // Booked slots for a date (public, minimal data)
    if (route === '/appointments/booked' && method === 'GET') {
      const { searchParams } = new URL(request.url)
      const date = searchParams.get('date')
      if (!date) return json({ error: 'date richiesta' }, 400)
      const appts = await db.collection('appointments')
        .find({ date, status: { $ne: 'cancelled' } })
        .toArray()
      return json({ date, booked: appts.map((a) => a.time) })
    }

    if (route === '/appointments' && method === 'POST') {
      const body = await request.json()
      // honeypot anti-spam
      if (body.website) return json({ ok: true })
      const required = ['name', 'email', 'date', 'time', 'service']
      for (const f of required) {
        if (!body[f]) return json({ error: `Campo ${f} obbligatorio` }, 400)
      }
      if (!body.consent) return json({ error: 'Consenso privacy obbligatorio' }, 400)
      // check slot not taken
      const clash = await db.collection('appointments').findOne({
        date: body.date, time: body.time, status: { $ne: 'cancelled' },
      })
      if (clash) return json({ error: 'Questo orario è stato appena prenotato. Scegli un altro slot.' }, 409)
      const appt = {
  id: uuidv4(),
  name: body.name,
  email: body.email,
  phone: body.phone || '',
  service: body.service,
  modality: body.modality || 'In studio',
  date: body.date,
  time: body.time,
  message: body.message || '',
  status: 'pending',
  payment_status: 'unpaid',
  payment_url: '',
  stripe_session_id: '',
  createdAt: new Date(),
      }
      await db.collection('appointments').insertOne(appt)
      let emailSent = false
      try {
        const { sendRequestEmail } = await import('@/lib/email')
        const r = await sendRequestEmail({
          type: 'booking', name: appt.name, email: appt.email, phone: appt.phone,
          modality: appt.modality, service: appt.service, date: appt.date, time: appt.time, message: appt.message,
        })
        emailSent = !!(r && (r.id || r.skipped))
        if (r?.id) await db.collection('appointments').updateOne({ id: appt.id }, { $set: { emailId: r.id } })
      } catch (e) {
        console.error('Email error (booking):', e?.message)
      }
      const { _id, ...rest } = appt
      return json({ ok: true, emailSent, appointment: rest })
    }

        // ---------- STRIPE CHECKOUT ----------
    // Crea il pagamento Stripe per un appuntamento già confermato dall'admin
    if (path[0] === 'appointments' && path[1] && path[2] === 'checkout' && method === 'POST') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)

      const appointmentId = path[1]

      const appointment = await db.collection('appointments').findOne({
        id: appointmentId,
      })

      if (!appointment) {
        return json({ error: 'Appuntamento non trovato' }, 404)
      }

      if (appointment.status !== 'confirmed') {
        return json({
          error: 'L’appuntamento deve essere confermato prima di richiedere il pagamento.'
        }, 400)
      }

      if (appointment.payment_status === 'paid') {
        return json({ error: 'L’appuntamento risulta già pagato.' }, 400)
      }

      const stripe = getStripe()

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://www.giuliafloripsicologa.it'

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',

        customer_email: appointment.email,

        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: appointment.service || 'Colloquio psicologico',
              },
              unit_amount: 6000,
            },
            quantity: 1,
          },
        ],

        metadata: {
          appointment_id: appointment.id,
        },

        success_url: `${siteUrl}/appuntamento-confermato?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/prenota`,
      })

      await db.collection('appointments').updateOne(
        { id: appointment.id },
        {
          $set: {
            payment_url: session.url,
            stripe_session_id: session.id,
            payment_status: 'pending',
          },
        }
      )

      return json({
        ok: true,
        payment_url: session.url,
        session_id: session.id,
      })
    }
    
    if (route === '/appointments' && method === 'GET') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      const appts = await db.collection('appointments')
        .find({})
        .sort({ date: 1, time: 1 })
        .toArray()
      return json(appts.map(({ _id, ...r }) => r))
    }

    // /appointments/:id  (PUT status/edit, DELETE)
    if (path[0] === 'appointments' && path[1] && method === 'PUT') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      const body = await request.json()
      const update = {}
      for (const k of ['status', 'date', 'time', 'name', 'email', 'phone', 'service', 'modality', 'message']) {
        if (body[k] !== undefined) update[k] = body[k]
      }
      await db.collection('appointments').updateOne({ id: path[1] }, { $set: update })
      const doc = await db.collection('appointments').findOne({ id: path[1] })
      if (!doc) return json({ error: 'Non trovato' }, 404)
      const { _id, ...rest } = doc
      return json(rest)
    }
    if (path[0] === 'appointments' && path[1] && method === 'DELETE') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      await db.collection('appointments').deleteOne({ id: path[1] })
      return json({ ok: true })
    }

    // ---------- BLOG ----------
    if (route === '/blog' && method === 'GET') {
      const { searchParams } = new URL(request.url)
      const all = searchParams.get('all') === 'true' && isAdmin(request)
      const query = all ? {} : { published: true }
      const posts = await db.collection('blog_posts')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray()
      return json(posts.map(({ _id, ...r }) => r))
    }
    // Public: single post by slug (used by the dedicated article page)
    if (path[0] === 'blog' && path[1] && method === 'GET') {
      const doc = await db.collection('blog_posts').findOne({ slug: path[1] })
      if (!doc || (!doc.published && !isAdmin(request))) return json({ error: 'Articolo non trovato' }, 404)
      const { _id, ...rest } = doc
      return json(rest)
    }
    if (route === '/blog' && method === 'POST') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      const body = await request.json()
      if (!body.title) return json({ error: 'Titolo obbligatorio' }, 400)
      const slug = (body.slug || body.title).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const post = {
        id: uuidv4(),
        slug: `${slug}-${Math.random().toString(36).slice(2, 6)}`,
        title: body.title,
        subtitle: body.subtitle || '',
        category: body.category || 'Psicologia',
        excerpt: body.excerpt || '',
        cover: body.cover || img('https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb'),
        readingTime: body.readingTime || 4,
        date: body.date || new Date().toISOString().slice(0, 10),
        content: body.content || '',
        published: body.published !== false,
        createdAt: new Date(),
      }
      await db.collection('blog_posts').insertOne(post)
      const { _id, ...rest } = post
      return json({ ok: true, post: rest })
    }
    if (path[0] === 'blog' && path[1] && method === 'PUT') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      const body = await request.json()
      const update = {}
      for (const k of ['title', 'subtitle', 'category', 'excerpt', 'cover', 'readingTime', 'date', 'content', 'published']) {
        if (body[k] !== undefined) update[k] = body[k]
      }
      await db.collection('blog_posts').updateOne({ id: path[1] }, { $set: update })
      const doc = await db.collection('blog_posts').findOne({ id: path[1] })
      if (!doc) return json({ error: 'Non trovato' }, 404)
      const { _id, ...rest } = doc
      return json(rest)
    }
    if (path[0] === 'blog' && path[1] && method === 'DELETE') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      await db.collection('blog_posts').deleteOne({ id: path[1] })
      return json({ ok: true })
    }

    // ---------- CONTACT ----------
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      if (body.website) return json({ ok: true }) // honeypot
      if (!body.name || !body.email || !body.message) {
        return json({ error: 'Nome, email e messaggio obbligatori' }, 400)
      }
      if (!body.consent) return json({ error: 'Consenso privacy obbligatorio' }, 400)
      const msg = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        message: body.message,
        createdAt: new Date(),
        read: false,
      }
      await db.collection('contact_messages').insertOne(msg)
      try {
        const { sendRequestEmail } = await import('@/lib/email')
        await sendRequestEmail({ type: 'contact', name: msg.name, email: msg.email, phone: msg.phone, message: msg.message })
      } catch (e) {
        console.error('Email error (contact):', e?.message)
      }
      return json({ ok: true })
    }
    if (route === '/contact' && method === 'GET') {
      if (!isAdmin(request)) return json({ error: 'Non autorizzato' }, 401)
      const msgs = await db.collection('contact_messages').find({}).sort({ createdAt: -1 }).toArray()
      return json(msgs.map(({ _id, ...r }) => r))
    }

    // ---------- ADMIN LOGIN ----------
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      if (body.password === ADMIN_PASSWORD) {
        return json({ ok: true, token: ADMIN_TOKEN })
      }
      return json({ error: 'Password errata' }, 401)
    }
    if (route === '/admin/verify' && method === 'GET') {
      return json({ ok: isAdmin(request) })
    }

    return json({ error: `Route ${route} not found` }, 404)
  } catch (error) {
    console.error('API Error:', error)
    return json({ error: 'Internal server error' }, 500)
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
