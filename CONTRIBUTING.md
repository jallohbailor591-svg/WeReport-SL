# Contributing to WeReport

Thank you for your interest in contributing to WeReport! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/your-org/wereport/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. Check existing issues and discussions first
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Proposed implementation (optional)
   - Mockups or examples (optional)

### Pull Requests

1. **Fork the repository** and create a new branch from `main`
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes** following our coding standards:
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Write tests** for new features:
   - Unit tests for functions
   - Integration tests for API routes
   - E2E tests for critical flows

4. **Run the test suite**:
   \`\`\`bash
   npm test
   npm run e2e
   npm run lint
   \`\`\`

5. **Commit your changes** with clear messages:
   \`\`\`bash
   git commit -m "feat: add user notification preferences"
   git commit -m "fix: resolve search filtering issue"
   git commit -m "docs: update API documentation"
   \`\`\`

6. **Push to your fork** and submit a pull request:
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

7. **Fill out the PR template** completely:
   - Description of changes
   - Related issue number
   - Testing performed
   - Screenshots (if applicable)

## Development Setup

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/your-org/wereport.git
   cd wereport
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   \`\`\`

4. **Run database migrations**:
   \`\`\`bash
   # Execute SQL scripts in Supabase dashboard
   \`\`\`

5. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Enable strict mode
- Define proper types (avoid `any`)
- Use interfaces for object shapes

### React
- Use functional components with hooks
- Keep components focused and single-purpose
- Use client components only when necessary
- Implement proper error boundaries

### Styling
- Use Tailwind CSS utility classes
- Follow design system tokens
- Ensure responsive design
- Support dark mode

### API Routes
- Validate inputs with Zod
- Use proper HTTP status codes
- Implement error handling
- Add rate limiting

### Database
- Use parameterized queries
- Implement RLS policies
- Add proper indexes
- Write efficient queries

## Testing Guidelines

### Unit Tests
- Test pure functions and utilities
- Mock external dependencies
- Aim for 80%+ coverage
- Test edge cases and errors

### Integration Tests
- Test API endpoints
- Verify database operations
- Test authentication flows
- Check authorization

### E2E Tests
- Test critical user journeys
- Verify form submissions
- Test navigation flows
- Check responsive design

## Documentation

- Update README.md for significant changes
- Add JSDoc comments to functions
- Update API documentation
- Include examples in docs

## Review Process

1. **Automated checks** must pass:
   - Linting
   - Type checking
   - Unit tests
   - E2E tests

2. **Code review** by maintainers:
   - Code quality
   - Test coverage
   - Documentation
   - Security concerns

3. **Testing** on staging environment

4. **Merge** when approved

## Release Process

1. Maintainers will create release branches
2. Version numbers follow [Semantic Versioning](https://semver.org/)
3. Changelog is updated for each release
4. Releases are tagged in git

## Questions?

- Join our [Discord community](https://discord.gg/wereport)
- Email: dev@wereport.sl
- Check [documentation](https://docs.wereport.sl)

Thank you for contributing to WeReport! 🎉
