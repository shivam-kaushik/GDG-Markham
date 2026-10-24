 1. What the board says

  ┌───────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
  │        Section        │                                       Team input                                        │
  ├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ Target user           │ "Markham Residents"                                                                     │
  ├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │                       │ You don't know the environment at an event. There's no group filter. A Toronto events   │
  │ Pain points (pink     │ site has no language support. You can't tell if an event is free. Residents don't know  │
  │ stickies)             │ where to start. Looking for a place can be hard. Events need disability info, such as   │
  │                       │ flashing lights.                                                                        │
  ├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ Ideas (green          │ Build events, multi-language, volunteer or participant roles, event forum summary,      │
  │ stickies)             │ community input for event planning, summarize the conversation.                         │
  ├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ Journey: Event finder │ 1. I want to find an event to join. 2. Use search, filter and language tools. 3. Learn  │
  │                       │ more about the event in detail. 4. Decide on the event.                                 │
  ├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ Journey: Event        │ 1. I want to plan an event. 2. Post an event insight. 3. Ask the community about event  │
  │ planner               │ details. 4. Plan an optimized event with community insight.                             │
  ├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
  │ Success metrics       │                                                                                         │
  │ (table with Impact    │ Search time, understanding, language support, user confidence.                          │
  │ and Target blank)     │                                                                                         │
  └───────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

  Your pasted brief adds these:
  - multiple personas
  - sign-up as a volunteer or participant
  - a marketplace that pulls from Luma, Eventbrite, local and community sources
  - a comment thread per event with an AI summary
  - an event "space" that lists each occurrence by date
  - separate participant and host flows with a switch between them
  - AI recommendations, and AI help for hosts creating events

  The accessibility sticky and the TodoMarkham guide still fit. I'd keep them as the "What to expect" feature rather
  than a separate product.

  2. Product concept (working name: TodoMarkham)

  One-line pitch: a community event marketplace for Markham. It aggregates events from many platforms, helps people find
  ones that fit them, shows what to expect, and lets the community and hosts shape events together.

  Principles
  1. One account, two modes: Participant and Host, switchable at any time.
  2. Every event answers the unknowns: cost, language, accessibility, environment and who it's for.
  3. AI helps but does not decide. It recommends, summarizes and drafts. It never invents facts, and it labels anything
     it estimated.
  4. Residents don't need to disclose a diagnosis.

  3. Personas

  ┌──────────────────┬─────────────────┬───────────────────────┬──────────────────────┬────────────────────────────┐
  │     Persona      │       Who       │      Main goals       │  Main frustrations   │           Needs            │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │                  │ College or      │ Cheap, social,        │ Doesn't know where   │ Free filter,               │
  │ Maya, student    │ university      │ resume-building       │ to start. Can't tell │ volunteer-hours tag, quick │
  │ (19)             │ student         │ events and volunteer  │  if an event is      │  sign-up, mobile           │
  │                  │                 │ hours                 │ free.                │                            │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │ Daniel, young    │ New to the      │                       │ Events are scattered │ Evening and weekend        │
  │ professional     │ area, works     │ Networking and        │  across platforms.   │ filter, calendar sync, one │
  │ (28)             │ full time       │ hobbies               │ Weekday timing is    │  place for every platform  │
  │                  │                 │                       │ hard.                │                            │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │                  │                 │                       │ Small print,         │ Large text, simple flow,   │
  │ Margaret, senior │ Long-time       │ Social connection,    │ uncertainty about    │ seating and quiet-space    │
  │  (72)            │ resident        │ low-stress activities │ seating and crowds,  │ info, phone support        │
  │                  │                 │                       │ complicated sites    │                            │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │                  │ Recently        │ Meet people, find     │ No language support, │ Multi-language UI and      │
  │ Priya, newcomer  │ arrived,        │ services and          │  unsure what's       │ summaries,                 │
  │                  │ English is her  │ festivals             │ welcome              │ "newcomer-friendly" tag    │
  │                  │ second language │                       │                      │                            │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │ Sam, resident    │ Mobility,       │ Know if they can      │ Missing details on   │ Evidence-labelled          │
  │ with access      │ sensory or      │ participate           │ flashing lights,     │ accessibility card,        │
  │ needs, or        │ cognitive needs │ comfortably           │ noise and entry      │ Essential and Preferred    │
  │ caregiver        │                 │                       │                      │ filters                    │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │ Chris, family    │                 │ Family-friendly       │ No age filter,       │ Age and family filter,     │
  │ parent           │ Kids aged 3–10  │ weekend activities    │ unclear cost and     │ cost, duration             │
  │                  │                 │                       │ stroller access      │                            │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │ Jordan, host     │ Runs a club,    │ Fill the event and    │ Posting to several   │ AI-assisted event          │
  │ (community       │ library program │ learn what people     │ platforms, no        │ creation, community input, │
  │ organizer)       │  or festival    │ want                  │ feedback before the  │  attendee insights         │
  │                  │                 │                       │ event                │                            │
  ├──────────────────┼─────────────────┼───────────────────────┼──────────────────────┼────────────────────────────┤
  │ Lena, volunteer  │ Nonprofit or    │ Recruit volunteers    │ Hard to reach people │ Volunteer roles, shift     │
  │ coordinator      │ city staff      │                       │  who want to help    │ sign-up, headcount         │
  └──────────────────┴─────────────────┴───────────────────────┴──────────────────────┴────────────────────────────┘

  Primary personas for the MVP: Maya, Margaret, Priya and Sam as participants, and Jordan as host. The board's target
  user is "Markham Residents", so these four are how I'd break it down.

  4. Roles and the mode switch

  - Guest: browse and search only.
  - Participant: save events, RSVP, volunteer, comment, set preferences.
  - Host: everything above, plus create and manage events, answer questions and see insights.
  - Admin / moderator: review reported comments and imported events.

  A single account holds both modes. A toggle in the header ("Participating | Hosting") swaps the navigation, dashboard
  and default actions without logging out. A person who has never hosted sees a short "Become a host" setup the first
  time.

  5. Core features

  A. Event marketplace (aggregation)
  - Sources: Eventbrite and Luma imports, City of Markham and Visit Markham listings, library and community-centre
    pages, and events posted directly by hosts.
  - Imported events show the source badge and link back to the original page. Ticketing and payment stay on the source
    platform.
  - Dedupe by title, date and venue. Normalize into one event schema.
  - Build reality: Eventbrite has an API. Luma has limited API access. For the hackathon, seed 10–15 events by hand or
    via one importer, and show the architecture for the rest.

  B. Discovery
  - Search, filters (date, free or paid, category, language, age group, distance, accessibility needs, volunteer or
    participant), and sort.
  - Language switcher (English plus 2–3 of Chinese, Tamil, Hindi, French). Gemini translates the event content.
  - AI "For you" feed from interests and past activity.

  C. Event space (the page for each event or series)
  - Header with date, venue, cost, language, source and host.
  - "What to expect" card: accessibility, noise, crowd, seating, flashing lights and quiet space, each labelled
    Confirmed, AI-estimated or Unknown.
  - Occurrence list: every date this event has run or will run. Past occurrences show photos and summaries. Future ones
    show a sign-up button.
  - Sign up as Participant or Volunteer, with volunteer roles and shifts.
  - Community thread: comments, replies, questions to the host, and reports.
  - AI comment summary at the top: common praise, common concerns and answered questions.

  D. Host tools
  - AI-assisted event creation. The host pastes a flyer, a link or a few notes. Gemini fills in the form: title,
    description, category, date, cost, language and accessibility fields. The host reviews and edits before publishing.
  - Gap checker: Gemini lists the 3 most useful details still missing (for example "flashing lights not mentioned").
  - Pre-event community input: post a draft idea, collect comments and polls, and see an AI summary of what people want.
  - Attendee and volunteer list, messaging, and post-event recap.
  - Series management: create the event once, then add occurrences.

  E. Community and trust
  - Comments need an account. Moderation tools: report, hide and rate-limit.
  - A host reply is badged "Host". A host answer to an accessibility question can upgrade a field from Unknown to
    Confirmed.
  - AI summary refreshes as comments arrive.

  6. Workflows

  Participant: find and join
  1. Land on the home page and pick a language and interests, or skip.
  2. Search or use the "For you" feed. Filter by free, date, language and needs.
  3. Open the event space and read the "What to expect" card and the AI comment summary.
  4. If something is unknown, ask the community or the host in the thread.
  5. Choose Participate or Volunteer. Pick the date and the role.
  6. Get confirmation, add to calendar, and receive a reminder.
  7. After the event, leave a comment or a rating, which feeds the next summary.

  Host: create and run
  1. Switch to Hosting. Choose "New event".
  2. Paste a link, flyer text or notes. Gemini drafts every field and flags missing details.
  3. Review, edit and publish. Optionally post a draft to the community for input first.
  4. Read the AI summary of community input and adjust the plan.
  5. Manage sign-ups and volunteers and answer questions in the thread.
  6. After the event, add the occurrence recap. The next date inherits the learnings.

  Import (system): fetch from sources, normalize, dedupe, Gemini tags the event with categories and attributes, then
  publish with the source badge.

  Moderation (admin): a reported comment goes to a queue, then the admin hides or restores it and the author is
  notified.

  7. User journeys

  ┌──────────┬───────────────────┬──────────────────┬────────────────────────┬──────────────────┬──────────────────┐
  │  Stage   │  Maya (student)   │    Margaret      │    Priya (newcomer)    │   Sam (access    │  Jordan (host)   │
  │          │                   │     (senior)     │                        │      needs)      │                  │
  ├──────────┼───────────────────┼──────────────────┼────────────────────────┼──────────────────┼──────────────────┤
  │          │ Opens "For you"   │ Opens a          │ Switches language      │ Sets needs,      │ Switches to      │
  │ Discover │ and sees free     │ large-text,      │ first                  │ marks Essential  │ Hosting          │
  │          │ events            │ simple view      │                        │ or Preferred     │                  │
  ├──────────┼───────────────────┼──────────────────┼────────────────────────┼──────────────────┼──────────────────┤
  │          │ Reads the         │                  │                        │                  │ Pastes a flyer,  │
  │ Evaluate │ summary: "good    │ Checks seating   │ Reads the translated   │ Reads the        │ reviews the AI   │
  │          │ for meeting       │ and crowd info   │ summary                │ evidence grid    │ draft            │
  │          │ people"           │                  │                        │                  │                  │
  ├──────────┼───────────────────┼──────────────────┼────────────────────────┼──────────────────┼──────────────────┤
  │          │ Volunteers for    │ Asks "is there   │ Sees                   │ Copies a         │ Posts a draft    │
  │ Decide   │ hours             │ seating?" in the │ "newcomer-friendly"    │ question for the │ for community    │
  │          │                   │  thread          │ comments               │  host            │ input            │
  ├──────────┼───────────────────┼──────────────────┼────────────────────────┼──────────────────┼──────────────────┤
  │          │ Signs up and adds │ Signs up, gets a │                        │ Signs up if      │ Publishes and    │
  │ Commit   │  to calendar      │  reminder        │ Signs up               │ essentials are   │ opens sign-ups   │
  │          │                   │                  │                        │ confirmed        │                  │
  ├──────────┼───────────────────┼──────────────────┼────────────────────────┼──────────────────┼──────────────────┤
  │          │                   │                  │                        │ The host's       │ Reads the        │
  │ After    │ Comments on the   │ Rates seating    │ Replies to help other  │ answer upgrades  │ summary and      │
  │          │ experience        │ accuracy         │ newcomers              │ the field        │ creates the next │
  │          │                   │                  │                        │                  │  date            │
  └──────────┴───────────────────┴──────────────────┴────────────────────────┴──────────────────┴──────────────────┘

  Emotions to design for: uncertainty before, confidence after reading the card, and belonging after attending.

  8. How AI is used

  ┌────────────────────────┬───────────────────────────────────────────┬────────────────────────────────────────────┐
  │        Feature         │                 Model job                 │                 Guardrail                  │
  ├────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Recommendations        │ Rank events from interests, language and  │ Show "because you liked X"; the user can   │
  │                        │ behavior                                  │ reset                                      │
  ├────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Comment summary        │ Summarize themes, questions and concerns  │ Cite counts; show the raw comments; never  │
  │                        │                                           │ invent                                     │
  ├────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Host event creation    │ Extract structured fields from pasted     │ The host must approve; unknown stays       │
  │                        │ text                                      │ Unknown                                    │
  ├────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Gap checker            │ Suggest the missing details that matter   │ Suggestions only                           │
  │                        │ most                                      │                                            │
  ├────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Accessibility          │ Fill the 6 attributes with evidence state │ Confirmed only with a quote; silence means │
  │ extraction             │                                           │  Unknown                                   │
  ├────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Translation            │ Translate descriptions and summaries      │ Keep the original one tap away             │
  ├────────────────────────┼───────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Categorization on      │ Tag source events                         │ Admin can override                         │
  │ import                 │                                           │                                            │
  └────────────────────────┴───────────────────────────────────────────┴────────────────────────────────────────────┘

  Scoring and ranking logic stays in code so results are explainable.

  9. Information architecture

  - Public: Home, Search results, Event space, Sign in.
  - Participant mode: For you, Saved, My events (upcoming and past), Volunteer shifts, Preferences (interests, language,
    needs), Notifications.
  - Host mode: Dashboard, Create event (AI), My events and series, Community input, Sign-ups and volunteers, Insights.
  - Admin: Import queue, Moderation queue.

  Key screens: Home with search, Results with filters, Event space, Sign-up modal, Host create flow, Host dashboard.

  10. Data model

  - User: id, name, language, interests[], needs{}, roles (participant, host).
  - Source: id, name, type (eventbrite, luma, city, direct), url.
  - EventSeries: id, title, description, category[], hostId, sourceId, sourceUrl, cost, languages[], audience tags, and
    the 6 accessibility attributes with evidence state.
  - Occurrence: id, seriesId, start, end, venue, capacity, status (upcoming, past), recap, photos.
  - Signup: userId, occurrenceId, type (participant or volunteer), role, status.
  - Comment: id, seriesId, optional occurrenceId, userId, text, parentId, isHostReply, status, reports.
  - CommentSummary: seriesId, text, themes[], openQuestions[], updatedAt.
  - Recommendation cache: userId, eventIds[], reasons[].

  11. Technical approach

  - Frontend: React (Vite or Next.js), responsive, WCAG-minded, i18n library for language.
  - Backend and data: Firebase (Auth, Firestore, Hosting, Cloud Functions). This matches the TodoMarkham guide and the
    hackathon's Google stack.
  - AI: Gemini API with structured JSON output for extraction. Prompts for summaries, translation and recommendations.
    Run calls in Cloud Functions to keep keys off the client.
  - Imports: a scheduled Cloud Function pulls from source APIs and feeds. For the demo, use seeded data.
  - Maps (optional): Google Maps for venue and distance.
  - Quality: keyboard navigation, contrast, large tap targets, loading and empty states.

  12. MVP versus later

  The board says to pick one core feature. I'd scope it like this.

  MVP (hackathon build)
  - Seeded marketplace of 10–15 events, with source badges.
  - Search and filters: free, date, category, language.
  - Event space with the "What to expect" card and the occurrence list.
  - Sign up as participant or volunteer.
  - Comment thread with an AI summary.
  - Participant and Host mode switch.
  - AI-assisted event creation for hosts.
  - "For you" recommendations (simple version).
  - Language switch for 2 languages.

  Later: live Eventbrite and Luma sync, full moderation, volunteer shift scheduling, notifications, ratings, insights
  dashboard, a full set of languages, a Maps view, payments.

  Cut order if time runs out: recommendations, then the second language, then the occurrence history, then the host
  dashboard. Keep one complete participant journey and the AI event creation.

  13. Suggested success metrics (fills the blank table)

  ┌─────────────────┬─────────────────────┬──────────────────────────────────────────┬────────────────────────────┐
  │     Metric      │       Impact        │                   How                    │           Target           │
  ├─────────────────┼─────────────────────┼──────────────────────────────────────────┼────────────────────────────┤
  │ Search time     │ Easier to find a    │ Time from landing to opening a relevant  │ Under 60 seconds           │
  │                 │ fit                 │ event                                    │                            │
  ├─────────────────┼─────────────────────┼──────────────────────────────────────────┼────────────────────────────┤
  │ Understanding   │ Fewer unknowns      │ Share of fields labelled and explained   │ 100% of 6 attributes       │
  │                 │                     │                                          │ labelled                   │
  ├─────────────────┼─────────────────────┼──────────────────────────────────────────┼────────────────────────────┤
  │ Language        │ Inclusive access    │ Languages for UI and summaries           │ 2+ at launch               │
  │ support         │                     │                                          │                            │
  ├─────────────────┼─────────────────────┼──────────────────────────────────────────┼────────────────────────────┤
  │ User confidence │ Willingness to      │ Post-test rating: "I know what to        │ 4 out of 5                 │
  │                 │ attend              │ expect"                                  │                            │
  └─────────────────┴─────────────────────┴──────────────────────────────────────────┴────────────────────────────┘

  14. Open decisions for you

  1. Scope: do you build both the participant and host flows end to end, or go deep on participant with the host as a
     lighter demo?
  2. Name: keep "TodoMarkham"?
  3. Imports: seeded data for the demo, or one real API such as Eventbrite?
  4. Languages: which two or three?
  5. Accessibility: keep it as the "What to expect" card, as in the guide?