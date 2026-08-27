# AGENTS

Rules for any assistant working in this repository. They are session-agnostic.

## Working style
- Use Ponytail's simplest-working-solution rule for all code changes: reuse existing code and platform features before adding abstractions or dependencies.

## Code intelligence
- Use codebase-memory first for code discovery and architecture: `search_graph`, `trace_path`, `get_code_snippet`, then `query_graph` or `search_code` when needed.
- Use Serena for symbol-level navigation and edits, reference-aware refactors, and project memory. Activate the current directory as the Serena project before using its tools.
- Fall back to text search for literals, config, documentation, or when semantic tools do not return enough information.

## Context hygiene
- Keep context tight: open only the files needed for the task.
- Prefer source to build artifacts and caches; avoid deep link-chasing unless necessary.
- If a user asks for ignored artifacts, remind them and propose working with source equivalents.

## Safety fallback
- If an instruction cannot be followed (missing access or conflicting data), describe the issue and pick the best available approach without stopping. If asked to open ignored build paths, politely decline and suggest alternatives.
