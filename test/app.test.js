import assert from 'node:assert/strict';
import test from 'node:test';
import { run } from '../src/app.js';

function memoryStore(tasks = []) {
  const board = { version: 1, tasks: [...tasks] };
  return {
    board,
    writes: 0,
    async read() { return board; },
    async write() { this.writes += 1; },
  };
}

test('adds a task and reports its id', async () => {
  const store = memoryStore();
  const output = [];
  await run(['add', 'Ship release', '--priority', 'high'], {
    store,
    output: (line) => output.push(line),
    id: 'task_ship',
    now: () => new Date('2026-09-03T14:00:00.000Z'),
  });

  assert.equal(store.board.tasks[0].title, 'Ship release');
  assert.equal(store.writes, 1);
  assert.deepEqual(output, ['Added task_ship: Ship release']);
});

test('starts an existing task', async () => {
  const store = memoryStore([{ id: 'task_ship', title: 'Ship', status: 'todo', priority: 'normal' }]);
  await run(['start', 'task_ship'], {
    store,
    output: () => {},
    now: () => new Date('2026-09-03T14:00:00.000Z'),
  });
  assert.equal(store.board.tasks[0].status, 'doing');
});

test('filters listed tasks by status and priority', async () => {
  const store = memoryStore([
    { id: 'task_match', title: 'Ship', status: 'doing', priority: 'high', createdAt: '2026-09-03' },
    { id: 'task_status', title: 'Plan', status: 'todo', priority: 'high', createdAt: '2026-09-03' },
    { id: 'task_priority', title: 'Polish', status: 'doing', priority: 'low', createdAt: '2026-09-03' },
  ]);
  const output = [];
  await run(['list', '--status', 'doing', '--priority', 'high'], {
    store,
    output: (line) => output.push(line),
  });
  assert.match(output[0], /task_match/);
  assert.doesNotMatch(output[0], /task_status|task_priority/);
});

test('fails clearly for a missing task', async () => {
  await assert.rejects(run(['done', 'missing'], { store: memoryStore(), output: () => {} }), /Task not found/);
});
