export function formatGreeting(name) {
  return `Hello, ${normalizeName(name)}!`;
}

export function formatFarewell(name) {
  return `Goodbye, ${normalizeName(name)}!`;
}

function normalizeName(name) {
  return name.trim();
}
