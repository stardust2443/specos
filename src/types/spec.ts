// SpecOS Core Type Contracts (Reverse-engineered from Notion blocks and Linear issues)

export type PriorityLevel = 1 | 2 | 3 | 4; // 1: Urgent, 2: High, 3: Medium, 4: Low

export interface GherkinCriterion {
  id: string;
  scenario: string;
  given: string;
  when: string;
  then: string;
}

export interface SchemaField {
  name: string;
  type: string;
  description: string;
  isNullable?: boolean;
}

export interface SchemaDiff {
  entity: string;
  action: 'create' | 'modify' | 'deprecate';
  description: string;
  fields: SchemaField[];
}

export type EdgeCaseCategory = 'concurrency' | 'idempotency' | 'rate_limit' | 'ux_recovery';

export interface EdgeCase {
  id: string;
  category: EdgeCaseCategory;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  scenario: string;
  mitigation: string;
}

export interface LinearTicket {
  id: string;
  title: string;
  priority: PriorityLevel;
  estimate: 1 | 2 | 3 | 5 | 8;
  area: 'Backend' | 'Frontend' | 'Infra' | 'Security';
  acceptanceCriteria: string[];
}

export type MockupType = 'checkout' | 'switcher' | 'canvas' | 'generic';

export interface SpecDocument {
  id: string;
  createdAt: string;
  prompt: string;
  title: string;
  targetKpi: string;
  problemStatement: string;
  userJourney: {
    persona: string;
    entryPoint: string;
    targetOutcome: string;
  };
  acceptanceCriteria: GherkinCriterion[];
  dataSchemaDiff: SchemaDiff[];
  edgeCases: EdgeCase[];
  linearIssues: LinearTicket[];
  mockupState: {
    type: MockupType;
    title: string;
    subtitle: string;
    config: Record<string, any>;
  };
}

export interface DemoPreset {
  id: string;
  name: string;
  prompt: string;
  tag: string;
  spec: SpecDocument;
}
