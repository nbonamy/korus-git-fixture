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

test('fails clearly for a missing task', async () => {
  await assert.rejects(run(['done', 'missing'], { store: memoryStore(), output: () => {} }), /Task not found/);
});

test('includes rename in command help', async () => {
  const output = [];
  await run(['help'], { output: (line) => output.push(line) });
  assert.match(output[0], /rename <id> <title>/);
});

test('renames an existing task', async () => {
  const task = {
    id: 'task_ship',
    title: 'Ship',
    status: 'done',
    priority: 'high',
    createdAt: '2026-09-03T12:00:00.000Z',
    updatedAt: '2026-09-03T13:00:00.000Z',
    completedAt: '2026-09-03T13:00:00.000Z',
  };
  const store = memoryStore([task]);
  const output = [];
  await run(['rename', 'task_ship', 'Publish release'], {
    store,
    output: (line) => output.push(line),
    now: () => new Date('2026-09-03T14:00:00.000Z'),
  });

  assert.deepEqual(store.board.tasks[0], {
    ...task,
    title: 'Publish release',
    updatedAt: '2026-09-03T14:00:00.000Z',
  });
  assert.equal(store.writes, 1);
  assert.deepEqual(output, ['Renamed task_ship: Publish release']);
});

test('does not write when renaming to a blank title', async () => {
  const store = memoryStore([{ id: 'task_ship', title: 'Ship' }]);
  await assert.rejects(run(['rename', 'task_ship', '  '], { store, output: () => {} }), /title is required/i);
  assert.equal(store.writes, 0);
});

test('fails clearly when renaming a missing task', async () => {
  const store = memoryStore();
  await assert.rejects(run(['rename', 'missing', 'Publish'], { store, output: () => {} }), /Task not found: missing/);
  assert.equal(store.writes, 0);
});
