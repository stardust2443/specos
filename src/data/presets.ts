import { DemoPreset } from '../types/spec';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'stripe-apple-pay',
    name: 'Stripe 1-Click Guest Checkout',
    tag: 'Fintech / Conversion',
    prompt: 'Add one-click Apple Pay & Google Pay checkout for guest users on mobile web with zero mandatory account creation.',
    spec: {
      id: 'spec-stripe-apple-pay',
      createdAt: '2026-10-19T12:00:00Z',
      prompt: 'Add one-click Apple Pay & Google Pay checkout for guest users on mobile web with zero mandatory account creation.',
      title: '1-Click Express Guest Checkout (Apple Pay / Google Pay)',
      targetKpi: '+18.4% Mobile Checkout Conversion Rate; Reduction of Drop-offs at Step 2 by 42%',
      problemStatement: 'Currently, mobile web checkout requires 5 form steps (Shipping Address, Billing Address, Card Details, Email, Confirmation). 68% of mobile traffic drops off at Step 2 (Address Entry) due to small mobile keyboards and autofill mismatches.',
      userJourney: {
        persona: 'First-time mobile shopper browsing via Instagram or TikTok ad referral',
        entryPoint: 'Product Detail Page (PDP) or Mini-Cart Bottom Sheet',
        targetOutcome: 'Completed purchase in <3 seconds without creating a password or typing an address'
      },
      acceptanceCriteria: [
        {
          id: 'ac-1',
          scenario: 'Browser supports Apple Pay / Google Pay and has an active wallet card',
          given: 'User arrives on PDP on iOS Safari or Chrome Android with a configured Payment Request wallet',
          when: 'User taps the prominent black "Pay with Apple Pay" button',
          then: 'Native payment sheet displays shipping address selection, total with tax, and biometric auth (FaceID/Fingerprint)'
        },
        {
          id: 'ac-2',
          scenario: 'Biometric authorization succeeds',
          given: 'Native wallet sheet returns a valid PaymentMethod token from Apple/Google',
          when: 'Stripe PaymentIntent is confirmed with return_url',
          then: 'Order is created in pending state, inventory reserved, and user transitions to the Order Confirmed receipt screen within 900ms'
        },
        {
          id: 'ac-3',
          scenario: 'Wallet sheet cancelled by user',
          given: 'User presses "Cancel" on the native wallet modal',
          when: 'The sheet dismisses',
          then: 'Cart state remains intact, no authorization hold placed on card, and friendly fallback "Continue with standard checkout" is highlighted'
        }
      ],
      dataSchemaDiff: [
        {
          entity: 'orders',
          action: 'modify',
          description: 'Support guest checkout attribution and digital wallet metadata',
          fields: [
            { name: 'is_guest', type: 'BOOLEAN NOT NULL DEFAULT FALSE', description: 'Flag indicating checkout without an account' },
            { name: 'wallet_provider', type: 'VARCHAR(32)', description: 'Values: apple_pay, google_pay, link, or null', isNullable: true },
            { name: 'idempotency_key', type: 'VARCHAR(64) UNIQUE NOT NULL', description: 'Prevents double-charging on duplicate mobile sheet submissions' }
          ]
        },
        {
          entity: 'guest_sessions',
          action: 'create',
          description: 'Ephemeral 24-hour token mapping guest session to created order before optional post-purchase signup',
          fields: [
            { name: 'token', type: 'VARCHAR(64) PRIMARY KEY', description: 'Secure random session token' },
            { name: 'order_id', type: 'UUID REFERENCES orders(id)', description: 'Target order' },
            { name: 'expires_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'TTL 24 hours' }
          ]
        }
      ],
      edgeCases: [
        {
          id: 'ec-1',
          category: 'concurrency',
          severity: 'High',
          title: 'Duplicate PaymentIntent Submission via Rapid Double-Tap',
          scenario: 'User taps the biometric trigger twice or experiences high-latency 4G jitter during token transmission.',
          mitigation: 'Enforce client-side button disablement on first touch + server-side Stripe Idempotency-Key generated from cart_session_hash.'
        },
        {
          id: 'ec-2',
          category: 'idempotency',
          severity: 'High',
          title: 'Webhook vs. Client Redirect Race Condition',
          scenario: 'Stripe webhook payment_intent.succeeded arrives at backend before the mobile browser finishes loading the /success receipt route.',
          mitigation: 'Implement state machine with optimistic pending status: /success endpoint polls local cache or subscribes to SSE channel; webhook writes idempotent status.'
        },
        {
          id: 'ec-3',
          category: 'ux_recovery',
          severity: 'Medium',
          title: 'Unsupported Shipping Region in Apple Wallet Card',
          scenario: 'User selects a shipping address in Apple Pay that the merchant does not deliver to (e.g., International PO Box).',
          mitigation: 'Listen to onshippingcontactselected event in Payment Request API and return invalid_shipping_address error directly into the native sheet before payment auth.'
        },
        {
          id: 'ec-4',
          category: 'rate_limit',
          severity: 'Low',
          title: 'Guest Card Testing Attacks on Public Endpoint',
          scenario: 'Bots abusing 1-click guest endpoints to test stolen card tokens.',
          mitigation: 'Cloudflare Turnstile invisible captcha on PDP load + Cloudflare rate-limit of 5 checkout attempts per IP per minute.'
        }
      ],
      linearIssues: [
        {
          id: 'lin-1',
          title: '[Payment] Integrate Stripe Payment Request Button on PDP & Mini-Cart',
          priority: 2,
          estimate: 3,
          area: 'Frontend',
          acceptanceCriteria: [
            'Mount Stripe Elements PaymentRequestButton',
            'Verify device capability via canMakePayment() check',
            'Hide button gracefully if device lacks Apple/Google Pay wallet'
          ]
        },
        {
          id: 'lin-2',
          title: '[Backend] Implement Idempotent Guest Order Creation Endpoint',
          priority: 1,
          estimate: 5,
          area: 'Backend',
          acceptanceCriteria: [
            'Create /api/v1/checkout/express-guest handler',
            'Enforce cart_hash idempotency key on PaymentIntent',
            'Persist guest_sessions record with 24-hour TTL'
          ]
        },
        {
          id: 'lin-3',
          title: '[Backend] Handle Stripe Webhook payment_intent.succeeded & Failed Events',
          priority: 1,
          estimate: 3,
          area: 'Backend',
          acceptanceCriteria: [
            'Verify Stripe signature on webhook payload',
            'Handle out-of-order execution gracefully',
            'Trigger order confirmation email with guest claim link'
          ]
        },
        {
          id: 'lin-4',
          title: '[Security] Deploy Cloudflare Turnstile & IP Velocity Throttling',
          priority: 2,
          estimate: 2,
          area: 'Security',
          acceptanceCriteria: [
            'Require valid Turnstile token for guest payment tokenization',
            'Alert on >10 failed authorizations per hour threshold'
          ]
        }
      ],
      mockupState: {
        type: 'checkout',
        title: 'Guest Express Checkout Modal',
        subtitle: 'Simulating Mobile Safari Apple Pay Sheet',
        config: {
          productName: 'Mechanical Keychron Q1 Pro',
          price: 199.00,
          currency: 'USD'
        }
      }
    }
  },
  {
    id: 'linear-multi-workspace',
    name: 'Linear Multi-Workspace Switcher',
    tag: 'Productivity / Ergonomics',
    prompt: 'Implement zero-friction instant workspace switching with isolated local SQLite caches and unified notification badge counters.',
    spec: {
      id: 'spec-linear-workspace',
      createdAt: '2026-10-19T14:30:00Z',
      prompt: 'Implement zero-friction instant workspace switching with isolated local SQLite caches and unified notification badge counters.',
      title: 'Instant Multi-Workspace Switcher & Aggregated Inbox',
      targetKpi: 'Reduce workspace switch latency from 1.8s to <50ms; 0 sync merge conflicts across tenant borders',
      problemStatement: 'Freelancers, consultants, and multi-team leaders must log out or keep 4 separate browser windows open to monitor multiple Linear organizations. Switching accounts currently causes a full page reload and cache flush.',
      userJourney: {
        persona: 'Agency Tech Lead / Fractional PM managing 3 distinct client Linear workspaces',
        entryPoint: 'Global Workspace Picker (top-left) or Cmd+O quick switcher',
        targetOutcome: 'Instant workspace toggle with preserved scroll position and aggregated notification badges'
      },
      acceptanceCriteria: [
        {
          id: 'ac-1',
          scenario: 'Quick switch via keyboard shortcut',
          given: 'User is viewing Workspace A and presses Cmd+1 or Cmd+2',
          when: 'Keystroke is detected',
          then: 'UI instantly transitions to Workspace B in <50ms without clearing memory or triggering full layout recalculation'
        },
        {
          id: 'ac-2',
          scenario: 'Background notification polling',
          given: 'User is active in Workspace A',
          when: 'A high-priority issue is assigned to the user in Workspace B',
          then: 'Unified workspace pill in sidebar shows subtle red badge "+1" without interrupting active focus'
        }
      ],
      dataSchemaDiff: [
        {
          entity: 'local_workspaces_registry',
          action: 'create',
          description: 'Client-side indexed metadata of authenticated tenants and their local DB shard pointers',
          fields: [
            { name: 'workspace_id', type: 'VARCHAR(64) PRIMARY KEY', description: 'Unique tenant slug' },
            { name: 'db_shard_name', type: 'VARCHAR(128)', description: 'IndexedDB or OPFS shard file pointer' },
            { name: 'unread_inbox_count', type: 'INTEGER DEFAULT 0', description: 'Cached badge count' },
            { name: 'last_active_at', type: 'TIMESTAMP', description: 'Timestamp for MRU ordering' }
          ]
        }
      ],
      edgeCases: [
        {
          id: 'ec-1',
          category: 'concurrency',
          severity: 'High',
          title: 'Cross-Tenant Token Leakage in Background Sync',
          scenario: 'WebSocket message intended for Client A gets routed to Client B storage during simultaneous background sync.',
          mitigation: 'Strict cryptographic namespace isolation: each workspace runs inside an isolated Web Worker instance with dedicated encryption key.'
        },
        {
          id: 'ec-2',
          category: 'ux_recovery',
          severity: 'Medium',
          title: 'Session Revocation on Inactive Workspace',
          scenario: 'User changes password on Workspace B from mobile; desktop app attempts background poll.',
          mitigation: 'Detect 401 Unauthorized in background worker, mark workspace badge as "Session Expired", and prompt re-auth without affecting active workspace.'
        }
      ],
      linearIssues: [
        {
          id: 'lin-10',
          title: '[Core] Multi-Tenant Sharded IndexedDB Storage Engine',
          priority: 1,
          estimate: 5,
          area: 'Frontend',
          acceptanceCriteria: [
            'Implement isolated IndexedDB database per workspace_id',
            'Benchmark switch latency <50ms across 5 workspaces'
          ]
        },
        {
          id: 'lin-11',
          title: '[UI] Global Cmd+O Workspace Switcher & Keyboard Nav',
          priority: 2,
          estimate: 3,
          area: 'Frontend',
          acceptanceCriteria: [
            'Cmd+1 to Cmd+9 direct jump shortcuts',
            'Visual workspace icon stack with unified unread indicators'
          ]
        }
      ],
      mockupState: {
        type: 'switcher',
        title: 'Multi-Workspace Quick Selector',
        subtitle: 'Keyboard-first navigation with unread badges',
        config: {
          currentWorkspace: 'Acme Corp',
          workspaces: [
            { id: '1', name: 'Acme Corp (Primary)', unread: 0, active: true },
            { id: '2', name: 'HyperScale AI (Client)', unread: 3, active: false },
            { id: '3', name: 'Personal Lab', unread: 1, active: false }
          ]
        }
      }
    }
  },
  {
    id: 'slack-canvas-block',
    name: 'Slack Canvas Collaborative Block',
    tag: 'Collaboration / Real-Time',
    prompt: 'Design an embeddable living doc block inside channel threads that syncs checklist items and comments directly to engineering issues.',
    spec: {
      id: 'spec-slack-canvas',
      createdAt: '2026-10-19T16:00:00Z',
      prompt: 'Design an embeddable living doc block inside channel threads that syncs checklist items and comments directly to engineering issues.',
      title: 'In-Thread Collaborative Canvas & Issue Bridge',
      targetKpi: '+32% Sprint Alignment; 0 lost action items from post-incident war rooms',
      problemStatement: 'Incident retrospectives and feature brainstorms occur inside ephemeral chat threads. Critical action items get buried in message history and never make it into Jira/Linear.',
      userJourney: {
        persona: 'On-Call Engineer or Incident Commander',
        entryPoint: 'Incident Slack channel or war room thread',
        targetOutcome: 'Pinned in-thread document where checklist items automatically sync to Linear tickets with live status updates'
      },
      acceptanceCriteria: [
        {
          id: 'ac-1',
          scenario: 'Item checked in thread canvas',
          given: 'An action item in the canvas is linked to Linear issue ENG-402',
          when: 'User checks the checkbox in the canvas UI',
          then: 'Linear issue status updates to "Done" via webhook within 1.2s and writes audit log to thread'
        }
      ],
      dataSchemaDiff: [
        {
          entity: 'thread_canvases',
          action: 'create',
          description: 'Document block metadata attached to a specific channel thread',
          fields: [
            { name: 'thread_id', type: 'VARCHAR(64) PRIMARY KEY', description: 'Slack thread identifier' },
            { name: 'document_crdt_blob', type: 'BYTEA NOT NULL', description: 'Yjs binary update buffer' },
            { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'Last edit timestamp' }
          ]
        }
      ],
      edgeCases: [
        {
          id: 'ec-1',
          category: 'concurrency',
          severity: 'High',
          title: 'Simultaneous Multi-User Checklist Edits during Active Outage',
          scenario: '8 engineers simultaneously editing the post-mortem checklist while on-call.',
          mitigation: 'Implement Yjs / Automerge CRDT with state-based conflict resolution, preventing text overwrites.'
        }
      ],
      linearIssues: [
        {
          id: 'lin-20',
          title: '[Collab] Implement Yjs CRDT WebSocket Server for In-Thread Canvas',
          priority: 1,
          estimate: 5,
          area: 'Backend',
          acceptanceCriteria: ['Support up to 50 concurrent typists with <30ms character sync latency']
        }
      ],
      mockupState: {
        type: 'canvas',
        title: 'In-Thread Canvas Mockup',
        subtitle: 'Live checklist syncing with Linear status',
        config: {
          threadTitle: '#incident-sev1-auth-failure',
          items: [
            { id: '1', text: 'Rollback auth-service to v2.4.1', done: true, ticket: 'ENG-401' },
            { id: '2', text: 'Invalidate leaked JWT signing tokens in Redis', done: true, ticket: 'ENG-402' },
            { id: '3', text: 'Draft customer post-mortem disclosure', done: false, ticket: 'ENG-403' }
          ]
        }
      }
    }
  }
];
