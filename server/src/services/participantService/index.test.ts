
import { expect, test, vi } from 'vitest';
import { getParticipants } from '.';

vi.mock('../../../client.ts');

test('getParticipants should return a list of participants', async () => {
  const {participantCount, participants} = await getParticipants();
  expect(participants).toBeInstanceOf(Array)
  expect(participantCount).toBeGreaterThan(0);
  expect(participantCount).toBe(15);
});