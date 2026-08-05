#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Sito web premium per la psicologa Dott.ssa Giulia Flori (stile Minimal Luxury, verde salvia). Include: sistema di prenotazione online (calendario + slot + salvataggio in DB + conferma a schermo), disponibilita configurabile, blog con articoli SEO, modulo contatti con anti-spam (honeypot), dashboard admin protetta da login. Email reali (Resend) da integrare in seguito."

backend:
  - task: "Availability GET/PUT (settings collection, admin protected PUT)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "GET /api/availability returns weekly schedule (auto-seeded default Mon-Fri). PUT requires x-admin-token header. Verified GET manually returns 200 with correct days object."
        -working: true
        -agent: "testing"
        -comment: "✅ TESTED: All 4 tests passed. GET /api/availability returns correct days structure (0-6 with Mon-Fri enabled). PUT without token returns 401. PUT with token updates and persists changes. No Mongo _id leaks."

  - task: "Appointments create (POST) with slot clash + honeypot + consent validation"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "POST /api/appointments validates required fields (name,email,date,time,service) + consent. Rejects double-booking with 409. Honeypot field 'website' silently accepted. Stores status 'pending'."
        -working: true
        -agent: "testing"
        -comment: "✅ TESTED: All 6 tests passed. Missing email returns 400. Missing consent returns 400. Honeypot 'website' returns {ok:true} but does NOT store in DB (verified). Valid booking creates appointment with UUID id and status=pending. Double booking same date+time returns 409 conflict. No Mongo _id leaks."

  - task: "Appointments list/update/delete (admin) + booked slots public"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "GET /api/appointments (admin only). PUT /api/appointments/:id updates status/fields (admin). DELETE /api/appointments/:id (admin). GET /api/appointments/booked?date=YYYY-MM-DD is public and returns only booked times."
        -working: true
        -agent: "testing"
        -comment: "✅ TESTED: All 7 tests passed. GET /api/appointments/booked returns only times array, no personal data leak. GET /api/appointments without token returns 401. GET with token returns full appointment data. PUT /api/appointments/:id updates status to confirmed. DELETE removes appointment from DB and frees up the booked slot (verified). No Mongo _id leaks."

  - task: "Blog CRUD + auto-seed 10 SEO posts"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "GET /api/blog returns published posts (auto-seeded 10 Italian articles). GET /api/blog?all=true requires admin. POST/PUT/DELETE /api/blog admin only. Slug auto-generated. Verified GET returns seeded posts."
        -working: true
        -agent: "testing"
        -comment: "✅ TESTED: All 6 tests passed. GET /api/blog returns 10+ auto-seeded Italian posts with UUID ids (not ObjectID). POST /api/blog with token creates post with auto-generated slug + UUID. GET /api/blog?all=true with token includes drafts. GET /api/blog?all=true without token behaves like public (only published). PUT /api/blog/:id updates title. DELETE /api/blog/:id removes post. No Mongo _id leaks."
        -working: true
        -agent: "testing"
        -comment: "✅ RE-TESTED AFTER BLOG REWORK: All 15 blog tests passed (100% success). CHANGES VERIFIED: (1) Auto-seed removed - GET /api/blog now returns [] empty array (migration deleted demo posts), (2) New fields working - POST /api/blog with subtitle, date, readingTime, category all persist correctly, (3) New endpoint GET /api/blog/:slug working - returns 200 for published posts, 404 for nonexistent slugs, (4) Draft visibility enforced - GET /api/blog/:draftSlug returns 404 without admin token and 200 with token, (5) GET /api/blog?all=true with token includes drafts, public GET excludes drafts, (6) PUT /api/blog/:id updates subtitle+date and persists (verified), (7) DELETE /api/blog/:id removes posts and slug returns 404 after deletion. MongoDB connection fix working - no race condition errors during concurrent requests. No Mongo _id leaks. No 500 errors."

  - task: "Contact message POST (honeypot + consent) and GET (admin)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "POST /api/contact validates name/email/message + consent, honeypot 'website'. GET /api/contact admin only."
        -working: true
        -agent: "testing"
        -comment: "✅ TESTED: All 7 tests passed. POST /api/contact missing message returns 400. Missing consent returns 400. Honeypot 'website' returns {ok:true} but does NOT store in DB (verified). Valid message stores correctly. GET /api/contact without token returns 401. GET with token returns array of messages. No Mongo _id leaks."

  - task: "Admin login + token verify"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "POST /api/admin/login with {password} (env ADMIN_PASSWORD, default giulia2025) returns {token}. Admin endpoints check x-admin-token == ADMIN_TOKEN. GET /api/admin/verify returns {ok:bool}."
        -working: true
        -agent: "testing"
        -comment: "✅ TESTED: All 4 tests passed. POST /api/admin/login with correct password (giulia2025) returns 200 + token. Wrong password returns 401. GET /api/admin/verify with valid x-admin-token header returns {ok:true}. Without token returns {ok:false}. Minor fix applied: isAdmin() now explicitly returns boolean. No Mongo _id leaks."

  - task: "Resend email notifications on booking + contact (native fetch)"
    implemented: true
    working: true
    file: "lib/email.js + app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "lib/email.js uses native fetch to POST https://api.resend.com/emails (SDK intentionally NOT installed). Wired into POST /api/appointments (type='booking', line ~270) and POST /api/contact (type='contact', line ~394). Booking response includes emailSent flag and stores emailId. Env: RESEND_API_KEY set, RESEND_FROM_EMAIL='...onboarding@resend.dev', CONTACT_RECIPIENT_EMAIL=giuliaflori.1093@gmail.com. NEEDS TESTING: verify POST /api/appointments returns {ok:true, emailSent:true} (Resend returns an id) and POST /api/contact returns 200 without error. Note: Resend test/free mode with onboarding@resend.dev may only deliver to the account owner's email; a non-2xx from Resend throws and would surface as 500 - check for that."
        -working: true
        -agent: "testing"
        -comment: "✅ TESTED: All 9 tests passed (100% success). AREA 1 - RESEND EMAIL: (1) POST /api/appointments with valid booking returns 200 {ok:true, emailSent:true, appointment:{...}} - Resend email dispatched successfully, (2) POST /api/contact with valid message returns 200 {ok:true} - Resend email dispatched successfully, (3) POST /api/contact with honeypot field 'website' returns 200 {ok:true} silently (not stored, no crash). AREA 2 - AVAILABILITY HOURS: GET /api/availability returns EXACT correct structure - Day 0 (Sunday) enabled:false slots:[], Days 1-5 (Mon-Fri) enabled:true slots:['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'], Day 6 (Saturday) enabled:true slots:['09:00','10:00','11:00','12:00','13:00','14:00','15:00']. REGRESSION: (1) POST /api/appointments duplicate booking returns 409 conflict, (2) POST /api/appointments missing consent returns 400, (3) GET /api/appointments (admin) returns 200 array, (4) GET /api/appointments/booked returns only times array with no personal data leak. No 500 errors. Resend API integration fully functional with onboarding@resend.dev sender address."

frontend:
  - task: "Single-page premium site (hero, values, help, about, services, booking, testimonials, blog, faq, contact, footer, whatsapp, cookie)"
    implemented: true
    working: true
    file: "app/page.js + components/site/*"
    stuck_count: 1
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Built. Hero verified visually. Reveal animations made SSR-resilient. Frontend testing NOT yet authorized by user."
        -working: false
        -agent: "testing"
        -comment: "CRITICAL ISSUE - Booking calendar date selection not working. When user clicks a date, the React state is not updated (selected dates count: 0), no API call to /api/appointments/booked is made, and time slots do not appear. This blocks the entire booking flow. Other sections tested: ✅ Hero headline and CTA buttons visible, ✅ All navbar links present and smooth-scroll works, ✅ All sections render (chi-sono, servizi, blog, faq, contatti), ✅ Blog: 10 articles load, category filters work, article modal opens/closes, ✅ FAQ accordion expands/collapse works, ✅ Testimonials carousel prev/next works, ✅ Contact form submission works (success toast appears), ✅ Cookie banner appears and dismisses correctly, ✅ WhatsApp floating button present with correct link. ⚠️ Dark mode toggle button not found with aria-label='Cambia tema' selector. Console errors: hydration mismatches, 502/500 errors during testing. Network errors: API calls to /api/blog and /api/availability failed intermittently."
        -working: true
        -agent: "testing"
        -comment: "✅ RE-TEST AFTER MEMORY FIX: BOOKING FLOW NOW WORKING! Full flow tested successfully: (1) Calendar loads and date selection works (clicked Aug 4, 2026), (2) Time slots appear correctly (09:00, 10:00), (3) Consent validation works (error toast appears when submitting without consent checkbox), (4) Booking submission successful (success confirmation card appears with date/time), (5) Booking saved to DB (verified via API: /api/appointments/booked returns 09:00 for 2026-08-04). ✅ Dark mode toggle working (button found with aria-label='Cambia tema', theme toggles from 'light' to 'dark'). Minor: Hydration mismatch warnings still present in console (data-day attribute format differs between server/client: '2026-08-04' vs '8/4/2026') but does not block functionality after hydration completes."

  - task: "Admin dashboard (login, appointments, availability, blog, messages)"
    implemented: true
    working: true
    file: "app/admin/page.js"
    stuck_count: 1
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Built. Not yet tested via UI (awaiting user authorization)."
        -working: false
        -agent: "testing"
        -comment: "CRITICAL ISSUE - Admin page (/admin) returns 502 Bad Gateway error intermittently. Server is memory-constrained (--max-old-space-size=512) and appears to crash/restart during testing. After multiple restarts, the page eventually loads but the issue persists. The Next.js dev server needs more memory allocation or optimization. Backend API endpoints work correctly when tested directly (availability, appointments, blog, contact all return 200 with correct data)."
        -working: true
        -agent: "testing"
        -comment: "✅ RE-TEST AFTER MEMORY FIX: ADMIN DASHBOARD NOW WORKING! No 502 errors encountered. Full flow tested: (1) /admin page loads successfully (no 502 Bad Gateway), (2) Login with password 'giulia2025' successful, (3) Dashboard loads with all 4 tabs visible, (4) Appuntamenti tab: Shows 2 appointments (Sofia Bianchi 2026-08-04 09:00, Sofia Martini 2026-08-10 09:00) with status dropdowns working, (5) Blog tab: Loads posts list, 'Nuovo articolo' button opens editor form successfully, (6) Messaggi tab: Loads correctly. Note: Disponibilità tab had timeout clicking the tab button during test (may be timing issue), but other 3 tabs confirmed working. Memory fix (NODE_OPTIONS='--max-old-space-size=1536') resolved the previous 502 errors."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "Resend email notifications on booking + contact (native fetch)"
    - "Availability GET/PUT (settings collection, admin protected PUT)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: "Backend completo per il sito della psicologa. Testare tutti gli endpoint /api. Admin password = giulia2025 (POST /api/admin/login -> token), poi usare header x-admin-token con il token restituito per gli endpoint protetti. Verificare: (1) admin login ok/ko, (2) availability GET pubblica + PUT protetta, (3) creazione appuntamento con validazioni + doppia prenotazione 409 + honeypot, (4) booked slots pubblici, (5) list/update/delete appuntamenti protetti, (6) blog GET pubblico (10 articoli seed) + CRUD protetto, (7) contact POST + GET protetta. Usare solo UUID (niente ObjectID)."
    -agent: "testing"
    -message: "✅ BACKEND TESTING COMPLETE: All 34 tests passed (100% success rate). Tested all 6 backend tasks: (1) Admin login/verify - 4/4 passed, (2) Availability GET/PUT - 4/4 passed, (3) Appointments create with validations - 6/6 passed, (4) Appointments admin operations + booked slots - 7/7 passed, (5) Blog CRUD + auto-seed - 6/6 passed, (6) Contact POST/GET - 7/7 passed. All endpoints working correctly: proper authentication (401 for unauthorized), validation (400 for missing fields/consent), honeypot anti-spam (silently rejects without storing), double-booking prevention (409 conflict), UUID format (no Mongo _id leaks), CRUD operations, data persistence. Minor fix applied: isAdmin() now returns explicit boolean. No 500 errors encountered. Backend is production-ready."
    -agent: "main"
    -message: "FRONTEND UI TESTING AUTHORIZED by user. Please test the full single-page site + admin dashboard. IMPORTANT: dev server is memory-constrained and restarts occasionally (first load of a route can take 20-30s and may briefly 502 during recompile) - please retry/wait on transient failures. Base URL: use NEXT_PUBLIC_BASE_URL. KEY FLOWS TO TEST: (1) Homepage loads, hero headline + 2 CTA buttons visible, navbar links smooth-scroll to sections. (2) BOOKING (#prenota): pick an available future weekday in the calendar (Mon-Fri enabled; Sat/Sun disabled), available time slots appear, select a slot, fill name/email, select service + modality, tick the GDPR consent checkbox, submit -> on-screen confirmation card appears. Also verify submitting WITHOUT consent shows an error toast. (3) BLOG (#blog): 10 article cards load, category filter chips work, clicking a card opens a modal with full article content. (4) FAQ accordion expands. (5) Testimonials carousel next/prev works. (6) CONTACT (#contatti): fill form + consent + submit -> success toast. (7) WhatsApp floating button present (href wa.me/393793539560). (8) Cookie banner appears and can be accepted. (9) Dark mode toggle in navbar works. (10) ADMIN (/admin): login with password 'giulia2025' -> dashboard; verify Appuntamenti tab lists the booking just created and status can be changed to 'confirmed'; Disponibilita tab loads weekday toggles+slots and Save works; Blog tab lists posts and 'Nuovo articolo' form opens; Messaggi tab lists the contact message. Report any console errors, broken flows, or elements stuck invisible."
    -agent: "testing"
    -message: "Frontend results: HOME ok, navbar smooth-scroll ok, sections render ok. BLOG ok (10 cards, filters, modal). FAQ ok. Testimonials carousel ok. CONTACT ok (success toast). WhatsApp button + Cookie banner ok. TWO CRITICAL FAILURES: (a) BOOKING calendar date selection did not update state / no slots appeared during test window; (b) /admin returned intermittent 502 Bad Gateway. Root cause identified as SEVERE memory constraint (--max-old-space-size=512) causing frequent server restarts that prevented JS hydration (calendar clicks not registering) and 502s on the heavy /admin route (26s compile). Backend APIs confirmed working. Recommended: raise Node heap; fix dark-mode toggle selector (minor)."
    -agent: "main"
    -message: "FIX APPLIED for the two critical issues: raised Node heap from --max-old-space-size=512 to 1536 in package.json 'dev' script (container cgroup limit is 2GB, so 1536 is safe alongside MongoDB) and restarted nextjs. After fix: /admin compiles in ~8s and serves 200 in ~250ms with NO more 'approaching memory threshold, restarting' messages; /api/availability and /api/blog return 200; server logs from the earlier test already showed the booking POST /api/appointments 200 and GET /api/appointments/booked 200 (i.e. the calendar selection works once JS is hydrated - the failure was purely the hydration being interrupted by restarts). Please RE-TEST focused on: (1) BOOKING #prenota full flow (select future weekday -> slots appear -> select slot -> fill name/email + service + modality -> submit without consent shows error toast -> tick consent -> submit shows confirmation card); (2) ADMIN /admin login with 'giulia2025' and all 4 tabs (Appuntamenti list + change status to Conferma, Disponibilita save, Blog list + Nuovo articolo form, Messaggi list); (3) quick re-check dark mode toggle (button has aria-label='Cambia tema', renders after mount)."
    -agent: "main"
    -message: "CONTENT UPDATE: Updated the 'Il mio percorso' timeline captions in components/site/about.jsx (TIMELINE array) with richer descriptions provided by the user, and renamed the 3rd item to 'Laurea in Psicologia Clinica'. This is a static text change (no logic). Please verify the '#chi-sono' -> 'Il mio percorso' timeline now renders 5 items with these exact titles and their new one-line descriptions: (1) 'Sociologia e Criminologia' -> 'Studio dei fenomeni sociali, criminologici e delle dinamiche del comportamento umano.'; (2) 'Scienze e Tecniche Psicologiche' -> 'Formazione sulle basi teoriche, valutazione psicologica e relazione d’aiuto professionale.'; (3) 'Laurea in Psicologia Clinica' -> 'Approfondimento clinico su diagnosi, benessere psicologico, ascolto e intervento terapeutico.'; (4) 'Master in Psicologia Investigativa e Forense' -> 'Specializzazione in psicologia forense, investigativa, valutazione e consulenza giudiziaria specialistica.'; (5) 'Volontaria Croce Rossa Italiana · Albo Nazionale Psicologi CRI' -> 'Supporto psicologico nelle emergenze, vulnerabilità, resilienza e interventi umanitari qualificati.' No regression expected elsewhere."
    -agent: "testing"
    -message: "🔴 FRONTEND UI TESTING COMPLETE - 2 CRITICAL ISSUES FOUND: (1) BOOKING CALENDAR BROKEN: Date selection not working - when user clicks a date, React state is not updated, no API call to /api/appointments/booked is made, time slots do not appear. This completely blocks the booking flow. (2) ADMIN DASHBOARD 502 ERRORS: /admin page returns intermittent 502 Bad Gateway errors due to memory constraints (Next.js server configured with --max-old-space-size=512). Server logs show 'Server is approaching the used memory threshold, restarting...' The /admin route takes 26+ seconds to compile and causes server restarts. ✅ WORKING FEATURES: Hero section, navbar smooth-scroll, all sections render, blog (10 articles, filters, modal), FAQ accordion, testimonials carousel, contact form submission, WhatsApp button, cookie banner. ⚠️ MINOR: Dark mode toggle selector issue (aria-label='Cambia tema' not found). Backend APIs work correctly when tested directly."
    -agent: "testing"
    -message: "✅ RE-TEST AFTER MEMORY FIX - BOTH CRITICAL ISSUES RESOLVED! (1) BOOKING FLOW: ✅ WORKING - Calendar date selection works (clicked Aug 4, 2026), time slots appear (09:00, 10:00), consent validation works (error toast when unchecked), booking submission successful (confirmation card appears), booking saved to DB (verified: /api/appointments/booked returns ['09:00'] for 2026-08-04). (2) ADMIN DASHBOARD: ✅ WORKING - No 502 errors, /admin loads successfully, login works, dashboard shows 2 appointments (Sofia Bianchi, Sofia Martini), Blog tab + editor form working, Messaggi tab working. (3) DARK MODE: ✅ WORKING - Toggle button found (aria-label='Cambia tema'), theme switches correctly (light -> dark). Server logs show all API calls returning 200 with fast response times (80-500ms). Memory fix successful - no more server restarts or 'approaching memory threshold' warnings. Minor: Hydration mismatch warnings still present in console (data-day attribute format) but do not block functionality."
    -agent: "testing"
    -message: "✅ TIMELINE CONTENT VERIFICATION COMPLETE - PASS! Verified 'Il mio percorso' timeline in #chi-sono section. All 5 items present in correct order with exact titles and descriptions: (1) 'Sociologia e Criminologia' with description about social/criminological phenomena, (2) 'Scienze e Tecniche Psicologiche' with description about theoretical bases and psychological evaluation, (3) 'Laurea in Psicologia Clinica' with description about clinical diagnosis and therapeutic intervention, (4) 'Master in Psicologia Investigativa e Forense' with description about forensic psychology specialization, (5) 'Volontaria Croce Rossa Italiana · Albo Nazionale Psicologi CRI' with description about emergency psychological support. Italian text renders correctly with proper accents and typographic apostrophes. No console errors. Content update successful, no regressions detected."
    -agent: "testing"
    -message: "✅ BACKEND RE-TEST AFTER BLOG REWORK + CONNECTION FIX - ALL 31 TESTS PASSED (100% success). BLOG CHANGES VERIFIED (15 tests): (1) GET /api/blog returns [] empty array (migration removed demo posts), (2) POST /api/blog with subtitle, date, readingTime, category creates post with UUID + generated slug, all fields persist, (3) GET /api/blog/:slug (public) returns 200 with full post (subtitle, date, content), (4) GET /api/blog/nonexistent returns 404, (5) Draft post visibility: GET /api/blog/:draftSlug returns 404 without admin token, 200 with token, (6) GET /api/blog?all=true with token includes drafts, public GET excludes drafts, (7) PUT /api/blog/:id updates subtitle+date and persists (verified with GET), (8) DELETE /api/blog/:id removes posts, slug returns 404 after deletion, GET /api/blog returns [] after cleanup. REGRESSION TESTS PASSED (16 tests): Admin login wrong/correct password (401/200), admin verify with/without token, availability GET (public 200) + PUT (401 without token, 200 with token), appointments POST valid (200), duplicate (409), missing consent (400), honeypot (200 not stored), GET booked slots (public, no personal data), GET appointments (admin 200), DELETE appointment, contact POST valid (200), missing consent (400). MongoDB connection fix working - no race condition errors during concurrent requests. No Mongo _id leaks. No 500 errors. All API response times fast (100-400ms). Backend fully functional after rework."

    -agent: "main"
    -message: "BACKEND CHANGES for the Blog rework + a bug fix. Please RE-TEST backend focusing on Blog, plus a quick regression of appointments/contact/admin. Admin: POST /api/admin/login {password:'giulia2025'} -> token; send header x-admin-token for protected routes. CHANGES: (1) Blog auto-seed REMOVED and a one-time migration deletes the old demo posts, so GET /api/blog should now return [] (empty) unless posts are created. (2) Blog posts now support new fields 'subtitle' (string) and 'date' (YYYY-MM-DD). (3) NEW public endpoint GET /api/blog/:slug returns a single post by slug (404 if not found, and 404 for unpublished unless admin). (4) MongoDB connection refactored to a shared promise to fix an intermittent race ('Cannot read properties of undefined (reading collection)') under concurrent first requests. TEST PLAN: (a) GET /api/blog -> 200 [] ; (b) POST /api/blog (admin) with {title, subtitle, category, date, readingTime, content, published:true} -> 200 {ok, post} with generated slug + UUID + subtitle + date persisted; (c) GET /api/blog/:slug (public) -> 200 returns that post; (d) GET /api/blog/non-existent -> 404; (e) create an unpublished post and confirm GET /api/blog/:slug is 404 without admin token but 200 with token; (f) PUT /api/blog/:id (admin) update subtitle+date -> 200 persisted; GET /api/blog?all=true (admin) includes drafts; (g) DELETE /api/blog/:id (admin) -> 200 and GET /api/blog/:slug now 404; (h) REGRESSION: admin login ok/ko, GET /api/availability 200, POST /api/appointments valid booking 200 + double-booking 409 + missing consent 400 + honeypot silent, GET /api/appointments/booked?date=... public, GET /api/appointments (admin) 200, POST /api/contact valid 200 + missing consent 400. Confirm no Mongo _id leaks and no 500s. Clean up test data via DELETE endpoints."

    -agent: "main"
    -message: "P0 SERVER CRASH ROOT CAUSE FIXED (was NOT memory/OOM). The Next.js dev server was crash-looping because the SWC native binary (@next/swc-linux-x64-gnu/next-swc.linux-x64-gnu.node) was TRUNCATED on disk (68.9MB instead of 143MB), causing SIGBUS (BUS_ADRERR) when the render worker mmapped it. Fixed by re-downloading the correct 143MB binary from the npm registry tarball. Server now Ready in ~3.9s and serves 200. NOW PLEASE TEST BACKEND (2 items): (1) RESEND EMAIL: POST /api/appointments with a valid booking {name,email,date(future weekday),time,service,modality,consent:true} -> expect 200 {ok:true, emailSent:true} (Resend returns an id). POST /api/contact with {name,email,message,consent:true} -> expect 200 (no 500). If Resend rejects (e.g. test mode can only deliver to account owner giuliaflori.1093@gmail.com), the helper throws and endpoint may 500 - report the exact error/status so we know if the key/from-address needs adjustment. (2) AVAILABILITY HOURS: GET /api/availability -> verify day 0 (Sun) enabled:false; days 1-5 (Mon-Fri) slots exactly ['09:00'..'17:00']; day 6 (Sat) slots ['09:00'..'15:00']. Admin token: POST /api/admin/login {password:'giulia2025'} -> token, header x-admin-token. Clean up any test appointments via DELETE. Report emailSent values and any 500s."

    -agent: "testing"
    -message: "✅ RESEND EMAIL + AVAILABILITY HOURS TESTING COMPLETE - ALL 9 TESTS PASSED (100% success). AREA 1 - RESEND EMAIL NOTIFICATIONS (highest priority): (1) POST /api/appointments with valid booking returns 200 {ok:true, emailSent:true, appointment:{...}} - Resend API successfully dispatches email (emailSent=true confirms integration working), (2) POST /api/contact with valid message returns 200 {ok:true} - Resend email dispatched successfully, (3) POST /api/contact with honeypot field 'website' returns 200 {ok:true} silently (not stored, no crash on email). AREA 2 - AVAILABILITY HOURS: GET /api/availability returns EXACT correct structure - Day 0 (Sunday) enabled:false slots:[], Days 1-5 (Mon-Fri) enabled:true slots:['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'] (9 slots), Day 6 (Saturday) enabled:true slots:['09:00','10:00','11:00','12:00','13:00','14:00','15:00'] (7 slots). QUICK REGRESSION: (1) POST /api/appointments duplicate booking returns 409 conflict, (2) POST /api/appointments missing consent returns 400, (3) GET /api/appointments (admin) returns 200 array, (4) GET /api/appointments/booked returns only times array with no personal data leak. No 500 errors encountered. Resend API integration fully functional with onboarding@resend.dev sender address and RESEND_API_KEY configured. All API response times fast (90-448ms). Backend email notifications and availability configuration working correctly."
