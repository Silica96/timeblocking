# CLAUDE.md - AI Assistant Development Guide

## Project Overview

**Project Name:** Timeblocking

**Purpose:** A timeblocking application to help users manage their schedules by allocating specific time blocks for tasks and activities.

**Status:** Initial setup phase

## Repository Structure

```
timeblocking/
├── CLAUDE.md           # This file - AI assistant guide
├── README.md           # User-facing documentation (to be created)
├── .gitignore          # Git ignore patterns (to be created)
└── [Additional structure to be defined]
```

### Future Directory Structure (Template)

As the project evolves, the structure should follow these conventions:

```
timeblocking/
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components/routes
│   ├── hooks/          # Custom React hooks (if React)
│   ├── utils/          # Utility functions
│   ├── services/       # API/service layer
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles
├── tests/              # Test files
├── docs/               # Documentation
├── public/             # Static assets (if web app)
└── scripts/            # Build and development scripts
```

## Technology Stack

**To Be Determined** - Update this section as technologies are chosen.

Considerations for timeblocking applications:
- **Frontend:** React, Vue, or Svelte for web; React Native or Flutter for mobile
- **Backend:** Node.js/Express, Python/FastAPI, or Go for API server
- **Database:** PostgreSQL, MongoDB, or SQLite for data persistence
- **Calendar Integration:** Google Calendar API, Microsoft Graph API
- **State Management:** Redux, Zustand, or Context API
- **Styling:** Tailwind CSS, CSS Modules, or styled-components

## Development Workflow

### Branch Naming Convention

- `main` or `master` - Production-ready code
- `develop` - Integration branch for features
- `feature/<name>` - New features
- `bugfix/<name>` - Bug fixes
- `hotfix/<name>` - Critical production fixes
- `claude/<session-id>` - AI assistant working branches

### Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**
```
feat(calendar): add drag-and-drop time block creation
fix(auth): resolve token expiration handling
docs(readme): update installation instructions
refactor(api): simplify event fetching logic
```

### Pull Request Guidelines

1. **Title:** Clear, descriptive summary of changes
2. **Description:** Include:
   - What changed and why
   - How to test the changes
   - Any breaking changes
   - Related issues or tickets
3. **Checklist:**
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No console errors or warnings
   - [ ] Code follows project conventions
   - [ ] Self-review completed

## Code Conventions

### General Principles

1. **Readability First:** Code should be self-documenting
2. **DRY (Don't Repeat Yourself):** Extract reusable logic
3. **KISS (Keep It Simple, Stupid):** Prefer simple solutions
4. **YAGNI (You Aren't Gonna Need It):** Don't add unnecessary features

### Naming Conventions

- **Files:** `kebab-case.ts` or `PascalCase.tsx` (for components)
- **Variables/Functions:** `camelCase`
- **Classes/Components:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Private methods:** `_prefixedCamelCase` or `#privateField` (JS)

### Code Style

Update this section based on chosen linter/formatter:
- Use ESLint + Prettier (JavaScript/TypeScript)
- Use Black + Pylint (Python)
- Use gofmt + golangci-lint (Go)
- Maximum line length: 80-100 characters
- Use meaningful variable names
- Add comments for complex logic only

### Function Design

```javascript
// Good: Clear, single responsibility
function calculateTimeBlockDuration(startTime, endTime) {
  return endTime - startTime;
}

// Bad: Doing too many things
function handleTimeBlock(block) {
  // validates, saves, updates UI, sends notifications...
}
```

### Error Handling

- Always handle errors gracefully
- Provide meaningful error messages
- Log errors appropriately
- Don't expose sensitive information in error messages
- Use try-catch blocks for async operations

## Testing Strategy

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage for business logic
- **Integration Tests:** Critical user flows
- **E2E Tests:** Key user journeys

### Test File Location

- Co-locate tests with source: `component.test.ts` next to `component.ts`
- Or separate: `tests/` directory mirroring `src/` structure

### Testing Guidelines

1. **Test behavior, not implementation**
2. **Use descriptive test names:** `it('should create time block when user drags on calendar')`
3. **AAA Pattern:** Arrange, Act, Assert
4. **Mock external dependencies**
5. **Test edge cases and error conditions**

### Running Tests

```bash
# To be defined based on chosen framework
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

## Architecture Decisions

### Key Design Decisions

Document major architectural decisions here as they are made:

1. **[Date] - Technology Stack Selection**
   - Decision: [To be made]
   - Rationale: [To be documented]
   - Alternatives considered: [To be documented]

2. **[Date] - Data Model Design**
   - Decision: [To be made]
   - Rationale: [To be documented]

### Design Patterns

Preferred patterns for this project:
- **State Management:** [To be defined]
- **API Communication:** [To be defined]
- **Error Handling:** [To be defined]
- **Data Fetching:** [To be defined]

## Common Tasks

### Setting Up Development Environment

```bash
# To be defined
git clone <repository-url>
cd timeblocking
# Install dependencies
# Set up environment variables
# Run development server
```

### Adding a New Feature

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Implement the feature following code conventions
3. Write tests for the new functionality
4. Update documentation if needed
5. Submit a pull request

### Debugging Common Issues

Document common issues and solutions here as they arise.

## AI Assistant Guidelines

### When Working on This Project

1. **Always Read First**
   - Use Read tool to examine existing code before making changes
   - Understand the context and existing patterns
   - Check for similar implementations elsewhere

2. **Use Todo Lists**
   - Break down complex tasks into smaller steps
   - Track progress with TodoWrite tool
   - Mark items as completed as you go

3. **Follow Existing Patterns**
   - Match the coding style of surrounding code
   - Use established patterns and conventions
   - Don't introduce new patterns without discussion

4. **Test Your Changes**
   - Run existing tests to ensure nothing breaks
   - Add tests for new functionality
   - Verify the application works as expected

5. **Security Considerations**
   - Never commit sensitive data (API keys, passwords)
   - Validate all user inputs
   - Sanitize data before rendering
   - Follow OWASP guidelines
   - Avoid common vulnerabilities:
     - SQL injection
     - XSS (Cross-Site Scripting)
     - CSRF (Cross-Site Request Forgery)
     - Command injection

6. **Commit Practices**
   - Make atomic commits (one logical change per commit)
   - Write clear, descriptive commit messages
   - Don't commit generated files or dependencies
   - Review changes before committing

7. **Code Quality**
   - Write self-documenting code
   - Add comments only when necessary to explain "why", not "what"
   - Keep functions small and focused
   - Avoid premature optimization

8. **Communication**
   - Explain what you're doing and why
   - Ask for clarification when requirements are unclear
   - Suggest improvements when you see opportunities
   - Document important decisions

### File Operations Priority

1. **Reading Files:** Use Read tool (not `cat`)
2. **Editing Files:** Use Edit tool (not `sed`/`awk`)
3. **Creating Files:** Use Write tool (not `echo >`)
4. **Searching Code:** Use Grep tool (not `grep` command)
5. **Finding Files:** Use Glob tool (not `find`)

### Exploration Strategy

For understanding the codebase:
1. Start with README.md and package.json (or equivalent)
2. Examine directory structure
3. Read main entry points (index, main, app files)
4. Follow imports to understand dependencies
5. Use Task tool with subagent_type=Explore for broad investigations

## Timeblocking Domain Knowledge

### Core Concepts

1. **Time Block:** A dedicated time slot for a specific task or activity
2. **Calendar View:** Visual representation of time blocks across days/weeks
3. **Task:** An activity that needs to be scheduled
4. **Priority:** Importance level of a task
5. **Duration:** Time allocated for a time block
6. **Recurrence:** Repeating time blocks (daily, weekly, etc.)

### Key Features (Planned)

- [ ] Create, edit, delete time blocks
- [ ] Drag-and-drop interface for scheduling
- [ ] Calendar integration (Google Calendar, etc.)
- [ ] Task prioritization
- [ ] Notifications and reminders
- [ ] Time tracking and analytics
- [ ] Templates for recurring schedules
- [ ] Multi-device synchronization

### User Workflows

1. **Creating a Time Block:**
   - User selects time slot on calendar
   - Enters task details (name, description, priority)
   - Saves time block
   - System validates and stores

2. **Editing a Time Block:**
   - User clicks existing time block
   - Modifies details or time
   - Saves changes
   - System updates and revalidates conflicts

3. **Viewing Schedule:**
   - User selects view (day, week, month)
   - System displays time blocks
   - User can filter by category, priority

## Performance Considerations

### Optimization Guidelines

1. **Lazy Loading:** Load components and data as needed
2. **Caching:** Cache frequently accessed data
3. **Debouncing:** Debounce user inputs (search, resize)
4. **Virtual Scrolling:** For long lists of time blocks
5. **Code Splitting:** Split bundles for faster initial load
6. **Image Optimization:** Compress and lazy-load images

### Performance Metrics

Target metrics (to be refined):
- Initial load: < 3 seconds
- Time to interactive: < 5 seconds
- Smooth 60 FPS animations
- API response time: < 200ms

## Accessibility

### WCAG 2.1 Compliance

Aim for Level AA compliance:
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1 for text)
- Focus indicators
- Alt text for images
- ARIA labels where appropriate

### Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus visible and logical focus order
- [ ] Form inputs have associated labels
- [ ] Error messages are clear and associated
- [ ] Color is not the only means of conveying information
- [ ] Text can be resized up to 200%
- [ ] Animations respect prefers-reduced-motion

## Environment Variables

Document required environment variables here:

```bash
# Example structure (update as needed)
# API_KEY=your_api_key
# DATABASE_URL=your_database_url
# AUTH_SECRET=your_auth_secret
```

Create a `.env.example` file with dummy values for reference.

## Troubleshooting

### Common Issues

Document solutions to common problems here as they arise.

## Resources

### Timeblocking Methodology

- [Cal Newport's Time Blocking Guide](https://www.calnewport.com/blog/2013/12/21/deep-habits-the-importance-of-planning-every-minute-of-your-work-day/)
- [Todoist Guide to Time Blocking](https://todoist.com/productivity-methods/time-blocking)

### Development Resources

- [Add relevant documentation links as project evolves]

## Changelog

### Version History

Document major changes and versions here.

- **2025-11-14:** Initial CLAUDE.md created

## Contributing

Guidelines for contributors:
1. Fork the repository
2. Create a feature branch
3. Make your changes following code conventions
4. Write/update tests
5. Submit a pull request
6. Respond to code review feedback

## Contact & Support

[To be added - project maintainers, support channels, etc.]

---

**Last Updated:** 2025-11-14

**Note for AI Assistants:** This document should be updated as the project evolves. When you make significant changes to the codebase structure, technology choices, or conventions, please update this file accordingly.
