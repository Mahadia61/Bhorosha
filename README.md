# Bhorosha

Bhorosha is a privacy-preserving CUET course-feedback platform. The repository
contains two independent applications:

- `Frontend/` — React, TypeScript, Vite, and Tailwind user interface.
- `Backend/` — Express, MongoDB, JWT authentication, moderation, and AI review summaries.

Each application has its own `package.json`, lockfile, and README because it
has its own dependencies and commands. This is intentional and does not create
runtime ambiguity.

See the README in each folder for setup instructions. No Git submodules are
required; the unused historical `Bhorosha/` gitlink has been removed.
