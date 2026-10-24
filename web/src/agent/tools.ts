import { EVENTS, getEvent } from '../data/events';
import { reviewsFor, summarizeReviews } from '../data/reviews';
import { explain, upcoming, type Reason } from '../lib/agent';
import { scoreEvent, travelMinutes, trendScores, type Scored } from '../lib/scoring';
import type { AccessAttr, Category, EventItem, Lang, Profile } from '../types';

/**
 * The agent's tools. They return plain JSON so the same functions serve the offline engine and a connected LLM.
 * The model can only recommend events these tools return, so it cannot invent one.
 */

export interface ToolContext {
  profile: Profile;
  now: Date;
}

export interface EventBrief {
  id: string;
  title: string;
  start: string;
  venue: string;
  category: Category;
  free: boolean;
  price?: number;
  source: string;
  platformRating?: number;
  platformReviews?: number;
  communityRating?: number;
  communityReviews?: number;
  languages: Lang[];
  travelMinutes: number | null;
  score?: number;
  /** Status of each access need the person asked about. */
  accessChecks?: Record<string, 'confirmed' | 'estimated' | 'unknown'>;
  reasons?: Reason[];
}

export interface SearchArgs {
  text?: string;
  categories?: Category[];
  free?: boolean;
  weekend?: boolean;
  evening?: boolean;
  morning?: boolean;
  languages?: Lang[];
  accessNeeds?: AccessAttr[];
  transitOnly?: boolean;
  maxMinutes?: number;
  volunteer?: boolean;
  limit?: number;
}

function brief(e: EventItem, ctx: ToolContext, s?: Scored, needs: AccessAttr[] = []): EventBrief {
  const mins = travelMinutes(e, ctx.profile.homeArea, ctx.profile.travelMode);
  const community = summarizeReviews(reviewsFor(e.id));
  const accessChecks: EventBrief['accessChecks'] = {};
  for (const a of needs) {
    const info = e.access[a];
    accessChecks[a] = !info || info.evidence === 'unknown' ? 'unknown' : info.evidence;
  }
  return {
    id: e.id,
    title: e.title,
    start: e.start,
    venue: e.venue,
    category: e.category,
    free: e.free,
    price: e.price,
    source: e.source.name,
    platformRating: e.source.rating,
    platformReviews: e.source.reviewCount,
    communityRating: community.count ? Math.round(community.average * 10) / 10 : undefined,
    communityReviews: community.count || undefined,
    languages: e.languages,
    travelMinutes: Number.isFinite(mins) ? mins : null,
    score: s?.score,
    accessChecks: needs.length ? accessChecks : undefined,
  };
}

export function searchEvents(args: SearchArgs, ctx: ToolContext): { total: number; events: EventBrief[]; filters: SearchArgs } {
  const needs = args.accessNeeds ?? [];
  const profile: Profile = {
    ...ctx.profile,
    interests: args.categories?.length ? args.categories : ctx.profile.interests,
    freeOnly: args.free ?? ctx.profile.freeOnly,
    travelMode: args.transitOnly ? 'transit' : ctx.profile.travelMode,
    access: { ...ctx.profile.access, ...Object.fromEntries(needs.map((a) => [a, 'essential' as const])) },
  };
  const pool = upcoming(EVENTS, ctx.now);
  const trend = trendScores(pool, ctx.now);
  const words = (args.text ?? '').toLowerCase().split(/[^a-z0-9-]+/).filter((w) => w.length > 2);

  const matches = pool.filter((e) => {
    const d = new Date(e.start);
    if (args.free && !e.free) return false;
    if (args.categories?.length && !args.categories.includes(e.category)) return false;
    if (args.weekend && ![0, 6].includes(d.getDay())) return false;
    if (args.evening && d.getHours() < 17) return false;
    if (args.morning && d.getHours() >= 12) return false;
    if (args.languages?.length && !args.languages.some((l) => e.languages.includes(l))) return false;
    if (args.volunteer && !e.volunteer) return false;
    if (args.transitOnly && !(e.transit.serviceAtStart && e.transit.walkMeters <= 650)) return false;
    if (args.maxMinutes) {
      const m = travelMinutes(e, profile.homeArea, profile.travelMode);
      if (!Number.isFinite(m) || m > args.maxMinutes) return false;
    }
    for (const a of needs) {
      const info = e.access[a];
      if (info && info.evidence === 'confirmed' && !info.present) return false;
    }
    if (words.length) {
      const hay = `${e.title} ${e.summary} ${e.venue} ${e.audience}`.toLowerCase();
      if (!words.some((w) => hay.includes(w))) return false;
    }
    return true;
  });

  const scored = matches.map((e) => scoreEvent(e, profile, trend[e.id] ?? 0)).sort((a, b) => b.score - a.score);
  const limit = Math.min(10, Math.max(1, args.limit ?? 5));
  return {
    total: scored.length,
    events: scored.slice(0, limit).map((s) => brief(s.event, ctx, s, needs)),
    filters: args,
  };
}

export function rankForUser(args: { limit?: number }, ctx: ToolContext): { events: EventBrief[] } {
  const pool = upcoming(EVENTS, ctx.now).filter((e) => !ctx.profile.freeOnly || e.free);
  const trend = trendScores(pool, ctx.now);
  const scored = pool
    .map((e) => scoreEvent(e, ctx.profile, trend[e.id] ?? 0))
    .filter((s) => s.access.missingEssential.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(10, args.limit ?? 5));
  return {
    events: scored.map((s) => ({ ...brief(s.event, ctx, s, Object.keys(ctx.profile.access) as AccessAttr[]), reasons: explain(s, ctx.profile) })),
  };
}

export function getTrending(args: { limit?: number }, ctx: ToolContext): { events: EventBrief[] } {
  const pool = upcoming(EVENTS, ctx.now);
  const t = trendScores(pool, ctx.now);
  return { events: [...pool].sort((a, b) => t[b.id] - t[a.id]).slice(0, args.limit ?? 3).map((e) => brief(e, ctx)) };
}

export function getEventDetails(args: { id: string }, ctx: ToolContext) {
  const e = getEvent(args.id);
  if (!e) return { error: 'No event with that id.' };
  const community = summarizeReviews(reviewsFor(e.id));
  return {
    ...brief(e, ctx),
    summary: e.summary,
    address: e.address,
    audience: e.audience,
    volunteer: e.volunteer,
    access: Object.fromEntries(Object.entries(e.access).map(([k, v]) => [k, v ? { present: v.present, evidence: v.evidence, note: v.note } : null])),
    communityReviews: community.count,
  };
}

export function transitOptions(args: { id: string }, ctx: ToolContext) {
  const e = getEvent(args.id);
  if (!e) return { error: 'No event with that id.' };
  return {
    id: e.id,
    nearestStop: e.transit.stop,
    walkMeters: e.transit.walkMeters,
    routes: e.transit.routes,
    serviceAtStartTime: e.transit.serviceAtStart,
    estimatedMinutesFromHome: travelMinutes(e, ctx.profile.homeArea, 'transit'),
    parking: e.parking,
  };
}

export const TOOL_NAMES = ['search_events', 'rank_for_user', 'get_trending', 'get_event_details', 'transit_options'] as const;
export type ToolName = (typeof TOOL_NAMES)[number];

export function runTool(name: string, args: Record<string, unknown>, ctx: ToolContext): unknown {
  switch (name) {
    case 'search_events':
      return searchEvents(args as SearchArgs, ctx);
    case 'rank_for_user':
      return rankForUser(args as { limit?: number }, ctx);
    case 'get_trending':
      return getTrending(args as { limit?: number }, ctx);
    case 'get_event_details':
      return getEventDetails(args as { id: string }, ctx);
    case 'transit_options':
      return transitOptions(args as { id: string }, ctx);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

const CATEGORIES = ['community', 'arts', 'outdoors', 'learning', 'family', 'volunteering', 'sports', 'food', 'music'];
const ACCESS = ['stepFree', 'accessibleWashroom', 'accessibleParking', 'seating', 'largePrint', 'audioDescription', 'interpreter', 'captions', 'lowNoise', 'noFlashing', 'quietSpace', 'lowCrowd', 'plainLanguage', 'supportPerson'];

/** Function declarations in the shape Gemini expects. */
export const TOOL_DECLARATIONS = [
  {
    name: 'search_events',
    description: 'Find upcoming Markham events that match filters. Returns ranked events with travel time and the evidence status of each requested access need. Use this for any request to find events.',
    parameters: {
      type: 'OBJECT',
      properties: {
        text: { type: 'STRING', description: 'Optional keywords to match in the title or description, in English.' },
        categories: { type: 'ARRAY', items: { type: 'STRING', enum: CATEGORIES } },
        free: { type: 'BOOLEAN' },
        weekend: { type: 'BOOLEAN' },
        evening: { type: 'BOOLEAN' },
        morning: { type: 'BOOLEAN' },
        languages: { type: 'ARRAY', items: { type: 'STRING', enum: ['en', 'yue', 'zh', 'ta', 'fa'] }, description: 'Languages the event is offered in.' },
        accessNeeds: { type: 'ARRAY', items: { type: 'STRING', enum: ACCESS }, description: 'Access features the person needs. Only include what the person said.' },
        transitOnly: { type: 'BOOLEAN', description: 'Only events reachable by bus or train at the start time.' },
        maxMinutes: { type: 'NUMBER' },
        volunteer: { type: 'BOOLEAN' },
        limit: { type: 'NUMBER' },
      },
    },
  },
  {
    name: 'rank_for_user',
    description: "Rank upcoming events by the person's saved profile (interests, travel mode, access needs, times). Returns the top events with structured reasons.",
    parameters: { type: 'OBJECT', properties: { limit: { type: 'NUMBER' } } },
  },
  {
    name: 'get_trending',
    description: 'Return the events that are currently most popular with neighbours.',
    parameters: { type: 'OBJECT', properties: { limit: { type: 'NUMBER' } } },
  },
  {
    name: 'get_event_details',
    description: 'Get the full details of one event, including each access feature with its evidence status.',
    parameters: { type: 'OBJECT', properties: { id: { type: 'STRING' } }, required: ['id'] },
  },
  {
    name: 'transit_options',
    description: 'Get bus and train options for one event: nearest stop, routes, walking distance and whether service runs at the start time.',
    parameters: { type: 'OBJECT', properties: { id: { type: 'STRING' } }, required: ['id'] },
  },
];
