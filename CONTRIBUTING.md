# Contributing to Rynex

Thank you for your interest in contributing to Rynex! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rynex/rynex.git
   cd rynex
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the framework**
   ```bash
   pnpm build:framework
   ```

4. **Run the example**
   ```bash
   cd examples/counter-app
   pnpm install
   pnpm dev
   ```

## Project Structure

```
rynex/
├── src/
│   ├── runtime/          # Core runtime engine
│   │   ├── state.ts      # State management
│   │   ├── vdom.ts       # Virtual DOM
│   │   ├── renderer.ts   # Renderer
│   │   ├── helpers.ts    # Helper functions
│   │   └── types.ts      # TypeScript types
│   └── cli/              # CLI tool
│       ├── parser.ts     # view/style parser
│       ├── builder.ts    # Build system
│       ├── dev-server.ts # Dev server
│       ├── init.ts       # Project initializer
│       └── bin/          # CLI executable
├── examples/             # Example projects
└── dist/                 # Compiled output
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow TypeScript best practices
   - Add tests if applicable

3. **Build and test**
   ```bash
   pnpm build:framework
   cd examples/counter-app
   pnpm dev
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Testing

- Test your changes thoroughly
- Ensure the example app works correctly
- Test in different browsers if possible

## Documentation

- Update README.md if adding new features
- Add JSDoc comments to new functions
- Update examples if API changes

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing to Rynex, you agree that your contributions will be licensed under the MIT License.
