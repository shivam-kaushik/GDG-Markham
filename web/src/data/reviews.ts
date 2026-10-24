export interface Review {
  id: string;
  eventId: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** ISO date of the gathering the person attended. */
  date: string;
  /** Marks reviews from people who attended, as opposed to open comments. */
  attended: true;
}

type Row = [string, string, 1 | 2 | 3 | 4 | 5, string, string];

const rows: Row[] = [
  ['mending-circle', 'Hannah L.', 5, 'I had never held a needle. Lin sat with me for twenty minutes and I left with a mended sleeve and three new friends.', '2026-10-03'],
  ['mending-circle', 'Arun P.', 5, 'The step-free entrance and accessible washroom were exactly as described. That made planning easy.', '2026-10-03'],
  ['mending-circle', 'Eleanor S.', 4, 'Lovely and welcoming. It does get a little busy in the middle hour, so I took a short break outside.', '2026-09-05'],
  ['new-neighbours', 'Wei C.', 5, 'I was nervous about my English. Everyone was patient and I learned three new words.', '2026-10-11'],
  ['new-neighbours', 'Omar S.', 4, 'Good conversation and free tea. My mother liked the seat near the door.', '2026-10-11'],
  ['fall-colours-walk', 'Margaret T.', 5, 'Flat, paved and lots of benches. I could keep up with my walker. The leaves were beautiful.', '2026-10-12'],
  ['fall-colours-walk', 'Daniel W.', 4, 'Great route. Wish the washroom info had been confirmed ahead of time.', '2026-10-12'],
  ['clay-night', 'Jordan P.', 5, 'Instructor explains everything. Walked out with a bowl I actually like.', '2026-10-07'],
  ['clay-night', 'Sofia L.', 3, 'Fun class but the steps at the door were hard for my wheelchair. The ground-floor room worked once I asked.', '2026-10-07'],
  ['community-pantry', 'Chris M.', 5, 'My daughter and I did a shift together. The buddy system made us feel looked after.', '2026-10-14'],
  ['community-pantry', 'Alice F.', 4, 'Rewarding. I did sorting seated, which was perfect for my back.', '2026-10-14'],
  ['saturday-stories', 'Anna K.', 5, 'The quiet corner made all the difference for my son. We stayed the whole hour for the first time.', '2026-10-10'],
  ['saturday-stories', 'Wei C.', 5, 'The Mandarin story was my daughter\'s favourite part.', '2026-10-10'],
  ['maker-afternoon', 'Sam K.', 4, 'The no-flash table was real, and staff remembered when I asked. Good mentors.', '2026-10-04'],
  ['maker-afternoon', 'Lina H.', 5, 'My teen built a tiny robot and did not want to leave.', '2026-10-04'],
  ['tai-chi', '陈女士', 5, '老师很耐心，可以坐着练习，用广东话讲解，很适合长辈。', '2026-10-15'],
  ['tai-chi', 'Daniel W.', 4, 'Calming start to the day. Bring a jacket, it is cool in the morning.', '2026-10-15'],
  ['board-games', 'Margaret T.', 5, 'Large-print cards and a calm room. My father smiled the whole time.', '2026-10-09'],
  ['board-games', 'Alice F.', 5, 'Predictable and gentle. Exactly what we needed for my mother.', '2026-10-09'],
  ['sign-language-cafe', 'Emma B.', 5, 'I learned more in one evening than in two weeks of apps. The interpreters were wonderful.', '2026-10-08'],
  ['sign-language-cafe', 'Noor A.', 5, 'Captions on the screen and a friendly room. I felt included.', '2026-10-08'],
  ['family-recipes', 'Priya N.', 5, 'Cooked a dal with two new neighbours. The vegetarian station was thoughtful.', '2026-10-02'],
  ['family-recipes', 'Wei C.', 4, 'Delicious and busy. The quiet room was a relief for my father.', '2026-10-02'],
  ['chair-yoga', 'Alice F.', 5, 'The teacher adjusted everything for my hip. I felt safe.', '2026-10-13'],
  ['chair-yoga', '陈女士', 5, '动作很轻柔，老师会说广东话。', '2026-10-13'],
  ['tech-help', 'Margaret T.', 5, 'The volunteer helped me spot a scam text. I feel so much more confident.', '2026-10-12'],
  ['tech-help', 'Rana H.', 4, 'The Farsi-speaking volunteer made it easy. Could use more time slots.', '2026-10-12'],
  ['mandarin-story', 'Wen L.', 5, 'Songs and a craft in Mandarin for toddlers. Loved it.', '2026-10-10'],
  ['mandarin-story', 'Anna K.', 4, 'English explanations helped our family follow along.', '2026-10-10'],
  ['diwali-lights', 'Kavya S.', 5, 'The steady-light route worked well for my daughter. Beautiful lanterns.', '2025-11-01'],
  ['diwali-lights', 'Daniel W.', 4, 'Big and lively. Plan for a crowd.', '2025-11-01'],
  ['repair-cafe', 'Jordan P.', 5, 'They fixed my zipper in ten minutes and showed me how.', '2026-09-26'],
  ['repair-cafe', 'Chris M.', 4, 'Great community feeling. A bit loud when sanding.', '2026-09-26'],
  ['choir-open', 'Lina H.', 5, 'I hummed at the back on night one and sang by night three.', '2026-10-01'],
  ['choir-open', 'Sam K.', 4, 'Steady lighting, friendly people, lyrics on a screen.', '2026-10-01'],
  ['garden-cleanup', 'Alice F.', 5, 'Seated seed sorting was a lovely way to help.', '2026-10-03'],
  ['garden-cleanup', 'Jordan P.', 4, 'Muddy and satisfying. Bring boots.', '2026-10-03'],
  ['quiet-hour', 'Anna K.', 5, 'The first library visit my son has enjoyed. The calm room was perfect.', '2026-10-04'],
  ['quiet-hour', 'Sam K.', 5, 'Dim lights and quiet. I could finally browse in peace.', '2026-10-04'],
  ['job-club', 'Rana H.', 5, 'The counsellor helped me in Farsi and fixed my resume.', '2026-10-08'],
  ['job-club', 'Priya N.', 4, 'Useful and friendly. Arrive early for a seat.', '2026-10-08'],
  ['badminton-night', 'Wei C.', 5, 'Beginners had their own courts. Loved it.', '2026-10-07'],
  ['badminton-night', 'Alice F.', 4, 'Plenty of benches. Noisy but fun.', '2026-10-07'],
  ['seniors-walk', 'Margaret T.', 5, 'A warm, slow, friendly group. Coffee afterwards is the best part.', '2026-10-12'],
  ['seniors-walk', '陈女士', 5, '大家都很友好，说广东话，走得很慢。', '2026-10-12'],
  ['open-studio', 'Sofia L.', 4, 'The step-free map was accurate and honest. Three studios were lovely.', '2025-11-16'],
  ['open-studio', 'Jordan P.', 5, 'Met artists and tried printmaking. Great afternoon.', '2025-11-16'],
  ['persian-poetry', 'Rana H.', 5, 'شعرخوانی دلنشینی بود و همه مهربان بودند.', '2026-10-05'],
  ['tamil-music', 'Kavya S.', 5, 'Reserved seats at the front for my parents. Wonderful music.', '2025-11-08'],
];

export const REVIEWS: Review[] = rows.map(([eventId, author, rating, text, date], i) => ({
  id: `rv${i}`,
  eventId,
  author,
  rating,
  text,
  date,
  attended: true,
}));

export function reviewsFor(eventId: string): Review[] {
  return REVIEWS.filter((r) => r.eventId === eventId);
}

export function summarizeReviews(list: Review[]): { average: number; count: number; counts: number[] } {
  const counts = [0, 0, 0, 0, 0];
  for (const r of list) counts[r.rating - 1]++;
  const count = list.length;
  const average = count ? list.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { average, count, counts };
}
