# Contributing to Browserating

Thank you for your interest in contributing to Browserating! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Basic knowledge of React and Next.js
- Familiarity with Tailwind CSS

## Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/browserating.git
   cd browserating
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

## Coding Standards

### Code Style

This project uses:

- **Prettier** for code formatting
- **ESLint** for code quality
- **Tailwind CSS** for styling

### Formatting

Format your code before committing:

```bash
npm run format
```

### Linting

Run linting to check for code quality issues:

```bash
npm run lint
```

### File Naming

- Use PascalCase for React components: `BrowserCard.js`
- Use camelCase for utility functions: `getBrowsers.js`
- Use kebab-case for CSS files: `globals.css`
- Use kebab-case for assets: `browser-logo.png`

### Component Structure

```javascript
'use client';

import { useState, useEffect } from 'react';

export default function ComponentName({ prop1, prop2 }) {
  // State
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // effect logic
  }, []);

  // Event handlers
  const handleClick = () => {
    // handler logic
  };

  // Render
  return <div>{/* JSX */}</div>;
}
```

### Accessibility

- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Provide alt text for images
- Use semantic HTML elements
- Test with screen readers

## Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependencies changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert a previous commit

### Examples

```bash
feat(browser-list): add filter by browser engine

fix(dark-mode): resolve theme mismatch on initial load

docs(readme): update installation instructions

style(ui): improve button hover states

test(browsers): add unit tests for getBrowsers utility
```

### Pre-commit Hooks

This project uses Husky for Git hooks and lint-staged for pre-commit checks:

- Code is automatically formatted with Prettier
- Linting runs on staged files
- Commit messages are validated with commitlint

## Pull Request Process

1. **Update the documentation**

   Update relevant documentation if your PR changes functionality.

2. **Write tests**

   Add tests for new features or bug fixes.

3. **Ensure all checks pass**
   - CI/CD pipeline must pass
   - Code must be formatted
   - No linting errors

4. **Submit a pull request**
   - Provide a clear description of changes
   - Reference related issues (e.g., `Fixes #123`)
   - Add screenshots for UI changes
   - Keep PRs focused and atomic

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] All existing tests pass

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review performed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Reporting Issues

### Bug Reports

When reporting bugs, include:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or error messages
- Environment (browser, OS, device)

### Feature Requests

When requesting features, include:

- Clear description of the feature
- Use case or problem it solves
- Proposed solution (optional)
- Alternative solutions considered

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
browserating/
├── app/                    # Next.js App Router
│   ├── components/          # React components
│   ├── lib/               # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── globals.css        # Global styles
├── public/                # Static assets
│   ├── data/             # Browser data (JSON)
│   └── images/           # Images
├── .husky/              # Git hooks
├── .github/              # GitHub workflows
└── README.md            # Project documentation
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Questions?

If you have questions, please:

- Open an issue on GitHub
- Join our discussions
- Contact the maintainers

Thank you for contributing! 🎉
