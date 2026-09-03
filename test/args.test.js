import assert from 'node:assert/strict';
import test from 'node:test';
import { parseArguments } from '../src/args.js';

test('parses add options in any order', () => {
  assert.deepEqual(parseArguments(['--file', 'team.json', 'add', '--priority', 'high', 'Ship release']), {
    command: 'add', file: 'team.json', priority: 'high', title: 'Ship release',
  });
});

test('uses the default board for list', () => {
  assert.deepEqual(parseArguments(['list']), { command: 'list', file: '.relay/tasks.json' });
});

test('parses rename arguments', () => {
  assert.deepEqual(parseArguments(['rename', 'task_ship', 'Publish release']), {
    command: 'rename', file: '.relay/tasks.json', id: 'task_ship', title: 'Publish release',
  });
});

test('rejects unknown commands and extra arguments', () => {
  assert.throws(() => parseArguments(['archive']), /Unknown command/);
  assert.throws(() => parseArguments(['list', 'extra']), /Unexpected argument/);
});
