import assert from 'node:assert/strict';
import test from 'node:test';
import { createTask, renameTask, transitionTask } from '../src/task.js';

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

test('renames a task while preserving its other fields', () => {
  const task = {
    id: 'task_1234',
    title: 'Old title',
    priority: 'high',
    status: 'done',
    createdAt: '2026-09-03T13:00:00.000Z',
    updatedAt: '2026-09-03T13:30:00.000Z',
    completedAt: '2026-09-03T13:30:00.000Z',
  };

  assert.deepEqual(renameTask(task, '  New title  ', { now: fixedClock }), {
    ...task,
    title: 'New title',
    updatedAt: '2026-09-03T14:00:00.000Z',
  });
});

test('rejects a blank renamed title', () => {
  assert.throws(() => renameTask({ title: 'Old title' }, '  '), /title is required/i);
});
