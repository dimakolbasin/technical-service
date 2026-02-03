# AGENTS

Rules for any assistant working in this repository. They are session-agnostic.

## Context hygiene
- Keep context tight: open only the files needed for the task.
- Prefer source to build artifacts and caches; avoid deep link-chasing unless necessary.
- If a user asks for ignored artifacts, remind them and propose working with source equivalents.

## Safety fallback
- If an instruction cannot be followed (missing access or conflicting data), describe the issue and pick the best available approach without stopping. If asked to open ignored build paths, politely decline and suggest alternatives.
