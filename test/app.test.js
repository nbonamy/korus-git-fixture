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

test('renames an existing task and reports the new title', async () => {
  const store = memoryStore([{
    id: 'task_ship',
    title: 'Ship',
    status: 'done',
    priority: 'high',
    createdAt: '2026-09-03T13:00:00.000Z',
    updatedAt: '2026-09-03T14:00:00.000Z',
    completedAt: '2026-09-03T14:00:00.000Z',
  }]);
  const output = [];

  await run(['rename', 'task_ship', '  Ship stable release  '], {
    store,
    output: (line) => output.push(line),
    now: () => new Date('2026-09-03T15:00:00.000Z'),
  });

  assert.deepEqual(store.board.tasks[0], {
    id: 'task_ship',
    title: 'Ship stable release',
    status: 'done',
    priority: 'high',
    createdAt: '2026-09-03T13:00:00.000Z',
    updatedAt: '2026-09-03T15:00:00.000Z',
    completedAt: '2026-09-03T14:00:00.000Z',
  });
  assert.equal(store.writes, 1);
  assert.deepEqual(output, ['Renamed task_ship: Ship stable release']);
});

test('rejects blank task renames without writing', async () => {
  const store = memoryStore([{ id: 'task_ship', title: 'Ship' }]);

  await assert.rejects(run(['rename', 'task_ship', '  '], { store, output: () => {} }), /title is required/i);
  assert.equal(store.writes, 0);
});

test('fails clearly when renaming a missing task', async () => {
  await assert.rejects(run(['rename', 'missing', 'Ship'], {
    store: memoryStore(), output: () => {},
  }), /Task not found/);
});
