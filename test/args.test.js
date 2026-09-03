import assert from 'node:assert/strict';
import test from 'node:test';
import { parseArguments } from '../src/args.js';

test('parses add options in any order', () => {
  assert.deepEqual(parseArguments(['--file', 'team.json', 'add', '--priority', 'high', 'Ship release']), {
    command: 'add', file: 'team.json', priority: 'high', title: 'Ship release',
  });
});

test('uses the default board for list', () => {
  assert.deepEqual(parseArguments(['list']), {
    command: 'list', file: '.relay/tasks.json', status: undefined, priority: undefined,
  });
});

test('parses and validates list filters', () => {
  assert.deepEqual(parseArguments(['list', '--status', 'doing', '--priority', 'high']), {
    command: 'list', file: '.relay/tasks.json', status: 'doing', priority: 'high',
  });
  assert.throws(() => parseArguments(['list', '--status', 'blocked']), /Status must be one of/);
  assert.throws(() => parseArguments(['list', '--priority', 'urgent']), /Priority must be one of/);
});

test('rejects unknown commands and extra arguments', () => {
  assert.throws(() => parseArguments(['archive']), /Unknown command/);
  assert.throws(() => parseArguments(['list', 'extra']), /Unexpected argument/);
});
