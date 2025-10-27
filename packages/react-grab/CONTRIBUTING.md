# Contributing to React Grab

Thanks for your interest in contributing to React Grab! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](https://github.com/aidenybai/react-grab/blob/main/.github/CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher

### Development Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/<your-username>/react-grab.git
cd react-grab
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development mode:
```bash
pnpm dev
```

This will watch for changes in the `packages/react-grab` package and rebuild automatically.

## Project Structure

This is a monorepo managed by pnpm workspaces:

```
react-grab/
├── packages/
│   ├── react-grab/      # Main library package
│   ├── kitchen-sink/    # Demo/testing application
│   └── website/         # Documentation website
├── .github/             # GitHub workflows and configs
└── pnpm-workspace.yaml  # Workspace configuration
```

### Key Packages

- **`packages/react-grab`**: The main library code
  - `src/index.ts`: Main entry point
  - `src/instrumentation.ts`: Core instrumentation logic
  - `src/adapters.ts`: Adapter implementations
  - `src/plugins/vite.ts`: Vite plugin
  - `src/overlay.ts`: Overlay UI
  - `src/hotkeys.ts`: Keyboard shortcuts

- **`packages/kitchen-sink`**: Demo application for testing

- **`packages/website`**: Documentation and landing page

## Development Workflow

### Building

Build the main package:
```bash
pnpm build
```

### Linting

Run linter:
```bash
pnpm lint
```

Auto-fix linting issues:
```bash
pnpm lint:fix
```

### Formatting

Format code with Prettier:
```bash
pnpm format
```

Check formatting and linting:
```bash
pnpm check
```

### Testing

Test your changes by running the kitchen-sink demo:
```bash
cd packages/kitchen-sink
pnpm dev
```

Then open your browser and test the functionality by holding <kbd>⌘C</kbd> (or <kbd>Ctrl+C</kbd> on Windows/Linux) and clicking elements.

## Making Changes

### Creating a Branch

Create a new branch for your feature or fix:
```bash
git checkout -b feat/your-feature-name
```

Branch naming conventions:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes
- `chore/` - Maintenance tasks

### Commit Messages

Write clear, concise commit messages:
```
feat: add support for custom hotkeys
fix: resolve overlay positioning issue
docs: update installation guide
```

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Code Style

We follow these guidelines:

- Use **TypeScript** for all code
- Use **arrow functions** over function declarations
- Use **interfaces** over types
- Use **descriptive variable names** (avoid abbreviations)
- **Remove unused code** and avoid repetition
- Add comments only when necessary (prefix hacks with `// HACK:`)
- Use **kebab-case** for filenames

Example:
```typescript
interface UserPreferences {
  enableOverlay: boolean;
  hotkey: string;
}

const getUserPreferences = (): UserPreferences => {
  // Implementation
};
```

### Before Submitting

1. **Run tests**: Ensure the kitchen-sink demo works
2. **Run linter**: `pnpm check`
3. **Format code**: `pnpm format`
4. **Build successfully**: `pnpm build`
5. **Test in multiple browsers**: Chrome, Firefox, Safari

## Submitting a Pull Request

1. Push your changes to your fork
2. Create a Pull Request against the `main` branch
3. Fill out the PR template with:
   - Description of changes
   - Related issue number (if applicable)
   - Screenshots/videos (for UI changes)
   - Testing performed

### PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged

### After Your PR is Merged

- Your contribution will be included in the next release
- You'll be credited in the changelog
- Consider joining our [Discord](https://discord.gg/X9yFbcV2rF) community!

## Release Process

We use [Changesets](https://github.com/changesets/changesets) for version management.

If your change affects the public API:

1. Create a changeset:
```bash
pnpm changeset
```

2. Follow the prompts to describe your changes
3. Commit the generated changeset file

Maintainers will handle releasing new versions.

## Areas for Contribution

### Good First Issues

Look for issues labeled `good first issue` in our [issue tracker](https://github.com/aidenybai/react-grab/issues).

### Feature Requests

Check existing issues before creating new feature requests. Provide:
- Use case description
- Expected behavior
- Alternative solutions considered

### Bug Reports

When reporting bugs, include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots or error messages

## Development Tips

### Local Testing

To test react-grab in another project locally:

1. Build the package:
```bash
cd packages/react-grab
pnpm build
```

2. Link it:
```bash
pnpm link --global
```

3. In your test project:
```bash
pnpm link --global react-grab
```

### Debugging

Add debug logs:
```typescript
console.log('[react-grab]', 'your debug message');
```

Remember to remove debug logs before submitting.

## Getting Help

- **Discord**: Join our [community](https://discord.gg/X9yFbcV2rF)
- **Issues**: Check the [issue tracker](https://github.com/aidenybai/react-grab/issues)
- **Discussions**: Start a [GitHub Discussion](https://github.com/aidenybai/react-grab/discussions)

## Recognition

Contributors will be:
- Listed in the changelog
- Credited in release notes
- Featured in our README (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to React Grab!
