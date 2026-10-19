// Edge Case Contract for Synthetic Tech Lead Audit

export type EdgeCaseCategory = 'concurrency' | 'idempotency' | 'rate_limit' | 'ux_recovery';

export interface EdgeCase {
  id: string;
  category: EdgeCaseCategory;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  scenario: string;
  mitigation: string;
}
