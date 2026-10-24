# Food Security in Markham: Research, Problem Statement & Build Plan
*Generated: 2026-10-23 | Sources: 24 | Confidence: Medium-High for regional data, Medium for Markham-specific data (see gaps)*

---

## Executive Summary

Food insecurity in York Region **doubled in five years**: 11.1% of households in 2019, 22.1% in 2024. Markham is the second-largest user of the regional food bank network (8,172 people, 2,697 households in 2024). The help that exists is built for a client who is free on weekday afternoons, reads English and eats a Western pantry hamper. The fastest-growing client groups are different: **working people** (up 113% since 2021), **seniors** (doubled province-wide) and **first-time visitors** (1 in 3). In Markham, most of those people are immigrants. Markham's main food bank is open **5 hours 15 minutes a week**, lists only English as a service language, and gives a **7–10 day supply once every 28 days**.

Markham also has one of the densest clusters of Asian supermarkets, bakeries, BBQ shops and dim sum restaurants in Canada. Each night they throw away perishable food of exactly the kind newcomer and senior households want. Nationally, **41.7% of wasted food is avoidable**, and Ontario's **Donation of Food Act (1994)** already shields good-faith donors from liability.

**Recommended build:** **"Table Tonight"**, a voice-first, multilingual app with three parts:
1. A Markham plaza business speaks one sentence in Cantonese, Mandarin, Tamil or English and snaps a photo. The surplus food is listed in about 10 seconds.
2. A resident asks *"I need food tonight"* in their own language and gets matched to that surplus or to a program **open right now**, filtered by diet (halal, vegetarian, Chinese staples), distance and transit.
3. If nothing fits, it falls back to the next open pantry, with what to bring and how to get there.

It covers two event tracks (everyday life and small business) plus the sustainability bonus theme. The demo uses two phones and two languages, which makes it hard to forget.

---

## 1. What the research says (with sources)

### 1.1 Markham demographics (2016 Census, City of Markham fact sheet)
These are the figures in the PDF you linked. It is the 2016 Census, the latest version the City publishes as a fact sheet.

| Parameter | Value | Why it matters for food |
|---|---|---|
| Population | 328,940 | — |
| Immigrants | 59% (192,230); 81% born in Asia | Western hampers are a mismatch for most newcomers |
| Visible minority | 78%; Chinese 45%, South Asian 18% | Culturally specific staples (rice, noodles, lentils, halal) |
| Mother tongue | English 36%, **Cantonese 23%**, **Mandarin 13%**, **Tamil 5%**, Farsi 2%, Urdu 2%, Tagalog 1%, Gujarati 1%, Punjabi 1% | An English-only service misses most residents. These are the **5 demo languages** |
| Seniors 65+ | 15% (49,960) | Fixed incomes; senior food bank use doubled in Ontario |
| Households with 5+ people | 17% (17,910) | Multigenerational homes; a 7–10 day hamper runs out faster |
| One-person households | 13% (13,850) | Isolated seniors; 35.4% of regional food bank households are single people |
| Household income under $40k | 20% (20,380 households) | Core at-risk group |
| Household income under $20k | 7% (7,565 households) | Deep poverty |
| No certificate, diploma or degree | 17% (45,360) | Plain language and voice matter |
| Work in accommodation & food services | 7% (12,020) | Food workers who are themselves food-insecure; also the donor network |
| No fixed workplace / work at home | 10% / 8% | Gig and shift workers can't attend fixed pantry hours |

Source: [Markham Demographics Fact Sheet (2016)](https://www.markham.ca/sites/default/files/about-city-markham/Facts%20%26%20Stats/Demographics-Fact-Sheet-Markham-City-Wide.pdf)

### 1.2 Food insecurity is rising quickly, and the people affected are changing
| Parameter | Value | Source |
|---|---|---|
| York Region households food-insecure | **22.1% (2024)**, up from 19.4% (2023) and 11.1% (2019) | [York Region, May 2026](https://www.york.ca/node/71376) |
| Food-insecure York households (2023) | 79,300 | [FBYR Report 2024](https://fbyr.ca/wp-content/uploads/Food-Bank-of-York-Regions-Report-on-Food-Insecurity-2024-1.pdf) |
| York residents below the low-income line | 18.6%; over 231,000 people | FBYR 2024; [Markham Review, Jun 2026](https://markhamreview.com/york-region-food-bank-use-surges-57-in-five-years/) |
| Food bank use in York Region | **+57% in 5 years**; ~35,000 people in 2025, 30% of them children | Markham Review, Jun 2026 |
| **Markham** served by the FBYR network (2024) | **8,172 individuals / 2,697 households** (2nd highest, after Richmond Hill) | FBYR 2024, p.7 |
| Markham Food Bank load | ~800 families (3,000+ residents) a month, **entirely volunteer-run** | [Markham Review, Dec 2025](https://markhamreview.com/?p=31579) |
| Clients whose main income is employment | 10.8% → 15.5% → 17.7% → 20.9% (2021–24); **+113% by 2025** | FBYR 2024; Markham Review |
| Clients who are renters | **71% private rental**; 15.8% social housing; 4.4% owners | FBYR 2024 |
| Ages of clients | 29.7% aged 0–17; 9.4% aged 65+ | FBYR 2024 |
| First-time food bank visitors (Ontario) | About 1 in 3 | [Feed Ontario Hunger Report 2025](https://feedontario.ca/wp-content/uploads/2025/11/FEED_HungerReport25_Digital.pdf) via [Niagara Knowledge Exchange](https://www.niagaraknowledgeexchange.com/resources-publications/hunger-report-2025-feed-ontario/) |
| Senior visitors (Ontario) | About double five years ago | Feed Ontario 2025 |
| Monthly cost of food, family of 4 (York) | **$1,242** + $2,205 rent = $3,447 | York Region 2026 |
| Ontario Works family of 4 | $2,994 a month, **$453 short** before any other bill | York Region 2026 |
| Renters paying more than 30% of income on rent | 46.9% in York Region, the highest in Ontario | FBYR 2024 |

**Our estimate (inference, not a published figure):** if Markham matched the regional rate of 22.1%, about **22,700 Markham households** were food-insecure in 2024 (102,665 households × 22.1%). The network served **2,697**. That suggests **about 1 in 8 food-insecure households reach a food program**. That is consistent with FBYR's own statement that food banks are a *"last resort"*. Present this in the demo as an estimate.

### 1.3 Food access in Markham: what residents face
| Program | Hours / access | Gap |
|---|---|---|
| **Markham Food Bank**, 190 Bullock Dr (McCowan) | Tue 6–7:45pm, Thu 12:30–2:15pm, Sat 9–10:45am. ID required. **One 7–10 day order every 28 days.** Prepackaged. **Language listed: English.** No delivery listed. | **5h15m a week, about 3% of the hours in a week.** One evening slot. Covers ~1/3 of the month. Listing updated 27 Jul 2026 ([Central Healthline](https://centralhealthline.ca/printService.aspx?id=190176)) |
| Master's Pantry, Unionville Alliance, 4898 16th Ave | 1st & 3rd Sat, 9–10:30am | 3 hours a month ([listing](https://centralhealthline.ca/printService.aspx?id=190250)) |
| Cornerstone Pantry, 9680 Ninth Line | By appointment; delivery offered | Small capacity ([listing](https://centralhealthline.ca/printService.aspx?id=190247)) |
| 105 Gibson Centre (Warden/Steeles) | By appointment, call or email | Booking barrier ([listing](https://centralhealthline.ca/printService.aspx?id=200693)) |
| Seneca SSF food bank, Markham campus | Full-time Seneca students only; register 24h ahead; once a month | Students only ([listing](https://centralhealthline.ca/printService.aspx?id=187032)) |
| CHATS Chinese community lunch (seniors) | Tuesdays | One day a week ([Caredove](https://www.caredove.com/service/detail/sid/3829)) |
| SPLC Meals on Wheels | Western or Chinese meals; Cantonese and Mandarin; **$10.75 a hot meal**; 55+ | Costs money; limited area ([listing](https://centralhealthline.ca/printService.aspx?id=51482)) |

What the listings show:
- **Hours don't fit working clients.** The fastest-growing group has jobs, and most slots are weekday daytime or early Saturday.
- **Information is scattered and goes stale.** Each pantry is listed separately, with update dates ranging from 2024 to 2026. Neither the City nor the Region has a "what's open now" view (the City's [food page](https://yourvoicemarkham.ca/food_sustainability) was last updated in Feb 2023).
- **Donated food is a cultural mismatch.** The Dec 2025 drive's largest single donation was 11,000 packs of instant noodles. Food banks elsewhere in Canada report that newcomers don't use canned goods and ask for fresh produce, halal meat, lentils and rice ([CBC PEI](https://amp.cbc.ca/news/canada/prince-edward-island/pei-immigrants-food-bank-1.4028298), [CTV Alberta](https://edmonton.ctvnews.ca/lentils-halal-meat-alberta-food-banks-address-demand-for-cultural-groceries-1.6348332), [CBC Surrey](https://amp.cbc.ca/news/canada/british-columbia/surrey-food-bank-culturally-appropriate-foods-halal-1.6665375)). *Unverified for York Region specifically: confirm with a resident at the event.*

### 1.4 Supply that already exists: Markham's food businesses
- Canada wastes **46.5%** of food produced; **41.7% of that waste is avoidable**, worth about **$58B** a year. Fresh produce, bakery and dairy have the highest rates ([Second Harvest 2024](https://www.secondharvest.ca/research/avoidable-crisis-updated)).
- **Liability is already handled:** Ontario's [Donation of Food Act, 1994](https://www.ontario.ca/laws/statute/94d19) protects donors (and their staff) unless the food was knowingly unfit or they acted with reckless disregard. Many small owners don't know this, so the app should tell them in their language.
- Markham has a local food-rescue group, [Meals That Matter](https://mealsthatmatter.odoo.com/connect-with-us), which can be a pilot partner.
- **The [Markham Small Business Centre](https://markhambusiness.ca/helping-businesses/small-business-services) has no food-specific program.** It offers consultations, Starter Company Plus (up to $5,000), Summer Company (up to $3,000) and a Digital Transformation Grant, and helped 1,679 businesses in 2023–24. A food-business tool fills a gap in what the City offers, and the Digital Transformation Grant is a plausible way to fund adoption later.

### 1.5 Existing tools, and why none of them solves this
| Tool | What it does | Why it doesn't solve Markham's problem |
|---|---|---|
| Second Harvest Food Rescue App | Businesses donate bulk surplus to registered non-profits | Agency-to-agency only; residents can't use it; English UI; bulk-oriented ([listing](https://centralhealthline.ca/printService.aspx?id=132772)) |
| Too Good To Go | Discounted surprise bags | Paid; Markham coverage unverified; no dietary or cultural matching; no link to food banks |
| Flashfood | Discounted near-expiry groceries | Loblaw stores only; paid |
| Chalmers (Ample Labs) | Chatbot for shelters and meals | Toronto homeless sector; not multilingual or food-surplus-aware ([BetaKit](https://betakit.com/ample-labs-ada-officially-launch-ai-chatbot-for-torontos-homeless-community/)) |
| 211 / Central Healthline | Directory listings | No "open now", no language or diet filter, static, uneven update dates |

**What none of them does:** a free, multilingual, voice-first link between Markham's independent Asian and South Asian food businesses and residents, with dietary and cultural matching and a fallback to a program that is open now.

---

## 2. The parameters that decide whether a Markham resident gets helped

Use these as **design requirements** and **demo metrics**.

### Resident-side parameters
| # | Parameter | Current state (Markham) | Target for Table Tonight |
|---|---|---|---|
| R1 | **Time to food** (hours from "I need food" to food in hand) | Up to 4 days (Sat → Tue) at the main food bank | Under 3 hours (same evening) |
| R2 | **Hours fit** (help available outside 9–5) | 1 evening slot a week | Business close-time surplus (7–10pm) most nights |
| R3 | **Language match** | English-listed | Cantonese, Mandarin, Tamil, Farsi, Urdu, English (covers ~80% of mother tongues) |
| R4 | **Cultural / dietary fit** | Prepackaged Western hamper | Tags: halal, vegetarian, Jain, no beef, no pork, Chinese staples, South Asian staples, allergens |
| R5 | **Monthly coverage** | 7–10 days out of 28 (~64–75% of the month uncovered) | Fills the days between hampers |
| R6 | **Reach without a car** | Bullock & McCowan, fixed site | Nearest pickup + YRT/walking time shown |
| R7 | **Dignity / stigma** | In-person line, ID check | No account needed to browse; anonymous pickup code |
| R8 | **Information freshness** | Listings from 2024–2026 | Live listings; programs show "last verified" |
| R9 | **Literacy / tech barrier** | Text directories | Voice in, voice out; large buttons |
| R10 | **Nutrition** | Noodle-heavy donations | Fresh produce and prepared meals prioritized |

### Business-side parameters
| # | Parameter | Target |
|---|---|---|
| B1 | **Time to post surplus** | 10 seconds or less (one sentence plus one photo) |
| B2 | **Language of owner** | Owner speaks their own language; the listing is auto-translated |
| B3 | **Liability clarity** | Donation of Food Act summary shown in the owner's language |
| B4 | **Waste diverted** | kg and $ counter per shop, and an "impact" badge for the storefront |
| B5 | **No-show risk** | Pickup window plus confirmation; anything unclaimed is routed to a partner agency |

### Food bank / community parameters
| # | Parameter | Target |
|---|---|---|
| C1 | Volunteer admin time | Programs update hours with one voice message |
| C2 | Overflow | Residents outside food bank hours get routed to surplus, which relieves the line |
| C3 | Data for advocacy | Anonymous counts of unmet requests by ward, language and time (useful to the City and FBYR) |

---

## 3. Candidate problem statements (pick one; #1 recommended)

### ★ #1: "Food is thrown out at 9pm, a block from families who ate instant noodles for dinner." (Recommended)
> **Who:** Working, newcomer and senior households in Markham. About 22% of York Region households are food-insecure, and most are renters, workers and immigrants.
> **What blocks them:** Markham's main food bank is open 5 hours a week, lists only English, and gives one 7–10 day order every 28 days. Its hampers rarely match what a Cantonese grandmother or a halal-observant Tamil family cooks. Meanwhile Markham's plaza bakeries, BBQ shops and grocers discard fresh, culturally familiar food every night, because posting a donation takes time, English and a contact they don't have.
> **Why it matters:** About 1 in 8 food-insecure Markham households reaches a food program (our estimate). Food bank use is up 57%, working clients are up 113%, and 41.7% of wasted food is avoidable.
> **Tracks:** Everyday life + Small business + Sustainability (bonus).

### #2: "Help exists but nobody can find it in their language at the moment they need it."
A multilingual "what's open now" navigator over all Markham food programs, with documents to bring, transit and a phone script. This is an upgrade of idea #7 in your list. It is lower risk and more feasible, but it is **less novel**: 211 already does a static version.

### #3: "Seniors on OAS/GIS skip meals because Meals on Wheels costs $10.75 and lunch programs run one day a week."
A senior-specific companion that combines a voice check-in in Cantonese or Mandarin, meal program matching and family alerts. It is very emotional, but the audience is narrower and the demo is harder to verify live.

**Why #1 wins at this event:** it is the only one where **two different people with two phones in two languages** create a match live on stage. It answers all three showcase questions cleanly, it has a business partner story (the City's small business office), and it does more than make a better directory: it adds new food to the system.

---

## 4. The solution: Table Tonight

### 4.1 One-line pitch
*"Markham's plazas post tonight's surplus in their own language in 10 seconds; neighbours who need food find it, in their language, filtered for halal, vegetarian or Chinese staples. If nothing fits, Table Tonight shows the pantry that's open next and what to bring."*

### 4.2 Core flows (ship flow A + B end to end; C is the fallback)

**Flow A: Business posts surplus (the "10-second" moment)**
1. The owner taps the mic and says in Cantonese: *"今晚剩低二十個叉燒包同埋三盒菜，九點半前嚟攞。"* ("Tonight we have 20 BBQ pork buns and 3 boxes of vegetables left, pick up before 9:30.")
2. They snap one photo.
3. Gemini, with audio + image → **structured JSON**: `{items:[{name, qty, unit}], tags:[contains_pork, vegetarian:false, halal:false, allergens:[wheat, soy]], pickup_until, storage: "room temp", translations:{en, zh-Hans, zh-Hant, ta, fa, ur}}`
4. The owner sees a preview card in their language and taps **Post**. A one-line Donation of Food Act note appears in their language.

**Flow B: Resident finds food (the "tonight" moment)**
1. A resident says in Tamil or Mandarin: *"I need food for my family of 5 tonight, we eat halal, I'm near Milliken."*
2. Gemini extracts `{household_size:5, diet:[halal], location, need_by: tonight}` and filters Firestore listings by tags and pickup window.
3. Results come back in the resident's language. The pork bun listing is **excluded** because it isn't halal. A halal-compatible vegetable listing appears, with a map, walk/YRT time and a **pickup code**.
4. The resident taps **Reserve**, and the listing quantity goes down in real time.

**Flow C: Fallback ("Nothing tonight? Here's what's open next")**
- Searches the pre-seeded **programs** collection (about 15–25 Markham programs) by day and time.
- Example: *"Markham Food Bank opens Thursday 12:30–2:15pm at 190 Bullock Dr. Bring ID with your name and address. 1 order per 28 days."*
- It always ends with **211** and the City's 905-477-5530 so it never leaves someone stuck.

### 4.3 Architecture (designed for a 3-hour build)
```
[Phone browser PWA on Firebase Hosting]
   ├─ Mic (MediaRecorder) + camera input
   ├─ Firebase AI Logic SDK → current Gemini Flash model
   │     • audio + image in → JSON schema out (structured output)
   │     • translation in the same call
   ├─ Firestore: listings, programs, reservations (real-time listeners)
   ├─ Maps JavaScript API: markers + distance
   │     (optional: Grounding with Google Maps for "nearest YRT stop")
   └─ Firebase Anonymous Auth (no sign-up friction)
```
- **No custom backend.** Firebase AI Logic calls Gemini from the client with App Check, which cuts Cloud Run setup time. Use a Cloud Function only if time allows.
- **Two routes, one app:** `/shop` (business) and `/` (resident). Demo them on two phones side by side.
- References: [Firebase AI Logic: Grounding with Google Maps](https://firebase.google.com/docs/ai-logic/grounding-google-maps?api=dev)

### 4.4 Data model
```
listings/{id}: shopName, address, geo, items[], tags[], allergens[],
               pickupUntil, qtyRemaining, translations{}, photoUrl, createdAt
programs/{id}: name, address, geo, hours[{day, open, close}], requirements,
               frequency, languages[], diet[], eligibility, phone, lastVerified, sourceUrl
reservations/{id}: listingId, code, qty, createdAt   (no personal data stored)
```

### 4.5 Safety & trust rules (show these on stage; they build trust)
- Only **licensed, inspected food businesses** can post prepared food; consumer-to-consumer listings are off.
- Prepared food must have a **pickup window of 4 hours or less**; refrigerated items need a "kept cold" checkbox.
- Allergens are always shown, and Gemini output is **reviewed by the owner before posting**.
- The AI never invents a program: fallback answers come **only** from the seeded `programs` collection, with `lastVerified` shown.
- **No personal data collected** from residents: anonymous auth, and the pickup code isn't tied to a name.

---

## 5. Pre-event prep (allowed; disclose it)
| # | Task | Output |
|---|---|---|
| P1 | Create a GCP + Firebase project, enable AI Logic, Firestore, Hosting and the Maps JS API; get an API key; set budget alerts within the 5h credit | Working project |
| P2 | Build the **programs dataset**: 15–25 Markham food programs (food banks, pantries, CHATS, SPLC, Seneca SSF, Meals That Matter, mosque/temple/gurdwara meals), with hours, documents, languages, diet and source URL. **Phone 3–5 of them to verify hours.** | `programs.json` |
| P3 | **Tag taxonomy**: halal, vegetarian, vegan, Jain, no beef, no pork, contains seafood, Chinese staples, South Asian staples, top 9 allergens | `tags.json` |
| P4 | Write and test the **two Gemini prompts + JSON schemas** (listing extraction; resident intent extraction) in AI Studio, in 4 languages | `prompts.md` |
| P5 | 6 seed **demo listings** (bakery, BBQ shop, vegetarian Indian sweets shop, grocery produce, dim sum, halal kebab), clearly labelled DEMO | `listings_seed.json` |
| P6 | Pre-record audio clips in Cantonese, Mandarin and Tamil as a backup if live speech fails | 3 clips |
| P7 | Sketch 3 screens on paper or in Figma: Shop Post, Resident Ask, Results/Map | Mockups |
| P8 | **Reach out:** email the Markham Small Business Centre (edoinfo@markham.ca) and Meals That Matter; ask 1 plaza owner if you can use their shop name | Partner quote |
| P9 | Team roles: Gemini + data, frontend + maps, Firestore + hosting, presenter + tester | Roles |

---

## 6. On-the-day build plan (≈3 hours)
| Time | Goal | Done when |
|---|---|---|
| 10:15–10:45 | Listen to reverse pitches. **Write down one resident quote** about food, cost or language | Quote in the deck |
| 10:45–11:15 | Skeleton on Firebase Hosting: `/` and `/shop` pages, Firestore seeded with programs + demo listings | Live URL loads both pages |
| 11:15–12:15 | **Flow A**: mic + photo → Gemini → JSON preview → post to Firestore. **Flow B**: voice/text ask → intent JSON → filtered results list | Cantonese post shows up on the resident phone |
| 12:15–1:00 (lunch) | Let 3–4 attendees try it in their language; log failures | "What we learned" list |
| 1:00–1:45 | Map with markers + walking distance; reservation with a live quantity decrement; **Flow C** fallback "open next" | Halal filter excludes pork buns; fallback shows Thursday hours |
| 1:45–2:15 | Fix the top 3 failures; voice read-out of results (browser TTS); safety notes and Donation of Food Act line | Clean run-through 3 times |
| 2:15–2:30 | Record a 60s backup video; make the QR code slide; README | Ready to present |

**Cut list (in order) if behind:** voice read-out → map (use distance text) → photo (voice only) → reservation (just "show pickup code").

---

## 7. Showcase script (3 minutes)
1. **The challenge (30s):** "Last night at 9:30, a bakery on Highway 7 threw out 20 buns. Two kilometres away, Mrs. Lin, 71, a Mandarin speaker on GIS, had instant noodles for dinner; Markham's food bank wasn't open until Thursday." Then one number: *"Food insecurity in York Region doubled in five years, to 1 in 5 households."* Then the reverse-pitch quote.
2. **What we built and for whom (2 min):** Phone 1, the owner, speaks Cantonese and snaps a photo, and the listing appears. Phone 2, a resident, asks in Tamil for halal food for 5. The pork buns are filtered out, halal-safe vegetables show up with a map and a code, and you reserve them. Then ask "anything else?" and the fallback shows the Thursday pantry hours with "bring ID with your address".
3. **What we learned (30s):** One honest lunch-test finding plus a next step: *"Pilot with 5 shops on one plaza, Meals That Matter as the safety-net pickup, and the Markham Small Business Centre for onboarding."*
- Last slide: QR code to the live link and the Google stack used (Gemini via Firebase AI Logic, Firestore, Hosting, Maps). Disclose gen-AI use and pre-event data prep.

---

## 8. Risks & mitigations
| Risk | Mitigation |
|---|---|
| Food safety concerns from the audience | Licensed businesses only, time windows, allergen display, owner review, Donation of Food Act |
| Live speech recognition fails in a noisy room | Pre-recorded clips (P6) + typed fallback |
| "Isn't this Too Good To Go?" | Free; multilingual voice; dietary/cultural matching; food bank fallback; built for independent plaza shops, not chains |
| Stigma / misuse (people taking food for resale) | Per-listing quantity cap, pickup code, owner can mark collected |
| Stale program data | `lastVerified` badge; program staff can update by voice (post-hackathon) |
| Budget overrun on credits | Flash model, small images (resize to 768px client-side), budget alert |

---

## 9. Gaps in this research (be honest about these)
- **No Markham-specific food insecurity rate** was found; Markham figures are FBYR network counts. The 22.1% is regional.
- The **2021 Census** Markham fact sheet wasn't available; the City PDF is 2016 data. Language shares may have shifted (Mandarin has likely grown relative to Cantonese; *unverified*).
- **Cultural mismatch evidence comes from other Canadian cities**, not York Region. Validate it at the event.
- **Too Good To Go / Flashfood coverage in Markham** is unverified.
- Food bank hours come from 211 listings; **call to confirm** before the demo.

---

## Sources
1. [City of Markham Demographics Fact Sheet (2016 Census)](https://www.markham.ca/sites/default/files/about-city-markham/Facts%20%26%20Stats/Demographics-Fact-Sheet-Markham-City-Wide.pdf): language, immigration, income, household size
2. [Markham Small Business Services](https://markhambusiness.ca/helping-businesses/small-business-services): programs, grants, impact numbers; no food-specific program
3. [York Region: Food Insecurity & Food Affordability (May 2026)](https://www.york.ca/node/71376): 22.1% food-insecure; $1,242 food basket; $453 OW shortfall
4. [Food Bank of York Region Report on Food Insecurity 2024](https://fbyr.ca/wp-content/uploads/Food-Bank-of-York-Regions-Report-on-Food-Insecurity-2024-1.pdf): municipality counts, client demographics, renters, employment
5. [Markham Review: York Region food bank use surges 57% (Jun 2026)](https://markhamreview.com/york-region-food-bank-use-surges-57-in-five-years/): 35,000 served, +113% employed
6. [Markham Review: Helping Hands food drive (Dec 2025)](https://markhamreview.com/?p=31579): 800 families a month, volunteer-run, noodle donation
7. [Feed Ontario Hunger Report 2025](https://feedontario.ca/wp-content/uploads/2025/11/FEED_HungerReport25_Digital.pdf): 1M+ Ontarians, 8.7M visits
8. [Niagara Knowledge Exchange summary of Hunger Report 2025](https://www.niagaraknowledgeexchange.com/resources-publications/hunger-report-2025-feed-ontario/): first-time visitors, seniors doubled
9. [Central Healthline: Markham Food Bank](https://centralhealthline.ca/printService.aspx?id=190176): hours, ID, 28-day rule, English
10. [Markham Food Bank website](https://markhamfoodbank.ca): ID with name and address
11. [Central Healthline: Master's Pantry](https://centralhealthline.ca/printService.aspx?id=190250)
12. [Central Healthline: Cornerstone Pantry](https://centralhealthline.ca/printService.aspx?id=190247)
13. [Central Healthline: 105 Gibson Centre](https://centralhealthline.ca/printService.aspx?id=200693)
14. [Central Healthline: Seneca SSF Food Bank](https://centralhealthline.ca/printService.aspx?id=187032)
15. [Central Healthline: SPLC Meals on Wheels](https://centralhealthline.ca/printService.aspx?id=51482)
16. [Caredove: CHATS Markham Chinese lunch](https://www.caredove.com/service/detail/sid/3829)
17. [Your Voice Markham: Food Security & Sustainability](https://yourvoicemarkham.ca/food_sustainability)
18. [Second Harvest: The Avoidable Crisis of Food Waste, Update (2024)](https://www.secondharvest.ca/research/avoidable-crisis-updated)
19. [Ontario Donation of Food Act, 1994](https://www.ontario.ca/laws/statute/94d19)
20. [Meals That Matter (Markham food rescue)](https://mealsthatmatter.odoo.com/connect-with-us)
21. [CBC PEI: Food bank and newcomers / halal](https://amp.cbc.ca/news/canada/prince-edward-island/pei-immigrants-food-bank-1.4028298)
22. [CTV: Alberta food banks and cultural groceries](https://edmonton.ctvnews.ca/lentils-halal-meat-alberta-food-banks-address-demand-for-cultural-groceries-1.6348332)
23. [BetaKit: Ample Labs Chalmers chatbot](https://betakit.com/ample-labs-ada-officially-launch-ai-chatbot-for-torontos-homeless-community/)
24. [Firebase AI Logic: Grounding with Google Maps](https://firebase.google.com/docs/ai-logic/grounding-google-maps?api=dev)

## Methodology
About 20 web searches and 10 full-page or PDF reads (two PDFs text-extracted locally with pdftotext). Sub-questions investigated:
(1) Markham demographics relevant to food access; (2) the scale and shifting profile of food insecurity in York Region and Markham; (3) what food programs exist in Markham and their access barriers; (4) supply-side surplus and legal context; (5) existing tools and the gaps they leave; (6) the Google stack needed for the build.
