# Test Configuration

This directory contains test configuration files for the project.

## Contents

- `env.config.ts`: Environment variable configuration
- `setup.e2e.ts`: End-to-end (E2E) test setup
- `vitest.*.config.ts`: Vitest configurations for specific test modes (e.g., E2E, integration)

> [!NOTE]
> The main `vitest.config.ts` file is located in the project root directory for compatibility with tools like the Vitest VS Code extension, which may not support configuration files in subdirectories.