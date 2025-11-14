# CLAUDE.md - AI Assistant Development Guide

## Project Overview

**Project Name:** Timeblocking (Date Polling & Scheduling Coordination)

**Purpose:** A web application that helps groups find the best meeting date through collaborative polling. Users create a poll with multiple date options, share a unique link, and participants vote on their available dates without authentication. The system displays voting results to help identify the most popular dates.

**Similar Services:** Doodle, When2meet, LettuceMeet

**Status:** Initial setup phase

**Do Not Create README.md**

## Repository Structure

```
timeblocking/
├── CLAUDE.md           # This file - AI assistant guide
├── .gitignore          # Git ignore patterns
├── .env.example        # Environment variables template
├── package.json        # Node.js dependencies
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
├── app/                # Next.js App Router
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles
│   └── api/            # API routes (to be created)
├── components/         # Reusable UI components (to be created)
├── lib/                # Utility libraries
│   └── prisma.ts       # Prisma client instance
├── prisma/             # Prisma ORM
│   └── schema.prisma   # Database schema
└── public/             # Static assets (Next.js default)
```

## Technology Stack

### Core Technologies

- **Framework:** Next.js 14 (App Router)
  - Full-stack React framework with server and client components
  - API routes for backend functionality
  - Built-in routing and optimization

- **Language:** TypeScript
  - Type-safe development
  - Better IDE support and autocompletion
  - Reduced runtime errors

- **Database:** PostgreSQL + Prisma ORM
  - Relational database for structured data
  - Prisma for type-safe database access
  - Migration support for schema changes

- **Styling:** Tailwind CSS
  - Utility-first CSS framework
  - Rapid UI development
  - Built-in responsive design

### Additional Technologies

- **Link Generation:** UUID (built-in with Prisma)
- **Deployment:** Vercel (recommended for Next.js)
- **State Management:** React hooks and Server Components (no external library needed initially)
- **Real-time Updates:** To be implemented later (optional)

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
feat(poll): add date selection grid component
fix(voting): resolve duplicate vote submission issue
docs(readme): update installation instructions
refactor(api): simplify poll data fetching logic
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
function countVotesForDate(pollId, dateId) {
  return votes.filter(v => v.pollId === pollId && v.dateId === dateId).length;
}

// Bad: Doing too many things
function handleVote(vote) {
  // validates, saves, updates UI, sends notifications, recalculates...
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
2. **Use descriptive test names:** `it('should allow user to vote for multiple dates')`
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

1. **2025-11-14 - Technology Stack Selection**
   - Decision: Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL + Tailwind CSS
   - Rationale:
     - Next.js provides full-stack capabilities with server/client components
     - TypeScript ensures type safety across the application
     - Prisma offers excellent TypeScript integration and developer experience
     - PostgreSQL provides reliable relational data storage
     - Tailwind CSS enables rapid UI development
   - Alternatives considered:
     - Separate React + Express stack (more complex deployment)
     - Vue or Svelte (less ecosystem support)

2. **2025-11-14 - Data Model Design**
   - Decision: Relational model with Poll, DateOption, Vote, and VoteOnDate entities
   - Rationale: Clear separation of concerns, supports many-to-many relationships

### Design Patterns

Preferred patterns for this project:
- **State Management:** React hooks + Server Components (Next.js App Router pattern)
- **API Communication:** Next.js API routes with server actions
- **Error Handling:** Try-catch blocks with user-friendly error messages
- **Data Fetching:** Server Components for initial data, client components for interactions

## Common Tasks

### Setting Up Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd timeblocking

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Set up the database (if using PostgreSQL)
# Make sure PostgreSQL is running, then:
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Database Setup

**Option 1: PostgreSQL (Production-ready)**
```bash
# Install PostgreSQL locally or use a service like Railway, Supabase, or Neon
# Update .env with your DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/timeblocking"

# Run migrations
npx prisma migrate dev
```

**Option 2: SQLite (Quick local development)**
```bash
# Update prisma/schema.prisma datasource to:
# datasource db {
#   provider = "sqlite"
#   url      = "file:./dev.db"
# }

# Update .env
DATABASE_URL="file:./dev.db"

# Run migrations
npx prisma migrate dev
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

## Domain Knowledge: Date Polling & Scheduling

### Core Concepts

1. **Poll (Event):** A scheduling poll containing multiple date options
2. **Date Option:** A specific date/time slot that participants can vote for
3. **Vote:** A participant's selection indicating their availability
4. **Participant:** A person who votes on date availability (no authentication required)
5. **Poll Link:** A unique, shareable URL for accessing a specific poll
6. **Vote Count:** Aggregated number of participants available for each date
7. **Poll Creator:** The person who initiates the poll (may or may not require authentication)

### Key Features (Planned)

- [ ] Create new poll with multiple date options
- [ ] Generate unique shareable link for each poll
- [ ] Vote on available dates without authentication
- [ ] View real-time voting results
- [ ] Display vote counts for each date option
- [ ] Highlight most popular dates
- [ ] Allow participants to update their votes
- [ ] Optionally add participant names
- [ ] Visual calendar/grid interface for date selection
- [ ] Copy poll link to clipboard

### User Workflows

1. **Creating a Poll (Poll Creator):**
   - User opens the application
   - Enters poll title/description
   - Selects multiple date options
   - Clicks "Create Poll"
   - System generates unique poll link
   - User copies link to share with participants

2. **Voting on a Poll (Participant):**
   - User receives poll link from creator
   - Opens link in browser (no login required)
   - Views poll title and available dates
   - Selects all dates they are available
   - Optionally enters their name
   - Submits votes
   - Views updated voting results showing all participants' availability

3. **Viewing Poll Results:**
   - User opens poll link
   - Sees visual representation of votes per date
   - Identifies dates with highest availability
   - Can see participant names (if provided)
   - Can update own votes if needed

### Data Model (Preliminary)

```javascript
Poll {
  id: string (UUID)
  title: string
  description: string (optional)
  dateOptions: Date[]
  createdAt: timestamp
  createdBy: string (optional)
}

Vote {
  id: string
  pollId: string (foreign key)
  participantName: string (optional)
  selectedDates: Date[]
  submittedAt: timestamp
  participantId: string (for tracking vote updates)
}
```

## Performance Considerations

### Optimization Guidelines

1. **Lazy Loading:** Load components and data as needed
2. **Caching:** Cache poll data to reduce server requests
3. **Debouncing:** Debounce vote submissions and updates
4. **Optimistic Updates:** Update UI immediately before server confirmation
5. **Code Splitting:** Split bundles for faster initial load
6. **Efficient Rendering:** Only re-render affected date cells when votes change

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

### Similar Services (for Reference)

- [Doodle](https://doodle.com/) - Meeting scheduling and polling
- [When2meet](https://www.when2meet.com/) - Group availability finder
- [LettuceMeet](https://lettucemeet.com/) - Simple meeting scheduler
- [Calendly](https://calendly.com/) - Scheduling automation

### Development Resources

- [Add relevant documentation links as project evolves]
- UX patterns for date/time selection
- Best practices for shareable link generation

## Changelog

### Version History

Document major changes and versions here.

- **2025-11-14:** Initial CLAUDE.md created
- **2025-11-14:** Updated project purpose to date polling/scheduling coordination application
- **2025-11-14:** Project initialized with Next.js 14, TypeScript, Tailwind CSS, and Prisma
  - Created initial project structure with App Router
  - Set up Prisma schema with Poll, DateOption, Vote, and VoteOnDate models
  - Configured development environment
  - Added basic homepage with project description

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
