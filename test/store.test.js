import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { FileTaskStore } from '../src/store.js';

test('treats a missing board as empty and persists valid JSON', async (context) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'relayboard-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, 'nested', 'tasks.json');
  const store = new FileTaskStore(filePath);

  assert.deepEqual(await store.read(), { version: 1, tasks: [] });
  await store.write({ version: 1, tasks: [{ id: 'task_1' }] });
  assert.deepEqual(JSON.parse(await readFile(filePath, 'utf8')), {
    version: 1,
    tasks: [{ id: 'task_1' }],
  });
});

test('rejects unsupported board versions', async (context) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'relayboard-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const store = new FileTaskStore(path.join(directory, 'tasks.json'));
  await store.write({ version: 2, tasks: [] });
  await assert.rejects(store.read(), /Unsupported Relayboard data format/);
});
