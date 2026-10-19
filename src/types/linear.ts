// Linear Issue Contract (Reverse-engineered from Linear GraphQL schema)

export type PriorityLevel = 1 | 2 | 3 | 4; // 1: Urgent, 2: High, 3: Medium, 4: Low

export interface LinearTicket {
  id: string;
  title: string;
  priority: PriorityLevel;
  estimate: 1 | 2 | 3 | 5 | 8; // Fibonacci complexity
  area: 'Backend' | 'Frontend' | 'Infra' | 'Security';
  acceptanceCriteria: string[];
}
