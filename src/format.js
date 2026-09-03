const statusOrder = new Map([['doing', 0], ['todo', 1], ['done', 2]]);
const priorityOrder = new Map([['high', 0], ['normal', 1], ['low', 2]]);

export function formatTaskTable(tasks) {
  if (tasks.length === 0) return 'No tasks yet.';

  tasks.sort((left, right) => {
    const byStatus = statusOrder.get(left.status) - statusOrder.get(right.status);
    if (byStatus !== 0) return byStatus;
    const byPriority = priorityOrder.get(left.priority) - priorityOrder.get(right.priority);
    return byPriority || left.createdAt.localeCompare(right.createdAt);
  });

  const rows = tasks.map((task) => [task.id, task.status, task.priority, task.title]);
  const headings = ['ID', 'STATUS', 'PRIORITY', 'TITLE'];
  const widths = headings.map((heading, index) => Math.max(heading.length, ...rows.map((row) => row[index].length)));
  return [headings, ...rows]
    .map((row) => row.map((value, index) => value.padEnd(widths[index])).join('  ').trimEnd())
    .join('\n');
}
