import assert from 'node:assert/strict';
import test from 'node:test';
import { formatFarewell, formatGreeting } from './message.js';

test('formats a greeting', () => {
  assert.equal(formatGreeting('Claw'), 'Hello, Claw!');
});

test('formats a farewell', () => {
  assert.equal(formatFarewell('Claw'), 'Goodbye, Claw!');
});

test('trims names before formatting', () => {
  assert.equal(formatGreeting('  Claw  '), 'Hello, Claw!');
});
