const defaultFile = '.relay/tasks.json';

export function parseArguments(argv) {
  const args = [...argv];
  const file = takeOption(args, '--file') ?? defaultFile;
  const command = args.shift() ?? 'help';

  if (command === 'help' || command === '--help' || command === '-h') {
    assertNoArguments(args);
    return { command: 'help', file };
  }
  if (command === 'list') {
    assertNoArguments(args);
    return { command, file };
  }
  if (command === 'add') {
    const priority = takeOption(args, '--priority') ?? 'normal';
    const title = args.shift();
    assertNoArguments(args);
    return { command, file, priority, title };
  }
  if (command === 'start' || command === 'done') {
    const id = args.shift();
    assertNoArguments(args);
    return { command, file, id };
  }

  throw new Error(`Unknown command: ${command}.`);
}

function takeOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  if (index === args.length - 1) throw new Error(`${name} requires a value.`);
  const [value] = args.splice(index + 1, 1);
  args.splice(index, 1);
  return value;
}

function assertNoArguments(args) {
  if (args.length > 0) throw new Error(`Unexpected argument: ${args[0]}.`);
}
