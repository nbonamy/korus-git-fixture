import assert from 'node:assert/strict';
import test from 'node:test';
import { formatTaskTable } from '../src/format.js';

test('renders an empty board', () => {
  assert.equal(formatTaskTable([]), 'No tasks yet.');
});

test('orders active and high-priority tasks first', () => {
  const output = formatTaskTable([
    { id: 'task_done', title: 'Published', status: 'done', priority: 'high', createdAt: '2026-09-01' },
    { id: 'task_low', title: 'Polish docs', status: 'todo', priority: 'low', createdAt: '2026-09-02' },
    { id: 'task_now', title: 'Fix release', status: 'doing', priority: 'high', createdAt: '2026-09-03' },
  ]);
  assert.match(output, /^ID\s+STATUS\s+PRIORITY\s+TITLE/m);
  assert.ok(output.indexOf('task_now') < output.indexOf('task_low'));
  assert.ok(output.indexOf('task_low') < output.indexOf('task_done'));
});
