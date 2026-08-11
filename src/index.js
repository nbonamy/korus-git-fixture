import { formatGreeting } from './message.js';

const recipients = ['Nicolas', 'Codex Claw'];

for (const recipient of recipients) {
  console.log(formatGreeting(recipient));
}

