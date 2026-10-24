/**
 * Evidence behind the Mission page. Every figure names its year, its geography and a link.
 * Keep it honest: if a number is not verified, it goes in UNVERIFIED, not in STATS.
 * Text is English only for now; the page headings are translated.
 */
export interface Stat {
  value: string;
  label: string;
  where: string;
  source: string;
  url: string;
}

export const STATS: { group: string; items: Stat[] }[] = [
  {
    group: 'Markham is diverse and multilingual',
    items: [
      {
        value: '~78%',
        label: 'of residents identify as a visible minority',
        where: 'Markham, 2016 Census',
        source: 'Markham Museum demographics fact sheet',
        url: 'https://www.markhammuseum.ca/sites/default/files/about-city-markham/Facts%20%26%20Stats/Demographics-Fact-Sheet-Markham-City-Wide.pdf',
      },
      {
        value: '~59%',
        label: 'of residents are immigrants',
        where: 'Markham, 2016 Census',
        source: 'Markham Museum demographics fact sheet',
        url: 'https://www.markhammuseum.ca/sites/default/files/about-city-markham/Facts%20%26%20Stats/Demographics-Fact-Sheet-Markham-City-Wide.pdf',
      },
      {
        value: '23% · 13% · 5% · 2%',
        label: 'mother tongue Cantonese · Mandarin · Tamil · Persian',
        where: 'Markham, 2016 Census',
        source: 'Markham Museum demographics fact sheet',
        url: 'https://www.markhammuseum.ca/sites/default/files/about-city-markham/Facts%20%26%20Stats/Demographics-Fact-Sheet-Markham-City-Wide.pdf',
      },
      {
        value: '18.7% · 13.8% · 7.6% · 2.0%',
        label: 'the same four languages, more recently',
        where: 'Markham–Thornhill riding (part of the city only), 2021 Census',
        source: 'Wikipedia riding profile',
        url: 'https://en.wikipedia.org/wiki/Markham%E2%80%94Thornhill_(federal_electoral_district)',
      },
    ],
  },
  {
    group: 'Disability and age are common, not niche',
    items: [
      {
        value: '28.0%',
        label: 'of people aged 15+ have a disability that limits daily activities',
        where: 'Ontario, 2022 (Canada: 27%)',
        source: 'Statistics Canada, Canadian Survey on Disability',
        url: 'https://www150.statcan.gc.ca/n1/pub/11-627-m/11-627-m2023063-eng.htm',
      },
      {
        value: '40.4%',
        label: 'of seniors (65+) have a disability',
        where: 'Canada, 2022',
        source: 'Statistics Canada, Canadian Survey on Disability',
        url: 'https://www150.statcan.gc.ca/n1/pub/11-627-m/11-627-m2023063-eng.htm',
      },
      {
        value: '22.3% → 27.0%',
        label: 'rise in the national disability rate in five years',
        where: 'Canada, 2017 to 2022',
        source: 'Statistics Canada, Canadian Survey on Disability',
        url: 'https://www150.statcan.gc.ca/n1/pub/11-627-m/11-627-m2023063-eng.htm',
      },
      {
        value: '65+ > under 15',
        label: 'York Region now has more seniors than children',
        where: 'York Region, 2021 Census',
        source: 'York Region 2021 Census report',
        url: 'https://york.ca/media/104971/download',
      },
    ],
  },
  {
    group: 'Loneliness is measurable',
    items: [
      {
        value: '19%',
        label: 'of seniors reported loneliness',
        where: 'Canada, 2019 to 2020',
        source: 'Statistics Canada',
        url: 'https://statcan.gc.ca/o1/en/plus/4881-look-loneliness-among-seniors',
      },
      {
        value: '38% vs 13%',
        label: 'lonely among seniors with barriers to taking part, versus those without',
        where: 'Canada, 2019 to 2020',
        source: 'Statistics Canada',
        url: 'https://statcan.gc.ca/o1/en/plus/4881-look-loneliness-among-seniors',
      },
      {
        value: 'Higher',
        label: 'loneliness among people who immigrated as adults than among the Canadian-born, in later life',
        where: 'Canada',
        source: 'Statistics Canada study, reported by CTV',
        url: 'https://calgary.ctvnews.ca/immigrant-seniors-lonelier-than-those-born-in-canada-but-research-lacking-statcan-1.6486040',
      },
    ],
  },
];

/** Things we looked for and could not confirm. Showing them is part of earning trust. */
export const UNVERIFIED: string[] = [
  'Markham-wide 2021 Census figures (visible minority share, mother tongues, share aged 65+). We only found 2016 city-wide data and a partial 2021 riding profile. We will add the exact 2021 figures from the Statistics Canada Census Profile.',
  'Markham-specific disability and loneliness rates. The disability and loneliness figures above are national or Ontario numbers, not Markham numbers.',
  'How often Markham event listings leave out accessibility details. We have no outside statistic for this, and the events in this prototype are samples, so we make no claim. A small audit of real listings is planned.',
];

export const GAPS: { gap: string; today: string; ours: string }[] = [
  {
    gap: 'Accessibility details',
    today: 'Free text, or nothing',
    ours: 'Each need is marked Confirmed, AI-estimated or Unknown. Unknown never means "no".',
  },
  {
    gap: 'Language',
    today: 'Mostly English',
    ours: 'English, Cantonese, Mandarin, Tamil and Persian, with chat and voice in your language',
  },
  {
    gap: 'Ranking',
    today: 'Popularity or paid promotion',
    ours: 'Scores computed in code from your needs, with the reasons shown. The AI explains; it does not rank.',
  },
  {
    gap: 'Getting there without a car',
    today: 'An address',
    ours: 'Transit options and travel time are part of the ranking',
  },
  {
    gap: 'Community voice',
    today: 'Reviews of the seller',
    ours: 'Ratings from people who attended, plus a forum and event Q&A',
  },
  {
    gap: 'Your data',
    today: 'Tracked history',
    ours: 'Kept on your device. Disability needs are saved only after you tap "Yes, save", and you can delete them any time.',
  },
];

export const PILOT_MEASURES: string[] = [
  'How many questions people answer before they see picks',
  'How many events people save or attend',
  'How many hosts complete the accessibility checklist',
  'How many "Unknown" access fields hosts later confirm',
];

export const TRUST: { title: string; body: string }[] = [
  {
    title: 'It can only show real events',
    body: 'Maple shows only events returned by a search tool. It cannot make one up.',
  },
  {
    title: 'It never guesses a condition',
    body: 'Maple only uses needs you state. Every item it understood appears as a chip you can remove.',
  },
  {
    title: 'You can see how it decided',
    body: 'Each answer has a "How I decided" list of the steps it took.',
  },
  {
    title: 'Sample data is labelled',
    body: 'Events, ratings, reviews and conversations in this prototype are made up. Venues are real places.',
  },
];

export interface AiUse {
  what: string;
  how: string;
  why: string;
  real: 'ai' | 'rules';
}

/** Honest account of where AI is used. `rules` means the prototype does it with plain code, not a model. */
export const AI_USES: AiUse[] = [
  {
    what: 'Understanding what you type or say',
    how: 'With a Gemini key, a language model reads free text in any language. Without one, a keyword list for our five languages does it.',
    why: 'You describe yourself in your own words instead of ticking boxes.',
    real: 'ai',
  },
  {
    what: 'Finding events with tools',
    how: 'The model chooses which search, ranking, transit or detail tool to call. Maple can only show events those tools return.',
    why: 'It handles messy requests such as "something quiet near a bus stop on Saturday" without inventing events.',
    real: 'ai',
  },
  {
    what: 'Replying in your language',
    how: 'With a key, the model writes the reply. Without one, we use translated templates.',
    why: 'Follow-up questions get natural answers in Cantonese, Mandarin, Tamil, Persian or English.',
    real: 'ai',
  },
  {
    what: 'Voice input and read-aloud',
    how: 'Your browser’s built-in speech recognition and speech synthesis. We do not train or host any speech model.',
    why: 'It helps people who find typing hard or prefer to speak.',
    real: 'ai',
  },
  {
    what: 'Choosing the next question',
    how: 'Our own algorithm tries every answer and asks the question that would change your top picks the most. It is not machine learning.',
    why: 'Fewer, better questions get you to useful picks before you give up.',
    real: 'rules',
  },
  {
    what: 'Suggesting what to save to your profile',
    how: 'Maple proposes it. Nothing is stored until you tap "Yes, save".',
    why: 'The site learns what matters to you without quietly keeping sensitive details.',
    real: 'ai',
  },
];

export const AI_NOT: { what: string; why: string }[] = [
  {
    what: 'Ranking and scoring events',
    why: 'Plain code does it, so the same input gives the same order, no one can pay for a better place, and the "why this was picked" reasons match the real rule. The model explains; it does not rank.',
  },
  {
    what: 'Access status (Confirmed, AI-estimated, Unknown)',
    why: 'Unknown is never turned into yes or no by a guess.',
  },
  {
    what: 'Checking a host’s event for gaps',
    why: 'A fixed checklist is predictable and easy for hosts to understand.',
  },
];

export const AI_NOT_YET: string[] = [
  'The "AI-estimated" access labels on sample events were written by hand to show the design. No system estimates access from descriptions or reviews yet.',
  'The AI-style summaries of reviews and comments are rule-based today.',
  'Live mode with the real Gemini service has been tested only with a stand-in model.',
  'Event titles and descriptions are not machine-translated yet.',
];
