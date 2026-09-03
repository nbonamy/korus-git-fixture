import { randomUUID } from 'node:crypto';

export const priorities = ['low', 'normal', 'high'];
export const statuses = ['todo', 'doing', 'done'];

export function createTask(input, options = {}) {
  const title = input.title?.trim();
  if (!title) throw new Error('Task title is required.');

  const priority = input.priority ?? 'normal';
  if (!priorities.includes(priority)) {
    throw new Error(`Priority must be one of: ${priorities.join(', ')}.`);
  }

  const now = (options.now ?? (() => new Date()))().toISOString();
  const id = options.id ?? `task_${randomUUID().slice(0, 8)}`;
  return {
    id,
    title,
    priority,
    status: 'todo',
    createdAt: now,
    updatedAt: now,
  };
}

export function transitionTask(task, nextStatus, options = {}) {
  if (!statuses.includes(nextStatus)) throw new Error(`Unknown task status: ${nextStatus}.`);
  if (task.status === 'done' && nextStatus !== 'done') {
    throw new Error('Completed tasks cannot be reopened.');
  }

  const now = (options.now ?? (() => new Date()))().toISOString();
  return {
    ...task,
    status: nextStatus,
    updatedAt: now,
    ...(nextStatus === 'done' ? { completedAt: now } : {}),
  };
}
