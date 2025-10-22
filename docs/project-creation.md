# Creating Your First Project

Get started with Rynex using the interactive project initializer. It handles all the setup for you.

## Quick Start

Create a new project with one command:

```bash
npx rynex init
```

This starts an interactive wizard that guides you through the setup process.

## Interactive Setup

### Step 1: Enter Project Name

The wizard asks for your project name:

```
What is your project name? (my-rynex-app)
```

Enter your project name or press Enter to use the default.

### Step 2: Choose a Template

Select the template that fits your needs:

**Empty** - Start with a clean slate. Minimal setup with just the basics. Perfect for learning or building something unique from scratch.

**Minimal** - A single page application with modern UI components, reactive state management, and a beautiful dark theme. Great for simple applications and prototypes.

**Routed** - A multi-page application with file-based routing, navigation components, lazy loading support, and a modern dark theme. Ideal for complex applications with multiple pages.

### Step 3: Select Language

Choose your preferred language:

**TypeScript** - Recommended for type safety, better IDE support, and catching errors early in development.

**JavaScript** - Classic JavaScript (coming soon).

### Step 4: Project Ready

The wizard creates your project and shows the next steps to get started.

## Project Structure

After creation, your project is organized like this:

```
my-rynex-app/
├── src/
│   ├── index.ts           # Entry point
│   ├── App.ts             # Root component
│   ├── components/        # Reusable components
│   └── pages/             # Route pages (routed template)
├── public/
│   ├── index.html         # HTML shell
│   └── styles.css         # Global styles
├── node_modules/
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── rynex.config.js        # Rynex configuration
└── README.md              # Project documentation
```

## Getting Started

After your project is created, follow these steps:

### Install Dependencies

```bash
cd my-rynex-app
npm install
```

### Start Development Server

```bash
npm run dev
```

Your application opens at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## What's Included

Each template includes:

- TypeScript configuration for type safety
- Development server with hot reload
- Build tools for production optimization
- Example components and pages
- Global styles and theme
- Ready-to-use Rynex helpers

## Next Steps

1. Explore the [Helper Functions](./helpers/index.md) to learn what you can build
2. Read [Getting Started](./getting-started.md) for core concepts
3. Check [Examples](./examples.md) for common patterns
4. Review [Best Practices](./best-practices.md) for tips

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

## Troubleshooting

### Project directory already exists

If you get an error that the directory exists, choose a different project name or delete the existing directory first.

### Dependencies installation fails

Try clearing npm cache and reinstalling:

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Development server won't start

Make sure port 3000 is available. If not, you can specify a different port in your configuration.

## Project Templates Comparison

| Feature | Empty | Minimal | Routed |
|---------|-------|---------|--------|
| Setup complexity | Very simple | Simple | Moderate |
| Components included | None | Yes | Yes |
| Routing | No | No | Yes |
| Example pages | No | 1 | Multiple |
| Best for | Learning | Simple apps | Complex apps |

## Tips

- Use the Minimal template if you're just starting out
- Use the Routed template for applications with multiple pages
- Use the Empty template if you prefer building everything yourself
- All templates can be customized after creation

## Need Help?

- Check the [Helper Functions](./helpers/index.md) documentation
- Review [Examples](./examples.md) for code samples
- Read [Best Practices](./best-practices.md) for development tips
- See [FAQ](./faq.md) for common questions
