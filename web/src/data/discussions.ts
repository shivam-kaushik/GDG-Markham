import type { ForumCategory, Post, Thread } from './forum';
import type { Lang } from '../types';

type Role = Post['role'];
/** [author, role, text, index of the post this replies to, helpful votes, day in October 2026] */
type Row = [string, Role, string, number | null, number, string];

function eventThread(eventId: string, title: string, rows: Row[], category: ForumCategory = 'newcomers', lang: Lang = 'en'): Thread {
  const posts: Post[] = rows.map(([author, role, text, parent, helpful, day], i) => ({
    id: `${eventId}-${i}`,
    author,
    role,
    text,
    time: `2026-10-${day}T1${i % 9}:00:00-04:00`,
    parentId: parent === null ? undefined : `${eventId}-${parent}`,
    helpful,
  }));
  return { id: `event-${eventId}`, eventId, title, category, lang, created: posts[0].time, posts };
}

const N: Role = 'neighbour';
const H: Role = 'host';

/** Sample Q&A shown on each event page. Every event has questions, and most have a host answer. */
export const EVENT_DISCUSSIONS: Thread[] = [
  eventThread('new-neighbours', 'New neighbours, good conversations', [
    ['Priya N.', N, 'My English is still basic. Will people mind if I speak slowly?', null, 14, '20'],
    ['Library team', H, 'Not at all. Our facilitators speak slowly and simply, and Cantonese and Mandarin speakers are usually at the table too.', 0, 18, '21'],
    ['Omar S.', N, 'Is there tea and are there seats near the entrance? I bring my mother who uses a cane.', null, 6, '22'],
    ['Library team', H, 'Yes to both. Tea is free and the first table is right by the step-free entrance.', 2, 9, '22'],
  ]),
  eventThread('fall-colours-walk', 'Fall colours and a friendly park walk', [
    ['Margaret T.', N, 'How rough is the trail? I use a walker and need a path that stays firm.', null, 11, '19'],
    ['City events team', H, 'The main 3 km loop is paved and fairly flat. We turn back at the lookout if the ground is wet. Benches every ten minutes.', 0, 15, '20'],
    ['Daniel W.', N, 'Is there a washroom near the start?', null, 4, '21'],
    ['City events team', H, 'There is a seasonal washroom at the trailhead. It is not confirmed that it is accessible, so please ask on the day.', 2, 7, '21'],
  ], 'seniors'),
  eventThread('clay-night', 'A little clay, a little creativity', [
    ['Sofia L.', N, 'The listing mentions two steps at the door. Is there another way in for a wheelchair?', null, 12, '18'],
    ['Studio owner', H, 'Sorry, the heritage building has two steps and no ramp yet. We can move the class to the ground-floor garden room on request. Tell us a week ahead.', 0, 16, '19'],
    ['Jordan P.', N, 'Is clay included in the $25?', null, 3, '20'],
    ['Studio owner', H, 'Yes. Clay, tools, glazing and firing are all included. You collect your bowl two weeks later.', 2, 8, '20'],
  ], 'access'),
  eventThread('community-pantry', 'Lend a hand at a community pantry', [
    ['Chris M.', N, 'Can my 16-year-old come with me? She needs volunteer hours.', null, 8, '17'],
    ['Pantry volunteers', H, 'Yes, 16 and over are welcome and are paired with a buddy. We sign hour sheets at the end of the shift.', 0, 10, '18'],
    ['Kavya S.', N, 'Is the work heavy? I have a bad back.', null, 5, '19'],
    ['Pantry volunteers', H, 'There are seated jobs too, like sorting and labelling. Tell the shift lead when you arrive.', 2, 9, '19'],
  ], 'volunteers'),
  eventThread('saturday-stories', 'Saturday stories for little explorers', [
    ['Anna K.', N, 'My son is autistic and finds crowds hard. Is there somewhere calm?', null, 16, '18'],
    ['Library team', H, 'Yes, there is a quiet corner with soft mats set aside, and you are welcome to step out and return. Class size is small.', 0, 20, '19'],
    ['Wei C.', N, 'Is Mandarin spoken at all?', null, 4, '20'],
    ['Library team', H, 'The second story each week is read in Mandarin.', 2, 6, '20'],
  ], 'families'),
  eventThread('maker-afternoon', 'Make, learn and meet: a maker afternoon', [
    ['Sam K.', N, 'You mention LED demos. Do any of them flash? I get migraines from flashing lights.', null, 15, '16'],
    ['Centre staff', H, 'A few LED demos blink. We set aside a no-flash table with steady lights only. Ask for it at the door.', 0, 19, '17'],
    ['Lina H.', N, 'Is $10 per person or per family?', null, 3, '18'],
    ['Centre staff', H, 'Per person. Under 12s are free with an adult.', 2, 5, '18'],
  ], 'access'),
  eventThread('tai-chi', 'Morning tai chi in the park', [
    ['陈女士', N, '请问可以坐着练习吗？我膝盖不太好。', null, 10, '17'],
    ['Master Lau', H, '可以。我们有椅子，也会教坐着做的动作。用广东话和英语讲解。', 0, 14, '18'],
    ['Daniel W.', N, 'What if it rains?', null, 3, '19'],
    ['Master Lau', H, 'We move indoors to the covered pavilion. I will post a notice by 8 am.', 2, 6, '19'],
  ], 'seniors', 'zh'),
  eventThread('persian-poetry', 'Persian poetry and tea afternoon', [
    ['Rana H.', N, 'آیا می‌توانم شعر خودم را بخوانم؟ زبانم فارسی است.', null, 7, '15'],
    ['Host team', H, 'بله، خوش آمدید. هر شعری به فارسی یا انگلیسی خوانده می‌شود. فقط دو دقیقه وقت دارید.', 0, 11, '16'],
    ['Daniel W.', N, 'Is the room accessible by bus from Steeles?', null, 3, '17'],
    ['Host team', H, 'Yes, the Viva Orange stops at Bayview and Steeles, about a six-minute walk.', 2, 5, '17'],
  ], 'language', 'fa'),
  eventThread('board-games', 'Quiet board games for seniors', [
    ['Margaret T.', N, 'My father is 82 and uses a walker. Is there accessible parking?', null, 13, '16'],
    ['Lin Chen', H, 'Yes, there are two accessible spots by the main door and the room has no steps. Large-print cards are provided.', 0, 17, '17'],
    ['Alice F.', N, 'Is it only for seniors? I am 58.', null, 4, '18'],
    ['Lin Chen', H, 'Everyone over 55 is welcome. Caregivers of any age come free.', 2, 7, '18'],
  ], 'seniors'),
  eventThread('sign-language-cafe', 'ASL and LSQ social cafe', [
    ['Emma B.', N, 'I am learning sign language. Is it okay to come as a beginner?', null, 9, '14'],
    ['Cafe team', H, 'Absolutely. Beginners are paired with a signer and we have an interpreter for spoken parts.', 0, 13, '15'],
    ['Noor A.', N, 'Is there live captioning for the talks?', null, 6, '16'],
    ['Cafe team', H, 'Yes, captions run on the screen the whole evening.', 2, 8, '16'],
  ], 'access'),
  eventThread('family-recipes', 'Cook and share: family recipes night', [
    ['Priya N.', N, 'I am vegetarian and do not eat eggs. Can I still take part?', null, 7, '20'],
    ['Anita Rao', H, 'Yes, I plan vegetarian and vegan stations every time. Please tell me about allergies when you register.', 0, 10, '21'],
    ['Wei C.', N, 'Is the kitchen noisy? My father is hard of hearing.', null, 4, '22'],
    ['Anita Rao', H, 'It can get lively. I seat guests who prefer quiet near the far end, and the centre quiet room is open.', 2, 6, '22'],
  ], 'newcomers'),
  eventThread('chair-yoga', 'Chair yoga for everyone', [
    ['Alice F.', N, 'Do I need to bring anything? I am recovering from a hip replacement.', null, 8, '19'],
    ['Maria Costa', H, 'Just comfortable clothes. Chairs are provided, and I adapt every pose. Please tell me about your hip before class.', 0, 12, '20'],
    ['陈女士', N, '老师会说广东话吗？', null, 5, '21'],
    ['Maria Costa', H, '我会用简单的广东话带领，也有英语。', 2, 7, '21'],
  ], 'seniors', 'yue'),
  eventThread('tech-help', 'Phones and tablets help desk', [
    ['Margaret T.', N, 'I received a text about a parcel and I am not sure it is real. Can you look at it?', null, 17, '18'],
    ['Library team', H, 'Yes, that is exactly what we are here for. Bring the phone and we will check it together and show you what to look for.', 0, 21, '19'],
    ['Rana H.', N, 'آیا مترجم فارسی دارید؟', null, 5, '20'],
    ['Library team', H, 'A Farsi-speaking volunteer is here on Mondays, which includes this session.', 2, 9, '20'],
  ], 'seniors'),
  eventThread('mandarin-story', 'Mandarin story time', [
    ['Wei C.', N, '我家孩子三岁，会说一点普通话。适合吗？', null, 8, '19'],
    ['Wen Li', H, '很适合！故事很短，有歌曲和手工，孩子可以随时走动。', 0, 12, '20'],
    ['Anna K.', N, 'Our family speaks English only. Is that fine?', null, 5, '21'],
    ['Wen Li', H, 'Of course, I explain each story in English too.', 2, 7, '21'],
  ], 'families', 'zh'),
  eventThread('diwali-lights', 'Diwali lights stroll and sweets', [
    ['Kavya S.', N, 'Will there be flashing lights? My daughter has photosensitive epilepsy.', null, 18, '18'],
    ['City events team', H, 'Some string lights twinkle, but there is a steady-light route marked in green that avoids them, and a quiet seating area in the lobby.', 0, 22, '19'],
    ['Daniel W.', N, 'Is there a shuttle from the terminal?', null, 4, '20'],
    ['City events team', H, 'It is a two-minute walk from the terminal. We can have a volunteer meet you at the stop if you need help.', 2, 8, '20'],
    ['Sofia L.', N, 'Is sweets free?', null, 3, '21'],
    ['City events team', H, 'Yes, sweets and tea are free. We ask for donations to the pantry if you wish.', 4, 6, '21'],
  ], 'access'),
  eventThread('repair-cafe', 'Repair cafe: fix it, do not toss it', [
    ['Jordan P.', N, 'Can you fix a zipper on a winter coat?', null, 6, '17'],
    ['Raj Patel', H, 'Yes, we have two sewing tables. Bring the coat and any matching thread if you have it.', 0, 9, '18'],
    ['Chris M.', N, 'My teen wants to volunteer as a fixer. What skills do you need?', null, 5, '19'],
    ['Raj Patel', H, 'Curiosity is the main skill. We pair beginners with an experienced fixer and train on site.', 2, 7, '19'],
  ], 'volunteers'),
  eventThread('choir-open', 'Community choir open rehearsal', [
    ['Lina H.', N, 'I cannot read music and I am shy. Will I be asked to sing alone?', null, 11, '18'],
    ['Helen Wong', H, 'Never alone. We sing together and you can sit at the back and hum on your first night.', 0, 14, '19'],
    ['Sam K.', N, 'Are the lights bright or flashing? I am sensitive.', null, 4, '20'],
    ['Helen Wong', H, 'Steady room lighting only, no stage effects.', 2, 6, '20'],
  ], 'newcomers'),
  eventThread('garden-cleanup', 'Community garden fall cleanup', [
    ['Alice F.', N, 'I cannot bend easily. Are there tasks I can do standing or sitting?', null, 9, '17'],
    ['Garden committee', H, 'Yes. We have raised beds and a rest area with benches. You can sort seeds or label rows seated.', 0, 12, '18'],
    ['Jordan P.', N, 'Are tools provided?', null, 3, '19'],
    ['Garden committee', H, 'Gloves and tools are provided. Wear boots you do not mind getting muddy.', 2, 5, '19'],
  ], 'volunteers'),
  eventThread('quiet-hour', 'Sensory-friendly quiet hour', [
    ['Anna K.', N, 'Is it only for kids? I am an adult who finds loud places hard.', null, 15, '16'],
    ['Library access team', H, 'Everyone is welcome, any age. The hour was designed for people who are overwhelmed by noise and light.', 0, 19, '17'],
    ['Sam K.', N, 'Can I bring noise-cancelling headphones and take breaks?', null, 6, '18'],
    ['Library access team', H, 'Yes to both. We also lend headphones and have a separate calm room.', 2, 11, '18'],
  ], 'access'),
  eventThread('job-club', 'Newcomer job club', [
    ['Rana H.', N, 'آیا می‌توانم رزومه‌ام را ببرم تا بررسی شود؟', null, 8, '15'],
    ['Newcomer services team', H, 'بله، لطفاً دو نسخه چاپی بیاورید. مشاور ما به فارسی هم کمک می‌کند.', 0, 12, '16'],
    ['Priya N.', N, 'Is there a fee or a registration limit?', null, 5, '17'],
    ['Newcomer services team', H, 'It is free. Seating is limited to 40, so please reserve a spot.', 2, 7, '17'],
  ], 'newcomers', 'en'),
  eventThread('badminton-night', 'Try badminton night', [
    ['Wei C.', N, 'I have never played. Will I be put with experts?', null, 7, '17'],
    ['Kevin Tan', H, 'No. Beginners play on courts 3 and 4 and we rotate partners so no one is stuck with an expert.', 0, 10, '18'],
    ['Alice F.', N, 'Is there somewhere to sit between games?', null, 4, '19'],
    ['Kevin Tan', H, 'Yes, benches along every court.', 2, 5, '19'],
  ], 'newcomers'),
  eventThread('seniors-walk', "Seniors' mall walking group", [
    ['Margaret T.', N, 'Do I need to walk fast?', null, 10, '16'],
    ['Grace Lam', H, 'Not at all. We go at the pace of the slowest walker and stop for a rest every few minutes.', 0, 14, '17'],
    ['陈女士', N, '有人说广东话吗？', null, 6, '18'],
    ['Grace Lam', H, '有，大部分组员都说广东话。', 2, 8, '18'],
  ], 'seniors', 'yue'),
  eventThread('open-studio', 'Local artists open studio afternoon', [
    ['Sofia L.', N, 'Which studios are step-free? I use a wheelchair.', null, 13, '16'],
    ['Collective', H, 'Three of the six studios are step-free and marked on the map. We can park accessible vehicles at the front of the lane.', 0, 17, '17'],
    ['Jordan P.', N, 'Is parking free?', null, 3, '18'],
    ['Collective', H, 'Street parking is paid until 6 pm on weekends. There is a free lot ten minutes away.', 2, 5, '18'],
  ], 'access'),
];

/** More forum conversations, in addition to the ones in forum.ts. */
export const MORE_FORUM_THREADS: Thread[] = [
  {
    id: 'g10',
    title: 'Where can I practise English casually?',
    category: 'newcomers',
    lang: 'en',
    created: '2026-10-12T10:00:00-04:00',
    posts: [
      { id: 'g10-0', author: 'Wei C.', role: 'neighbour', text: 'I have been in Markham six months. I understand more than I speak. Where can I practise without feeling judged?', time: '2026-10-12T10:00:00-04:00', helpful: 14 },
      { id: 'g10-1', author: 'Priya N.', role: 'neighbour', parentId: 'g10-0', text: 'The Saturday conversation circle at Markham Village Library. Everyone is learning something.', time: '2026-10-12T14:00:00-04:00', helpful: 9 },
      { id: 'g10-2', author: 'Community moderator', role: 'mod', parentId: 'g10-0', text: 'Also try the cooking night and the badminton night. Doing something together makes talking easier.', time: '2026-10-13T09:00:00-04:00', helpful: 7 },
    ],
  },
  {
    id: 'g11',
    title: 'How accurate is the "Our estimate" tag?',
    category: 'access',
    lang: 'en',
    created: '2026-10-11T10:00:00-04:00',
    posts: [
      { id: 'g11-0', author: 'Arun P.', role: 'neighbour', text: 'I see tags like Our estimate and Not known yet. How much should I trust them?', time: '2026-10-11T10:00:00-04:00', helpful: 12 },
      { id: 'g11-1', author: 'Community moderator', role: 'mod', parentId: 'g11-0', text: 'Confirmed means the host told us. Our estimate means we guessed from the description or past events. Not known yet means nobody has said, and it never means no. When in doubt, use Ask the host.', time: '2026-10-11T12:00:00-04:00', helpful: 21 },
    ],
  },
  {
    id: 'g12',
    title: 'Tips for taking the bus to evening events',
    category: 'transit',
    lang: 'en',
    created: '2026-10-10T10:00:00-04:00',
    posts: [
      { id: 'g12-0', author: 'Chris M.', role: 'neighbour', text: 'Any tricks for getting home after 8 pm without a car?', time: '2026-10-10T10:00:00-04:00', helpful: 9 },
      { id: 'g12-1', author: 'Daniel W.', role: 'neighbour', parentId: 'g12-0', text: 'Viva Blue and Purple run until after midnight. Check the last bus before you commit. Free transfers within 2 hours on PRESTO.', time: '2026-10-10T13:00:00-04:00', helpful: 11 },
      { id: 'g12-2', author: 'Priya N.', role: 'neighbour', parentId: 'g12-0', text: 'Use the Transit filter on Explore. It hides events with no bus service at the start time.', time: '2026-10-10T16:00:00-04:00', helpful: 8 },
    ],
  },
  {
    id: 'g13',
    title: 'ஒரு தமிழ் குழுவில் சேர விரும்புகிறேன்',
    category: 'language',
    lang: 'ta',
    created: '2026-10-09T10:00:00-04:00',
    posts: [
      { id: 'g13-0', author: 'Kavya S.', role: 'neighbour', text: 'மார்க்கத்தில் தமிழ் பேசும் குடும்பங்களுடன் சேர ஏதாவது நிகழ்வுகள் உள்ளனவா?', time: '2026-10-09T10:00:00-04:00', helpful: 8 },
      { id: 'g13-1', author: 'Civic Centre team', role: 'host', parentId: 'g13-0', text: 'நவம்பர் 6 அன்று தமிழ் நாட்டுப்புற இசை மாலை உள்ளது. அனைவரும் வரவேற்கப்படுகிறார்கள்.', time: '2026-10-09T14:00:00-04:00', helpful: 10 },
    ],
  },
  {
    id: 'g14',
    title: 'Caregivers: events we can attend together',
    category: 'seniors',
    lang: 'en',
    created: '2026-10-08T10:00:00-04:00',
    posts: [
      { id: 'g14-0', author: 'Alice F.', role: 'neighbour', text: 'I care for my mother who has early memory loss. Any calm, predictable events we can do together?', time: '2026-10-08T10:00:00-04:00', helpful: 16 },
      { id: 'g14-1', author: 'Lin Chen', role: 'host', parentId: 'g14-0', text: 'The quiet board games afternoon has a predictable schedule and caregivers come free. The sensory-friendly hour also works well.', time: '2026-10-08T15:00:00-04:00', helpful: 14 },
      { id: 'g14-2', author: 'Margaret T.', role: 'neighbour', parentId: 'g14-0', text: 'The mall walking group is gentle too. Everyone looks out for each other.', time: '2026-10-09T09:00:00-04:00', helpful: 9 },
    ],
  },
  {
    id: 'g15',
    title: '谁有适合孩子的免费周末活动？',
    category: 'families',
    lang: 'zh',
    created: '2026-10-07T10:00:00-04:00',
    posts: [
      { id: 'g15-0', author: '王太太', role: 'neighbour', text: '孩子五岁，想找周末可以用普通话参加的免费活动。', time: '2026-10-07T10:00:00-04:00', helpful: 9 },
      { id: 'g15-1', author: 'Wen Li', role: 'host', parentId: 'g15-0', text: '十一月七日星期六上午十点半，Unionville 图书馆有普通话故事时间，免费，欢迎带孩子来。', time: '2026-10-07T16:00:00-04:00', helpful: 12 },
    ],
  },
  {
    id: 'g16',
    title: 'Teens looking for volunteer hours',
    category: 'volunteers',
    lang: 'en',
    created: '2026-10-06T10:00:00-04:00',
    posts: [
      { id: 'g16-0', author: 'Jordan P.', role: 'neighbour', text: 'I am 17 and need 40 hours for school. What is a good place to start?', time: '2026-10-06T10:00:00-04:00', helpful: 7 },
      { id: 'g16-1', author: 'Raj Patel', role: 'host', parentId: 'g16-0', text: 'Repair cafe and the community garden both sign hour sheets, and you learn a skill along the way.', time: '2026-10-06T13:00:00-04:00', helpful: 8 },
    ],
  },
];
