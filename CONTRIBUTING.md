# Contributing to InvestingPro

Thank you for your interest in contributing to InvestingPro! This document provides guidelines and instructions for contributing.

## Development Workflow

### Branching Strategy

- **`master`** - Production-ready code
- **`develop`** - Integration branch for features (create this if working with a team)
- **`feature/feature-name`** - New features
- **`bugfix/bug-name`** - Bug fixes
- **`hotfix/hotfix-name`** - Critical production fixes

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/DigitalHustleReal/InvestingPro.git
   cd InvestingPro
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-bug-name
   ```

4. **Make Changes**
   - Write clean, readable code
   - Follow TypeScript best practices
   - Add comments for complex logic
   - Update documentation as needed

5. **Test Your Changes**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code refactoring
   - `test:` - Tests
   - `chore:` - Maintenance

7. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a PR on GitHub.

## Code Standards

### TypeScript
- Use TypeScript for all new code
- Avoid `any` types - use proper types
- Use interfaces for object shapes
- Use enums for constants

### React/Next.js
- Use functional components with hooks
- Follow Next.js App Router conventions
- Use Server Components when possible
- Client components only when needed

### Styling
- Use Tailwind CSS utility classes
- Follow existing design system
- Maintain responsive design
- Use consistent spacing and colors

### File Structure
- Keep components in appropriate folders
- Use descriptive file names
- Group related files together
- Follow existing patterns

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test edge cases
- Test on multiple browsers/devices

## Pull Request Process

1. Update README.md if needed
2. Update documentation for new features
3. Ensure all tests pass
4. Get at least one review (if working with team)
5. Merge to `develop` or `master` based on workflow

## Questions?

Open an issue or contact the maintainers.






