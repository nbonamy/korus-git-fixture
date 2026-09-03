# Board data format

Relayboard stores one JSON object with a format version and a task array:

```json
{
  "version": 1,
  "tasks": [
    {
      "id": "task_a1b2c3d4",
      "title": "Ship the release",
      "priority": "high",
      "status": "doing",
      "createdAt": "2026-09-03T14:00:00.000Z",
      "updatedAt": "2026-09-03T14:05:00.000Z"
    }
  ]
}
```

Writes use a temporary sibling file followed by an atomic rename. If a process
stops during a write, the last complete board remains readable. A missing board
is treated as an empty version 1 board; malformed JSON and unsupported versions
fail without overwriting the source file.
