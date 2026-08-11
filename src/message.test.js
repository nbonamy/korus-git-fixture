import assert from 'node:assert/strict';
import test from 'node:test';
import { formatGreeting } from './message.js';

test('formats a greeting', () => {
  assert.equal(formatGreeting('Claw'), 'Hello, Claw!');
});

