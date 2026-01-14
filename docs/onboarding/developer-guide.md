# Developer Onboarding Guide

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Purpose:** Guide for new developers joining the InvestingPro team

---

## 📋 Table of Contents

1. [Getting Started](#1-getting-started)
2. [Development Environment](#2-development-environment)
3. [Project Structure](#3-project-structure)
4. [Development Workflow](#4-development-workflow)
5. [Key Concepts](#5-key-concepts)
6. [Common Tasks](#6-common-tasks)
7. [Best Practices](#7-best-practices)
8. [Resources](#8-resources)

---

## 1. Getting Started

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ or **pnpm**: v8+
- **Git**: Latest version
- **VS Code**: Recommended IDE
- **Supabase Account**: For database access

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/investingpro-app.git
   cd investingpro-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run Database Migrations**
   ```bash
   # Using Supabase CLI
   supabase migration up
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Verify Setup**
   - Open http://localhost:3000
   - Check health endpoint: http://localhost:3000/api/health
   - Verify database connection

---

## 2. Development Environment

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Providers (at least one required)
OPENAI_API_KEY=your-openai-key
GOOGLE_GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
MISTRAL_API_KEY=your-mistral-key
ANTHROPIC_API_KEY=your-anthropic-key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Axiom (Logging)
AXIOM_API_KEY=your-axiom-key
AXIOM_DATASET=investingpro-logs

# Cron Jobs
CRON_SECRET=your-cron-secret
```

### VS Code Setup

**Recommended Extensions:**
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense
- GitLens

**Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## 3. Project Structure

```
investingpro-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   └── [routes]/          # Public pages
├── components/             # React components
│   ├── admin/             # Admin components
│   ├── common/            # Shared components
│   └── ui/                # UI primitives
├── lib/                    # Business logic
│   ├── agents/             # AI agents
│   ├── ai/                 # AI utilities
│   ├── cms/                # CMS services
│   ├── errors/             # Error handling
│   ├── workflows/          # Workflow engine
│   └── ...                 # Other utilities
├── supabase/               # Database
│   └── migrations/         # SQL migrations
├── docs/                   # Documentation
├── types/                   # TypeScript types
└── public/                 # Static assets
```

### Key Directories

**`app/api/`**: API endpoints
- Follow RESTful conventions
- Use middleware for auth, validation, tracing
- Return standardized responses

**`lib/agents/`**: AI Agents
- Each agent has single responsibility
- Extend `BaseAgent`
- Stateless design

**`lib/workflows/`**: Workflow Engine
- Declarative workflow definitions
- State machine enforcement
- Error handling

**`supabase/migrations/`**: Database Migrations
- Idempotent migrations
- Versioned by date
- Include rollback if needed

---

## 4. Development Workflow

### Branch Strategy

- **main**: Production branch
- **develop**: Development branch
- **feature/***: Feature branches
- **fix/***: Bug fix branches

### Commit Convention

```
type(scope): subject

Examples:
feat(api): add article generation endpoint
fix(workflow): resolve stuck workflow issue
docs(readme): update setup instructions
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

### Pull Request Process

1. **Create Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature
   # Create PR on GitHub
   ```

5. **Code Review**
   - Address review comments
   - Update PR
   - Get approval

6. **Merge**
   - Squash and merge
   - Delete branch

---

## 5. Key Concepts

### Agent-Based Architecture

The platform uses **17 specialized agents** coordinated by the CMS Orchestrator:

- **Discovery Agents**: TrendAgent, KeywordAgent, StrategyAgent
- **Generation Agents**: ContentAgent, ImageAgent, BulkGenerationAgent
- **Quality Agents**: QualityAgent, RiskComplianceAgent, HealthMonitorAgent
- **Distribution Agents**: PublishAgent, SocialAgent, RepurposeAgent
- **Optimization Agents**: TrackingAgent, FeedbackLoopAgent, AffiliateAgent
- **Infrastructure Agents**: BudgetGovernorAgent, ScraperAgent, EconomicIntelligenceAgent

**See:** [Agent Coordination Documentation](../architecture/agent-coordination.md)

### State Machine

Articles follow a **strict state machine**:

```
draft → review → published
  ↓       ↓         ↓
  └───────┴─────────┘
```

**See:** [State Machine Documentation](../architecture/state-machine.md)

### Workflow Engine

**Declarative workflows** define content generation processes:

```typescript
const workflow: WorkflowDefinition = {
  id: 'article-generation',
  steps: [
    { id: 'generate', action: 'content.generate' },
    { id: 'score', action: 'quality.score', dependsOn: ['generate'] },
    { id: 'publish', action: 'publish.article', dependsOn: ['score'] }
  ]
};
```

**See:** [System Design Documentation](../SYSTEM_DESIGN.md)

---

## 6. Common Tasks

### Add New API Endpoint

1. **Create Route File**
   ```typescript
   // app/api/v1/articles/[id]/route.ts
   import { withErrorHandler } from '@/lib/errors/handler';
   import { withTracing } from '@/lib/middleware/tracing';
   
   export const GET = withErrorHandler(
     withTracing(async (request, { params }) => {
       // Implementation
     })
   );
   ```

2. **Add Validation**
   ```typescript
   import { withZodValidation } from '@/lib/middleware/zod-validation';
   import { articleSchema } from '@/lib/validation/api-schemas';
   
   export const POST = withZodValidation(
     articleSchema,
     withErrorHandler(async (request, data) => {
       // Implementation
     })
   );
   ```

3. **Add Tests**
   ```typescript
   // __tests__/api/articles.test.ts
   describe('GET /api/v1/articles/[id]', () => {
     it('returns article', async () => {
       // Test
     });
   });
   ```

### Add New Agent

1. **Create Agent File**
   ```typescript
   // lib/agents/my-agent.ts
   import { BaseAgent, AgentContext, AgentResult } from './base-agent';
   
   export class MyAgent extends BaseAgent {
     constructor() {
       super('MyAgent');
     }
     
     async execute(context: AgentContext): Promise<AgentResult> {
       // Implementation
     }
   }
   ```

2. **Register in Orchestrator**
   ```typescript
   // lib/agents/orchestrator.ts
   private myAgent: MyAgent;
   
   constructor() {
     this.myAgent = new MyAgent();
   }
   ```

3. **Add to Workflow**
   ```typescript
   {
     id: 'my-step',
     action: 'my-agent.execute',
     dependsOn: ['previous-step']
   }
   ```

### Add Database Migration

1. **Create Migration File**
   ```sql
   -- supabase/migrations/YYYYMMDD_description.sql
   CREATE TABLE IF NOT EXISTS my_table (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     -- columns
   );
   ```

2. **Make Idempotent**
   ```sql
   CREATE TABLE IF NOT EXISTS ...
   CREATE INDEX IF NOT EXISTS ...
   DROP FUNCTION IF EXISTS ... CASCADE;
   ```

3. **Add RLS Policies**
   ```sql
   ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Policy name" ON my_table FOR SELECT USING (...);
   ```

4. **Test Migration**
   ```bash
   supabase migration up
   ```

---

## 7. Best Practices

### Code Style

- **TypeScript**: Use strict mode
- **ESLint**: Follow project rules
- **Prettier**: Auto-format on save
- **Naming**: Use descriptive names

### Error Handling

- **Always use** `withErrorHandler` middleware
- **Throw** standardized error types
- **Log** errors with context
- **Return** user-friendly messages

### Testing

- **Write tests** for critical paths
- **Test** error cases
- **Mock** external dependencies
- **Keep tests** fast and isolated

### Performance

- **Cache** expensive operations
- **Use** database indexes
- **Optimize** queries
- **Monitor** performance metrics

### Security

- **Validate** all inputs
- **Use** RLS policies
- **Check** permissions
- **Sanitize** user data

---

## 8. Resources

### Documentation

- [System Design](../SYSTEM_DESIGN.md)
- [API Contracts](../api/contracts.md)
- [Architecture Documentation](../ARCHITECTURE_DOCUMENTATION.md)
- [Runbook](../operations/runbook.md)
- [Troubleshooting Guide](../operations/troubleshooting.md)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Internal Tools

- **Admin Dashboard**: `/admin`
- **API Docs**: `/api/docs`
- **Health Check**: `/api/health`
- **Metrics**: `/api/metrics`

---

## 9. Getting Help

### Questions?

1. **Check Documentation**
   - Review relevant docs
   - Search codebase
   - Check examples

2. **Ask Team**
   - Post in Slack
   - Tag relevant people
   - Provide context

3. **Code Review**
   - Request review early
   - Be open to feedback
   - Learn from reviews

---

**Welcome to the team! 🚀**
