import http from 'node:http';
import { runAgent } from './agentLoop';
import { makeGemini } from './gemini';

const PORT = Number(process.env.PORT ?? 8787);
const KEY = process.env.GEMINI_API_KEY ?? '';
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const generate = KEY ? makeGemini(KEY, MODEL) : null;

/** Fixed demo date so sample events stay upcoming. Matches web/src/lib/now.ts. */
const NOW = new Date('2026-10-24T12:00:00-04:00');

function send(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const c of req) {
    size += (c as Buffer).length;
    if (size > 64 * 1024) throw new Error('Request too large');
    chunks.push(c as Buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/health') {
      return send(res, 200, { live: !!generate, provider: generate ? 'gemini' : undefined, model: generate ? MODEL : undefined });
    }
    if (req.method === 'POST' && req.url === '/api/chat') {
      if (!generate) return send(res, 503, { error: 'No GEMINI_API_KEY configured. The app falls back to offline mode.' });
      const body = (await readJson(req)) as Record<string, unknown>;
      const text = typeof body.text === 'string' ? body.text.slice(0, 1000) : '';
      if (!text.trim()) return send(res, 400, { error: 'Empty message' });
      const result = await runAgent(
        {
          text,
          lang: (body.lang as never) ?? 'en',
          profile: body.profile as never,
          mode: body.mode === 'onboarding' ? 'onboarding' : 'assistant',
          history: Array.isArray(body.history) ? (body.history as never) : [],
          now: NOW,
        },
        generate,
      );
      return send(res, 200, result);
    }
    send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    send(res, 502, { error: err instanceof Error ? err.message : 'Agent failed' });
  }
});

server.listen(PORT, () => {
  console.log(`Agent server on http://localhost:${PORT} (${generate ? `Gemini ${MODEL}` : 'offline: set GEMINI_API_KEY to enable'})`);
});
