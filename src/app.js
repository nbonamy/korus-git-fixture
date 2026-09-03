import { parseArguments } from './args.js';
import { formatTaskTable } from './format.js';
import { FileTaskStore } from './store.js';
import { createTask, transitionTask } from './task.js';

export async function run(argv, options = {}) {
  const input = parseArguments(argv);
  const output = options.output ?? console.log;
  if (input.command === 'help') {
    output(helpText);
    return;
  }

  const store = options.store ?? new FileTaskStore(input.file);
  const board = await store.read();
  if (input.command === 'list') {
    const tasks = board.tasks.filter((task) => (
      (!input.status || task.status === input.status)
      && (!input.priority || task.priority === input.priority)
    ));
    output(formatTaskTable(tasks));
    return;
  }
  if (input.command === 'add') {
    const task = createTask({ title: input.title, priority: input.priority }, options);
    board.tasks.push(task);
    await store.write(board);
    output(`Added ${task.id}: ${task.title}`);
    return;
  }

  const taskIndex = board.tasks.findIndex((task) => task.id === input.id);
  if (taskIndex === -1) throw new Error(`Task not found: ${input.id ?? '(missing id)'}.`);
  const nextStatus = input.command === 'start' ? 'doing' : 'done';
  board.tasks[taskIndex] = transitionTask(board.tasks[taskIndex], nextStatus, options);
  await store.write(board);
  output(`${board.tasks[taskIndex].id} is now ${nextStatus}.`);
}

export const helpText = `Relayboard

Usage:
  relayboard [--file path] add <title> [--priority low|normal|high]
  relayboard [--file path] list [--status todo|doing|done] [--priority low|normal|high]
  relayboard [--file path] start <id>
  relayboard [--file path] done <id>`;
