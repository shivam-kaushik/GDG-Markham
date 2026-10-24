import type { Lang } from '../types';

export type ForumCategory =
  | 'newcomers'
  | 'access'
  | 'seniors'
  | 'families'
  | 'volunteers'
  | 'transit'
  | 'hosts'
  | 'language';

export const FORUM_CATEGORIES: ForumCategory[] = [
  'newcomers',
  'access',
  'seniors',
  'families',
  'volunteers',
  'transit',
  'hosts',
  'language',
];

export interface Post {
  id: string;
  author: string;
  role: 'neighbour' | 'host' | 'mod' | 'you';
  text: string;
  time: string;
  parentId?: string;
  helpful: number;
  helpedByMe?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  category: ForumCategory;
  lang: Lang;
  /** Set for the discussion that sits on an event page. */
  eventId?: string;
  created: string;
  posts: Post[];
}

const d = (day: string) => `2026-10-${day}T10:00:00-04:00`;

/** Sample conversations. Names are fictional. */
export const SEED_THREADS: Thread[] = [
  {
    id: 'event-mending-circle',
    eventId: 'mending-circle',
    title: 'Unionville Mending Circle',
    category: 'newcomers',
    lang: 'en',
    created: d('23'),
    posts: [
      { id: 'm1', author: 'Maya R.', role: 'neighbour', text: "I'm new to Markham and haven't sewn before. Is it okay to come on my own, and do I need to buy supplies?", time: d('23'), helpful: 4 },
      { id: 'm2', author: 'Lin Chen', role: 'host', parentId: 'm1', text: "Absolutely, come on your own! We'll introduce you around. Needles, thread and scraps are shared, just bring one clean item you'd like to mend.", time: d('23'), helpful: 6 },
      { id: 'm3', author: 'Arun P.', role: 'neighbour', text: 'Could you confirm whether the entrance is step-free and there is an accessible washroom? Thanks for making this easier to plan.', time: d('23'), helpful: 9 },
      { id: 'm4', author: 'Lin Chen', role: 'host', parentId: 'm3', text: "The entrance is step-free, and there's an accessible washroom on the main floor. I'll be at the entrance if you'd like help finding the room.", time: d('24'), helpful: 11 },
      { id: 'm5', author: 'Sofia L.', role: 'neighbour', text: 'This sounds lovely. Is there a separate quiet room, and when does the room tend to be busiest?', time: d('24'), helpful: 2 },
    ],
  },
  {
    id: 'event-tamil-music',
    eventId: 'tamil-music',
    title: 'Tamil folk music evening',
    category: 'language',
    lang: 'en',
    created: d('22'),
    posts: [
      { id: 't1', author: 'Kavya S.', role: 'neighbour', text: 'Is there seating near the front for older relatives? Also, will there be a lobby to step out to?', time: d('22'), helpful: 3 },
      { id: 't2', author: 'Civic Centre team', role: 'host', parentId: 't1', text: 'Yes, there are reserved seats at the front and the lobby is open throughout the evening.', time: d('23'), helpful: 5 },
    ],
  },
  {
    id: 'f1',
    title: 'Just moved to Markham: where do I start?',
    category: 'newcomers',
    lang: 'en',
    created: d('20'),
    posts: [
      { id: 'a1', author: 'Priya N.', role: 'neighbour', text: 'We moved here two weeks ago. Which free events are good for meeting neighbours? I am still learning English, so a relaxed place would help.', time: d('20'), helpful: 12 },
      { id: 'a2', author: 'Daniel W.', role: 'neighbour', parentId: 'a1', text: 'The Saturday conversation circles at Markham Village Library are very friendly, and Cantonese and Mandarin speakers usually come too.', time: d('20'), helpful: 8 },
      { id: 'a3', author: 'Community moderator', role: 'mod', parentId: 'a1', text: 'Tip: use the filters on Explore to show only free events in your language. Maple can also build a list for you.', time: d('21'), helpful: 7 },
    ],
  },
  {
    id: 'f2',
    title: 'Events with no flashing lights?',
    category: 'access',
    lang: 'en',
    created: d('19'),
    posts: [
      { id: 'b1', author: 'Sam K.', role: 'neighbour', text: 'I get migraines from flashing lights. How can I tell if an event is safe before I go?', time: d('19'), helpful: 15 },
      { id: 'b2', author: 'Ishika B.', role: 'neighbour', parentId: 'b1', text: 'On each event page, look at the "Flashing lights" tile. If it says Not known yet, use "Ask the host". Hosts usually answer within a day.', time: d('19'), helpful: 10 },
      { id: 'b3', author: 'Community moderator', role: 'mod', parentId: 'b1', text: 'You can also tick "No flashing lights" in the access filters on Explore.', time: d('20'), helpful: 6 },
    ],
  },
  {
    id: 'f3',
    title: 'Quiet, seated activities for my father (82)',
    category: 'seniors',
    lang: 'en',
    created: d('18'),
    posts: [
      { id: 'c1', author: 'Margaret T.', role: 'neighbour', text: 'My father uses a walker and likes cards and tea. Where could we go together on a weekday afternoon?', time: d('18'), helpful: 9 },
      { id: 'c2', author: 'Lin Chen', role: 'host', parentId: 'c1', text: 'The quiet board games afternoon at Milliken Mills has large print cards, a calm side room and accessible parking.', time: d('19'), helpful: 12 },
    ],
  },
  {
    id: 'f4',
    title: 'No car: how do you get to evening events?',
    category: 'transit',
    lang: 'en',
    created: d('17'),
    posts: [
      { id: 'd1', author: 'Chris M.', role: 'neighbour', text: 'Buses thin out after 8 pm. Does anyone share rides to Civic Centre events?', time: d('17'), helpful: 6 },
      { id: 'd2', author: 'Priya N.', role: 'neighbour', parentId: 'd1', text: 'The Viva Blue line runs late from Civic Centre Terminal. Check "Easy to reach without a car" on the For you page.', time: d('18'), helpful: 5 },
    ],
  },
  {
    id: 'f5',
    title: '谁可以推荐适合长辈的免费活动？',
    category: 'language',
    lang: 'zh',
    created: d('16'),
    posts: [
      { id: 'e1', author: '陈女士', role: 'neighbour', text: '我母亲只会说普通话和广东话，想找一些免费、安静、可以坐着参加的活动。', time: d('16'), helpful: 7 },
      { id: 'e2', author: 'Daniel W.', role: 'neighbour', parentId: 'e1', text: '早上的太极班用广东话和英语授课，也可以坐着做，在 Centennial Park。', time: d('17'), helpful: 8 },
    ],
  },
  {
    id: 'f6',
    title: 'Volunteer shifts for teens and parents',
    category: 'volunteers',
    lang: 'en',
    created: d('15'),
    posts: [
      { id: 'g1', author: 'Chris M.', role: 'neighbour', text: 'My 16-year-old needs community hours. Are there shifts we can do together?', time: d('15'), helpful: 5 },
      { id: 'g2', author: 'Pantry volunteers', role: 'host', parentId: 'g1', text: 'Yes! Volunteers 16 and over are paired with a buddy. Wednesday 4 to 6 pm is best for first-timers.', time: d('16'), helpful: 6 },
    ],
  },
  {
    id: 'f7',
    title: 'Hosts: how do I describe access honestly?',
    category: 'hosts',
    lang: 'en',
    created: d('14'),
    posts: [
      { id: 'h1', author: 'Rana H.', role: 'neighbour', text: 'I run a poetry afternoon. I am not sure whether our room counts as step-free. What should I write?', time: d('14'), helpful: 4 },
      { id: 'h2', author: 'Community moderator', role: 'mod', parentId: 'h1', text: 'Write exactly what you know, and mark anything else as unknown. Neighbours would rather ask than be surprised.', time: d('15'), helpful: 9 },
    ],
  },
];
