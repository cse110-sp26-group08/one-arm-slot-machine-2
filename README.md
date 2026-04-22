# One-Arm Slot Machine II

## GitHub Pages Site: [click](https://cse110-sp26-group08.github.io/one-arm-slot-machine-2/)

A fully-featured pirate-themed slot machine website built with the MERN stack. Features multiple themed machines, leaderboards, social competition, and engaging gameplay mechanics informed by user research and psychology.

---

## ⚠️ IMPORTANT: Environment Configuration

**Before running the application, you MUST download the `.env` file:**

1. Go to the **Slack environment-files channel**
2. Download the `.env` file
3. Place it in the **root directory** of this project
4. **Do not commit this file** - it's in `.gitignore` for security

Without the `.env` file, the application will not run properly.

---

## Getting Started

### Prerequisites

- Node.js v22 or higher
- npm

### Installation & Running

```bash
# Install dependencies
npm i

# Terminal 1: Start the backend server
npm run dev:backend

# Terminal 2: Start the frontend development server
npm run dev:frontend
```

The application will be available at `http://localhost:5173` (frontend) with the backend running on the configured port.

---

## Project Documentation

### Core Documents

- [AGENTS.md](./AGENTS.md) - Development guidelines and project specifications
- [Final Report](./final-report/FINAL-REPORT.md) - Complete project overview, architecture, and results

### Planning & Research

- [Research Overview](./plan/research-overview.md) - Comprehensive research across all domains
- [AI Development Plan](./plan/ai-plan.md) - AI-driven development strategy
- [AI Usage Log](./plan/ai-use-log.md) - Log of AI agent usage during development

### User Research

- [Player Persona: Joy](./plan/persona-documents/player-persona.md) - Primary player profile and requirements
- [Stakeholder Persona: Joe](./plan/persona-documents/stakeholder-persona.md) - Investor/stakeholder profile and requirements

---

## Available Scripts

```bash
npm run dev              # Start frontend dev server
npm run dev:frontend     # Frontend development only
npm run dev:backend      # Backend development only
npm run build            # Build frontend for production
npm run lint             # Run ESLint and TypeScript checks
npm run test             # Run all tests
npm run test:unit        # Run unit tests
npm run typecheck        # Run TypeScript type checking
npm run start:backend    # Start backend server (production)
```

---

## Technology Stack

- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB
- **Testing:** Node.js test runner, Playwright
- **Linting:** ESLint, TypeScript
- **Build:** Vite

---

## Project Structure

```
/backend         - Express backend services and controllers
/frontend        - React components and pages
/tests          - Unit and integration tests
/plan           - Project planning and research documents
/assets         - Static assets and images
```

---

## Quality Assurance

The project includes:

- Automated ESLint and TypeScript checking via GitHub Actions
- Comprehensive unit tests for backend and frontend
- Branch protection requiring passing CI/CD checks
- Code quality standards enforced through linting workflows
