import { LinearTicket } from './linear';
import { EdgeCase } from './edgecases';

export * from './linear';
export * from './edgecases';

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
