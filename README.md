# Relayboard

Relayboard is a small local-first task board for engineering teams. It stores a
portable JSON file in the repository and provides a zero-dependency command-line
interface for capturing and moving work.

## Quick start

```bash
npm install
npm start -- add "Ship the release" --priority high
npm start -- list
npm start -- rename <task-id> "Ship the stable release"
npm start -- start <task-id>
npm start -- done <task-id>
```

Use `--file <path>` to work with another board. The default is
`.relay/tasks.json`.

## Commands

| Command | Description |
| --- | --- |
| `add <title> [--priority low\|normal\|high]` | Add a task to the board. |
| `list` | List tasks in workflow order. |
| `rename <id> <title>` | Rename a task. |
| `start <id>` | Move a task to `doing`. |
| `done <id>` | Complete a task. |
| `help` | Show command help. |

## Development

Relayboard deliberately has no runtime or development dependencies.

```bash
npm run lint
npm test
```

The persisted format and recovery guarantees are documented in
[docs/data-format.md](docs/data-format.md).
