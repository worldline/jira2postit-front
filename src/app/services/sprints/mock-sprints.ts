import { Sprint, SprintResponse } from './sprint';

const SPRINTS: Sprint[] = [
  { id: 11, name: 'Sprint 41', state: 'Current' },
  { id: 12, name: 'Sprint 42', state: 'Future' },
  { id: 13, name: 'Sprint 43', state: 'Future' },
  { id: 14, name: 'Sprint 44', state: 'Future' },
  { id: 15, name: 'Sprint 45', state: 'Future' },
  { id: 16, name: 'Sprint 46', state: 'Future' },
  { id: 17, name: 'Sprint 47', state: 'Future' }
];

export const SPRINTRESPONSE: SprintResponse = {
  maxResults: 50,
  startAt: 0,
  isLast: true,
  values: SPRINTS
}
