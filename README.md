# Bhorosha

Bhorosha is a privacy-preserving CUET course-feedback platform. The repository
contains two independent applications:

- `Frontend/` — React, TypeScript, Vite, and Tailwind user interface.
- `Backend/` — Express, MongoDB, JWT authentication, moderation, and AI review summaries.

Each application has its own `package.json`, lockfile, and README because it
has its own dependencies and commands. This is intentional and does not create
runtime ambiguity.

See the README in each folder for setup instructions. The `Bhorosha/` Git
submodule is preserved as historical project content and is not used by the
root `Frontend/` or `Backend/` applications.
