import type { GenerateFn, GenerateResponse } from './agentLoop';

/**
 * Gemini generateContent with function calling.
 * Endpoint and body follow the public REST docs; the key is sent in a header and never reaches the browser.
 */
export function makeGemini(apiKey: string, model: string): GenerateFn {
  return async ({ system, contents, tools }) => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        tools: [{ functionDeclarations: tools }],
        toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
        generationConfig: { temperature: 0.4 },
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
    }
    return (await res.json()) as GenerateResponse;
  };
}
