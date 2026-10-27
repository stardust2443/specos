import { SpecDocument } from '../types/spec';

const API_KEY_STORAGE_KEY = 'specos_gemini_api_key';
const GEMINI_MODEL = 'gemini-1.5-flash';

export const getStoredApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored && stored.trim()) return stored.trim();
  }
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
};

export const setStoredApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  }
};

export const removeStoredApiKey = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
};

export const hasApiKey = (): boolean => {
  return Boolean(getStoredApiKey());
};

const SYSTEM_INSTRUCTION = `You are SpecOS, an elite multi-agent Product Planning Engine and Synthetic Staff Architect.
Given a 1-sentence feature prompt, synthesize a comprehensive, production-grade technical specification combining three adversarial perspectives:

1. THE PRINCIPAL PRODUCT MANAGER:
   - Specific Title and measurable North Star KPI (e.g., '+18.4% Conversion; <80ms latency').
   - Sharp, analytical Problem Statement highlighting user pain and business risk.
   - User Journey Matrix (Target Persona, Entry Point, Target Outcome).
   - 2 to 3 Gherkin Acceptance Criteria (Given, When, Then) covering primary and edge-case execution.

2. THE SYNTHETIC TECH LEAD / ADVERSARIAL ARCHITECT:
   - Database schema diff: Specific tables created or modified with real SQL types (e.g., 'UUID PRIMARY KEY', 'VARCHAR(64) UNIQUE NOT NULL', 'TIMESTAMP WITH TIME ZONE') and field descriptions.
   - 2 to 3 Adversarial Edge Cases covering real distributed system risks:
     * Concurrency & race conditions (e.g., simultaneous mutations, distributed lock lease expiry)
     * Idempotency & retries (e.g., out-of-order webhooks, double charges)
     * Rate limits & abuse (e.g., token bucket exhaustion, velocity attacks)
     * UX recovery (e.g., offline queueing, optimistic rollback)
     Each must include a concrete, production-grade architectural mitigation.

3. THE ENGINEERING MANAGER / SPRINT LEAD:
   - 2 to 4 Atomic Linear Sprint Tickets.
   - Priorities (1: Urgent, 2: High, 3: Medium, 4: Low).
   - Fibonacci complexity estimates (1, 2, 3, 5, or 8 story points).
   - Functional areas ('Frontend', 'Backend', 'Security', 'Infra').
   - 2 to 3 bulleted acceptance criteria per ticket.

Output STRICT JSON matching the requested SpecDocument structure. No markdown fences, no conversational filler.`;

export async function generateSpecWithGemini(
  prompt: string,
  apiKey: string,
  onProgress?: (step: string) => void
): Promise<SpecDocument> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new Error('Missing Gemini API Key. Please provide an API key in settings.');
  }

  onProgress?.('Initializing SpecOS multi-agent synthesis...');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${cleanKey}`;

  const requestPayload = {
    contents: [
      {
        parts: [
          {
            text: `Synthesize a complete SpecDocument for this feature request: "${prompt}".\n\nEnsure data types, mitigations, and ticket estimates are concrete and technically rigorous.`
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  };

  onProgress?.('Agent 1 (Staff PM) & Agent 2 (Tech Lead) auditing failure modes...');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestPayload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `Gemini API returned status ${response.status}`;
    if (response.status === 400 && message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API Key. Please verify your key at Google AI Studio.');
    }
    if (response.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please wait a few seconds and try again.');
    }
    throw new Error(message);
  }

  onProgress?.('Agent 3 (Sprint Lead) decomposing Linear backlog tickets...');

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Received empty response from Gemini API.');
  }

  try {
    const parsed = JSON.parse(rawText);
    
    // Normalize and ensure all required fields match SpecDocument contract
    const spec: SpecDocument = {
      id: parsed.id || `spec-${Date.now().toString().slice(-6)}`,
      createdAt: parsed.createdAt || new Date().toISOString(),
      prompt: prompt,
      title: parsed.title || prompt,
      targetKpi: parsed.targetKpi || '+20% Conversion; <100ms Latency',
      problemStatement: parsed.problemStatement || `Feature execution for "${prompt}".`,
      userJourney: {
        persona: parsed.userJourney?.persona || 'Core User / Engineer',
        entryPoint: parsed.userJourney?.entryPoint || 'Primary application surface',
        targetOutcome: parsed.userJourney?.targetOutcome || 'Instant deterministic completion'
      },
      acceptanceCriteria: (parsed.acceptanceCriteria || []).map((ac: any, idx: number) => ({
        id: ac.id || `ac-${idx + 1}`,
        scenario: ac.scenario || `Scenario ${idx + 1}`,
        given: ac.given || 'Given verified session state',
        when: ac.when || `When action "${prompt}" is triggered`,
        then: ac.then || 'Then state mutation completes with zero UI freeze'
      })),
      dataSchemaDiff: (parsed.dataSchemaDiff || []).map((sd: any) => ({
        entity: sd.entity || 'feature_events',
        action: sd.action === 'create' || sd.action === 'modify' || sd.action === 'deprecate' ? sd.action : 'create',
        description: sd.description || 'Audit ledger and state mutation persistence',
        fields: (sd.fields || []).map((f: any) => ({
          name: f.name || 'id',
          type: f.type || 'VARCHAR(64)',
          description: f.description || 'Field identifier',
          isNullable: Boolean(f.isNullable)
        }))
      })),
      edgeCases: (parsed.edgeCases || []).map((ec: any, idx: number) => ({
        id: ec.id || `ec-${idx + 1}`,
        category: ec.category || (idx % 2 === 0 ? 'concurrency' : 'idempotency'),
        severity: ec.severity === 'High' || ec.severity === 'Medium' || ec.severity === 'Low' ? ec.severity : 'High',
        title: ec.title || 'Potential Production Vulnerability',
        scenario: ec.scenario || 'Unhandled failure under rapid sequential triggers.',
        mitigation: ec.mitigation || 'Implement optimistic client lock and idempotency token verification.'
      })),
      linearIssues: (parsed.linearIssues || []).map((li: any, idx: number) => ({
        id: li.id || `lin-${idx + 1}`,
        title: li.title || `Implement ${prompt.slice(0, 30)}`,
        priority: typeof li.priority === 'number' && li.priority >= 1 && li.priority <= 4 ? li.priority : 2,
        estimate: [1, 2, 3, 5, 8].includes(li.estimate) ? li.estimate : 3,
        area: ['Frontend', 'Backend', 'Security', 'Infra'].includes(li.area) ? li.area : 'Backend',
        acceptanceCriteria: Array.isArray(li.acceptanceCriteria) ? li.acceptanceCriteria : ['Implement core handler', 'Add automated tests']
      })),
      mockupState: {
        type: 'generic',
        title: `${prompt.slice(0, 35)} Sandbox`,
        subtitle: 'Live Interactive Prototype Container',
        config: parsed.mockupState?.config || {}
      }
    };

    onProgress?.('Synthesis complete!');
    return spec;
  } catch (err: any) {
    console.error('Failed to parse Gemini output as SpecDocument:', rawText, err);
    throw new Error('AI generated malformed specification JSON. Please try again with a slightly more detailed prompt.');
  }
}
