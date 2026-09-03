import assert from 'node:assert/strict';
import test from 'node:test';
import { createTask, transitionTask } from '../src/task.js';

const fixedClock = () => new Date('2026-09-03T14:00:00.000Z');

test('creates a normalized todo task', () => {
  assert.deepEqual(createTask({ title: '  Ship release  ', priority: 'high' }, { id: 'task_1234', now: fixedClock }), {
    id: 'task_1234',
    title: 'Ship release',
    priority: 'high',
    status: 'todo',
    createdAt: '2026-09-03T14:00:00.000Z',
    updatedAt: '2026-09-03T14:00:00.000Z',
  });
});

test('rejects empty titles and invalid priorities', () => {
  assert.throws(() => createTask({ title: '  ' }), /title is required/i);
  assert.throws(() => createTask({ title: 'Ship', priority: 'urgent' }), /Priority must be one of/);
});

test('transitions tasks and records completion', () => {
  const task = createTask({ title: 'Ship release' }, { id: 'task_1234', now: fixedClock });
  const completed = transitionTask(task, 'done', { now: () => new Date('2026-09-03T15:00:00.000Z') });
  assert.equal(completed.status, 'done');
  assert.equal(completed.completedAt, '2026-09-03T15:00:00.000Z');
});

test('does not reopen completed tasks', () => {
  assert.throws(() => transitionTask({ status: 'done' }, 'doing', { now: fixedClock }), /cannot be reopened/i);
});
